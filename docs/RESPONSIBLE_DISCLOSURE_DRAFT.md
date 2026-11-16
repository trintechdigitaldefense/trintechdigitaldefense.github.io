# Responsible Disclosure Policy — Draft for Approval

> **Status: DRAFT — NOT APPROVED / NOT IN FORCE.**  
> This document is an internal proposal for management and qualified Trinidad & Tobago legal review. It must not be presented as an approved safe-harbour policy. Do not publish it as an operative policy until the owner approves the scope, process, timelines and legal wording.

## Purpose

Provide a clear, safe contact route for people who believe they have identified a security vulnerability in a system operated by TrinTech Digital Defense.

## Proposed reporting channel

- Email: trintechdigitaldefense@gmail.com
- Subject suggestion: `Security report — [brief issue]`
- Report only the minimum technical detail needed for initial triage.
- Do not send passwords, private keys, access tokens, personal records, client information, or large data dumps.

## Authorisation and scope

**No public testing authorisation is granted by this draft or by the existence of the contact address.**

Until management publishes an approved in-scope asset list and written rules of engagement, researchers must not scan, probe, access, modify, disrupt, or test any TrinTech system without explicit written permission and an agreed scope.

Management must decide and record:
- Which domains, applications, repositories, and services are in scope.
- Which third-party-hosted services and supplier systems are excluded.
- Whether any testing methods are permitted or prohibited.
- How a researcher can obtain written permission for a specific test.

## Proposed safe research boundaries

For legal and operational review only, consider prohibiting:
- Denial-of-service or resource-exhaustion testing.
- Social engineering, phishing, or physical access attempts.
- Accessing, copying, modifying, deleting, or retaining another person's data.
- Persistence, lateral movement, credential theft, or destructive actions.
- Testing third-party systems or customer networks without their explicit written authorisation.

These are proposed controls, not an approved commitment or safe harbour.

## Triage and disclosure decisions — owner input required

The following must be approved before publication:
- Acknowledgement target and update cadence.
- Severity assessment and remediation communication process.
- Coordinated disclosure timing and exceptions.
- Whether and how researcher acknowledgement may be provided.
- Legal safe-harbour wording, if any, reviewed by qualified counsel.

No response-time, remediation-time, bounty, confidentiality, or legal-immunity commitment is made by this draft.

## Publication checklist

- [ ] Owner approves the in-scope asset list.
- [ ] Owner approves excluded systems and permitted testing methods.
- [ ] Security contact mailbox ownership and monitoring are confirmed.
- [ ] Triage and disclosure timelines are approved.
- [ ] Legal counsel reviews the final wording under applicable Trinidad & Tobago law.
- [ ] The approved policy is published at a stable URL and referenced from `/.well-known/security.txt`.
- [ ] The Trust Centre and security.txt are updated together.

## Contact

For an initial security concern, email trintechdigitaldefense@gmail.com. Do not perform testing unless you have explicit written authorisation and a defined scope.
