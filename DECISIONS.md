# Architectural Decision Records (ADRs)

This file tracks foundational design and architectural decisions made for `universal-webdev-skills`. All decisions follow the principle: State in files, not memory.

---

## ADR-001: Repository Root Directory Structure

- **Status:** Accepted (Phase 1)
- **Context:** The project root workspace is `f:\Web Dev Skill`. We must decide whether to nest the project inside an inner `universal-webdev-skills/` directory or place all assets directly at the repository root.
- **Decision:** Place all repository assets (`skills/`, `playbooks/`, `templates/`, `AGENTS.md`, `skills.index.json`, etc.) directly at the workspace root `f:\Web Dev Skill/`.
- **Consequences:** 
  - Standardizes paths (`/skills/...`, `/templates/...`) across tools and CI.
  - Eliminates redundant directory levels and confusion in tool adapters and relative imports.

---

## ADR-002: Three-Tier Rigor Classification (MVP / PROD / SCALE)

- **Status:** Accepted (Phase 1)
- **Context:** Agents often either over-engineer simple prototypes or under-engineer mission-critical platforms.
- **Decision:** Adopt a strict 3-tier classification evaluated on incoming signals:
  - **MVP:** Internal tools, prototypes, single-user proofs-of-concept. Speed prioritized; baseline defensive security and clean separation maintained.
  - **PROD:** Public users, accounts/email, payment/checkout, customer data, revenue at stake. Full automated test suite, OWASP Top 10 defense, WCAG 2.2 AA, migrations, observability, and backup recovery required.
  - **SCALE:** >100k MAU or spiky traffic, payments/payouts, regulated/health data, multi-tenant boundaries, strict SLAs. Chaos resilience, distributed caching, queue idempotency, rate limiting, and compliance audits required.
- **Rule:** Always classify at the HIGHEST tier triggered. Never downgrade a PROD signal to MVP without an explicit, recorded `ACCEPTED-RISK` entry approved by the user.
- **Consequences:** Eliminates mismatched engineering effort; prevents fragile prototypes from being shipped to paying customers while avoiding premature distributed complexity on simple tools.

---

## ADR-003: L0 / L1 / L2 Layered Context Loading Model

- **Status:** Accepted (Phase 1)
- **Context:** Agent context windows are precious and expensive. Ingesting an entire engineering library wastes tokens, degrades reasoning, and risks context truncation.
- **Decision:** Implement a three-tier loading model:
  - **L0 (Always loaded, <3k tokens):** `AGENTS.md` (team protocol, behavior rules, conflict resolution) + `skills.index.json` (metadata router).
  - **L1 (Loaded on route, <300 lines):** Specialist `SKILL.md` files for the 2–5 routed specialists.
  - **L2 (Loaded on-demand):** Specific deep dives in `skills/<id>/references/` or `playbooks/`, triggered only by explicit conditions in L1.
- **Consequences:** Keeps typical task overhead under 12,000 tokens while providing access to deep reference material when required.

---

## ADR-004: Evidence-First Gate & Veto Protocol

- **Status:** Accepted (Phase 1)
- **Context:** AI agents frequently hallucinate that code or configs "work", "are secure", or "have been tested" without running verification commands.
- **Decision:** Specialist gates are binding. Security and Privacy hold HARD VETOs. QA ("No evidence, no ship") and DevOps ("No rollback, no ship") block shipping without demonstrable terminal execution evidence.
- **Rule:** If a command cannot be executed directly by the agent, it must output the exact command for the user and demand pasted terminal output before marking verification as complete.
- **Consequences:** Prevents rubber-stamping, unverified code claims, and deployment of broken configurations.

---

## ADR-005: Dual Operational Modes (Multi-Agent Subagents vs Single-Agent Hat-Switching)

- **Status:** Accepted (Phase 1)
- **Context:** Some agentic environments support autonomous subagents running in parallel (e.g. Antigravity, Claude Code subagents); others run as a single chat agent (Cursor, ChatGPT, Copilot).
- **Decision:** All skills and protocols natively support:
  1. **MULTI-AGENT Mode:** Parallel subagents invoked per specialist role, communicating via schema-validated artifacts.
  2. **SINGLE-AGENT Mode:** Sequential role-playing where the agent explicitly announces which specialist hat it is wearing, executes that specialist's checklist to completion, produces the artifact, and transitions cleanly to the next hat.
