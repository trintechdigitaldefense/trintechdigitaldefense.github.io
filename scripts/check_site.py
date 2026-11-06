#!/usr/bin/env python3
"""Dependency-free static checks for the TrinTech GitHub Pages site."""
from __future__ import annotations
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import sys

ROOT = Path(__file__).resolve().parents[1]
ERRORS: list[str] = []
PAGES = sorted(p for p in ROOT.rglob("*.html") if ".git" not in p.parts and "node_modules" not in p.parts)
IDS: dict[Path, set[str]] = {}
LINKS: list[tuple[Path, str, str]] = []

class PageParser(HTMLParser):
    def __init__(self, path: Path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.ids: set[str] = set()
        self.title_count = 0
        self.has_viewport = False
        self.has_lang = False
        self.in_title = False
        self.title_text = ""
        self.has_doctype = False

    def handle_decl(self, decl: str) -> None:
        if decl.lower() == "doctype html":
            self.has_doctype = True

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if tag == "html":
            self.has_lang = bool(data.get("lang"))
        if tag == "meta" and (data.get("name") or "").lower() == "viewport":
            self.has_viewport = True
        if "id" in data and data["id"]:
            value = str(data["id"])
            if value in self.ids:
                ERRORS.append(f"{self.path.relative_to(ROOT)}: duplicate id '{value}'")
            self.ids.add(value)
        if tag == "img" and "alt" not in data:
            ERRORS.append(f"{self.path.relative_to(ROOT)}: image missing alt text")
        if tag == "a" and data.get("target") == "_blank":
            rel = set((data.get("rel") or "").lower().split())
            if not {"noopener", "noreferrer"}.issubset(rel):
                ERRORS.append(f"{self.path.relative_to(ROOT)}: target=_blank link missing rel=noopener noreferrer")
        for attr in ("href", "src", "poster"):
            value = data.get(attr)
            if value:
                LINKS.append((self.path, attr, str(value)))
        if tag == "title":
            self.title_count += 1
            self.in_title = True

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self.in_title = False

for page in PAGES:
    rel = page.relative_to(ROOT)
    raw = page.read_text(encoding="utf-8")
    parser = PageParser(page)
    try:
        parser.feed(raw)
        parser.close()
    except Exception as exc:
        ERRORS.append(f"{rel}: HTML parser error: {exc}")
    if not raw.lstrip().lower().startswith("<!doctype html>"):
        ERRORS.append(f"{rel}: missing HTML5 doctype")
    if not parser.has_lang:
        ERRORS.append(f"{rel}: html element missing lang")
    if parser.title_count != 1:
        ERRORS.append(f"{rel}: expected exactly one title element, found {parser.title_count}")
    if not parser.has_viewport:
        ERRORS.append(f"{rel}: missing viewport meta")
    IDS[page.resolve()] = parser.ids

for source, attr, value in LINKS:
    parts = urlsplit(value)
    if parts.scheme or parts.netloc or value.startswith("//") or value.startswith("data:"):
        continue
    if attr in ("href", "src", "poster") and parts.path:
        decoded = unquote(parts.path)
        if decoded.startswith("/"):
            target = ROOT / decoded.lstrip("/")
        else:
            target = source.parent / decoded
        if target.is_dir():
            target = target / "index.html"
        elif not target.suffix and target.exists() and target.is_dir():
            target = target / "index.html"
        if not target.exists():
            ERRORS.append(f"{source.relative_to(ROOT)}: broken local {attr} '{value}'")
            continue
    else:
        target = source
    if parts.fragment:
        target_page = target.resolve()
        if target_page.suffix.lower() == ".html" and target_page in IDS:
            if unquote(parts.fragment) not in IDS[target_page]:
                ERRORS.append(f"{source.relative_to(ROOT)}: missing fragment '#{parts.fragment}' in {target_page.relative_to(ROOT)}")

security = ROOT / ".well-known" / "security.txt"
legacy_security = ROOT / "security.txt"
if security.exists() and legacy_security.exists() and security.read_text() != legacy_security.read_text():
    ERRORS.append("security.txt and .well-known/security.txt differ")

homepage = ROOT / "index.html"
for page in PAGES:
    if "enhancements.js" in page.read_text(encoding="utf-8"):
        ERRORS.append(f"{page.relative_to(ROOT)}: must not load the unverified legacy enhancements.js module")

print(f"Checked {len(PAGES)} HTML pages and {len(LINKS)} local/external references.")
if ERRORS:
    print("\n".join(f"ERROR: {item}" for item in ERRORS))
    sys.exit(1)
print("Static site checks passed.")
