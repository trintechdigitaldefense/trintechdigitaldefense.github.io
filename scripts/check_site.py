#!/usr/bin/env python3
"""Dependency-free static checks for the TrinTech GitHub Pages site."""
from __future__ import annotations
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from datetime import datetime, timezone
from html import unescape
import re
import xml.etree.ElementTree as ET
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
if not security.is_file():
    ERRORS.append("missing .well-known/security.txt")
else:
    security_text = security.read_text(encoding="utf-8")
    fields: dict[str, list[str]] = {}
    for line in security_text.splitlines():
        if ":" in line and not line.lstrip().startswith("#"):
            key, value = line.split(":", 1)
            fields.setdefault(key.strip(), []).append(value.strip())
    for required in ("Contact", "Canonical", "Expires", "Preferred-Languages"):
        if not fields.get(required):
            ERRORS.append(f"security.txt missing required {required} field")
    if fields.get("Canonical") != ["https://trintechdigitaldefense.github.io/.well-known/security.txt"]:
        ERRORS.append("security.txt Canonical must point to the published .well-known/security.txt URL")
    if any(field in fields for field in ("Encryption", "Policy")):
        ERRORS.append("security.txt must not advertise an unverified encryption key or unapproved policy")
    if fields.get("Contact") and not fields["Contact"][0].startswith("mailto:"):
        ERRORS.append("security.txt Contact must use the approved mailto contact")
    if fields.get("Preferred-Languages") and "en" not in fields["Preferred-Languages"][0].lower().split(","):
        ERRORS.append("security.txt Preferred-Languages must include en")
    if fields.get("Expires"):
        try:
            expiry = datetime.strptime(fields["Expires"][0], "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
            if expiry <= datetime.now(timezone.utc):
                ERRORS.append("security.txt Expires date is not in the future")
        except ValueError:
            ERRORS.append("security.txt Expires must be an RFC 3339 UTC timestamp")
if legacy_security.is_file() and security.is_file() and security.read_text(encoding="utf-8") != legacy_security.read_text(encoding="utf-8"):
    ERRORS.append("security.txt and .well-known/security.txt differ")

sitemap = ROOT / "sitemap.xml"
if not sitemap.is_file():
    ERRORS.append("missing sitemap.xml")
else:
    try:
        root = ET.parse(sitemap).getroot()
        locs = [node.text.strip() for node in root.findall(".//{*}loc") if node.text]
        for loc in locs:
            parts = urlsplit(loc)
            if parts.scheme != "https" or parts.netloc != "trintechdigitaldefense.github.io":
                ERRORS.append(f"sitemap contains non-canonical site URL: {loc}")
                continue
            path = unquote(parts.path or "/")
            target = ROOT / path.lstrip("/") if path != "/" else ROOT / "index.html"
            if target.is_dir() or (not target.suffix and not target.exists()):
                target = target / "index.html"
            if not target.is_file():
                ERRORS.append(f"sitemap URL has no local page: {loc}")
        expected_sitemap_urls = (
            "https://trintechdigitaldefense.github.io/about/",
            "https://trintechdigitaldefense.github.io/trust/",
            "https://trintechdigitaldefense.github.io/enquiry/",
            "https://trintechdigitaldefense.github.io/blog/dark-web-credential-markets-2026.html",
        )
        for expected in expected_sitemap_urls:
            if expected not in locs:
                ERRORS.append(f"sitemap missing current public page: {expected}")
    except ET.ParseError as exc:
        ERRORS.append(f"sitemap.xml is invalid XML: {exc}")

homepage = ROOT / "index.html"
readme = ROOT / "README.md"
if homepage.is_file() and readme.is_file():
    homepage_text = unescape(re.sub(r"<[^>]*>", "", homepage.read_text(encoding="utf-8")))
    readme_text = readme.read_text(encoding="utf-8")
    for price in ("TT$1,350", "TT$2,350", "TT$200", "TT$150", "TT$1,000", "TT$2,200"):
        if price not in homepage_text:
            ERRORS.append(f"homepage missing published price {price}")
        if price not in readme_text:
            ERRORS.append(f"README pricing summary is out of sync: missing {price}")
    if "All prices in USD" in readme_text:
        ERRORS.append("README must not contradict the public TT$ pricing page")
for page in PAGES:
    if "enhancements.js" in page.read_text(encoding="utf-8"):
        ERRORS.append(f"{page.relative_to(ROOT)}: must not load the unverified legacy enhancements.js module")

print(f"Checked {len(PAGES)} HTML pages and {len(LINKS)} local/external references.")
if ERRORS:
    print("\n".join(f"ERROR: {item}" for item in ERRORS))
    sys.exit(1)
print("Static site checks passed.")
