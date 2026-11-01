# Contributing to Universal WebDev Skills

Thank you for contributing to `universal-webdev-skills`! Our mission is to provide an open-source, tool-agnostic skills framework that turns any AI coding agent into a disciplined 15-specialist web engineering team.

---

## 1. Core Engineering Principles

1. **Context is a Budget:** Every line of markdown must earn its tokens. L1 skills must remain under 300 lines. L2 reference documents load on demand only.
2. **Evidence Over Assertion:** Never claim code is verified, secure, or working without demonstrating runnable terminal execution evidence.
3. **No Hallucinated Facts:** Cite source IDs from `SOURCES.md`. Tag volatile facts as `FACT` (with citation), `BEST PRACTICE` (industry consensus), or `JUDGMENT` (opinionated trade-off with rationale).
4. **Binding Gates:** Security and Privacy retain hard veto authority. QA and DevOps enforce "No evidence, no ship" and "No rollback, no ship".

---

## 2. Specialist Skill Authoring Specification

When authoring or updating a specialist skill in `skills/<id>-<name>/`:

### A. Frontmatter Schema
```yaml
---
name: specialist-name
description: Use when <concrete trigger phrases>.
tiers: [MVP, PROD, SCALE]
inputs: [prd, adr]
outputs: [threat-model, test-report]
depends_on: [00-orchestrator]
last_verified: YYYY-MM-DD
sources: [OWASP-ASVS-4.0.3, W3C-WCAG-2.2]
---
```

### B. Standard Section Hierarchy
1. **Specialist Stance & 3 Invariant Questions** (Non-negotiables)
2. **When to Use & When NOT to Use**
3. **Inputs and Outputs** (Referencing `templates/schemas/`)
4. **Decision Rules** (Formatted as: *If X, choose Y because Z*)
5. **Procedure** (Numbered steps tagged `[MVP]`, `[PROD]`, or `[SCALE]`)
6. **Anti-Patterns**
7. **Verification Steps** (Runnable commands with exact expected outputs)
8. **Escalate-to-User Triggers** (Irreversible or architectural forks)

### C. Unit Test Requirements
Every skill folder must contain `tests/trigger-tests.json` featuring:
- **5 Positive Trigger Prompts:** Queries that unambiguously route to this specialist.
- **5 Negative Near-Miss Prompts:** Queries that should route to an adjacent specialist.
- **3 Concrete Evaluation Tasks:** Executable benchmark tasks with success criteria.

---

## 3. Pre-Flight Verification Tools

Before submitting a Pull Request, all automated verification checks must pass with exit code `0`:

```bash
# 1. Lint all skills for line limits (<300 lines) and required sections
node tools/lint-skills.js

# 2. Check internal markdown links and cross-references
node tools/check-links.js

# 3. Check skill freshness (flag skills not verified within 180 days)
node tools/check-freshness.js

# 4. Scan repository for security invariants (no remote pipes, no credential leaks)
node tools/scan-skills.js

# 5. Re-generate tool adapters
node tools/build-adapters.js
```

---

## 4. Conventional Commits

We follow standard Conventional Commits:
- `feat(skills)`: Add or update a specialist skill
- `feat(playbooks)`: Add or update a cross-sector playbook
- `feat(tools)`: Add or update automation scripts
- `fix(security)`: Remediate security or privacy weaknesses
- `test(evals)`: Update benchmark tasks, triggers, or evaluation harnesses
- `docs(...)`: Update documentation, progress, or decisions

