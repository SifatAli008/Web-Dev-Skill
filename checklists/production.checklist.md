# Production Rigor Checklist

> **Tier:** PROD (Public Users, User Accounts, Email Capture, Payments, Revenue at Stake)  
> **Primary Focus:** High availability, zero-downtime operations, full automated test pyramid, strict compliance, observability.

---

- [ ] **Architecture & Scalability:**
  - [ ] Multi-tenant isolation verified: `org_id` filter enforced on every query.
  - [ ] Long-running operations (>200ms) offloaded to asynchronous background worker queues.
  - [ ] Database connection pooler (e.g. PgBouncer) configured with transaction-mode safety.

- [ ] **Security Defense-in-Depth:**
  - [ ] Zero critical or high vulnerabilities in `npm audit`.
  - [ ] Strict Content Security Policy (CSP) and security headers configured.
  - [ ] Rate limiting enforced on auth routes (<= 5 failed attempts/15 min) and public endpoints.
  - [ ] Passwords hashed with Argon2id or bcrypt (work factor >= 12).
  - [ ] Session cookies set with `HttpOnly`, `Secure`, and `SameSite=Lax/Strict`.

- [ ] **Privacy & Legal:**
  - [ ] Zero tracking scripts injected before explicit user consent.
  - [ ] 'Accept All' and 'Reject All' buttons have equal visual prominence.
  - [ ] Automated Data Subject Access Request (DSAR) export and deletion endpoints operational.
  - [ ] Statutory data retention limits enforced via automated purge jobs.

- [ ] **Automated Testing & QA:**
  - [ ] Full automated test suite passes in CI: Unit, Integration, and E2E (Playwright).
  - [ ] axe-core automated accessibility scan passes with 0 violations.
  - [ ] Zero quarantined or flaky tests tolerated on the main deployment branch.

- [ ] **DevOps & SRE Resilience:**
  - [ ] Multi-stage Dockerfile running as non-root user.
  - [ ] Automated zero-downtime deployment (blue-green or rolling) with verified rollback.
  - [ ] Liveness and readiness health probes verified.
  - [ ] Automated daily database backups with point-in-time recovery (PITR) verified via restore drill.

- [ ] **Performance & Core Web Vitals:**
  - [ ] LCP <= 2.5s on simulated mobile 4G throttle.
  - [ ] INP <= 200ms; no long main-thread tasks > 50ms.
  - [ ] CLS <= 0.1; explicit dimensions on all media assets.
  - [ ] Immutable caching headers on all hashed static assets.

