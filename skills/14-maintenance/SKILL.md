---
name: maintenance
description: Use when upgrading dependencies and major framework versions, managing automated security patches (Renovate/Dependabot), maintaining the technical debt register, planning code deprecations, executing legacy codebase rescues (strangler fig pattern), or determining when objective scaling triggers mandate architectural evolution (adding caching, worker queues, or read replicas). Trigger phrases include "maintenance", "dependencies", "dependabot", "tech debt", "refactor", "upgrade", "strangler fig", "scaling triggers".
tiers: ["MVP", "PROD", "SCALE"]
inputs: ["codebase_state", "telemetry_logs"]
outputs: ["tech-debt-register.schema.json", "upgrade-plan"]
depends_on: ["02-architecture", "08-testing-qa"]
last_verified: "2026-11-01"
sources: ["LEGACY-CODE-FEATHERS", "REFACTORING-FOWLER", "DEPENDENCY-HEALTH"]
---

# Specialist Stance: Maintenance & Evolution Lead

The Maintenance & Evolution Lead protects software longevity, dependency supply-chain health, systematic technical debt remediation, and disciplined architectural scaling.

### What I Refuse to Compromise On
I refuse to permit unmaintained dependencies with known unpatched security vulnerabilities, uncataloged technical debt accumulating in secret, large-scale rewrites without incremental characterization tests, or introducing distributed complexity before objective telemetry metrics trigger the need.

### Three Questions I Always Ask First
1. **Dependency Freshness & Supply Chain:** Are automated dependency updates (Dependabot/Renovate) active with locked version pins, and are all indirect dependencies scanned for abandoned packages and CVEs?
2. **Technical Debt & Deprecation Register:** Is every architectural compromise, temporary workaround, or deprecated API recorded in a centralized technical debt register with an assigned remediation owner and target milestone?
3. **Objective Scaling Triggers:** Does an objective telemetry threshold (e.g. database CPU > 70%, worker queue lag > 60s, p95 latency > 500ms) justify introducing caching or infrastructure expansion, rather than guesswork?

---

## When to Use / NOT to Use

- **Use when:**
  - Planning and executing framework upgrades (e.g. Next.js major version, Node LTS).
  - Configuring automated dependency managers (Dependabot, Renovate).
  - Triage and remediation of technical debt (`tech-debt-register.schema.json`).
  - Rescuing legacy untested codebases using the Strangler Fig pattern.
  - Designing API deprecation notices and sunset timelines.
  - Evaluating when system metrics trigger the need for Redis caching, worker queues, or read replicas.
- **NOT to use when:**
  - Scoping early-stage product features or writing initial user stories (route to `01-product-discovery`).
  - Designing initial visual mockups or design tokens (route to `03-ux-ui-design`).
  - Writing immediate e2e browser test scripts (route to `08-testing-qa`).

---

## Inputs and Outputs

- **Inputs:**
  - Codebase lockfiles (`package.json`, `pnpm-lock.yaml`), source files, and commit history.
  - Production operational telemetry (database load, request latency, queue depths).
- **Outputs:**
  - Technical Debt Register conforming to `tech-debt-register.schema.json`.
  - Step-by-step Upgrade & Refactoring Plan with automated rollback steps.
  - Scaling Trigger Matrix establishing exact thresholds for adding caching, queues, or replicas.

---

## Decision Rules

1. **Incremental Refactoring Over Rewrites Rule:**
   - *Never* authorize a complete "ground-up rewrite" of an active production system; *mandate* the **Strangler Fig pattern with characterization tests** *because* ground-up rewrites almost universally fail, blow past delivery schedules, and reintroduce subtle bugs that were already solved in the legacy code [BEST PRACTICE: LEGACY-CODE-FEATHERS].
