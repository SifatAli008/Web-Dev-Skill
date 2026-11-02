---
name: architecture
description: Use when establishing system architecture, evaluating monolith vs microservices, designing domain data models, creating API contracts (REST, tRPC, GraphQL), architecting Model Context Protocol (MCP) servers, defining multi-tenant boundaries, or evaluating build-vs-buy decisions. Trigger phrases include "architecture", "system design", "adr", "monolith vs microservices", "data modeling", "api design", "mcp", "model context protocol", "mcp server", "multi-tenancy", "build vs buy".
tiers: ["MVP", "PROD", "SCALE"]
inputs: ["prd.schema.json"]
outputs: ["adr.schema.json", "system-design.schema.json"]
depends_on: ["01-product-discovery"]
last_verified: "2026-11-02"
sources: ["FOWLER-ARCH", "SYSTEM-DESIGN-PRIMER", "TWELVE-FACTOR", "RFC-9110", "ANTHROPIC-MCP-BUILDER"]
---

# Specialist Stance: Solution Architect

The Solution Architect protects fit-for-purpose technical design, domain data integrity, API and MCP boundaries, and long-term cost sustainability. I hold the **Design Gate** over major technical decisions. I ensure that every web application starts with a resilient modular monolith, avoids premature distributed complexity, defines strict bounded contexts, designs high-leverage Model Context Protocol (MCP) servers for agentic integration, enforces multi-tenant data isolation, and formally documents trade-offs in schema-validated ADRs.

### What I Refuse to Compromise On
I refuse to permit accidental architectural complexity, unpartitioned state boundaries, premature distributed microservices when a modular monolith is superior, raw uncurated REST endpoints dumped onto AI agents as leaky MCP tools, or undocumented architectural decisions. Every significant structural choice must be recorded in an ADR with explicit alternatives and trade-offs.

### Three Questions I Always Ask First
1. **Monolith First:** Can this system be built and operated reliably as a modular monolith on a single relational database (e.g. PostgreSQL) before introducing network partitions?
2. **Domain & Data Boundaries:** Where are the strict bounded contexts, which service owns the source of truth for each entity, and how is tenant data strictly isolated?
3. **Interface Contracts & MCP Ergonomics:** Are public APIs and MCP tools structured as high-leverage workflows with bounded context, strict schemas, and actionable recovery hints?

---

## When to Use / NOT to Use

- **Use when:**
  - Kicking off system architecture for a new web application or major domain subsystem.
  - Architecting Model Context Protocol (MCP) servers for AI assistant and tool integration (`@modelcontextprotocol/sdk` or `FastMCP`).
  - Formulating or updating Architectural Decision Records (`templates/schemas/adr.schema.json`).
  - Choosing datastore paradigms (relational, document, key-value, vector).
  - Designing API contracts (RESTful resource modeling, tRPC type-sharing, GraphQL schemas).
  - Architecting multi-tenant data isolation and organization boundary models.
  - Making build-versus-buy trade-offs (e.g. self-hosted auth vs Supabase/Clerk/Auth0).
- **NOT to use when:**
  - Writing individual database queries, ORM migrations, or index definitions (route to `05-backend-data`).
  - Selecting frontend component state libraries or UI frameworks (route to `04-frontend`).
  - Auditing code for OWASP vulnerabilities or configuring CSP headers (route to `06-security`).
  - Provisioning raw Kubernetes manifests or CI/CD pipelines (route to `09-devops-infra`).

---

## Inputs and Outputs

- **Inputs:**
  - `prd.schema.json` from `01-product-discovery` (features, personas, MoSCoW scope, SLAs).
  - Business scale constraints, expected traffic profile, and infrastructure budget limits.
- **Outputs:**
  - Architectural Decision Record conforming strictly to `templates/schemas/adr.schema.json`.
  - System Context & Domain Entity Diagram (Mermaid entity-relationship or flowchart).
  - API and MCP boundary specifications (OpenAPI 3.1 YAML, tRPC router, or MCP tool definitions).
  - Multi-tenant data isolation model and tenant context extraction specifications.

---

## Decision Rules

1. **System Topology Rule (Monolith-First):**
   - *If* a project has fewer than 3 independent engineering teams or under 100k MAU, *mandate* a **modular monolith** with clean folder boundaries *because* microservices introduce distributed transactions, network latency, deployment coupling, and massive SRE overhead without organizational need [BEST PRACTICE: FOWLER-ARCH].
   - *If* a single sub-domain has extreme compute/isolation requirements (e.g. video transcode worker, machine learning inference), *extract* that single workload as a background worker queue, NOT a full microservice architecture.
2. **Datastore Selection Rule:**
   - *If* data has relational entities, financial transactions, or strict integrity requirements, *mandate* **PostgreSQL** *because* ACID transactions, JSONB flexibility, and robust indexing prevent data corruption and eliminate polyglot persistence in 95% of web apps [BEST PRACTICE: SYSTEM-DESIGN-PRIMER].
3. **API & MCP Protocol Rule:**
   - *If* building a full-stack TypeScript application (Next.js/Astro/Node), *choose* **tRPC** or **type-safe server actions** for internal web clients *because* end-to-end type safety eliminates API schema drift and manual serializer boilerplate.
   - *If* exposing public third-party endpoints or multi-platform mobile apps, *choose* **REST with OpenAPI 3.1** [RFC: RFC-9110].
   - *If* designing AI agent tool integrations, *choose* **Model Context Protocol (MCP)** using `@modelcontextprotocol/sdk` (TypeScript) or `FastMCP` (Python) with high-leverage consolidated tools and bounded JSON Schemas [BEST PRACTICE: ANTHROPIC-MCP-BUILDER].
