# ADR-001: Client Platform Foundation

- **Status:** Proposed — architecture decisions recorded; implementation not authorised by this document
- **Date:** 2026-11-05
- **Owner:** TrinTech Digital Defense
- **Scope:** First release of the TrinTech client-facing business platform
- **Decision branch:** `platform/milestone-1-architecture`

## 1. Context and goals

TrinTech intends to evolve its static public website into a business platform with two distinct authenticated experiences:

1. A client portal for client organisations and their authorised members.
2. A separate staff portal for TrinTech operations, assessment delivery, review and administration.

The platform will coordinate services and approved outputs from TrinTech defensive tools, while keeping tool execution environments separate from the central business application.

The design goals are confidentiality between client organisations, least privilege, reliable report delivery, auditable staff actions, secure tool integration, recoverability and maintainable operation.

The existing GitHub Pages website is a static public site. It is not an application backend and must not host credentials, private reports, database access or privileged application logic.

## 2. Decisions recorded

| ID | Decision | Selected direction | Status / consequence |
|---|---|---|---|
| D-001 | Production hosting | Managed cloud hosting | Selected at category level. Provider, region, services and contract remain undecided. |
| D-002 | Authentication | Managed OIDC identity provider | Selected at category level. Provider, tenant design, MFA policy and contractual terms remain undecided. |
| D-003 | Client registration | Invitation-only | TrinTech staff initiate or approve invitations. No open self-registration in release one. |
| D-004 | Monitoring agent connectivity | Outbound authenticated connections | Agents initiate connections to the platform; no unsolicited inbound access to client networks is required by the default design. |
| D-005 | Application architecture | Separate public website, client application, staff application and backend API | Proposed. Public static site remains separate from private application services. |
| D-006 | Backend | Python FastAPI | Recommended; confirm before implementation. |
| D-007 | Database | PostgreSQL | Recommended, with organisation-scoped data access and database Row-Level Security as defence in depth. |
| D-008 | Report/evidence storage | Private encrypted object storage | Recommended. No public buckets or permanent public report URLs. |
| D-009 | Authorisation | RBAC plus organisation membership and resource-level checks | Required design principle. Never trust a client-supplied organisation identifier as proof of access. |
| D-010 | Report release | Human review and approval before client release | Required. Analysts must not approve their own reports. |
| D-011 | Tool integration | Scoped, authenticated agent/API interfaces | Required. Agents receive no direct database credentials or broad portal access. |

### 2.1 Managed hosting

Use a managed cloud platform for production application, database, storage, backups and monitoring. This is a hosting-category decision, not approval of a particular vendor or deployment.

Provider selection must assess:
- Data processing terms, subprocessors, security certifications and breach notification commitments.
- Available data regions and data residency options.
- Private networking, workload identity, managed secrets/KMS, encryption and audit logs.
- Backup retention, point-in-time recovery, restore testing and service availability commitments.
- Cost predictability, support, exportability and exit/migration options.
- Whether the provider's terms and selected region are appropriate for TrinTech's Trinidad and Tobago and wider Caribbean client base.

### 2.2 Managed OIDC

Use a managed OpenID Connect identity provider for authentication. The application backend remains responsible for authorisation.

Required controls:
- MFA mandatory for staff; phishing-resistant MFA preferred for privileged roles where supported.
- Secure account invitation, verification, recovery and deprovisioning.
- Short-lived access tokens; validate issuer, audience, signature, expiry and allowed algorithms.
- Secure browser session handling; prefer server-managed sessions or secure, HttpOnly, Secure, SameSite cookies over persistent browser token storage.
- Staff and client access policies must be distinct. Staff access must not be granted by changing client profile attributes.
- No local password storage in the TrinTech application unless a separately reviewed exception is approved.
- Test account lockout/risk controls without creating denial-of-service opportunities.

### 2.3 Invitation-only client registration

