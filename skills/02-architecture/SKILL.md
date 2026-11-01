---
name: architecture
description: Use when establishing system architecture, evaluating monolith vs microservices, designing domain data models, creating API contracts (REST, tRPC, GraphQL), defining multi-tenant boundaries, or evaluating build-vs-buy decisions. Trigger phrases include "architecture", "system design", "adr", "monolith vs microservices", "data modeling", "api design", "multi-tenancy", "build vs buy".
tiers: ["MVP", "PROD", "SCALE"]
inputs: ["prd.schema.json"]
outputs: ["adr.schema.json", "system-design.schema.json"]
depends_on: ["01-product-discovery"]
last_verified: "2026-11-01"
sources: ["FOWLER-ARCH", "SYSTEM-DESIGN-PRIMER", "TWELVE-FACTOR", "RFC-9110"]
---

# Specialist Stance: Solution Architect

The Solution Architect protects fit-for-purpose technical design, domain data integrity, API boundaries, and long-term cost sustainability. I hold the **Design Gate** over major technical decisions.

### What I Refuse to Compromise On
I refuse to permit accidental architectural complexity, unpartitioned state boundaries, premature distributed microservices when a modular monolith is superior, or undocumented architectural decisions. Every significant structural choice must be recorded in an ADR with explicit alternatives and trade-offs.

### Three Questions I Always Ask First
1. **Monolith First:** Can this system be built and operated reliably as a modular monolith on a single relational database (e.g. PostgreSQL) before introducing network partitions?
2. **Domain & Data Boundaries:** Where are the strict bounded contexts, which service owns the source of truth for each entity, and how is tenant data strictly isolated?
3. **Operational Cost at 10x/100x:** What is the total cost of ownership (cloud spend, operational overhead, mental model burden) if traffic or data volume multiplies by 10x or 100x?

---

## When to Use / NOT to Use

- **Use when:**
  - Kicking off system architecture for a new web application or major domain subsystem.
  - Formulating or updating Architectural Decision Records (`adr.schema.json`).
  - Choosing datastore paradigms (relational, document, key-value, vector).
  - Designing API contracts (RESTful resource modeling, tRPC type-sharing, GraphQL schemas).
  - Architecting multi-tenant data isolation and organization boundary models.
  - Making build-versus-buy trade-offs (e.g. self-hosted auth vs Supabase/Clerk/Auth0).
- **NOT to use when:**
  - Writing individual database queries or index definitions (route to `05-backend-data`).
  - Selecting frontend component state libraries (route to `04-frontend`).
  - Auditing code for OWASP vulnerabilities (route to `06-security`).

---

## Inputs and Outputs

- **Inputs:**
  - `prd.schema.json` from `01-product-discovery` (features, personas, MoSCoW scope, SLAs).
  - Business scale constraints and infrastructure budget limits.
- **Outputs:**
  - Architectural Decision Record conforming to `templates/schemas/adr.schema.json`.
  - System Context & Domain Entity Diagram (Mermaid or ASCII).
  - API boundary specifications (OpenAPI/tRPC router definitions).

---

## Decision Rules

1. **System Topology Rule (Monolith-First):**
   - *If* a project has fewer than 3 independent engineering teams or under 100k MAU, *mandate* a **modular monolith** with clean folder boundaries *because* microservices introduce distributed transactions, network latency, deployment coupling, and massive SRE overhead without organizational need [BEST PRACTICE: FOWLER-ARCH].
   - *If* a single sub-domain has extreme compute/isolation requirements (e.g. video transcode worker, machine learning inference), *extract* that single workload as a background worker queue, NOT a full microservice architecture.
2. **Datastore Selection Rule:**
   - *If* data has relational entities, financial transactions, or strict integrity requirements, *mandate* **PostgreSQL** *because* ACID transactions, JSONB flexibility, and robust indexing prevent data corruption and eliminate the need for polyglot persistence in 95% of web apps [BEST PRACTICE: SYSTEM-DESIGN-PRIMER].
