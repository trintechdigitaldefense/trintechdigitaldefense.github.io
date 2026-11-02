# TrinTech Client Portal (scaffold)

**Do not deploy this on GitHub Pages.** Pages is static only.

This scaffold is a starting point for a real portal on a VPS, Railway, Fly.io, Render, or similar.

## Features (MVP target)

- Email/password registration + login
- Session cookies (HttpOnly, Secure, SameSite)
- Placeholder MFA hook (TOTP)
- Tenant isolation by `tenant_id`
- Engagements list (stub)
- Report download (stub, authorised path only)
- Support ticket create (stub)
- Audit log table

## Quick start (local)

```bash
cd portal-scaffold
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export PORTAL_SECRET=$(openssl rand -hex 32)
export DATABASE_URL=sqlite:///./portal.db
uvicorn app.main:app --reload --port 8088
```

Open http://127.0.0.1:8088

## Production checklist

1. Postgres with RLS or strict `tenant_id` filters
2. HTTPS termination
3. MFA required
4. Object storage for reports (encrypted)
5. Backups + restore drill
6. Security review before any real client data

## Contact

trintechdigitaldefense@gmail.com · +1 (868) 362-0679
