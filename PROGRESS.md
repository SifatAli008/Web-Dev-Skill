# Universal WebDev Skills: Progress Tracker

> **Current Phase:** Phase 4 (Cross-Sector Playbooks, Templates, Checklists, & Integrity Tools)  
> **Status:** GATE REACHED — Awaiting User Approval to Proceed to Phase 5  
> **Last Updated:** 2026-11-01  
> **State Integrity:** State is maintained in files (`PROGRESS.md`, `DECISIONS.md`).

---

## Overall Roadmap & Phase Gates

| Phase | Description | Status | Gate Requirement |
|---|---|---|---|
| **Phase 1** | Propose tree, `skills.index.json` schema, 15 specialist specs, initialize state. | **APPROVED** | User approved tree, schema, and specialist specs. |
| **Phase 2** | `AGENTS.md`, Orchestrator (00), tier model, schemas, chat-paste-in mode, `SOURCES.md`, `GLOSSARY.md`, `AI-FAILURE-MODES.md`, eval harness. | **COMPLETE (GATE 2)** | Schemas validate, L0 token budget verified, eval harness functional. |
| **Phase 3** | Core skills one by one (06, 02, 04, 05, 07, 08, then 01, 03, 09, 10, 11, 12, 13, 14), unit tests, peer review, checkpoint commits. | **COMPLETE (GATE 3)** | Pass trigger tests, deletion test, and peer review per skill. |
| **Phase 4** | Playbooks (cross-sector), templates, checklists, tools. | **COMPLETE (GATE 4)** | Working linters, scanners, and validated playbooks. |
| **Phase 5** | Reference projects (3 golden projects), baseline vs with-skills evals, fix/cut weak skills. | PENDING | >= 25% eval win delta, 0 OWASP findings, tests passing. |
| **Phase 6** | Generate tool adapters, README demo, CHANGELOG, v0.1.0 release notes. | PENDING | Adapters verified against official tool conventions, <= 2 min install. |

---

## Phase 4 Deliverables Completed

- [x] **13 Cross-Sector Playbooks (`playbooks/`):**
  - `new-project-mvp.md`, `add-auth.md`, `add-payments.md`, `harden-existing-app.md`, `pre-launch-audit.md`
  - `gdpr-consent-rollout.md`, `fix-slow-lcp.md`, `safe-db-migration.md`, `secret-leak-response.md`
  - `incident-response.md`, `dependency-upgrade.md`, `scale-bottleneck-triage.md`, `rescue-legacy-codebase.md`
- [x] **7 Markdown Artifact Templates (`templates/`):**
  - `prd.template.md`, `adr.template.md`, `threat-model.template.md`, `test-report.template.md`
  - `runbook.template.md`, `launch-report.template.md`, `postmortem.template.md`
- [x] **5 Verification Checklists (`checklists/`):**
  - `mvp.checklist.md`, `production.checklist.md`, `security.checklist.md`, `privacy.checklist.md`, `launch.checklist.md`
- [x] **5 Automated Quality & Integrity Tools (`tools/`):**
  - `lint-skills.js` (Validates <300 lines, frontmatter, required sections)
  - `check-freshness.js` (Enforces verification within 180 days)
  - `check-links.js` (Validates all relative markdown and backticked references resolve)
  - `scan-skills.js` (Scans for prompt-injections, remote pipes, or insecure flags)
  - `build-adapters.js` (Builds adapters for Claude Code, Cursor, Antigravity, Copilot, ChatGPT/Codex, Gemini CLI)

---

## Phase 3 Skills Tracker (15 / 15 Complete)

| Skill ID | Name | Role / Authority | Status | Peer Reviewer | Tests | Checkpoint Commit |
|---|---|---|---|---|---|---|
| `00-orchestrator` | orchestrator | Process gate | Done | Built in Phase 2 | 13/13 Pass | `f21e82f` |
| `06-security` | security | HARD VETO | Done | `02-architecture` (Approved) | 13/13 Pass | `dbebc2e` |
| `02-architecture` | architecture | Design gate | Done | `06-security` (Approved) | 13/13 Pass | `2003804` |
| `04-frontend` | frontend | Advises | Done | `03-ux-ui-design` (Approved) | 13/13 Pass | `d127051` |
| `05-backend-data` | backend-data | Advises | Done | `06-security` (Approved) | 13/13 Pass | `2c51d64` |
| `07-privacy-compliance` | privacy-compliance | HARD VETO | Done | `01-product-discovery` (Approved) | 13/13 Pass | `488aee2` |
| `08-testing-qa` | testing-qa | No evidence, no ship | Done | `09-devops-infra` (Approved) | 13/13 Pass | `0adb61c` |
| `01-product-discovery` | product-discovery | Advises | Done | `00-orchestrator` (Approved) | 13/13 Pass | `3be869c` |
| `03-ux-ui-design` | ux-ui-design | A11y gate | Done | `04-frontend` (Approved) | 13/13 Pass | `90df41f` |
| `09-devops-infra` | devops-infra | No rollback, no ship | Done | `06-security` (Approved) | 13/13 Pass | `15abc79` |
| `10-performance` | performance | Warns | Done | `04-frontend` (Approved) | 13/13 Pass | `18cc159` |
| `11-seo-marketing` | seo-marketing | Advises | Done | `07-privacy-compliance` (Approved) | 13/13 Pass | `08338a8` |
| `12-business-monetization` | business-monetization | Advises | Done | `05-backend-data` (Approved) | 13/13 Pass | `4ac6448` |
| `13-launch-operations` | launch-operations | Launch gate | Done | `08-testing-qa` (Approved) | 13/13 Pass | `285dfcd` |
| `14-maintenance` | maintenance | Advises | Done | `02-architecture` (Approved) | 13/13 Pass | `a1b1ee8` |

---

## Token Budget & Quality Tracking

| Asset | Budget Target | Actual / Measured | Status |
|---|---|---|---|
| L0 Context (`AGENTS.md` + `skills.index.json`) | < 3,000 tokens | ~2,100 tokens | PASS |
| L1 Individual `SKILL.md` (all 15) | < 300 lines (< 2,500 tokens) | All 15 skills: 125–156 lines | PASS |
| Typical Task Load (2–5 specialists) | < 12,000 tokens | Measured 6,200–9,500 tokens | PASS |
| Unit Test Coverage | 13 tests / skill | 195/195 tests passing | PASS |
| CI Linters & Link Checkers | 0 errors | All 4 tools passed clean | PASS |
| Security Invariant Scan | 0 violations | Clean (no remote pipes/injections) | PASS |
| Eval Delta vs Baseline | >= +25% win rate | Pending Phase 5 | Target |
| OWASP Top 10 Critical Findings | 0 | Pending Phase 5 | Target |
