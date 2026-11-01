# Playbook: Production Incident Triage & Response (`incident-response`)

> **Objective:** Rapidly detect, triage, contain, mitigate, and resolve production outages (SEV1–SEV4) with structured communication, automated rollback, and blameless postmortems.

---

## 1. Specialists Involved
- `13-launch-operations`: Incident Commander, triage categorization, public communication, postmortem facilitation.
- `09-devops-infra`: Telemetry investigation, logs/metrics analysis, automated rollback execution, infrastructure mitigation.
- `05-backend-data`: Database recovery, connection pool remediation, deadlocks triage.
- `06-security`: Breach containment and malicious attack mitigation (if security incident).
- `08-testing-qa`: Verification smoke tests proving outage resolution before public all-clear.

---

## 2. Ordered Steps

### Step 1: Detect, Classify, & Appoint Incident Commander (`13-launch-operations` — Minute 0–5)
1. Triage severity level:
   - **SEV1 (Critical):** Core customer workflows down (checkout, login, API 500s), data loss, active security breach. (SLA: immediate, all-hands).
   - **SEV2 (Major):** High-impact degradation affecting >20% of users with no immediate workaround.
   - **SEV3 (Minor):** Degraded non-critical feature with workaround.
   - **SEV4 (Low):** Minor cosmetic bug or non-customer-facing issue.
2. Designate a single **Incident Commander (IC)**: The IC directs mitigation, coordinates specialists, and assigns tasks; they do not write code during the incident.

### Step 2: Establish Communication & Public Status (`13-launch-operations` — Minute 5–15)
1. Open dedicated incident channel: `#incident-[date]-[brief-name]`.
2. Post initial public status page update:
   - "We are currently investigating elevated error rates affecting [Service Name]. Our engineering team is actively working to resolve the issue. Next update in 30 minutes."
3. Send internal status updates to stakeholders every 30 minutes for SEV1.

### Step 3: Mitigate Immediately — Roll Back First, Debug Later (`09-devops-infra` — Minute 15–30)
1. Determine if incident correlates with a recent release:
   - Check deployment history in CI/CD within the last 2 hours.
2. If correlated with a deployment, **TRIGGER IMMEDIATE AUTOMATED ROLLBACK**:
   ```bash
   ./scripts/rollback-release.sh
   ```
   Do NOT attempt to "roll forward" or debug in production during active downtime!
3. If database saturation is the cause: terminate idle connections or enable connection pool throttling.
4. If third-party vendor outage: enable fallback circuit breaker (e.g. queue requests locally).

### Step 4: Verify Outage Resolution (`08-testing-qa` + `09-devops-infra`)
1. Run automated production health probes: verify HTTP 200 on `/api/health/readiness`.
2. Verify application error rate drops below 0.1% on monitoring dashboards.
3. Execute live synthetic smoke tests to confirm end-to-end functionality.

### Step 5: Incident Closure & Public All-Clear (`13-launch-operations`)
1. Post public all-clear: "The issue affecting [Service Name] has been resolved. All systems are operational."
2. Stand down the incident command channel.

### Step 6: Facilitate Blameless Postmortem (`13-launch-operations` — Within 48 Hours)
1. Convene engineering team for blameless review.
2. Construct timeline and perform 5-Whys root cause analysis.
3. Generate and commit `templates/schemas/postmortem.schema.json`.

---

## 3. Quality Gates
- **Operations Gate (`13-launch-operations`):** Incident response SLA adhered to; status page updated within 15 minutes.
- **QA Gate (`08-testing-qa`):** Synthetic smoke test passes clean before declaring all-clear.

---

## 4. Rollback Procedure
- The primary response to any deployment-induced incident is automated rollback.
- If rollback fails, activate the emergency maintenance splash page and redirect traffic to CDN static holding page while investigating.

---

## 5. Evidence Required to Call Done
1. Telemetry dashboard screenshot or export showing error rates normalized to baseline (<0.1%).
2. Completed and schema-validated `templates/schemas/postmortem.schema.json` with preventative action owners assigned.
