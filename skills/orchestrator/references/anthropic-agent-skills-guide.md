# Anthropic Agent Skills Architecture & Metasystem Guide

> **Loading Level:** L2 Reference Document  
> **Load Condition:** Load when authoring, refactoring, evaluating, or auditing agent skills adhering to the official Anthropic Agent Skills specification (`anthropics/skills`).

---

## 1. Foundations: The 4 Anthropic Core Skill Archetypes

Anthropic's official `anthropics/skills` repository establishes the canonical architecture for agent capability expansion. Every web engineering skill in this framework aligns with one or more of Anthropic's four core skill archetypes:

### 1. `skill-creator` (The Metasystem Archetype)
- **Role:** Guides agents in authoring, evaluating, and refining other skills.
- **Key Principles:**
  - **Single Responsibility Principle:** A skill must solve one coherent engineering domain; never create kitchen-sink skills that dilute routing.
  - **Bounded Context Window:** Never exceed 300 lines in the primary `SKILL.md`. Offload deep background to L2 reference documents loaded on demand.
  - **Empirical Deletion Testing:** Every skill must prove its unique value. If removing the skill results in no measurable degradation in output quality, delete or consolidate it.

### 2. `frontend-design` (The Craft & Anti-Slop Archetype)
- **Role:** Directs AI agents to build production-grade, highly distinctive user interfaces while eliminating generic "AI slop."
- **Key Principles:**
  - **Ban AI Visual Clichés:** Strictly prohibit repetitive purple/indigo gradients, generic 3-card feature grids, centered floating pill badges with spark emojis, and unstyled form controls.
  - **Intentional Typography:** Pair contrasting, high-character fonts (e.g. sharp editorial serifs with monospaced telemetry counters, or geometric sans with tabular numerals).
  - **Design Variance & Dials:** Tune visual density and motion intensity dynamically based on user domain (e.g. high density for SaaS dashboards, spacious editorial rhythm for narrative blogs).

### 3. `webapp-testing` (The Autonomous Verification Archetype)
- **Role:** Provides autonomous web application reconnaissance, interaction testing, and defect trapping.
- **Key Principles:**
  - **Server Lifecycle Management:** Never assume a server is running. Orchestrate ephemeral local test servers, await readiness probes (`/healthz` HTTP 200), and cleanly terminate processes.
  - **Accessible DOM Locators:** Select elements strictly via accessible roles (`page.getByRole('button', { name: 'Deploy' })`) rather than fragile CSS classes (`.btn-primary`).
  - **Console & Network Error Trapping:** Automatically fail tests if uncaught browser JavaScript errors (`console.error`) or unhandled 4xx/5xx network requests fire during test execution.

### 4. `mcp-builder` (The Protocol Boundary Archetype)
- **Role:** Governs the architecture and implementation of Model Context Protocol (MCP) servers.
- **Key Principles:**
  - **Consolidated Workflows Over CRUD:** Never mirror 50 raw database endpoints as MCP tools. Consolidate multi-step actions into high-leverage workflows (e.g. `provision_project_environment` instead of 5 discrete calls).
  - **Strict Parameter Schemas:** Validate all tool inputs with JSON Schema/Zod with bounded array lengths and paginated outputs (`limit`, `cursor`).
  - **Actionable Recovery Hints:** When parameter validation fails, return structured text explaining *why* it failed and the exact corrective parameters the agent should attempt.

---

## 2. Professional Practice: 3-Level Progressive Disclosure

To prevent context bloat and minimize token costs, all skills enforce the Anthropic 3-level progressive disclosure standard:

| Level | Component | Token Budget | Load Timing | Purpose |
|---|---|---|---|---|
| **L0 / L1** | `skills.index.json` + YAML Frontmatter | $\le 150$ tokens | Session Initialization | Fast discovery, keyword matching, and routing without loading prompt bodies. |
| **L1** | `SKILL.md` (Specialist Stance & Rules) | $\le 1,800$ tokens ($< 300$ lines) | On-Demand Activation | Core decision rules, procedures, anti-patterns, and runnable terminal verification. |
| **L2** | `references/*.md` (Architectural Compendia) | $\le 3,500$ tokens | Deep Task Execution | In-depth implementation guides, code recipes, and complex decision trees. |

---

## 3. Trigger Engineering & False Positive Suppression

A high-performance Agent Skill must fire reliably when needed, and remain completely silent when irrelevant:

1. **Specific Noun & Operational Verb Pairs:**
   - Prefer compound triggers: `"manage database migrations"`, `"container rollback"`, `"wcag contrast audit"`.
   - Avoid generic single words like `"code"`, `"build"`, or `"app"` which cause accidental multi-skill activations.
2. **Explicit Anti-Triggers:**
   - Every skill must declare `anti_triggers` in `skills.index.json` to divert unrelated requests to appropriate specialist domains (e.g. `architecture` diverts button styling to `frontend`).
3. **Audit via Trigger Tests:**
   - Maintain `tests/trigger-tests.json` in every skill directory containing positive trigger test cases and negative boundary cases to prevent regression.

---

## 4. Deletion Testing: Non-Redundancy Verification Protocol

Before introducing or maintaining a skill, execute the Anthropic Deletion Test:

1. **Baseline Evaluation:** Run a benchmark task without the candidate skill present; record code quality, security vulnerabilities, and token cost.
2. **With-Skill Evaluation:** Run the identical task with the candidate skill loaded.
3. **Delta Calculation:** If the score delta is $< +15\%$ or introduces token overhead exceeding its quality contribution, the skill is classified as redundant and must be eliminated.

---

## 5. Ecosystem Interoperability (`skills.sh` & Anthropic Skills)

Universal WebDev Skills is 100% interoperable with Anthropic's ecosystem and universal skill CLI package managers:

```bash
# Install Anthropic's individual skills directly
npx skills add anthropics/skills@frontend-design
npx skills add anthropics/skills@webapp-testing
npx skills add anthropics/skills@mcp-builder

# Install Universal WebDev Skills full 16-specialist framework
npx skills add SifatAli008/Web-Dev-Skill
```