- **Consequences:** Allows identical skill files and governance protocols to execute in both parallel subagent architectures and single-thread conversational chat agents.

---

## ADR-006: Tool-Agnostic Adapter Architecture and Release Specification

- **Status:** Accepted (Phase 6)
- **Context:** Developers use diverse AI agents (Claude Code, Cursor, Antigravity, GitHub Copilot, Gemini CLI, ChatGPT/Codex). Maintaining duplicate prompt rules across every tool leads to desynchronization and configuration drift.
- **Decision:**
  1. The core skills repository (`skills/`, `playbooks/`, `templates/`, `AGENTS.md`, `skills.index.json`) is the single source of truth.
  2. Adapters in `adapters/` are thin configuration pointers, generated strictly via `tools/build-adapters.js` and never hand-edited.
  3. Installation takes under 2 minutes per tool by copying or symlinking a single file or instruction snippet.
- **Consequences:** Changes to team behavior, specialist stances, or checklists immediately propagate across all AI coding environments upon running `node tools/build-adapters.js`.

---

## ADR-007: Zero External Dependencies & Language/Tool Neutrality

- **Status:** Accepted (Hygiene & Agnosticism Certification)
- **Context:** Framework lock-in, heavy external npm dependency graphs, or language biases severely limit adoption and introduce third-party supply-chain risks.
- **Decision:**
  1. **Zero External Dependencies:** The repository contains zero third-party dependencies (`dependencies: {}`, `devDependencies: {}`). All 10 verification tools, evaluation runners, and reference test suites run exclusively on standard runtime built-ins (`node:fs`, `node:path`, `node:child_process`, `node:crypto`, `node:http`, `node:sqlite`, `node:assert`). No `npm install` is ever required to run the suite.
  2. **Language & Framework Neutrality:** Core engineering skills enforce universal mathematical and architectural invariants (OWASP defenses, ACID isolation, WCAG 2.2 accessibility, RFC 8594 headers, test pyramid ratios) that apply universally to Python, TypeScript, Go, Rust, Ruby, PHP, Java, or C#. Any framework-specific code is strictly an illustrative example.
  3. **Universal Agent Neutrality:** The entire core is plain Markdown and standard JSON, ensuring zero friction across any LLM or agent environment.
- **Consequences:** Eliminates supply-chain vulnerabilities, eliminates version conflicts, and ensures immediate out-of-the-box execution on any machine or CI pipeline.

---

## ADR-008: Adoption of the Open Agent Skills Specification (`agentskills.io` / AAIF)

- **Status:** Accepted (Phase 7 - Frontier Skills Integration)
- **Context:** As agent engineering matures, bespoke or unstructured markdown prompt structures risk fragmentation and lack interoperability across emerging industry platforms.
- **Decision:** Align all 15 skills with the official open Agent Skills specification (promoted by Anthropic, AAIF, and AgentSkills.io):
  1. Frontmatter specification with strictly typed fields: `name`, `description`, `tiers`, `inputs`, `outputs`, `depends_on`, `last_verified`, `sources`.
  2. Three-level progressive disclosure architecture: L1 Discovery (<300 lines frontmatter & stances), L2 Operational Procedures, L3 Verification Suites.
  3. Strict trigger and anti-trigger definitions in `skills.index.json` to prevent unnecessary token consumption.
- **Consequences:** Enables full interoperability with any Agent Skills compliant runtime or runner, while retaining 100% backward compatibility with markdown-reading agents.

---

## ADR-009: Design Contract (`DESIGN.md`) & Full Taste-Skill v2 Anti-Slop Architecture

