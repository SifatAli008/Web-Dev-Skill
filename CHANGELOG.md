# Changelog

All notable changes to `universal-webdev-skills` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0] - 2026-11-12

### Added
- **Native Antigravity Plugin Packaging:**
  - `plugin.json`: Antigravity plugin manifest (`universal-webdev-skills`) with `displayName`, `description`, `version`, `author`, `homepage`, `repository`, `assets/logo.png`, and `suggestedPrompts`.
  - `rules/AGENTS.md`: Scoped always-on team protocol rule for web/software engineering tasks.
  - `assets/logo.png`: 512×512 transparent-background plugin emblem.
- **Automated Plugin CI/CD & Release Pipeline:**
  - `tools/validate-plugin.js`: Validates `plugin.json`, version parity, square PNG logo dimensions, `rules/AGENTS.md` size/frontmatter rules, and all 16 `SKILL.md` frontmatters.
  - `tools/package-plugin.js`: Stages self-contained plugin bundles and outputs `.tar.gz`, `.zip`, and `SHA256SUMS.txt` release archives.
  - `.github/workflows/release-plugin.yml`: Automated tag (`v*.*.*`) and `workflow_dispatch` workflow to validate, package, and publish GitHub Releases.
- **16th Specialist Skill (`skills/15-hci-interaction/`):**
  - HCI & Cognitive Ergonomics Lead (Fitts's Law, Hick-Hyman Law, Doherty Threshold, KLM, and thumb-zone ergonomics) plus `DESIGN.md` dual-theme OKLCH and component primitive updates.

### Fixed
- Tightened `skills/03-ux-ui-design/SKILL.md` frontmatter `description` below the 1,024-character Agent Skills specification cap.

## [0.1.0] - 2026-11-01

### Added
- **15 Specialist Skills (`skills/<id>-<name>/`):**
  - `00-orchestrator`: Engineering Manager / Orchestrator (process gate, 3-tier classification, audience mode).
  - `01-product-discovery`: Product Lead (MoSCoW scope cuts, PRD generation).
  - `02-architecture`: Solution Architect (design gate, ADR generation, boundary definitions).
  - `03-ux-ui-design`: UX/UI & Accessibility Lead (A11y gate, WCAG 2.2 AA, contrast checks).
  - `04-frontend`: Frontend Lead (Core Web Vitals, zero-CLS, component architecture).
  - `05-backend-data`: Backend & Data Lead (ACID transactions, expand-and-contract migrations).
  - `06-security`: Application Security Lead (**HARD VETO**, threat models, OWASP Top 10 prevention).
  - `07-privacy-compliance`: Privacy & Compliance Officer (**HARD VETO**, GDPR/ePrivacy affirmative consent, ROPA).
  - `08-testing-qa`: QA / SDET Lead (**"No evidence, no ship"**, test harnesses, coverage gates).
  - `09-devops-infra`: DevOps / SRE Lead (**"No rollback, no ship"**, health probes, automated rollback).
  - `10-performance`: Performance Engineer (Core Web Vitals audits, bundle size budgets).
  - `11-seo-marketing`: SEO & Growth Lead (Schema.org JSON-LD, XML sitemaps, robots.txt).
  - `12-business-monetization`: Business & Monetization Lead (server-authoritative pricing, webhook signatures).
  - `13-launch-operations`: Launch & Operations Manager (launch gate sign-offs, go-live runbooks).
  - `14-maintenance`: Maintenance & Evolution Lead (Strangler Fig legacy rescue, dependency triage).
- **Core Router Index (`skills.index.json`):**
  - Machine-readable JSON schema defining triggers, token budgets, dependencies, and file paths.
- **Team Protocol & Behavior Rules (`AGENTS.md`):**
  - 3-tier classification system (MVP, PROD, SCALE), binding veto gates, audience mode, single-agent vs multi-agent execution rules, and mandatory status formatting (<50 lines).
- **Knowledge Foundations:**
  - `SOURCES.md`: Authoritative source registry citing standards (OWASP, W3C WCAG, NIST, GDPR, web.dev, MDN).
  - `GLOSSARY.md`: Shared engineering terminology definitions.
  - `AI-FAILURE-MODES.md`: Shared catalog of AI code generation failure modes and automated counter-measures.
- **15 Cross-Sector Playbooks (`playbooks/`):**
  - Complete operational workflows for auth, billing, API hardening, launch audits, GDPR consent, slow LCP remediation, safe database migrations, secret leak responses, incident response, dependency upgrades, bottleneck triage, legacy rescue, new project MVPs, SQAT quality gate audits, and API versioning/contracts.
- **8 Markdown Templates & 9 JSON Schemas (`templates/` and `templates/schemas/`):**
  - PRD, ADR, threat model, test report, runbook, launch report, postmortem, and performance audit.
- **5 Verification Checklists (`checklists/`):**
  - MVP, Production, Security, Privacy, and Launch checklists.
- **8 Automated Repository Tools (`tools/`):**
  - `lint-skills.js`, `check-links.js`, `check-freshness.js`, `scan-skills.js`, `validate-index.js`, `build-adapters.js`, `run-reference-tests.js`, `verify-all.js`.
- **6 Tool Adapters (`adapters/`):**
  - Pre-built adapters for Claude Code, Cursor, Antigravity, GitHub Copilot, ChatGPT / Codex, and Gemini CLI.
- **3 Golden Reference Projects (`reference-projects/`):**
  - `01-saas-starter-mvp`: SaaS landing + auth + Stripe billing MVP with in-memory SQLite (7/7 tests pass).
  - `02-ecommerce-api-prod`: Production API with idempotency keys, ACID inventory lock, zero-downtime migration, and health probes (7/7 tests pass).
  - `03-content-platform-scale`: Scale platform with edge caching, CWV priority hints, Schema.org JSON-LD, and cookieless analytics (7/7 tests pass).
- **Benchmark Evaluation Suite (`evals/`):**
  - 9 standardized benchmark tasks, 100-point evaluation rubric, and automated runner ([`evals/harness/run-eval.js`](evals/harness/run-eval.js)).
  - Certified results: **+79.9% win delta** on Frontier models, **+132.7% win delta** on Small models, **0 OWASP critical findings**.

