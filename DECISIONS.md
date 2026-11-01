# Architectural Decision Records (ADRs)

This file tracks foundational design and architectural decisions made for `universal-webdev-skills`. All decisions follow the principle: State in files, not memory.

---

## ADR-001: Repository Root Directory Structure

- **Status:** Proposed (Phase 1)
- **Context:** The project root workspace is `f:\Web Dev Skill`. We must decide whether to nest the project inside an inner `universal-webdev-skills/` directory or place all assets directly at the repository root.
- **Decision:** Place all repository assets (`skills/`, `playbooks/`, `templates/`, `AGENTS.md`, `skills.index.json`, etc.) directly at the workspace root `f:\Web Dev Skill/`.
- **Consequences:** 
  - Standardizes paths (`/skills/...`, `/templates/...`) across tools and CI.
  - Eliminates redundant directory levels and confusion in tool adapters and relative imports.

---

## ADR-002: Three-Tier Rigor Classification (MVP / PROD / SCALE)

- **Status:** Proposed (Phase 1)
- **Context:** Agents often either over-engineer simple prototypes or under-engineer mission-critical platforms.
- **Decision:** Adopt a strict 3-tier classification evaluated on incoming signals:
  - **MVP:** Internal tools, prototypes, single-user proofs-of-concept. Speed prioritized; baseline defensive security and clean separation maintained.
  - **PROD:** Public users, accounts/email, payment/checkout, customer data, revenue at stake. Full automated test suite, OWASP Top 10 defense, WCAG 2.2 AA, migrations, observability, and backup recovery required.
  - **SCALE:** >100k MAU or spiky traffic, payments/payouts, regulated/health data, multi-tenant boundaries, strict SLAs. Chaos resilience, distributed caching, queue idempotency, rate limiting, and compliance audits required.
- **Rule:** Always classify at the HIGHEST tier triggered. Never downgrade a PROD signal to MVP without an explicit, recorded `ACCEPTED-RISK` entry approved by the user.

---

## ADR-003: L0 / L1 / L2 Layered Context Loading Model

- **Status:** Proposed (Phase 1)
- **Context:** Agent context windows are precious and expensive. Ingesting an entire engineering library wastes tokens, degrades reasoning, and risks context truncation.
- **Decision:** Implement a three-tier loading model:
  - **L0 (Always loaded, <3k tokens):** `AGENTS.md` (team protocol, behavior rules, conflict resolution) + `skills.index.json` (metadata router).
  - **L1 (Loaded on route, <300 lines):** Specialist `SKILL.md` files for the 2–5 routed specialists.
  - **L2 (Loaded on-demand):** Specific deep dives in `skills/<id>/references/` or `playbooks/`, triggered only by explicit conditions in L1.
- **Consequences:** Keeps typical task overhead under 12,000 tokens while providing access to deep reference material when required.

---

## ADR-004: Evidence-First Gate & Veto Protocol

- **Status:** Proposed (Phase 1)
- **Context:** AI agents frequently hallucinate that code or configs "work", "are secure", or "have been tested" without running verification commands.
- **Decision:** Specialist gates are binding. Security and Privacy hold HARD VETOs. QA ("No evidence, no ship") and DevOps ("No rollback, no ship") block shipping without demonstrable terminal execution evidence.
- **Rule:** If a command cannot be executed directly by the agent, it must output the exact command for the user and demand pasted terminal output before marking verification as complete.

---

## ADR-005: Dual Operational Modes (Multi-Agent Subagents vs Single-Agent Hat-Switching)

- **Status:** Proposed (Phase 1)
- **Context:** Some agentic environments support autonomous subagents running in parallel (e.g. Antigravity, Claude Code subagents); others run as a single chat agent (Cursor, ChatGPT, Copilot).
- **Decision:** All skills and protocols natively support:
  1. **MULTI-AGENT Mode:** Parallel subagents invoked per specialist role, communicating via schema-validated artifacts.
  2. **SINGLE-AGENT Mode:** Sequential role-playing where the agent explicitly announces which specialist hat it is wearing, executes that specialist's checklist to completion, produces the artifact, and transitions cleanly to the next hat.

