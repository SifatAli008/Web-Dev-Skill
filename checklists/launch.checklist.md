# Go-Live Launch Verification Checklist

> **Authority:** Launch & Operations Manager (`13-launch-operations`) — Launch Gate  
> **Scope:** Final Release Authorization & Pre-Launch Sanity

---

- [ ] **1. Gate Certifications (Pre-Requisites):**
  - [ ] Security Gate: APPROVED (0 Criticals, threat model signed).
  - [ ] Privacy Gate: APPROVED (Consent barrier active, ROPA logged).
  - [ ] QA Gate: APPROVED (Automated test suite passing with exit code 0).
  - [ ] DevOps Gate: APPROVED (Automated rollback verified in staging).
  - [ ] A11y Gate: APPROVED (axe-core scan 0 violations, WCAG 2.2 AA).

- [ ] **2. Domain, DNS, & Infrastructure:**
  - [ ] DNS TTL lowered to 300 seconds 24–48 hours before cutover.
  - [ ] Apex domain and `www` redirects configured cleanly with valid SSL/TLS certificates.
  - [ ] Liveness and readiness endpoints return HTTP 200.
  - [ ] Database backup snapshot taken immediately before migration.

- [ ] **3. Cutover Execution:**
  - [ ] Database migrations applied with `SET lock_timeout = '2s'`.
  - [ ] Application deployed using zero-downtime rolling or blue-green strategy.
  - [ ] Monitoring dashboards active (error rate baseline < 0.1%).

- [ ] **4. 5-Minute Post-Deployment Live Smoke Tests:**
  - [ ] Visit homepage over clean browser session: verify HTTPS and assets load.
  - [ ] Complete synthetic user registration and verify session cookie flags.
  - [ ] Execute live payment transaction in Stripe test/live mode; verify invoice receipt.
  - [ ] Clean up synthetic test records from database.

- [ ] **5. Launch Sign-Off:**
  - [ ] On-call incident lead designated with active PagerDuty rotation.
  - [ ] Launch Report completed and schema-validated in `launch-report.json`.
  - [ ] Formal Launch Decision: **GO** authorized.

