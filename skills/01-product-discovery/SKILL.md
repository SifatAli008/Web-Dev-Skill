---
name: product-discovery
description: Use when scoping new features, cutting MVP scope, defining target personas, formulating Jobs-to-be-Done (JTBD), establishing MoSCoW priorities, setting measurable success metrics, or establishing kill criteria. Trigger phrases include "product requirements", "prd", "user stories", "personas", "jtbd", "scope cut", "moscow cut", "kill criteria", "mvp scope".
tiers: ["MVP", "PROD", "SCALE"]
inputs: ["raw_concept", "business_goals"]
outputs: ["prd.schema.json"]
depends_on: ["00-orchestrator"]
last_verified: "2026-11-01"
sources: ["JTBD-INTERCOM", "LEAN-STARTUP", "SHAPE-UP"]
---

# Specialist Stance: Product Lead

The Product Lead protects problem-solution fit, minimal viable scope, user clarity, and verifiable business value.

### What I Refuse to Compromise On
I refuse to permit building features without an identified user problem, unprioritized kitchen-sink scope lists, vague success metrics, or launching initiatives without predefined kill criteria. Every feature must earn its development cost.

### Three Questions I Always Ask First
1. **The Core Job-to-be-Done:** What specific painful job is the user trying to accomplish, and what workaround are they currently using today?
2. **The MoSCoW Cut:** What is the absolute smallest slice of functionality (Must-Haves) that allows a user to complete this job from start to finish?
3. **Kill Criteria & Metrics:** What measurable metric determines whether this feature succeeded or failed within 30 days of launch, and at what threshold do we pull the plug?

---

## When to Use / NOT to Use

- **Use when:**
  - Ingesting a new product idea, feature request, or ambiguous user concept.
  - Authoring a formal Product Requirements Document (`prd.schema.json`).
  - Pruning an over-scoped backlog into a tight, testable MVP.
  - Defining user personas, user stories, and acceptance criteria.
  - Setting up customer feedback loops and quantitative success metrics.
- **NOT to use when:**
  - Choosing database schemas or API protocols (route to `02-architecture`).
  - Auditing software for security vulnerabilities (route to `06-security`).
  - Writing code or unit test suites (route to `04-frontend` / `05-backend-data`).

---

## Inputs and Outputs

- **Inputs:**
  - Raw user request, business vision, or customer interview transcripts.
  - Existing product state and competitor context.
- **Outputs:**
  - Product Requirements Document conforming to `templates/schemas/prd.schema.json`.
  - Feature prioritization matrix (Must / Should / Could / Won't).
  - Measurable success metrics and kill criteria.

---

## Decision Rules

1. **MoSCoW Scoping Rule:**
   - *If* a feature does not directly enable the primary Job-to-be-Done or block launch compliance, *relegate it* to **Should Have** or **Could Have** *because* shipping late with bloat destroys feedback cycles [BEST PRACTICE: SHAPE-UP].
   - *Limit* Must-Haves to at most 3 to 5 core capabilities for any single release cycle.
2. **Acceptance Criteria Precision Rule:**
   - *Never* write subjective criteria like "The UI should look clean and fast"; *mandate* testable statements in Given-When-Then format (e.g. "Given an unauthenticated user, when they click Checkout, then they are redirected to /login with return_to param") *because* ambiguity in PRDs creates downstream implementation drift [BEST PRACTICE: LEAN-STARTUP].
3. **Kill Criteria Rule:**
   - *Every* feature PRD must specify an explicit condition for decommissioning (e.g. "If fewer than 5% of active users use this feature after 60 days, deprecate and remove the code") *because* dead code creates permanent maintenance drag.

---

## Procedure

### Step 1: JTBD Problem Extraction [MVP] [PROD] [SCALE]
1. Frame the user problem:
   - "When [situation], I want to [motivation], so I can [expected outcome]."
2. Identify existing manual workarounds (spreadsheets, manual emails, copy-pasting).
3. Validate that the proposed feature offers at least a 10x improvement in speed, cost, or convenience over the workaround.

### Step 2: MoSCoW Categorization & Scope Cut [MVP] [PROD] [SCALE]
1. List all requested feature elements.
2. Force brutal prioritization into 4 buckets:
   - **Must Have:** The product cannot function or launch without this.
   - **Should Have:** Important and high-value, but a workaround exists for launch.
   - **Could Have:** Nice-to-have enhancements if time permits.
   - **Won't Have (This Cycle):** Explicitly agreed out-of-scope items.
3. Defend against scope creep: when stakeholders request additions, trade off an existing Must-Have rather than expanding the release date.

### Step 3: Acceptance Criteria & User Stories [MVP] [PROD] [SCALE]
1. Break Must-Haves into granular user stories.
2. Author unambiguous acceptance criteria with testable boundaries:
   - Positive validation cases.
   - Error messages and failure recovery expectations.
   - Data limits and format requirements.

### Step 4: Metric Definition & Handoff [MVP] [PROD] [SCALE]
1. Define primary adoption metric and baseline target.
2. Define kill criteria threshold.
3. Validate and output `prd.schema.json`. Hand off to `02-architecture` and `03-ux-ui-design`.

---

## Anti-Patterns

- **Kitchen-Sink PRDs:** Writing a 40-page document with 50 features before validating if users want the core value proposition.
- **Vague Acceptance Criteria:** Writing "Must be user-friendly" or "Fast response" without measurable numbers or states.
- **Undocumented Out-of-Scope:** Omitting the "Won't Have" section, leading to endless arguments about implied scope.
- **Building for Non-Existent Personas:** Designing features for hypothetical enterprise buyers when the current users are freelance designers.

---

## Verification

Run these automated verification checks:
1. Verify that `SKILL.md` contains all required sections:
   ```bash
   node -e "
   const fs = require('fs');
   const text = fs.readFileSync('skills/01-product-discovery/SKILL.md', 'utf8');
   const required = ['Specialist Stance', 'When to Use', 'Inputs and Outputs', 'Decision Rules', 'Procedure', 'Anti-Patterns', 'Verification'];
   const missing = required.filter(r => !text.includes(r));
   console.log('Product skill structure:', missing.length === 0 ? 'PASS' : 'FAIL: ' + missing.join(', '));
   "
   ```
   *Expected output:* `Product skill structure: PASS`

---

## Escalate-to-User Triggers

Immediately halt and escalate to the user when:
1. The stakeholder refuses to select any item for the "Won't Have" list, demanding an un-tiered kitchen-sink release.
2. The core problem statement changes fundamentally during discovery (e.g. pivoting from B2C consumers to B2B enterprise procurement).
3. Discovery reveals an established competitor offering the exact same solution for free with high satisfaction.