A staff member with the appropriate permission invites a named person to a specific client organisation. Invitations must be single-use, time-limited, revocable and bound to the intended email address and organisation. Invitation acceptance must not permit the recipient to select an arbitrary organisation or role.

Client organisation ownership and membership changes require an auditable approval process. Staff must verify the business relationship and the inviter's authority before granting owner-level access.

### 2.4 Outbound-only agent connectivity

Agents initiate outbound connections to a designated platform endpoint over TLS. Do not require inbound firewall openings into client networks as the default.

Each agent must have an individual identity and revocable credentials, preferably certificate-based workload/device identity. Agent credentials must be scoped to one client organisation, one registered agent and an explicit set of permitted operations. Support credential rotation, replay protection, expiry, revocation and signed job/result envelopes where feasible.

An agent must reject unapproved jobs locally. The platform must not treat an agent's reported result as inherently trustworthy; validate schema, provenance, timestamps, job authorisation and integrity.

## 3. Target logical architecture

1. **Public website:** existing static HTML/CSS/JavaScript hosted separately. Public enquiries remain distinct from authenticated client workflows.
2. **Client application:** responsive client-facing interface.
3. **Staff application:** separate staff-facing interface and access policy. It may share a design system, but not a trust boundary or client permissions.
4. **API/backend:** FastAPI service enforcing identity validation, RBAC, organisation membership, resource-level authorisation, input validation, rate limits and audit events.
5. **Identity provider:** managed OIDC service.
6. **Data layer:** PostgreSQL for structured business records; private object storage for reports and evidence.
7. **Background processing:** isolated workers/queue for notifications, report generation and integration jobs.
8. **Agent integration:** outbound authenticated agent communication through a narrowly scoped API or broker. Agents do not connect directly to PostgreSQL or object storage.
9. **Operations/security:** central logs, alerting, secrets manager/KMS, backup system, vulnerability management and incident response procedures.

### Trust boundaries

- Public internet to client/staff applications.
- Browser applications to backend API.
- Backend API to database and object storage.
- Backend to background workers and third-party services.
- Platform to each client agent.
- Staff users to privileged administrative operations.

Every boundary requires explicit authentication, authorisation, validation, logging and network policy appropriate to its function.

## 4. Permissions model

Roles are scoped to an organisation or to the TrinTech workforce. A role name alone never grants access to all records. Resource ownership, assignment, organisation membership and explicit permissions must also be checked.

| Capability | Client member | Client owner | Analyst | Reviewer | Admin | Super admin |
|---|---:|---:|---:|---:|---:|---:|
| View own organisation profile | Read | Manage limited profile | Assigned only | Assigned only | Manage | Manage |
| View own organisation service status | Read | Read | Assigned only | Assigned only | Manage | Manage |
| View released reports | Read | Read | Assigned work only | Assigned work | Manage | Manage |
| Download released reports | Yes | Yes | No by default | Controlled | Controlled | Controlled |
| Invite/manage client members | No | Request/limited | No | No | Yes | Yes |
| Request an assessment | Yes | Yes | No | No | Yes | Yes |
| Create/assign assessment | No | No | Within scope | Within scope | Yes | Yes |
| Execute approved assessment tasks | No | No | Assigned and authorised | No by default | Exceptional, logged | Exceptional, logged |
| View raw findings/evidence | No by default | Limited released view | Assigned | Assigned | Need-to-know | Need-to-know |
| Draft report | No | No | Yes | Yes, if assigned | Yes | Yes |
| Approve/release report | No | No | No | Yes, independent review | Yes, independent review | Yes, independent review |
| Manage subscription records | View own | Request/change request | No | No | Yes | Yes |
| Manage staff identities/roles | No | No | No | No | Limited | Yes |
| Change security/platform configuration | No | No | No | No | Narrow delegated subset | Yes |
| View audit events | Own activity summary | Own organisation summary | Relevant events | Relevant events | Operational scope | Full authorised scope |

