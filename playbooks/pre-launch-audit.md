# Playbook: Pre-Launch Production Readiness Audit (`pre-launch-audit`)

> **Objective:** Execute an exhaustive, cross-specialist production readiness review (PRR) before public release, verifying all gates and generating a certified Launch Report.

---

## 1. Specialists Involved
- `13-launch-operations`: Audit orchestration, launch checklist, Go/No-Go decision (Launch gate).
- `06-security`: Final vulnerability check, CSP header verification, secret leak audit (HARD VETO).
- `07-privacy-compliance`: Cookie consent barrier, lawful basis, DSAR workflows (HARD VETO).
- `08-testing-qa`: Full automated test suite execution, coverage review (No evidence, no ship).
- `09-devops-infra`: Automated rollback verification, health probes, backup restore test (No rollback, no ship).
- `03-ux-ui-design`: WCAG 2.2 AA accessibility audit, responsive checks (A11y gate).
- `10-performance`: Core Web Vitals audit (LCP < 2.5s, INP < 200ms, CLS < 0.1).
- `11-seo-marketing`: Canonical tags, robots.txt, dynamic sitemap, Open Graph cards.

---

## 2. Ordered Steps

### Step 1: Security & Privacy Gate Reviews (`06-security` + `07-privacy-compliance`)
1. Security: Run `npm audit`, verify zero plaintext secrets in repo, verify HTTPS and CSP.
2. Privacy: Verify tracking scripts do not fire prior to explicit consent; verify `POST /api/user/export-data` and account deletion endpoints function.
3. Sign off or issue HARD VETO.

### Step 2: Quality Assurance & Test Verification (`08-testing-qa`)
1. Execute entire test suite in CI environment:
   ```bash
   npm test
   ```
2. Verify Playwright e2e critical journeys pass.
3. Generate certified `test-report.schema.json`.

### Step 3: DevOps & Infrastructure Readiness (`09-devops-infra`)
1. Verify `/api/health/liveness` and `/api/health/readiness` respond correctly.
2. Verify automated rollback command is documented and verified in staging.
3. Verify automated database backup exists and has been tested in a restore drill.
4. Generate certified `runbook.schema.json`.

### Step 4: Accessibility & Design System Check (`03-ux-ui-design`)
1. Run axe-core automated accessibility scan: assert 0 violations.
2. Verify all text passes 4.5:1 contrast and focus rings are visible.

### Step 5: Performance & Core Web Vitals Check (`10-performance`)
1. Audit primary landing and product routes on mobile:
   - LCP <= 2.5s.
   - INP <= 200ms.
   - CLS <= 0.1.

### Step 6: SEO & Metadata Verification (`11-seo-marketing`)
1. Validate `robots.txt` disallows private routes (`/dashboard`, `/api`).
2. Validate `sitemap.xml` returns valid XML.
3. Verify `og:image` returns valid 1200x630 image.

### Step 7: Go / No-Go Decision & Launch Report (`13-launch-operations`)
1. Consolidate all specialist sign-offs into `templates/schemas/launch-report.schema.json`.
2. Designate on-call incident lead and communication channel.
3. Issue formal `GO` authorization.

---

## 3. Quality Gates
- All 5 specialist gates must be in `APPROVED` status:
  - Security Gate: PASSED
  - Privacy Gate: PASSED
  - QA Gate: PASSED
  - DevOps Gate: PASSED
  - A11y Gate: PASSED
- If any gate fails, launch status is strictly `NO-GO` unless explicit `ACCEPTED-RISK` entry is approved by the user.

---

## 4. Rollback Procedure
If live release triggers high error rates during post-launch smoke testing:
1. Trigger automated rollback script documented in `runbook.schema.json`.
2. Re-route DNS / load balancer to previous known good release.
3. Announce incident status on team channel and convene SEV1 triage.

---

## 5. Evidence Required to Call Done
1. Completed and schema-validated `templates/schemas/launch-report.schema.json` with `launch_decision: "GO"`.
2. Verified terminal output from CI displaying 100% green tests.

