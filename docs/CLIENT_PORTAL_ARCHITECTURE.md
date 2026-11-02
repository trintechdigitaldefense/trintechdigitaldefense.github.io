# Client Portal — Architecture (Phase 5 preparation)

**Status:** Design only. No public login or customer data UI is deployed on GitHub Pages.

**Owner:** TrinTech Digital Defense  
**Updated:** 2026-11-01

## Why not on GitHub Pages

GitHub Pages is static hosting. A real client portal requires:

- Server-side authentication and session management
- Multi-factor authentication (MFA)
- Tenant isolation between customers
- Authorisation on every request
- Encrypted storage for reports and tickets
- Audit logging
- Rate limiting and backup/recovery

Do **not** expose Sentinel, CyberAudit, or CyberGuardian management dashboards on the public internet without a hardened reverse proxy, auth, and network controls.

## Recommended architecture

```
[Client browser]
      |
      | HTTPS
      v
[Edge: CDN + WAF + rate limit]
      |
      v
[Auth service] ---- MFA (TOTP / WebAuthn)
      |
      +-- session cookie (HttpOnly, Secure, SameSite)
      |
      v
[API gateway]
      |
      +-- Engagement service
      +-- Report store (object storage, encrypted)
      +-- Ticketing / support
      +-- Billing read-model (optional)
      |
      v
[Audit log]  [Backup]
```

## Minimum capabilities (when built)

| Area | Requirement |
|------|-------------|
| Identity | Email/password or SSO + MFA |
| Roles | Client admin, client viewer, TrinTech analyst |
| Engagements | List active/past engagements; status only |
| Reports | Download approved PDF/HTML only for that tenant |
| Remediation | Track items client is allowed to see |
| Support | Ticket create/reply |
| Commercial | Quotation and invoice view (optional phase) |

## Explicit non-goals (public site)

- No fake “login” page that does nothing
- No embedding internal dashboards in iframes on the marketing site
- No client PII in the static repo

## Integration with managed packages

- Package 1 / Package 2 monitoring stays on client networks (Sentinel sensor, Mirage, etc.)
- Portal only surfaces **approved** summaries and reports TrinTech publishes to the tenant
- Human-gated CyberGuardian actions remain operator-controlled; portal may show status, not execute isolate/kill/block

## Suggested stack (example)

- Auth: Auth0 / Clerk / Keycloak / custom OIDC
- API: FastAPI or similar behind reverse proxy
- DB: Postgres with row-level security by `tenant_id`
- Files: S3-compatible bucket with per-tenant prefixes
- Hosting: separate subdomain e.g. `portal.trintech...` — not GitHub Pages

## Acceptance criteria before go-live

1. Penetration test or structured security review
2. MFA enforced for all client accounts
3. Tenant isolation verified with negative tests
4. Audit log for login, download, and permission changes
5. Backup restore drill completed
6. Privacy policy and data retention updated

## Contact

Architecture questions: trintechdigitaldefense@gmail.com · WhatsApp +1 (868) 362-0679
