# Playbook: Harden an Existing Web Application (`harden-existing-app`)

> **Objective:** Perform a defensive security audit on an existing codebase and systematically remediate OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF, SSRF, IDOR), security headers, and dependency CVEs.

---

## 1. Specialists Involved
- `06-security`: STRIDE threat modeling, vulnerability detection, CSP, CORS, input sanitization (HARD VETO).
- `05-backend-data`: Parameterizing raw SQL queries, enforcing tenant authorization in database queries.
- `04-frontend`: Eliminating `dangerouslySetInnerHTML`, escaping output, adding CSRF tokens.
- `08-testing-qa`: Automated regression tests for remediated injection and authorization vectors.

---

## 2. Ordered Steps

### Step 1: Vulnerability & Dependency Scan (`06-security`)
1. Run automated dependency audit: `npm audit` or `trivy fs .`.
2. Scan codebase for raw SQL string concatenation:
   ```bash
   grep -rn "query(" --include="*.ts" --include="*.js"
   ```
3. Scan for dangerous HTML injection:
   ```bash
   grep -rn "dangerouslySetInnerHTML" --include="*.tsx" --include="*.jsx"
   ```

### Step 2: Remediate SQL Injection & Parameterize (`05-backend-data`)
1. Replace all string template queries with parameterized queries or ORM methods:
   - Vulnerable: `db.query(`SELECT * FROM users WHERE id = ${id}`)`
   - Remediated: `db.query('SELECT * FROM users WHERE id = $1', [id])`

### Step 3: Remediate Insecure Direct Object References (IDOR) (`06-security` + `05-backend-data`)
1. Audit all endpoints containing entity IDs (`/api/projects/:id`, `/api/invoices/:id`).
2. Add tenant ownership constraints to every single query:
   ```sql
   SELECT * FROM invoices WHERE id = $1 AND organization_id = $2;
   ```
3. If no matching record is found, return 404 Not Found (never reveal that the record exists under another tenant).

### Step 4: Configure Defensive HTTP Headers (`06-security`)
1. Configure helmet or custom middleware emitting defensive headers on all responses:
   - `Content-Security-Policy`: `default-src 'self'; script-src 'self'; frame-ancestors 'none';`
   - `X-Content-Type-Options`: `nosniff`
   - `X-Frame-Options`: `DENY`
   - `Referrer-Policy`: `strict-origin-when-cross-origin`
   - `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload`
2. Remove permissive wildcard CORS: replace `*` with an explicit array of trusted origins.

### Step 5: Input Validation & Schema Enforcement (`06-security`)
1. Enforce Zod schemas on every incoming `req.body`, `req.query`, and `req.params`.
2. Strip un-whitelisted fields to prevent parameter injection / mass assignment.

### Step 6: Security Regression Test Verification (`08-testing-qa`)
1. Author automated test verifying SQL injection payload `' OR 1=1 --` fails safely.
2. Author automated test verifying User A cannot access User B's resource IDOR endpoint (returns 404).
3. Author automated test asserting presence of all security headers.

---

## 3. Quality Gates
- **Security Gate (`06-security`):** HARD VETO: Zero critical or high vulnerabilities remaining in dependency scan or code audit.
- **QA Gate (`08-testing-qa`):** Security regression tests pass cleanly.

---

## 4. Rollback Procedure
If a security hardening header (e.g. strict CSP) breaks a legitimate third-party widget (e.g. Stripe checkout iframe):
1. Use CSP `report-only` mode temporarily: `Content-Security-Policy-Report-Only`.
2. Inspect browser console violation reports to add required whitelist domain (e.g. `frame-src https://js.stripe.com`).
3. Re-enable strict enforcing mode once whitelist is validated.

---

## 5. Evidence Required to Call Done
1. `npm audit` output displaying 0 high or critical vulnerabilities.
2. Automated test run displaying passing assertions for IDOR and SQLi protection.
3. Completed `templates/schemas/threat-model.schema.json` with status `PASSED`.