**Separation-of-duties rules**
- An analyst cannot approve their own report.
- Client owners cannot grant themselves staff roles or elevate permissions beyond the client role policy.
- Super-admin membership is exceptionally limited, protected with MFA and reviewed periodically.
- Break-glass access must be time-limited, justified, alerted and retrospectively reviewed.
- Support impersonation is disabled by default. If ever introduced, it requires explicit approval, visible session indication, strict time limits and complete audit logging.
- Deny access by default. Missing or ambiguous membership, role, assignment or resource ownership means deny.

## 5. Initial data model

All client-owned records must carry an immutable organisation relationship. The server derives the organisation scope from authenticated membership and resource relationships; it never accepts a browser-supplied organisation ID as sufficient authority.

| Entity/table | Important fields / relationships | Security notes |
|---|---|---|
| users | id, identity_subject, status, created_at | OIDC subject is unique; do not store provider passwords. |
| organisations | id, legal_name, status, created_at | Organisation lifecycle and verification state. |
| organisation_memberships | user_id, organisation_id, role_id, status | Unique active membership rules; auditable changes. |
| staff_memberships | user_id, staff_role_id, status | Separate staff trust domain from client memberships. |
| roles / permissions / role_permissions | role definitions and permission mappings | Server-controlled; no client self-assignment. |
| invitations | organisation_id, email, role, token_hash, expires_at, accepted_at, revoked_at | Store token hash only; single-use and time-limited. |
| services | id, name, description, active | Catalogue, not proof of a purchased service. |
| subscriptions | organisation_id, service_id, status, start/end | Changes audited; billing integration is a later decision. |
| assessments | organisation_id, scope, status, dates | Signed/recorded authorisation and scope required before work. |
| assessment_assignments | assessment_id, staff_user_id, assignment_role | Enforces staff need-to-know. |
| assets | organisation_id, assessment_id, asset_type, identifier, authorisation_state | Only explicitly authorised assets/tasks may be used. |
| findings | organisation_id, assessment_id, severity, status, provenance | Validate source and limit raw evidence visibility. |
| reports | organisation_id, assessment_id, status, current_version_id | Draft, review, approved, released, withdrawn states. |
| report_versions | report_id, version, object_key, sha256, created_by, approved_by, timestamps | Immutable version history and approval metadata. |
| evidence_files | organisation_id, assessment_id, object_key, hash, scan_status, classification | Private storage; malware scanning and retention controls. |
| tool_agents | organisation_id, agent_id, identity_ref, status, last_seen | Individual revocable identity; no shared fleet secrets. |
| tool_jobs | organisation_id, agent_id, assessment_id, operation, scope, approval, status | Explicit allowlisted job types, expiry and replay protection. |
| notifications | user_id, organisation_id, type, status, created_at | Do not include sensitive report content in email/push payloads. |
| audit_events | actor, action, resource, organisation_id, timestamp, outcome, correlation_id | Append-only/tamper-evident export to separately controlled storage. |

### Data protection rules

- Use foreign keys and constraints to prevent orphaned cross-organisation relationships.
- Apply PostgreSQL RLS to client-owned tables as defence in depth. The application must set tenant context safely per transaction and must not use a broadly privileged role that bypasses RLS for normal requests.
- Test connection pooling and transaction cleanup to ensure tenant context cannot leak between requests.
- Keep report/evidence bytes in private object storage, not directly in public web roots or database fields.
- Use random object keys; authorise every download and issue short-lived signed URLs only after a server-side access check.
- Encrypt in transit and at rest. Manage keys through a managed KMS; separate key administration from routine application administration.
- Define retention and deletion rules before accepting client evidence.
- Never log passwords, access tokens, invitation tokens, private keys, full report contents or unnecessary personal data.

## 6. Threat model (STRIDE)

