# Universal WebDev Team Protocol (Antigravity Plugin Rule)

Apply this engineering protocol whenever the task involves web development, frontend, backend, full-stack systems, APIs, UI/UX, HCI, application security, privacy compliance, QA, DevOps, performance, SEO, or monetization. Do not impose this workflow or the engineering status footer on unrelated non-engineering conversations.

## 1. Tier First
Classify the project as **MVP**, **PROD**, or **SCALE** from concrete signals, always adopting the **HIGHEST** tier triggered:
- **PROD signals:** public users, user accounts or email capture, payments/checkout, revenue at stake, or sensitive customer data.
- **SCALE signals:** >100k MAU or spiky traffic, high-volume transactions, regulated/health/minors data, strict SLAs, or multi-tenant isolation.
- Never build a PROD or SCALE signal at MVP rigor unless the user explicitly accepts the risk and records it in `DECISIONS.md`.

## 2. Route via `skills.index.json` (Progressive Disclosure)
Consult `skills.index.json` (bundled at the plugin root alongside `skills/`, or in the active workspace) and engage only the **2–5 specialist skills** relevant to the immediate task. Never load all 16 skills simultaneously.

- Core orchestration & discovery: `orchestrator`, `product-discovery`, `architecture`
- Design & UI engineering: `ux-ui-design`, `hci-interaction`, `frontend`
- Data, security & compliance: `backend-data`, `security`, `privacy-compliance`
- Quality, delivery & growth: `testing-qa`, `devops-infra`, `performance`, `seo-marketing`, `business-monetization`, `launch-operations`, `maintenance`

## 3. Conflict Order & Binding Gates
Resolve cross-discipline trade-offs strictly in this order:
**Security & Privacy > Architecture > Performance > Speed**

- **Security (`security`):** **HARD VETO** on unmitigated OWASP Top 10 flaws, unparameterized SQL, or hardcoded secrets.
- **Privacy (`privacy-compliance`):** **HARD VETO** on unlawful data collection or pre-consent tracking.
- **QA (`testing-qa`):** **No evidence, no ship** — execute automated checks and report real terminal output and exit codes.
- **DevOps (`devops-infra`):** **No rollback, no ship** — require health probes and verified rollback steps for PROD/SCALE releases.
- **A11y (`ux-ui-design`):** Enforce `DESIGN.md` visual contracts, Taste Profiles, and WCAG 2.2 Level AA compliance.

## 4. Decision Discipline & Hygiene
- **Ponytail Decision Ladder:** Stop at the first rung that satisfies the requirement: `1) YAGNI -> 2) Codebase Reuse -> 3) Web Platform Native -> 4) Installed Dependency -> 5) One-Liner -> 6) Minimum Viable`.
- **Zero AI Slop & Hygiene:** No placeholder stub comments, no dead code, no deeply nested folder sprawl, and no generic vibe-code UI clichés.
- **Bundled References:** Use the plugin's `templates/schemas/`, `playbooks/`, `checklists/`, `DESIGN.md`, and `AGENTS.md` when authoring PRDs, ADRs, threat models, test reports, or launch audits.

## 5. Engineering Status Closing Format
When delivering substantial web engineering changes, close with:
- **Done:** Concrete deliverables finished in this turn.
- **Verified (with evidence):** Commands executed, exit codes, and observed output.
- **NOT verified:** Checks deferred or blocked by environment access.
- **Risks:** Unmitigated vulnerabilities, regressions, or trade-offs.
- **Next step:** Exact next action or gate review.
