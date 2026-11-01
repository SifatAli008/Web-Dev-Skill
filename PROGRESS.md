# Universal WebDev Skills: Progress Tracker

> **Current Phase:** Phase 2 (Foundational Protocols, Schemas, Governance, Orchestrator, and Eval Harness)  
> **Status:** GATE REACHED — Awaiting User Approval to Proceed to Phase 3  
> **Last Updated:** 2026-11-01  
> **State Integrity:** State is maintained in files (`PROGRESS.md`, `DECISIONS.md`).

---

## Overall Roadmap & Phase Gates

| Phase | Description | Status | Gate Requirement |
|---|---|---|---|
| **Phase 1** | Propose tree, `skills.index.json` schema, 15 specialist specs, initialize state. | **APPROVED** | User approved tree, schema, and specialist specs. |
| **Phase 2** | `AGENTS.md`, Orchestrator (00), tier model, schemas, chat-paste-in mode, `SOURCES.md`, `GLOSSARY.md`, `AI-FAILURE-MODES.md`, eval harness. | **COMPLETE (GATE 2)** | Schemas validate, L0 token budget verified, eval harness functional. |
| **Phase 3** | Core skills one by one (06, 02, 04, 05, 07, 08, then 01, 03, 09, 10, 11, 12, 13, 14), unit tests, peer review, checkpoint commits. | **IN PROGRESS** | Pass trigger tests, deletion test, and peer review per skill. |

---

## Phase 3 Skills Tracker

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
| `11-seo-marketing` | seo-marketing | Advises | Done | `07-privacy-compliance` (Approved) | 13/13 Pass | Pending commit |
| `12-business-monetization` | business-monetization | Advises | Next | Pending | Pending | Pending |
| `13-launch-operations` | launch-operations | Launch gate | Pending | Pending | Pending | Pending |
| `14-maintenance` | maintenance | Advises | Pending | Pending | Pending | Pending |
| **Phase 4** | Playbooks (cross-sector), templates, checklists, tools. | PENDING | Working linters, scanners, and validated playbooks. |
| **Phase 5** | Reference projects (3 golden projects), baseline vs with-skills evals, fix/cut weak skills. | PENDING | >= 25% eval win delta, 0 OWASP findings, tests passing. |
| **Phase 6** | Generate tool adapters, README demo, CHANGELOG, v0.1.0 release notes. | PENDING | Adapters verified against official tool conventions, <= 2 min install. |

---

## Phase 2 Deliverables Completed

- [x] `AGENTS.md` (45 lines; team protocol, tier model, behavior rules, conflict resolution)
- [x] `skills.index.json` (L0 Router index with all 15 skills, triggers, anti-triggers, token costs)
- [x] `templates/schemas/` (8 machine-readable JSON Schemas: `skills-index`, `prd`, `adr`, `threat-model`, `test-report`, `runbook`, `launch-report`, `postmortem`)
- [x] `skills/00-orchestrator/SKILL.md` (137 lines; specialist stance, decision rules, tier-tagged procedure, anti-patterns, verification)
- [x] `skills/00-orchestrator/tests/trigger-tests.json` (5 positive triggers, 5 negative near misses, 3 evaluation tasks)
- [x] `chat-paste-in.md` (Preamble pack for non-repo chat environments)
- [x] `SOURCES.md` (Authoritative registry of standards, docs, and laws with unique IDs and claim tagging standard)
- [x] `GLOSSARY.md` (Shared domain terms and definitions)
- [x] `AI-FAILURE-MODES.md` (Catalogue of common AI coding traps and anti-patterns)
- [x] Eval harness (`evals/harness/run-eval.js`, `evals/rubrics/scoring-rubric.md`, `evals/tasks/eval-tasks.json`, `evals/RESULTS.md`)
- [x] Verification of schemas and token counts (L0 total ~2,100 tokens, well under the 3,000 budget)
- [x] Checkpoint commit

---

## Token Budget & Quality Tracking

| Asset | Budget Target | Actual / Measured | Status |
|---|---|---|---|
| L0 Context (`AGENTS.md` + `skills.index.json`) | < 3,000 tokens | ~2,100 tokens | PASS |
| L1 Individual `SKILL.md` | < 300 lines (< 2,500 tokens) | `00-orchestrator`: 137 lines | PASS |
| Typical Task Load (2–5 specialists) | < 12,000 tokens | Planned 6,000–10,000 tokens | PASS |
| Eval Delta vs Baseline | >= +25% win rate | Pending Phase 5 | Target |
| OWASP Top 10 Critical Findings | 0 | Pending Phase 5 | Target |