| Threat | Example | Principal controls |
|---|---|---|
| Spoofing | Stolen client/staff identity or forged agent | Managed OIDC, MFA, secure recovery, agent identity, revocation |
| Tampering | Change assessment scope, findings or approved report | Server-side validation, immutable versions, hashes, signed job/result envelopes |
| Repudiation | Staff denies report approval or access | Append-only audit events, actor identity, timestamps, correlation IDs |
| Information disclosure | IDOR/BOLA or cross-tenant report access | RBAC + resource checks + RLS + private object storage + negative tests |
| Denial of service | Login/API/job flooding or oversized uploads | Rate limits, quotas, queue limits, upload limits, WAF/provider protections |
| Elevation of privilege | Client modifies role or accesses staff endpoints | Separate staff trust domain, deny-by-default RBAC, MFA, approval and audit |
| Malicious upload | Evidence file exploits parser or malware infects analyst workstation | Quarantine, allowlisted types, size limits, malware scanning, isolated processing |
| Agent compromise | Stolen agent credential or malicious job | Per-agent identity, narrow scopes, short expiry, revocation, outbound-only design |
| Supply-chain compromise | Vulnerable dependency or poisoned build | Dependency pinning/scanning, SBOM, protected CI, signed/reproducible releases where practical |
| Backup compromise | Theft or deletion of backups | Separate credentials/account boundary, encryption, immutable retention, restore drills |
| Insider misuse | Staff browses unrelated client evidence | Assignment-based access, least privilege, audit alerts, periodic access review |

### Abuse cases that must be tested

1. Client A changes a report, assessment, evidence or organisation identifier to target Client B.
2. A client invokes staff-only endpoints or submits staff role claims.
3. An analyst attempts to approve their own report.
4. A former employee or revoked client member uses an old session or token.
5. A replayed, expired or cross-tenant agent job is accepted.
6. An agent submits results for an assessment or asset outside its scope.
7. An unapproved, quarantined or withdrawn report remains downloadable.
8. A malicious upload reaches a normal analyst workflow before scanning.
9. Tenant context leaks through a reused database connection.
10. A privileged action is performed without a corresponding audit event.

## 7. Remaining decisions before implementation

The four choices supplied by TrinTech resolve the direction of hosting, identity, registration and agent connectivity. They do **not** yet identify production vendors, regions, configurations or operational commitments.

| ID | Outstanding decision | Recommended default | Required owner input |
|---|---|---|---|
| R-01 | Cloud provider and service architecture | Managed provider with private networking, managed PostgreSQL, private object storage, KMS and central logging | Select provider after security, region, contractual and cost review |
| R-02 | Data region and residency | Choose region based on client requirements, legal review, latency and provider controls; document cross-border transfers | Approve primary/backup regions and data transfer approach |
| R-03 | OIDC provider and tenant setup | Managed OIDC, separate staff/client policies or tenants where supported | Select vendor; confirm MFA, recovery, SSO and lifecycle features |
| R-04 | Domain and DNS topology | Separate public, client and staff hostnames; staff app behind stronger access policy | Approve domain names, DNS owner and edge/WAF provider |
| R-05 | TLS, edge and network controls | TLS 1.2+ (prefer TLS 1.3), HSTS after validation, WAF, private database/storage, egress restrictions | Select edge provider and approve network design |
| R-06 | Secrets and encryption key ownership | Managed secret store and KMS; rotation and separation of duties | Decide key administrators, rotation cadence and emergency recovery |
| R-07 | Data classification and retention | Classify account, assessment, finding, report, evidence and audit data; minimise collection | Approve retention/deletion periods, legal holds and client export/deletion process |
| R-08 | Legal/privacy requirements | Privacy impact assessment and counsel review for Trinidad and Tobago and client jurisdictions | Approve privacy notice, processor terms, cross-border processing and breach obligations |
| R-09 | Recovery objectives | Encrypted automated backups, point-in-time recovery, separate backup access | Set RPO/RTO, backup retention, restore-test frequency and disaster-recovery owner |
| R-10 | Audit and security monitoring | Centralised append-only/tamper-evident logs, alert on privileged access and tenant-boundary denials | Set log retention, alert recipients, on-call owner and incident escalation |
| R-11 | Account lifecycle and support | Invite-only, verified client owner, immediate revocation and documented recovery | Define identity verification, ownership transfer and support approval procedure |
| R-12 | Agent protocol and fleet lifecycle | Per-agent certificates/identity, outbound TLS, allowlisted jobs, rotation and revocation | Define agent OS support, provisioning, updates, offline behaviour and lost-device process |
| R-13 | Tool integration contract | Versioned API schemas, scoped credentials and human approval for consequential actions | Identify supported versions/capabilities for each tool and integration owner |
| R-14 | Notifications | Transactional email with minimal sensitive content; portal remains source of truth | Select provider, sender domain, delivery monitoring and retention |
| R-15 | File upload/report processing | Quarantine, malware scan, file allowlist and isolated rendering | Select scanning service, permitted formats, size limits and retention |
| R-16 | Billing and subscription workflow | Manual staff-managed subscription records in release one | Decide whether payment processing is in scope; do not store card data |
| R-17 | Availability and capacity | Managed service with resource quotas and alerting | Approve availability target, expected client/agent count and budget |
| R-18 | Release governance | Protected branches, reviewed PRs, CI security checks, staged deployment and rollback | Approve release approvers, environments and production change authority |

