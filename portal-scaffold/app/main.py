"""TrinTech Client Portal — MVP scaffold (not for GitHub Pages)."""
from __future__ import annotations

import os
import secrets
from datetime import datetime, timezone
from typing import Optional

from fastapi import Depends, FastAPI, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy import String, DateTime, ForeignKey, Text, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session, sessionmaker
from passlib.context import CryptContext

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./portal.db")
SECRET = os.getenv("PORTAL_SECRET", "dev-only-change-me")
COOKIE = "trintech_portal_session"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
templates = Jinja2Templates(directory="app/templates")


class Base(DeclarativeBase):
    pass


class Tenant(Base):
    __tablename__ = "tenants"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200))


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    tenant_id: Mapped[int] = mapped_column(ForeignKey("tenants.id"))
    role: Mapped[str] = mapped_column(String(32), default="client_viewer")


class SessionRow(Base):
    __tablename__ = "sessions"
    token: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )


class AuditLog(Base):
    __tablename__ = "audit_log"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    action: Mapped[str] = mapped_column(String(100))
    detail: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )


class Engagement(Base):
    __tablename__ = "engagements"
    id: Mapped[int] = mapped_column(primary_key=True)
    tenant_id: Mapped[int] = mapped_column(ForeignKey("tenants.id"))
    title: Mapped[str] = mapped_column(String(200))
    status: Mapped[str] = mapped_column(String(50), default="active")


Base.metadata.create_all(engine)
app = FastAPI(title="TrinTech Client Portal", docs_url=None, redoc_url=None)


def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def audit(db: Session, user_id: Optional[int], action: str, detail: str = "") -> None:
    db.add(AuditLog(user_id=user_id, action=action, detail=detail))
    db.commit()


def current_user(request: Request, db: Session = Depends(db_session)) -> Optional[User]:
    token = request.cookies.get(COOKIE)
    if not token:
        return None
    row = db.get(SessionRow, token)
    if not row:
        return None
    return db.get(User, row.user_id)


@app.get("/", response_class=HTMLResponse)
def home(user: Optional[User] = Depends(current_user)):
    if not user:
        return RedirectResponse("/login", status_code=302)
    return RedirectResponse("/dashboard", status_code=302)


@app.get("/login", response_class=HTMLResponse)
def login_form(request: Request):
    return templates.TemplateResponse("login.html", {"request": request, "error": None})


@app.post("/login")
def login(
    request: Request,
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(db_session),
):
    user = db.scalar(select(User).where(User.email == email.lower().strip()))
    if not user or not pwd.verify(password, user.password_hash):
        audit(db, None, "login_failed", email)
        return templates.TemplateResponse(
            "login.html", {"request": request, "error": "Invalid credentials"}, status_code=401
        )
    token = secrets.token_hex(32)
    db.add(SessionRow(token=token, user_id=user.id))
    db.commit()
    audit(db, user.id, "login_ok")
    resp = RedirectResponse("/dashboard", status_code=302)
    resp.set_cookie(
        COOKIE, token, httponly=True, samesite="lax", secure=False, max_age=60 * 60 * 8
    )
    return resp


@app.get("/dashboard", response_class=HTMLResponse)
def dashboard(
    request: Request,
    db: Session = Depends(db_session),
    user: Optional[User] = Depends(current_user),
):
    if not user:
        return RedirectResponse("/login", status_code=302)
    engagements = db.scalars(
        select(Engagement).where(Engagement.tenant_id == user.tenant_id)
    ).all()
    return templates.TemplateResponse(
        "dashboard.html",
        {"request": request, "user": user, "engagements": engagements},
    )


@app.post("/logout")
def logout(
    request: Request,
    db: Session = Depends(db_session),
    user: Optional[User] = Depends(current_user),
):
    token = request.cookies.get(COOKIE)
    if token:
        row = db.get(SessionRow, token)
        if row:
            db.delete(row)
            db.commit()
    if user:
        audit(db, user.id, "logout")
    resp = RedirectResponse("/login", status_code=302)
    resp.delete_cookie(COOKIE)
    return resp


@app.get("/health")
def health():
    return {"ok": True, "service": "trintech-client-portal"}