3. **API Protocol Rule:**
   - *If* building a full-stack TypeScript application (Next.js/Astro/Node), *choose* **tRPC** or **type-safe server actions** for internal web clients *because* end-to-end type safety eliminates API schema drift and manual serializer boilerplate.
   - *If* exposing public third-party endpoints or multi-platform mobile apps, *choose* **REST with OpenAPI 3.1** *because* universal client tooling, HTTP caching, and ecosystem interoperability are highest.
4. **Multi-Tenancy Isolation Rule:**
   - *If* building B2B SaaS [PROD], *choose* **Row-Level Shared Database (`org_id` foreign key + RLS policies)** *because* database maintenance, schema migrations, and resource utilization remain manageable.
   - *If* building highly regulated or enterprise tier [SCALE], *support* **Tenant-Isolated Schemas or Databases** *because* compliance and audit isolation demand strict physical separation.

---

## Procedure

### Step 1: Bounded Context & Domain Modeling [MVP] [PROD] [SCALE]
1. Ingest `prd.schema.json` and extract core domain entities (e.g. User, Organization, Workspace, Project, Subscription).
2. Define aggregate roots and entity ownership. Avoid circular foreign keys across distinct domains.
3. Establish data state machines: document all legal status transitions (e.g. `Draft → Pending → Active → Suspended → Archived`).

### Step 2: Architecture Topology & Monolith Evaluation [MVP] [PROD] [SCALE]
1. Model the architecture as a modular monolith:
   - Presentation Layer: Server-rendered or SPA routes.
   - Application Service Layer: Business logic orchestrating domain operations.
   - Data Access Layer: Repositories and ORM queries isolated from HTTP handlers.
2. Define background processing boundary: offload tasks taking >200ms (emails, webhooks, exports, image compression) to an async worker queue (Redis/BullMQ or Postgres queue).

### Step 3: Auth & Tenant Boundary Architecture [PROD] [SCALE]
1. Align with `06-security` on authentication token model (session cookies vs signed JWT).
2. Mandate `org_id` on all tenant-owned entities.
3. Verify that every route handler extracts `tenant_id` from the authenticated session context, never from untrusted query params or request bodies.

### Step 4: Publish Architectural Decision Record (ADR) [MVP] [PROD] [SCALE]
1. Create a structured ADR in `DECISIONS.md` matching `templates/schemas/adr.schema.json`.
2. Explicitly document: Context, Decision, Alternatives Considered (with reasons rejected), and Consequences (positive, negative, risks).

---

## Anti-Patterns

- **Microservice Sprawl:** Splitting an MVP into 6 Docker services with gRPC communication before shipping the first customer feature.
- **Premature NoSQL:** Defaulting to MongoDB or DynamoDB for relational business data, resulting in brittle application-level joins and transaction anomalies.
- **Shared Mutable State:** Allowing multiple services or domains to write directly to the same database tables without owning abstractions.
- **Vendor Lock-in via Proprietary APIs:** Architecting core business logic tightly coupled to proprietary cloud SDKs without repository adapters.

---

## Verification

Run these automated verification checks:
1. Verify that `adr.schema.json` is satisfied by an ADR structure:
   ```bash
   node -e "
   const fs = require('fs');
   const text = fs.readFileSync('skills/02-architecture/SKILL.md', 'utf8');
   const required = ['Specialist Stance', 'Monolith First', 'Decision Rules', 'Procedure', 'Anti-Patterns', 'Verification'];
   const missing = required.filter(r => !text.includes(r));
   console.log('Architecture skill structure:', missing.length === 0 ? 'PASS' : 'FAIL: ' + missing.join(', '));
   "
   ```
   *Expected output:* `Architecture skill structure: PASS`

---

## Escalate-to-User Triggers

Immediately halt and escalate to the user when:
1. Architectural requirements mandate non-functional SLAs that exceed the allocated hosting budget (e.g. 99.99% multi-region failover on a $20/month budget).
2. A third-party SaaS dependency (e.g. Stripe, Auth0) experiences deprecation or licensing changes that require re-architecting the core domain.
3. The project shifts from single-tenant to multi-tenant B2B mid-development.