### Minimum decisions that block production implementation

Before production implementation begins, TrinTech must approve at least:
1. Cloud provider, deployment region, data-processing terms and environment boundaries.
2. OIDC provider, staff/client identity separation, MFA and recovery policy.
3. Domain/DNS, TLS, WAF/edge, private networking and secrets/KMS ownership.
4. Data classification, retention, deletion, backup RPO/RTO and incident response ownership.
5. Agent identity, enrolment, update, revocation and authorised job protocol.
6. Named owners for production operations, security alerts, restore tests and release approval.

Low-risk local development and schema prototyping can proceed after the architecture is accepted, using synthetic data only and no production credentials. Production client data must not be used in development or test environments.

## 8. Release acceptance gates

The platform is not production-ready until all applicable gates pass:

- Client-to-client isolation tests pass for every tenant-owned endpoint and file download.
- Client-to-staff privilege escalation tests pass.
- MFA is enforced for all staff and privileged accounts.
- Staff permissions and report approval separation-of-duties are enforced server-side.
- Sessions, invitation tokens, password/account recovery and revocation are tested.
- Agent identity, scope enforcement, replay prevention, expiry and revocation are tested.
- Upload quarantine and malware scanning are verified.
- No critical or high-severity security findings remain open without formally approved risk acceptance.
- Backup restoration and incident response exercises are completed.
- Privacy, retention, data processing and operational ownership are approved.
- Production deployment, monitoring, alerting and rollback are documented and tested.

## 9. Explicit non-goals for release one

- No open public client registration.
- No direct inbound connection from the platform into a client's private network by default.
- No client access to raw tool consoles or unrestricted agent commands.
- No automated execution of destructive or consequential response actions without explicit human authorisation.
- No public report/evidence URLs.
- No payment-card processing or storage unless separately scoped and assessed.
- No production credentials, client records or real evidence in development/test environments.
- No claim of compliance certification based solely on implementing these controls.

## 10. Approval record

This ADR records the four architecture directions selected by TrinTech on 2026-11-05:

- Managed hosting.
- Managed OIDC authentication.
- Invitation-only client registration.
- Outbound authenticated monitoring-agent connectivity.

The remaining decisions in section 7 are open. This ADR is a proposed design baseline, not a production deployment approval, legal opinion, security certification or authorisation to process client data.

**Next step:** owner review of the open decisions, then an implementation-specific design review and separate approval before production infrastructure or authentication is provisioned.