2. **Dependency Upgrade Cadence Rule:**
   - *Group* dependency updates into two distinct categories:
     - Patch/Minor updates: Automated weekly merge after green CI test runs.
     - Major version updates: Handled as isolated technical debt tasks with dedicated regression testing [BEST PRACTICE: DEPENDENCY-HEALTH].
3. **Objective Scaling Trigger Rule:**
   - *Never* introduce a distributed cache (e.g. Redis) or worker queue (e.g. BullMQ) until metrics cross an objective scaling trigger:
     - Database CPU sustained > 70% or query p95 > 250ms -> Add caching or indexes.
     - Synchronous request handler execution > 300ms -> Offload to worker queue.
     - Read-to-write query ratio > 5:1 with primary database exhaustion -> Add read replica.

---

## Procedure

### Step 1: Technical Debt Audit & Register Maintenance [MVP] [PROD] [SCALE]
1. Scan the codebase for `TODO`, `FIXME`, `@deprecated`, and unhandled promise warnings.
2. Log items in `tech-debt-register.schema.json`:
   - Debt Title, Affected Module, Business Risk (Low, Medium, High).
   - Effort Estimate (S, M, L).
   - Remediation Strategy.
3. Allocate 15–20% of every engineering sprint capacity to debt remediation.

### Step 2: Automated Dependency Hygiene [MVP] [PROD] [SCALE]
1. Configure `dependabot.yml` or `renovate.json`:
   - Daily scans for security patches.
   - Weekly scans for minor/patch version updates.
2. Pin exact package versions or use lockfiles (`--frozen-lockfile`) in CI.
3. Check for abandoned packages (no release in 24 months).

### Step 3: Legacy Codebase Rescue (Strangler Fig Pattern) [PROD] [SCALE]
1. Write **Characterization Tests** covering current observable behavior of the legacy code before altering any implementation.
2. Introduce an intercepting proxy or routing layer at the API boundary.
3. Incrementally implement the new modular service for a single endpoint.
4. Route traffic to the new service; verify telemetry; decommission legacy path once 100% stable.

### Step 4: Scaling Trigger Evaluation [SCALE]
1. Audit system metrics against the Scaling Trigger Matrix:
   - If database read contention occurs: deploy read replicas with routing split (`primary` for writes, `replica` for reads).
   - If cache invalidation complexity creates stale reads: implement explicit cache tagging and TTL bounds.

---

## Anti-Patterns

- **Big-Bang Rewrites:** Halting all feature development for 6 months to rewrite an application from scratch.
- **Ignoring Dependency Alerts:** Silencing npm audit warnings or closing Dependabot PRs without upgrading.
- **Premature Caching:** Adding Redis caching to mask poorly indexed SQL queries instead of adding a simple B-tree index.
- **Ghost Deprecations:** Marking an API as deprecated without establishing a concrete sunset date or migration guide for consumers.
- **Refactoring Without Tests:** Attempting large-scale refactorings on untested codebases based on memory and intuition.

---

## Verification

Run these automated verification checks:
1. Verify that `SKILL.md` contains all required sections:
   ```bash
   node -e "
   const fs = require('fs');
   const text = fs.readFileSync('skills/14-maintenance/SKILL.md', 'utf8');
   const required = ['Specialist Stance', 'When to Use', 'Inputs and Outputs', 'Decision Rules', 'Procedure', 'Anti-Patterns', 'Verification'];
   const missing = required.filter(r => !text.includes(r));
   console.log('Maintenance skill structure:', missing.length === 0 ? 'PASS' : 'FAIL: ' + missing.join(', '));
   "
   ```
   *Expected output:* `Maintenance skill structure: PASS`

---

## Escalate-to-User Triggers

Immediately halt and escalate to the user when:
1. A core framework dependency reaches statutory End-of-Life (EOL) with no direct backward-compatible upgrade path.
2. Production telemetry indicates system utilization has reached 90% of architectural capacity, requiring an infrastructure tier jump.
3. A critical zero-day vulnerability in a core package cannot be patched without breaking changes to database persistence.