- **Status:** Accepted (Phase 7 - Frontier Skills Integration)
- **Context:** AI coding agents frequently generate generic "AI vibe slop": predictable purple-to-blue gradients, floating overhead pill badges, identical 3-card grids with centered circle icons, low-contrast typography, and ubiquitous em-dashes in copy.
- **Decision:**
  1. Integrate the complete `Leonxlnx/taste-skill` v2 (`design-taste-frontend`) anti-slop framework into `03-ux-ui-design` and `04-frontend`.
  2. Enforce **Section 0: Brief Inference & Mandatory Design Read** before generating any markup or code: `[Design Read]: <Page Kind> | ICP: <Audience> | Vibe: <Keywords> | Dials: [V=<1-10>, M=<1-10>, D=<1-10>] | Profile: <Profile>`.
  3. Enforce **Section 1: Quantitative Design Dials** (1–10 scale) to deterministically govern layout variance, motion dynamics, and visual density.
  4. Mandate the **4 Curated Anti-Slop Taste Profiles** (Minimalist, Industrial-Brutalist, Editorial, Soft-Consumer).
  5. Enforce **Layout Family Diversity**: every landing page must implement at least 4 distinct layout families without repeating identical card grids.
  6. Enforce **Bounded Hero Section Discipline**: headlines bounded to $\le 2$ lines, subtext $< 20$ words, and primary CTA strictly above fold.
  7. Enforce the **Zero Em-Dash Copy Rule**: zero tolerance for em-dashes (`—`) or en-dashes (`–`) in web copy.
  8. Enforce **Section 14 Final Pre-Flight Quality Gate**: mandatory 8-point verification checklist before declaring UI deliverables complete.
  9. Maintain `nexu-io/open-design` `DESIGN.md` contract at workspace root as the single source of truth for design tokens.
- **Consequences:** Eliminates AI aesthetic tells, guarantees high-converting layout craft, ensures strict WCAG 2.2 AA compliance, and provides predictable art direction across any coding agent.

---

## ADR-010: Alibaba Open Code Review Hybrid Protocol & Defect Severity Gates

- **Status:** Accepted (Phase 7 - Frontier Skills Integration)
- **Context:** Automated code review by AI often either nitpicks inconsequential style issues or misses critical runtime defects (null pointer hazards, unhandled promise rejections, concurrency deadlocks).
- **Decision:**
  1. Adopt the Alibaba Open Code Review (OCR) hybrid review protocol in `08-testing-qa` and `14-maintenance`.
  2. Classify defects across 3 standardized severity tiers: P0 Blockers (Security/Data loss), P1 Defects (Logic/Resource leaks), and P2 Advisories (Readability/Style).
  3. Enforce line-level AST and contextual analysis prior to merge approval.
- **Consequences:** Focuses agent review attention on high-impact defects and architectural soundness rather than superficial comment formatting.

---

## ADR-011: DietrichGebert Ponytail YAGNI 6-Rung Decision Ladder

- **Status:** Accepted (Phase 7 - Frontier Skills Integration)
- **Context:** Coding agents frequently over-engineer solutions, creating speculative configuration flags, unnecessary microservices, premature abstract factory patterns, and superfluous npm packages for simple problems.
- **Decision:**
  1. Embed the Ponytail 6-rung decision ladder directly into `AGENTS.md` (Rule 1) and across Orchestrator (`00-orchestrator`), Architecture (`02-architecture`), Frontend (`04-frontend`), Backend (`05-backend-data`), and Maintenance (`14-maintenance`).
  2. Decision ladder priority order:
     - **Rung 1: YAGNI** — Eliminate unrequested features, speculative options, and premature generalizations.
     - **Rung 2: Codebase Reuse** — Use existing internal helpers, patterns, and modules.
     - **Rung 3: Platform Native** — Use Web Platform / Runtime standard APIs (native `fetch`, `crypto.randomUUID()`, `<dialog>`, CSS Grid, native parameterized SQL).
     - **Rung 4: Installed Dependencies** — Utilize packages already in `package.json` before adding new ones.
     - **Rung 5: One-Liner / Simple Logic** — Write straightforward, readable code over novel abstractions.
     - **Rung 6: Minimum Viable Implementation** — The simplest implementation that satisfies current observable tests.
  3. Enforce the Rule of Three: never extract an abstraction until at least 3 distinct call sites require it.
- **Consequences:** Drastically reduces bundle size, eliminates single-use supply chain dependencies, and keeps repositories maintainable and readable.

---

## ADR-012: Advanced Design Engineering, OKLCH Perceptual Colors, Fluid Math & 7-State Component Lifecycle

