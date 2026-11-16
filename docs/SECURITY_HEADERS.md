# GitHub Pages security-header deployment notes

**Status: documentation only. No HTTP response headers are configured by this file.**

GitHub Pages serves static content and does not interpret the repository's `.headers` file as a response-header configuration. The former `.headers` note incorrectly implied that a Caddy reverse proxy was already providing these controls. No such deployment has been verified.

## Required owner decision

Confirm whether the public domain is served directly by GitHub Pages or through a managed edge/CDN provider. If an edge provider is adopted, configure and verify headers there. Do not claim these headers are active until checked against the production response.

## Candidate baseline for edge configuration

Review and test these controls in a staging environment before production rollout:

- `Strict-Transport-Security`: enable only after HTTPS and all relevant subdomains are confirmed stable.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- `Content-Security-Policy`: start in report-only mode. The current pages contain inline styles and scripts and load Google Fonts; a restrictive policy needs script/style hashes or a refactor, and explicit font/image/navigation source review. Do not solve this by blindly adding broad `unsafe-inline` or wildcard sources.
- `frame-ancestors 'none'` (or a documented embedding policy) in the HTTP CSP header.

## Verification

After deployment, inspect the live HTTPS response headers for the homepage and policy pages, confirm redirects and HSTS behaviour, and run a browser regression check. Record the date, tested URLs, edge provider and exact observed headers in the Trust Centre.