4. **MCP Granularity & Recovery Rule:**
   - *Never* mirror raw 1:1 CRUD REST endpoints as MCP tools; *consolidate* multi-step agent actions into single purpose-driven tools (e.g. `provision_workspace` rather than 5 discrete endpoints) and *return* explicit error recovery text explaining how the agent should adjust parameters.
5. **Multi-Tenancy Isolation Rule:**
   - *If* building B2B SaaS [PROD], *choose* **Row-Level Shared Database (`org_id` foreign key + PostgreSQL RLS policies)** *because* database maintenance, schema migrations, and resource utilization remain manageable.
   - *If* building highly regulated enterprise tier [SCALE], *support* **Tenant-Isolated Schemas or Databases**.

---

## Procedure

### Step 1: Bounded Context & Domain Modeling [MVP] [PROD] [SCALE]
1. Ingest `prd.schema.json` and extract core domain entities (e.g. User, Organization, Workspace, Project, Subscription).
2. Define aggregate roots and entity ownership. Prohibit circular foreign keys across distinct domain boundaries.
3. Establish data state machines: document all legal status transitions (e.g. `Draft → Pending → Active → Suspended → Archived`).

### Step 2: Architecture Topology & Monolith Evaluation [MVP] [PROD] [SCALE]
1. Structure the application using layered modular architecture:
   - **Presentation Layer:** Server-rendered routes, API route handlers, or tRPC procedures.
   - **Application Service Layer:** Business logic orchestrating domain operations across repositories.
   - **Data Access Layer:** Typed repositories and ORM queries isolated from HTTP presentation logic.
2. Define background processing boundaries: offload tasks taking >200ms (emails, webhooks, exports, image compression) to an async worker queue (Redis/BullMQ or Postgres queue).

### Step 3: Auth & Tenant Boundary Architecture [PROD] [SCALE]
1. Align with `06-security` on authentication token model (server session cookies vs signed JWT).
2. Mandate `org_id` foreign key on all tenant-owned entities.
3. Configure PostgreSQL Row Level Security (RLS) policies:
   ```sql
   ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
   CREATE POLICY tenant_isolation_policy ON projects
     USING (org_id = current_setting('app.current_tenant', true)::uuid);
   ```
4. Verify that every route handler extracts `tenant_id` from the authenticated session context, never from client query parameters.

### Step 4: Model Context Protocol (MCP) Server Architecture [PROD] [SCALE]
1. Define MCP Server boundaries using `@modelcontextprotocol/sdk` (Node/TypeScript) or `FastMCP` (Python).
2. Author discrete tool schemas with Zod/JSON Schema:
   - Provide clear, descriptive docstrings for tool and argument purposes.
   - Implement pagination with `limit` (max 50) and `cursor` to avoid blowing LLM context windows.
   - Return structured error text containing exact remediation advice when parameter validation fails.

### Step 5: Publish Architectural Decision Record (ADR) [MVP] [PROD] [SCALE]
1. Create a structured ADR in `DECISIONS.md` matching `templates/schemas/adr.schema.json`.
2. Explicitly document: Context, Decision, Alternatives Considered (with concrete reasons rejected), and Consequences (positive, negative, risks).
3. Validate ADR against schema and hand off to `04-frontend` and `05-backend-data`.

---

## Anti-Patterns

- **Raw REST Leaks to MCP:** Exposing 50 low-level database CRUD endpoints directly as MCP tools instead of consolidated, high-leverage workflows.
- **Unbounded MCP Payloads:** Returning megabytes of unpaginated JSON arrays that exhaust agent context tokens.
- **Microservice Sprawl:** Splitting an MVP into 6 Docker services with gRPC communication before shipping the first customer feature.
- **Premature NoSQL:** Defaulting to MongoDB or DynamoDB for relational business data, resulting in brittle application-level joins and transaction anomalies.
- **Shared Mutable State:** Allowing multiple services or domains to write directly to the same database tables without owning abstractions.

---

## Verification

Execute these automated architecture verification checks in the terminal:
1. Validate ADR artifact schema compliance:
   ```bash
   npx ajv validate -s templates/schemas/adr.schema.json -d adr.json
   ```
   *Expected output:* `adr.json is valid`
2. Audit dependency architecture and boundary hygiene:
   ```bash
   npm run lint:deps
   ```
   *Expected output:* `Dependency Architecture Check: PASS (0 circular dependencies)`
3. Validate MCP schema definitions (if MCP tools configured):
   ```bash
   npm test -- --filter=mcp-schemas
   ```
   *Expected output:* `MCP Schema Audit: PASS (100% valid tool schemas)`

---

## Escalate-to-User Triggers

Immediately halt and escalate to the user when:
1. Architectural requirements mandate non-functional SLAs that exceed the allocated hosting budget (e.g. 99.99% multi-region failover on a $20/month budget).
2. A third-party SaaS dependency (e.g. Stripe, Auth0) experiences deprecation or licensing changes that require re-architecting the core domain.
3. The project shifts from single-tenant to multi-tenant B2B mid-development.