- **Status:** Accepted (Phase 7 - Frontier Skills Integration)
- **Context:** Design generation in AI coding agents often lacks deterministic engineering rigor: RGB/Hex color spaces cause perceptual contrast distortion across dark/light themes, static pixel typography creates brittle breakpoint jumps, linear CSS transitions feel mechanical, and components routinely omit interactive edge states (loading, empty, disabled, error, partial data).
- **Decision:**
  1. Mandate the **OKLCH Perceptual Color Space** (`oklch(L C H)`) for surface and contrast definitions across `DESIGN.md` and `templates/schemas/design-tokens.schema.json`. OKLCH guarantees uniform perceptual lightness steps across dark/light mode toggles without manual hex recalculation.
  2. Implement **Mathematical Fluid Typography & Spacing** using viewport-relative `clamp(min, preferred, max)` formulas, guaranteeing continuous, harmonic scaling from mobile (375px) to ultra-wide displays (1440px+) without layout shifts or brittle media query snapping.
  3. Establish **Spring Physics Motion Tokens** (`--spring-snap`, `--spring-smooth`) via cubic-bezier acceleration curves (`cubic-bezier(0.16, 1, 0.3, 1)`) and strictly respect `prefers-reduced-motion`.
  4. Enforce the **7-State Component Lifecycle Matrix** (Default, Hover/Pointer, Active/Pressed, Focus-Visible, Disabled, Loading/Skeleton, Error/Recovery) across every interactive UI primitive.
  5. Enforce **Visual Dominance Hierarchy** requiring a primary anchor with >= 2:1 scale or visual weight ratio relative to surrounding elements.
  6. Ship zero-dependency automated verification in `tools/verify-layout.js` integrated into the master test pipeline (`tools/verify-all.js`).
- **Consequences:** Eliminates AI visual blandness, guarantees WCAG 2.2 AA contrast across arbitrary theme switches, prevents breakpoint pop, and ensures comprehensive edge-case resilience for all frontend deliverables.

---

## ADR-013: Addition of Specialist 15 (HCI & Cognitive Ergonomics) for Interaction Science and Usability Modeling

- **Status:** Accepted (Phase 8 - Interaction Science & Cognitive Ergonomics Expansion)
- **Context:** While `03-ux-ui-design` governs visual aesthetics, color spaces, and token systems, and `04-frontend` handles component rendering and bundle budgets, coding agents consistently miss human cognitive limits, motor constraints, and empirical interaction laws. User interfaces suffer from cramped mobile touch targets (<44px), cognitive overload (>7 unchunked options), unmitigated latency (>400ms without feedback), hover-locked essential features, and habituated modal alerts for routine reversible actions.
- **Decision:**
  1. Introduce **Specialist 15: HCI & Cognitive Ergonomics Lead (`15-hci-interaction`)**, expanding the core team from 15 to 16 specialists.
  2. Ground interaction evaluations in mathematical interaction laws: Fitts's Law ($MT = a + b \log_2(2D/W)$) for touch geometry floor (>= 44x44px), Hick-Hyman Law ($RT = b \log_2(n+1)$) for decision density (<= 5 options), Doherty Threshold (<400ms) for perceptual feedback, and Miller's Chunking (7 +/- 2).
  3. Enforce Norman's Design Principles (Affordances, Signifiers, Constraints, Natural Mapping, Feedback, Conceptual Models) and bridge the Gulfs of Execution and Evaluation.
  4. Standardize Keystroke-Level Modeling (KLM/GOMS) to optimize high-frequency expert workflows with conflict-free keyboard accelerators (`Cmd+K`, `/`, `Escape`).
  5. Mandate mobile touch thumb zone prioritization (bottom 60% viewport) and distinguish slips from mistakes by implementing non-blocking reversible "Undo" toasts (5-10s grace window) over habituated modal confirmation dialogues.
  6. Publish `templates/schemas/hci-evaluation.schema.json`, `templates/hci-evaluation.template.md`, and `checklists/hci.checklist.md`.
- **Consequences:** Provides scientific rigor for interaction design, prevents motor frustration on touch devices, reduces task completion time, eliminates habituated modal fatigue, and guarantees seamless handoff between UX aesthetics and frontend implementation.
