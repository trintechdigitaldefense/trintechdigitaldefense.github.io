"""
TrinTech Digital Defense — Website Backend
Handles: contact form, newsletter, blog API, submissions storage
"""
import json
import smtplib
import os
from datetime import datetime
from pathlib import Path
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, EmailStr
import aiosmtplib

# Paths
DATA_DIR = Path("/opt/baal-agent/workspace/trintechdigitaldefense.github.io/data")
DATA_DIR.mkdir(exist_ok=True)
SUBMISSIONS_FILE = DATA_DIR / "submissions.json"
NEWSLETTER_FILE = DATA_DIR / "newsletter.json"

# Blog posts
BLOG_DIR = DATA_DIR / "blog"
BLOG_DIR.mkdir(exist_ok=True)

# Config
GMAIL_EMAIL = os.getenv("TRINTECH_GMAIL", "trintechdigitaldefense@gmail.com")
GMAIL_APP_PASSWORD = os.getenv("TRINTECH_GMAIL_PASSWORD", "")
GMAIL_TO = GMAIL_EMAIL

app = FastAPI(title="TrinTech Backend")
app.mount("/data", StaticFiles(directory=str(DATA_DIR)), name="data")
templates = Jinja2Templates(directory=".")

# Load existing data
def load_json(path):
    if path.exists():
        with open(path) as f:
            return json.load(f)
    return []

def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

# Init files
if not SUBMISSIONS_FILE.exists():
    save_json(SUBMISSIONS_FILE, [])
if not NEWSLETTER_FILE.exists():
    save_json(NEWSLETTER_FILE, [])

# Ensure blog posts exist
default_blog = [
    {
        "id": "sql-injection-mistakes",
        "title": "5 SQL Injection Mistakes Every Business Owner Should Know",
        "category": "Web Security",
        "date": "2026-07-01",
        "slug": "5-sql-injection-mistakes-every-business-owner-should-know",
        "content": """
## SQL Injection: Why Your Business Is at Risk

SQL injection remains one of the most critical web vulnerabilities. According to OWASP, it has consistently ranked in the top 10 web application security risks for over a decade. Here are the five most common mistakes that leave businesses exposed.

### 1. Using Raw String Concatenation in Queries

The most fundamental mistake. Building SQL queries by concatenating user input directly into strings is the quickest path to a data breach.

**Vulnerable:**
```python
query = "SELECT * FROM users WHERE username = '" + username + "'"
```

**Safe:**
```python
cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
```

### 2. Trusting Client-Side Validation Alone

Client-side validation (JavaScript form checks) provides convenience, not security. Any attacker can bypass it entirely.

### 3. Not Using Parameterized Queries or ORMs

Parameterized queries and Object-Relational Mappers (ORMs) are not optional — they are the baseline defense. Frameworks like Django, SQLAlchemy, and Laravel include protection by default.

### 4. Overly Detailed Error Messages

When your application returns database errors to the user, you are essentially giving attackers a walkthrough of your data structure.

### 5. No WAF or Input Filtering Layer

A Web Application Firewall acts as a safety net. While it should never be your only defense, it catches attacks that manual code reviews miss.

## The Bottom Line

If your business has any web application that interacts with a database, it needs a security audit. TrinTech specializes in identifying and remediating SQL injection vulnerabilities before attackers exploit them.

[Contact us for a security assessment](#contact)
        """
    },
    {
        "id": "digital-footprint-reveals",
        "title": "What Your Digital Footprint Reveals About Your Business",
        "category": "OSINT",
        "date": "2026-06-15",
        "slug": "what-your-digital-footprint-reveals-about-your-business",
        "content": """
## Your Business Is More Exposed Than You Think

A digital footprint is the trail of information your business leaves across the internet. For most organizations, the actual footprint is far larger than what internal IT teams have documented.

### What Attackers Can Find in Minutes

**Email addresses and employee names** — OSINT tools can map your entire org structure from public sources: LinkedIn profiles, press releases, conference speaker lists, and job postings.

**Exposed infrastructure** — Cloud storage buckets with default permissions, subdomains that point to development servers, and outdated DNS records.

**Credential leaks** — Employee email addresses found in public data breach databases, often with password hashes that can be cracked.

**Social engineering vectors** — Your employee directory, when combined with social media, creates a complete picture for targeted phishing campaigns.

### Why This Matters for Caribbean Businesses

Small businesses in Trinidad and the Caribbean are increasingly targeted because they often lack dedicated security teams. The attack infrastructure costs less than the audit would.

### What You Can Do

1. **Map your own footprint** — Use the same tools attackers use to see what is publicly available about your business.
2. **Secure your cloud storage** — Audit all S3 buckets, SharePoint sites, and cloud databases for public access.
3. **Monitor breach databases** — Set up alerts for your corporate email domains in services that track data breaches.
4. **Limit employee exposure** — Review what personal information employees post about their workplace.

### TrinTech's Approach

At TrinTech, we perform OSINT assessments that simulate how an attacker would research your business. The result is a detailed report showing every exposed asset and a prioritized remediation plan.

[Request an OSINT assessment](#contact)
        """
    },
    {
        "id": "android-pos-under-attack",
        "title": "Why Android POS Systems Are Under Attack",
        "category": "Android Security",
        "date": "2026-05-20",
        "slug": "why-android-pos-systems-are-under-attack",
        "content": """
## The Hidden Risk in Every Retail Establishment

Android-powered point-of-sale (POS) systems are rapidly replacing legacy payment terminals across the Caribbean. The convenience and lower cost are undeniable. But the security implications are often overlooked.

### The Attack Surface

**Outdated firmware** — Many POS devices run Android versions with known vulnerabilities that have been patched for years. The patch never gets applied because the vendor has stopped supporting the device.

**Root accessibility** — Android devices can be rooted, which gives attackers full control over the operating system. Some POS installations already run with root-level privileges for "convenience."

**USB and Bluetooth** — Physical access to a rooted Android POS device allows attackers to intercept payment data through USB debugging or Bluetooth vulnerabilities.

**Network exposure** — POS devices on the same network as guest WiFi or other business systems create lateral movement opportunities for attackers.

### Real-World Impact in the Caribbean

Payment card skimming via POS systems has increased significantly across the region. The financial and reputational damage extends far beyond the immediate transaction loss.

### Recommendations

1. **Isolate POS devices on a separate VLAN** — Never mix payment systems with guest networks.
2. **Enforce regular firmware updates** — Set up a maintenance schedule and never postpone security patches.
3. **Disable USB debugging and Bluetooth** — Unless absolutely required, these ports should be disabled.
4. **Monitor for unauthorized apps** — Android POS systems should run only approved applications.
5. **Conduct regular penetration tests** — Test your POS infrastructure as part of your annual security audit.

### TrinTech's Android Security Service

We conduct on-device penetration testing using Termux and Ubuntu, simulating real-world attacks against your POS infrastructure without disrupting operations.

[Book an Android security assessment](#contact)
        """
    }
]

