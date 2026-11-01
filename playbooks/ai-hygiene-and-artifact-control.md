# Playbook: AI Garbage Code Elimination, Folder De-Bloating & Artifact Control

> **Focus:** Remediation of AI Code Clutter, Unnecessary Directory Sprawl & Artifact Pollution  
> **Participating Specialists:** `00-orchestrator` (Lead), `02-architecture`, `08-testing-qa`, `14-maintenance`  
> **Applies to:** MVP, PROD, SCALE tiers  
> **Rule Reference:** `AGENTS.md` Rules 9 & 10; `AI-FAILURE-MODES.md` FM-09, FM-10, FM-11

---

## 1. Context & When to Run This Playbook

AI coding agents often generate synthetic bloat:
1. **Garbage Code:** Injecting placeholder comments (`// TODO: implement later`), single-line wrapper utilities (`function isNull(x)`), duplicate helpers, or half-baked mocks.
2. **Folder Sprawl:** Creating deeply nested directory trees (`src/services/api/v1/handlers/helpers/utils/`) or creating folders for a single file.
3. **Artifact Littering:** Dropping unrequested markdown files, scratchpads, and temporary test dumps directly into production directories.

Run this playbook when auditing AI-generated code, reviewing agent pull requests, or refactoring a cluttered codebase.

---

## 2. Core Decision Rules

1. **Native Feature Rule:**
   - *Never* write a custom utility wrapper if the runtime/language provides native syntax (e.g. use `Array.prototype.flat()`, `crypto.randomUUID()`, or `Object.hasOwn()` directly) *because* unnecessary wrappers increase bundle size and cognitive overhead.
2. **Flat Hierarchy Rule:**
   - *Maintain* a maximum directory depth of **3 levels** from the source root *because* deeply nested directories create convoluted relative imports (`../../../../utils`) and cognitive fragmentation.
3. **Three-File Folder Rule:**
   - *Do not* create a subfolder unless at least **3 distinct files** logically belong to that domain. Colocate files with their primary consumer until reuse is proven.
4. **Strict Artifact Control Rule:**
   - *Only* produce artifacts that conform to strict JSON schemas in `templates/schemas/`. Never write unrequested markdown summaries or scratchpad files to the workspace root.

---

## 3. Step-by-Step Procedure

### Phase 1: Static Garbage Code Audit
1. Run the AI Hygiene Linter:
   ```bash
   node tools/lint-ai-hygiene.js
   ```
2. Search for placeholder comments across the codebase:
   ```bash
   git grep -E "//\s*(TODO|Implement|FIXME|placeholder)"
   ```
3. Remediate or purge:
   - If the code is missing: fully implement the observable behavior with associated unit tests.
   - If the comment is redundant or unfinished: remove the comment and dead code.

### Phase 2: Directory Flattening & Folder De-Bloating
1. Scan for empty directories and prune them:
   ```bash
   find . -type d -empty -not -path "./.git*" -delete
   ```
2. Flatten single-file directory silos:
   - If `src/utils/math/calculateTax.ts` is the only file in `src/utils/math/`, move it up to `src/utils/calculateTax.ts` and delete the redundant `math/` directory.

### Phase 3: Workspace Artifact Control & Quarantine
1. Verify root directory cleanliness against authorized documentation:
   ```bash
   ls -la *.md
   ```
2. Ensure no stray `temp.js`, `notes.md`, `scratch.json`, or `.tmp` files exist.
3. Clean all temporary test caches and ephemeral build artifacts before committing:
   ```bash
   git clean -ndX  # Preview ignored temporary build waste
   ```

### Phase 4: Pre-Commit & CI Automation
1. Enforce `tools/lint-ai-hygiene.js` in the pre-commit hook and CI pipeline.
2. Verify that `npm test` runs the AI hygiene check automatically.

---

## 4. Verification Checklist

- [ ] Zero placeholder comments (`// TODO: implement`) in production source code.
- [ ] No single-file directories or deeply nested hierarchies (> 3 levels deep from source root).
- [ ] Zero unauthorized markdown files or scratchpad dumps in repository root.
- [ ] Automated check `node tools/lint-ai-hygiene.js` exits with code 0.

