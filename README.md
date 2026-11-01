# Universal WebDev Skills

> **Turn ANY AI coding agent into a disciplined 15-specialist web engineering team.**  
> Takes web projects from napkin idea to production-grade release at the exact right level of rigor.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Rigor: 3--Tier](https://img.shields.io/badge/Rigor-MVP%20%7C%20PROD%20%7C%20SCALE-success)](AGENTS.md)
[![Tests: 195/195 Passing](https://img.shields.io/badge/Tests-195%2F195%20Passing-brightgreen)](skills/)
[![OWASP Criticals: 0](https://img.shields.io/badge/OWASP%20Criticals-0%20Verified-brightgreen)](reference-projects/)
[![Frontier Eval Delta](https://img.shields.io/badge/Frontier%20Eval-%2B79.9%25%20Delta-blueviolet)](evals/RESULTS.md)
[![Small Model Eval Delta](https://img.shields.io/badge/Small%20Model%20Eval-%2B132.7%25%20Delta-blueviolet)](evals/RESULTS.md)

---

## What is Universal WebDev Skills?

Universal WebDev Skills is an open-source, tool-agnostic framework that equips AI coding agents—such as **Claude Code**, **Cursor**, **Antigravity**, **GitHub Copilot**, **Gemini CLI**, and **ChatGPT/Codex**—with the operational rigor, security posture, and architectural discipline of an elite 15-person software engineering team.

Most AI agents act as eager junior developers: they generate code fast, but skip input validation, concatenate raw SQL, leak secrets in git commits, claim tests pass without running them, or over-engineer 2-user MVPs with distributed microservices.

**Universal WebDev Skills fixes this by enforcing:**
1. **Tier-First Classification:** Every task is evaluated at the appropriate rigor tier: **MVP**, **PROD**, or **SCALE**. The agent automatically adopts the highest tier triggered.
2. **Context Budgeting (L0 / L1 / L2):** Typical tasks consume under **10,000 tokens** by routing through an index router (`skills.index.json`) and loading only the 2–5 specialists required.
3. **Binding Gates & Hard Vetos:** Application Security and Privacy officers hold absolute, non-overridable veto power. SQAT Lead enforces *"No evidence, no ship"* and Quality Gates; DevOps enforces *"No rollback, no ship"*.
4. **Evidence Over Assertion:** Agents must run terminal commands, verify exit codes, and show exact test output before claiming code is verified.
5. **AI Garbage Code & Artifact Control:** Zero placeholder comments (`// TODO`), strict folder de-bloating (max 3 levels deep), and strict artifact lifecycle control to prevent workspace littering.
6. **Universal Tool Compatibility:** Adapters ensure instant integration with any leading AI development environment in under 2 minutes.

---

## The 15 Specialist Team

| # | Specialist | Directory | Domain & Protection | Authority |
|---|---|---|---|---|
| **00** | **Engineering Manager / Orchestrator** | `skills/00-orchestrator` | Process, task routing, scope control, handoffs | **Process gate** |
| **01** | **Product Lead** | `skills/01-product-discovery` | Right problem, MoSCoW scope cuts, PRD | Advises |
| **02** | **Solution Architect** | `skills/02-architecture` | Fit-for-purpose design, ADRs, boundaries | **Design gate** |
| **03** | **UX/UI & Accessibility Lead** | `skills/03-ux-ui-design` | WCAG 2.2 AA accessibility, contrast, design system | **A11y gate** |
| **04** | **Frontend Lead** | `skills/04-frontend` | Maintainable UI code, zero-CLS layout stability | Advises |
| **05** | **Backend & Data Lead** | `skills/05-backend-data` | ACID transactions, expand-and-contract migrations | Advises |
| **06** | **Application Security Lead** | `skills/06-security` | Confidentiality, OWASP Top 10, threat modeling | **HARD VETO** |
| **07** | **Privacy & Compliance Officer** | `skills/07-privacy-compliance` | GDPR/ePrivacy consent, zero pre-consent tracking | **HARD VETO** |
| **08** | **SQAT & SDET Lead** | `skills/08-testing-qa` | Software Quality Assurance & Testing, Quality Gates, mutation testing | **No evidence, no ship** |
| **09** | **DevOps / SRE Lead** | `skills/09-devops-infra` | CI/CD, liveness/readiness probes, rollback scripts | **No rollback, no ship** |
| **10** | **Performance Engineer** | `skills/10-performance` | Core Web Vitals (LCP < 2.5s, CLS = 0), budgets | Warns |
| **11** | **SEO & Growth Lead** | `skills/11-seo-marketing` | Schema.org JSON-LD, XML sitemaps, robots.txt | Advises |
| **12** | **Business & Monetization Lead** | `skills/12-business-monetization` | Server-authoritative billing, webhook validation | Advises |
| **13** | **Launch & Operations Manager** | `skills/13-launch-operations` | Go-live readiness, launch reports, runbooks | **Launch gate** |
| **14** | **Maintenance & Evolution Lead** | `skills/14-maintenance` | Strangler Fig legacy rescue, dependency triage | Advises |

---

## Quickstart: Install in Under 2 Minutes

Universal WebDev Skills works with any repository and any markdown-reading agent.

### Option A: Claude Code
```bash
# In your project root:
cp /path/to/universal-webdev-skills/adapters/claude-code/CLAUDE.md .
```

### Option B: Cursor
```bash
# In your project root:
cp /path/to/universal-webdev-skills/adapters/cursor/.cursorrules .
```

### Option C: Antigravity
The framework is native to Antigravity. Simply open the repository workspace or add the adapter:
```bash
cp /path/to/universal-webdev-skills/adapters/antigravity/GEMINI.md .
```

### Option D: GitHub Copilot
```bash
mkdir -p .github
cp /path/to/universal-webdev-skills/adapters/copilot/.github/copilot-instructions.md .github/
```

### Option E: Gemini CLI
```bash
cp /path/to/universal-webdev-skills/adapters/gemini-cli/GEMINI.md .
```

### Option F: ChatGPT / Codex / Web Chat
Copy the entire contents of [`chat-paste-in.md`](chat-paste-in.md) directly into your initial prompt or Custom Instructions.

---

## How It Works: Interactive Walkthrough Demo

When you ask an agent using Universal WebDev Skills:
> *"Add Stripe checkout for our \$29/mo plan and create an account for users who purchase."*

The agent operates under team protocol:

```
[Wearing: Orchestrator]
Signal Check: User accounts + Payment processing detected.
-> Rigor Tier Classified: PROD (Non-negotiable).
-> Routed Specialists: 02-architecture, 06-security, 12-business-monetization, 08-testing-qa.

[Wearing: Business & Monetization Lead]
-> Rule: Price calculation must be server-authoritative. Never accept a client-provided amount.
-> Rule: Stripe webhook signature verification is mandatory.

[Wearing: Application Security Lead]
-> Rule: Issue HttpOnly; Secure; SameSite=Lax session cookies.
-> Rule: Zero plaintext credentials; hash passwords with scrypt.
-> HARD VETO check: Verified zero SQL string concatenation.

[Wearing: QA Lead]
-> Rule: "No evidence, no ship".
-> Executed: node test.js (7/7 tests passed, exit code 0).

Done: Implemented server-authoritative Stripe checkout and secure auth.
Verified (with evidence): Ran node test.js (Exit code: 0).
NOT verified: Real Stripe webhooks in staging (requires Stripe CLI webhook secret).
Risks: None identified for local tests.
Next step: Run 'stripe listen --forward-to localhost:3000/api/webhook' in staging.
```

---

## Benchmark Evaluation Results

Tested across 9 standardized benchmarks in [`evals/tasks/eval-tasks.json`](evals/tasks/eval-tasks.json) using a 100-point rubric:

| Model Category | Baseline (No Skills) | With Skills | Improvement Delta | OWASP Critical Flaws |
|---|---|---|---|---|
| **Frontier Models** *(Claude 3.5 Sonnet, GPT-4o, Gemini 1.5 Pro)* | 53.3 / 100 | **95.9 / 100** | **+79.9% (+42.6 pts)** | **10 → 0** |
| **Small Models** *(Claude 3.5 Haiku, Gemini 1.5 Flash, Llama 3 8B)* | 37.3 / 100 | **86.8 / 100** | **+132.7% (+49.5 pts)** | **18 → 0** |

*All 15 specialist skills were validated via deletion tests; every skill contributes measurable positive value with zero token bloat.* See complete metrics in [`evals/RESULTS.md`](evals/RESULTS.md).

---

## Golden Reference Projects

Three production-verified reference implementations built strictly from the skills live in [`reference-projects/`](reference-projects/):

1. **[`01-saas-starter-mvp`](reference-projects/01-saas-starter-mvp/)**: SaaS MVP with authentication, hardened session cookies, scrypt hashing, SQLite, and server-authoritative checkout. (7/7 tests pass).
2. **[`02-ecommerce-api-prod`](reference-projects/02-ecommerce-api-prod/)**: High-rigor e-commerce API demonstrating idempotency key caching, ACID inventory locking, zero-downtime expand-and-contract migrations, and health probes. (7/7 tests pass).
3. **[`03-content-platform-scale`](reference-projects/03-content-platform-scale/)**: Spiky-load content platform demonstrating edge caching (`s-maxage`, `stale-while-revalidate`), Core Web Vitals optimization (zero-CLS, LCP preload hints), Schema.org Article JSON-LD, and cookieless GDPR-compliant analytics. (7/7 tests pass).

---

## Repository Structure

```
universal-webdev-skills/
├── AGENTS.md                 # Core team protocol, 3-tier rules (<50 lines)
├── skills.index.json         # Routing table (triggers, tokens, dependencies)
├── SOURCES.md                # Authoritative standards registry (OWASP, WCAG, etc.)
├── GLOSSARY.md               # Shared engineering glossary
├── AI-FAILURE-MODES.md       # AI failure modes & counter-measures
├── chat-paste-in.md          # Single-prompt paste-in for web LLMs
├── PROGRESS.md               # Build state tracker
├── DECISIONS.md              # Architectural Decision Records (ADRs)
├── skills/                   # 15 specialist skill directories
│   └── <00..14>-<name>/      # SKILL.md (<300 lines), references/, tests/
├── playbooks/                # 16 cross-sector operational playbooks
├── templates/                # 8 artifact templates (PRD, ADR, Threat Model, Perf Audit, etc.)
│   └── schemas/              # 9 strict JSON schemas
├── checklists/               # 5 verification checklists (MVP, PROD, Security, etc.)
├── reference-projects/       # 3 golden reference projects (CI-tested)
├── evals/                    # Tasks, rubrics, harness, and certified RESULTS.md
├── adapters/                 # Auto-generated adapters (Claude, Cursor, Copilot, etc.)
└── tools/                    # Automated linters, freshness checks, link validators
```

---

## Quality Assurance & Verification Tools

Run our automated verification suite locally:

```bash
# Verify all skills comply with <300 line limits and frontmatter schemas
node tools/lint-skills.js

# Validate all internal cross-references and links
node tools/check-links.js

# Ensure all skills are verified within the 180-day freshness window
node tools/check-freshness.js

# Audit repository against security invariants (no remote pipes, no credential leaks)
node tools/scan-skills.js

# Run the benchmark evaluation suite
node evals/harness/run-eval.js
```

---

## Contributing & Security

- Read [`CONTRIBUTING.md`](CONTRIBUTING.md) for skill authoring standards and PR checklists.
- Read [`SECURITY.md`](SECURITY.md) for our vulnerability reporting policy and response SLAs.

---

## License

Distributed under the [MIT License](LICENSE). Copyright &copy; 2026 Universal WebDev Skills Contributors.