# Write blog posts if not present
for post in default_blog:
    post_file = BLOG_DIR / f"{post['id']}.json"
    if not post_file.exists():
        post_file.write_text(json.dumps(post, indent=2))

# Ensure all posts from default list are written
existing_ids = set(p["id"] for p in default_blog)
if BLOG_DIR.exists():
    for f in BLOG_DIR.glob("*.json"):
        try:
            data = json.loads(f.read_text())
            if data.get("id") not in existing_ids:
                # Keep user-added posts
                existing_ids.add(data["id"])
        except:
            pass


# ===== API Endpoints =====

class ContactSubmission(BaseModel):
    name: str
    company: str = ""
    email: str
    phone: str = ""
    service: str
    message: str = ""

class NewsletterSubscription(BaseModel):
    email: str


@app.post("/api/contact")
async def contact_form(submission: ContactSubmission):
    """Handle contact form submissions."""
    # Validate
    if not submission.name or not submission.email or not submission.service:
        return JSONResponse(status_code=400, content={"error": "Name, email, and service are required"})

    # Save to file
    submissions = load_json(SUBMISSIONS_FILE)
    record = {
        "timestamp": datetime.utcnow().isoformat(),
        **submission.model_dump()
    }
    submissions.append(record)
    save_json(SUBMISSIONS_FILE, submissions)

    # Send email notification
    if GMAIL_APP_PASSWORD:
        try:
            msg = MIMEMultipart()
            msg["From"] = GMAIL_EMAIL
            msg["To"] = GMAIL_TO
            msg["Subject"] = f"New Inquiry: {submission.service} — {submission.name}"
            body = f"""NEW WEBSITE INQUIRY
{'='*40}
Name: {submission.name}
Company: {submission.company or 'Not provided'}
Email: {submission.email}
Phone: {submission.phone or 'Not provided'}
Service: {submission.service}
Message: {submission.message or 'No message provided'}

Sent from: trintechdigitaldefense.github.io
"""
            msg.attach(MIMEText(body, "plain"))
            await aiosmtplib.send(
                msg,
                hostname="smtp.gmail.com",
                port=587,
                username=GMAIL_EMAIL,
                password=GMAIL_APP_PASSWORD,
                start_tls=True,
            )
        except Exception as e:
            print(f"Email send failed (non-critical): {e}")

    return JSONResponse(content={"success": True, "message": "Inquiry received. Jason will respond within 24 hours."})


@app.post("/api/newsletter")
async def newsletter_subscribe(data: NewsletterSubscription):
    """Handle newsletter subscriptions."""
    if not data.email:
        return JSONResponse(status_code=400, content={"error": "Email is required"})

    subscribers = load_json(NEWSLETTER_FILE)
    if any(s.get("email") == data.email for s in subscribers):
        return JSONResponse(content={"success": True, "message": "Already subscribed."})

    record = {"email": data.email, "timestamp": datetime.utcnow().isoformat()}
    subscribers.append(record)
    save_json(NEWSLETTER_FILE, subscribers)

    return JSONResponse(content={"success": True, "message": "Subscribed successfully."})


@app.get("/api/blog")
async def get_blog():
    """Return list of blog posts."""
    posts = []
    if BLOG_DIR.exists():
        for f in sorted(BLOG_DIR.glob("*.json"), key=lambda p: p.name):
            try:
                posts.append(json.loads(f.read_text()))
            except:
                pass
    return JSONResponse(content={"posts": posts})


@app.get("/api/blog/{slug}")
async def get_blog_post(slug: str):
    """Return a single blog post by slug."""
    if BLOG_DIR.exists():
        for f in BLOG_DIR.glob("*.json"):
            try:
                post = json.loads(f.read_text())
                if post.get("id") == slug or post.get("slug") == slug:
                    return JSONResponse(content={"post": post})
            except:
                pass
    return JSONResponse(status_code=404, content={"error": "Post not found"})


@app.get("/api/submissions")
async def get_submissions():
    """View all form submissions (admin)."""
    submissions = load_json(SUBMISSIONS_FILE)
    return JSONResponse(content={"submissions": submissions[-50:]})


@app.get("/api/health")
async def health():
    return JSONResponse(content={"status": "ok", "timestamp": datetime.utcnow().isoformat()})
