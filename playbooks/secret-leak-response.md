# Playbook: Emergency Secret Leak Incident Response (`secret-leak-response`)

> **Objective:** Contain, revoke, rotate, scrub, and audit an emergency leak of production credentials (API keys, database passwords, signing secrets) committed to a public or shared repository.

---

## 1. Specialists Involved
- `06-security`: Incident lead, immediate credential revocation, audit logs review, secret scanning (HARD VETO).
- `09-devops-infra`: Cloud secret re-provisioning, environment vault updates, zero-downtime redeployment.
- `13-launch-operations`: Severity classification (SEV1/SEV2), stakeholder notification, blameless postmortem.

---

## 2. Ordered Steps

### Step 1: Immediate Invalidation & Containment (`06-security` — Minute 0–15)
1. Treat the leaked credential as **COMPROMISED IMMEDIATELY**.
2. Do NOT waste time debating if anyone saw it; revoke or rotate the key at the provider immediately:
   - Stripe: Roll key in Stripe Dashboard (`Restricted Keys` -> `Roll key`).
   - AWS: Deactivate IAM Access Key via AWS CLI:
     ```bash
     aws iam update-access-key --access-key-id AKIA... --status Inactive
     ```
   - Database / Redis: Change password in cloud console / RDS.

### Step 2: Inject New Secret in Runtime Environments (`09-devops-infra` — Minute 15–30)
1. Generate fresh cryptographic secret (minimum 32 bytes high-entropy).
2. Update the secret in cloud secrets manager (AWS Secrets Manager, Doppler, Vault, Vercel Env).
3. Trigger immediate rolling redeployment of active services to ingest new runtime secret.
4. Verify application health probes return HTTP 200.

### Step 3: Scrub Secret from Git Repository History (`06-security` + `09-devops-infra`)
1. Merely deleting the file in a new commit DOES NOT scrub the secret from git history!
2. Use `git-filter-repo` or BFG Repo-Cleaner to permanently scrub the secret:
   ```bash
   git filter-repo --replace-text <(echo "leaked_secret_string==>REDACTED")
   ```
3. Force-push the scrubbed branch:
   ```bash
   git push origin --force --all
   ```
4. Note: Anyone who pulled the repository still has the old commit, which is why Step 1 (revocation at the provider) is the only true security control.

### Step 4: Audit Logs for Unauthorized Exploitation (`06-security`)
1. Review access and audit logs from the provider between the commit timestamp and key revocation:
   - Stripe: Check `Dashboard -> Developers -> Logs` for unfamiliar IP addresses or unauthorized charges/refunds.
   - AWS: Query CloudTrail for API calls made using the compromised Access Key ID.
   - Database: Inspect connection logs for unauthorized external IP connections.
2. Determine if personal customer data was accessed or exfiltrated. If breached, notify `07-privacy-compliance` for statutory breach reporting requirements (GDPR 72-hour window).

### Step 5: Preventative Safeguards & Postmortem (`13-launch-operations`)
1. Install pre-commit secret scanners locally:
   ```bash
   npx husky add .husky/pre-commit "npx secretlint"
   ```
2. Enable secret scanning on GitHub / GitLab repository settings.
3. Convene a blameless postmortem within 48 hours and document in `templates/schemas/postmortem.schema.json`.

---

## 3. Quality Gates
- **Security Gate (`06-security`):** Leaked key verified inactive/revoked at provider; secret scanning passes clean.
- **Operations Gate (`13-launch-operations`):** Incident postmortem completed with preventative actions.

---

## 4. Rollback Procedure
If rotating a database password breaks active application connectivity:
1. Temporarily enable dual-user authentication in database (support both old and new credentials simultaneously) during rotation window.
2. Verify all replicas and background workers connect successfully before terminating old credentials.

---

## 5. Evidence Required to Call Done
1. Terminal proof from provider CLI verifying leaked key is in `Inactive` or `Revoked` status.
2. Git history scan showing secret is completely removed from all commits.
3. Completed `templates/schemas/postmortem.schema.json`.
