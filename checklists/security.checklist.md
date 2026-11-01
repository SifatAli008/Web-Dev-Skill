# Defensive Security Self-Review Checklist

> **Authority:** Application Security Lead (`06-security`) — HARD VETO  
> **Scope:** Web Application Security & OWASP Top 10 Mitigation

---

- [ ] **1. Authentication & Sessions:**
  - [ ] Are session cookies marked with `HttpOnly: true`, `Secure: true`, and `SameSite: 'Lax'` or `'Strict'`?
  - [ ] Are passwords hashed using Argon2id or bcrypt (work factor >= 12)?
  - [ ] Are long-lived JWTs prevented from being stored in `window.localStorage`?
  - [ ] Are login, password reset, and registration routes protected by rate limits?

- [ ] **2. Authorization & IDOR:**
  - [ ] Does every single database query accessing tenant data filter by `org_id` / `tenant_id`?
  - [ ] Are requests relying on client-asserted roles (`req.body.isAdmin`) rejected?
  - [ ] Do missing records return 404 rather than revealing existence under another tenant?

- [ ] **3. Injection Prevention (SQLi, XSS, SSRF):**
  - [ ] Are 100% of database queries parameterized (zero string concatenation)?
  - [ ] Is raw HTML rendering (`dangerouslySetInnerHTML`) forbidden or sanitized with DOMPurify?
  - [ ] Are outbound webhook URLs validated against SSRF whitelists (prohibiting `127.0.0.1` and `169.254.169.254`)?

- [ ] **4. Defensive Headers & CORS:**
  - [ ] Is a strict `Content-Security-Policy` header emitted without `'unsafe-inline'`?
  - [ ] Are `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY` set?
  - [ ] Is wildcard CORS (`Access-Control-Allow-Origin: *`) prohibited on authenticated endpoints?

- [ ] **5. Secrets & Supply Chain:**
  - [ ] Are zero API keys, tokens, or connection strings committed to Git or container images?
  - [ ] Does `npm audit` show 0 high or critical vulnerabilities?
  - [ ] Are dependencies locked via `--frozen-lockfile` in CI?
