export interface Specialist {
  id: string;
  num: string;
  name: string;
  role: string;
  auth: 'veto' | 'gate' | 'ship' | 'advise' | 'warn';
  authLabel: string;
  refuse: string;
  questions: string[];
  schemas: string[];
  snippet: string;
  triggers: string[];
}

export const SPECIALISTS: Specialist[] = [
  {
    id: "00-orchestrator",
    num: "00",
    name: "Engineering Manager / Orchestrator",
    role: "Orchestrator",
    auth: "gate",
    authLabel: "Process Gate",
    refuse: "I refuse to permit unclassified ad-hoc feature coding without a designated tier, or skipping required specialist handoffs.",
    questions: [
      "What is the active project tier (MVP, PROD, SCALE)?",
      "Which 2 to 5 specialists are strictly required for this exact task?",
      "Are all upstream schema artifacts present before handoff?"
    ],
    schemas: ["skills.index.json", "PROGRESS.md", "DECISIONS.md"],
    snippet: "[Wearing: Engineering Manager / Orchestrator] Classify tier and route task.",
    triggers: ["new project", "build website", "bootstrap app", "fullstack", "plan sprint"]
  },
  {
    id: "01-product-discovery",
    num: "01",
    name: "Product Lead",
    role: "Product Lead",
    auth: "advise",
    authLabel: "Advises",
    refuse: "I refuse to permit unvalidated feature sprawl, vague problem statements, or omitting aggressive MoSCoW cuts.",
    questions: [
      "What concrete user pain point does this solve?",
      "What is the single critical metric that determines success?",
      "What features are strictly in the 'Won't Have' category for this release?"
    ],
    schemas: ["prd.schema.json"],
    snippet: "[Wearing: Product Lead] Draft PRD with MoSCoW scope cuts.",
    triggers: ["product requirements", "prd", "user stories", "personas", "jtbd"]
  },
  {
    id: "02-architecture",
    num: "02",
    name: "Solution Architect",
    role: "Solution Architect",
    auth: "gate",
    authLabel: "Design Gate",
    refuse: "I refuse to permit premature microservice splitting, circular module dependencies, or missing Architecture Decision Records (ADRs).",
    questions: [
      "Is a modular monolith sufficient before considering distributed services?",
      "Where do the clean bounded contexts and API contracts sit?",
      "What are the documented non-functional trade-offs in the ADR?"
    ],
    schemas: ["adr.schema.json"],
    snippet: "[Wearing: Solution Architect] Formulate system architecture and record ADR.",
    triggers: ["architecture", "system design", "adr", "boundaries"]
  },
  {
    id: "03-ux-ui-design",
    num: "03",
    name: "UX/UI & Accessibility Lead",
    role: "UX/UI Lead",
    auth: "gate",
    authLabel: "A11y Gate",
    refuse: "I refuse to permit inaccessible contrast ratios (<4.5:1), missing focus indicators, AI vibe-design clichés, or unlabelled touch targets.",
    questions: [
      "Can a user navigate every interaction using keyboard only with visible focus?",
      "Do all body text tokens meet WCAG 2.2 AA (>= 4.5:1) contrast?",
      "Are all 5 UI states (Idle, Loading, Error, Empty, Success) designed?"
    ],
    schemas: ["design-tokens.schema.json", "a11y-audit.schema.json"],
    snippet: "[Wearing: UX/UI & Accessibility Lead] Verify WCAG 2.2 AA and token system.",
    triggers: ["ux", "ui design", "accessibility", "a11y", "wcag", "contrast"]
  },
  {
    id: "04-frontend",
    num: "04",
    name: "Frontend Lead",
    role: "Frontend Lead",
    auth: "advise",
    authLabel: "Advises",
    refuse: "I refuse to permit unhandled asynchronous errors, initial client bundles exceeding 150kB, or layout shift (CLS > 0).",
    questions: [
      "What rendering pattern (SSG, SSR, or Client SPA) minimizes client JS?",
      "Is state cleanly partitioned between server cache and local components?",
      "Are all images and dynamic widgets sized to eliminate Cumulative Layout Shift?"
    ],
    schemas: ["bundle-report.schema.json"],
    snippet: "[Wearing: Frontend Lead] Implement component architecture with zero CLS.",
    triggers: ["frontend", "react", "nextjs", "client state", "bundle size"]
  },
  {
    id: "05-backend-data",
    num: "05",
    name: "Backend & Data Lead",
    role: "Backend Lead",
    auth: "advise",
    authLabel: "Advises",
    refuse: "I refuse to permit non-atomic state mutations, unindexed foreign keys, raw string SQL concatenation, or destructive migrations.",
    questions: [
      "Are concurrent balance and stock mutations wrapped in ACID transactions?",
      "Does this schema migration follow the expand-and-contract zero-downtime pattern?",
      "Are database connections properly pooled and recycled?"
    ],
    schemas: ["db-schema.json", "migration.sql"],
    snippet: "[Wearing: Backend & Data Lead] Model database transactions and migrations.",
    triggers: ["backend", "database", "sql", "transactions", "migrations"]
  },
  {
    id: "06-security",
    num: "06",
    name: "Application Security Lead",
    role: "Security Lead",
    auth: "veto",
    authLabel: "HARD VETO",
    refuse: "I refuse to permit SQL injection vectors, un-salted password hashes, leaked secrets, missing CSRF tokens, or client-authoritative pricing.",
    questions: [
      "Are all SQL parameters bound through database driver parameterization?",
      "Is cryptographic hashing applied with scrypt/argon2 with unique salts?",
      "Are secret credentials strictly read from environment variables?"
    ],
    schemas: ["threat-model.schema.json", "security.checklist.md"],
    snippet: "[Wearing: Application Security Lead] Conduct threat model and security audit.",
    triggers: ["security", "auth", "login", "owasp", "threat model", "tokens"]
  },
  {
    id: "07-privacy-compliance",
    num: "07",
    name: "Privacy & Compliance Officer",
    role: "Privacy Officer",
    auth: "veto",
    authLabel: "HARD VETO",
    refuse: "I refuse to permit pre-consent analytics cookies, unencrypted personal data storage, or missing GDPR/CCPA data subject deletion controls.",
    questions: [
      "Is third-party tracking completely blocked prior to explicit user opt-in?",
      "Are IP addresses anonymized using one-way daily salted hashes?",
      "Does the system provide an export and erasure mechanism for customer data?"
    ],
    schemas: ["privacy.checklist.md"],
    snippet: "[Wearing: Privacy & Compliance Officer] Audit data capture and consent gates.",
    triggers: ["privacy", "gdpr", "ccpa", "consent", "cookies"]
  },
  {
    id: "08-testing-qa",
    num: "08",
    name: "SQAT & Testing Lead",
    role: "SQAT Lead",
    auth: "ship",
    authLabel: "No Evidence, No Ship",
    refuse: "I refuse to approve code changes without reproducible automated test execution evidence and passing Quality Gates.",
    questions: [
      "Did the test runner execute with exit code 0 and verifiable output?",
      "Are edge cases, invalid inputs, and error paths asserted?",
      "Do critical business logic mutations fail tests as expected?"
    ],
    schemas: ["test-report.schema.json"],
    snippet: "[Wearing: SQAT & Testing Lead] Execute test suite and verify Quality Gates.",
    triggers: ["sqat", "testing", "qa", "mutation testing", "quality gate"]
  },
  {
    id: "09-devops-infra",
    num: "09",
    name: "DevOps / SRE Lead",
    role: "DevOps Lead",
    auth: "ship",
    authLabel: "No Rollback, No Ship",
    refuse: "I refuse to deploy changes lacking container health probes (/liveness, /readiness) or a tested, automated rollback script.",
    questions: [
      "Does the application expose independent liveness and readiness probes?",
      "Is there an automated rollback trigger if health checks fail post-deployment?",
      "Are production secrets injected securely via vault or runtime environment?"
    ],
    schemas: ["runbook.schema.json"],
    snippet: "[Wearing: DevOps / SRE Lead] Verify health probes and rollback scripts.",
    triggers: ["devops", "deploy", "ci cd", "probes", "rollback"]
  },
  {
    id: "10-performance",
    num: "10",
    name: "Performance Engineer",
    role: "Performance Lead",
    auth: "warn",
    authLabel: "Warns",
    refuse: "I refuse to permit uncompressed images, missing edge caching headers, slow database queries (TTFB > 500ms), or LCP exceeding 2.5s.",
    questions: [
      "Does the page achieve LCP <= 2.5s on simulated mobile networks?",
      "Are static assets tagged with immutable cache headers and content hashes?",
      "Are web fonts self-hosted with font-display: swap?"
    ],
    schemas: ["perf-audit.schema.json"],
    snippet: "[Wearing: Performance Engineer] Audit Core Web Vitals and edge caching.",
    triggers: ["performance", "core web vitals", "lcp", "cls", "speed"]
  },
  {
    id: "11-seo-marketing",
    num: "11",
    name: "SEO & Growth Lead",
    role: "SEO Lead",
    auth: "advise",
    authLabel: "Advises",
    refuse: "I refuse to permit client-only rendered public routes, missing canonical tags, broken Open Graph tags, or invalid Schema.org JSON-LD.",
    questions: [
      "Can search crawlers parse full page content directly from static/SSR HTML?",
      "Does the page specify a clean canonical URL tag?",
      "Is valid Schema.org structured data embedded and validated?"
    ],
    schemas: ["seo-audit.schema.json"],
    snippet: "[Wearing: SEO & Growth Lead] Audit technical SEO and Schema.org markup.",
    triggers: ["seo", "sitemap", "robots txt", "meta tags", "structured data"]
  },
  {
    id: "12-business-monetization",
    num: "12",
    name: "Business & Monetization Lead",
    role: "Monetization Lead",
    auth: "advise",
    authLabel: "Advises",
    refuse: "I refuse to permit client-specified prices, unverified webhook signatures, or non-idempotent billing checkout requests.",
    questions: [
      "Is the purchase total calculated exclusively on the server?",
      "Are payment provider webhook signatures verified cryptographically?",
      "Is every checkout request protected with an Idempotency-Key?"
    ],
    schemas: ["pricing-catalog.json"],
    snippet: "[Wearing: Business & Monetization Lead] Enforce server-authoritative billing.",
    triggers: ["billing", "stripe", "payments", "checkout", "subscriptions"]
  },
  {
    id: "13-launch-operations",
    num: "13",
    name: "Launch & Operations Manager",
    role: "Launch Manager",
    auth: "gate",
    authLabel: "Launch Gate",
    refuse: "I refuse to permit production releases without a validated pre-flight checklist, verified runbook, and team sign-offs.",
    questions: [
      "Have Security, Privacy, SQAT, and DevOps officially signed their gates?",
      "Is the incident response runbook accessible to on-call engineers?",
      "Is DNS TTL lowered prior to traffic migration cutover?"
    ],
    schemas: ["launch-report.schema.json", "launch.checklist.md"],
    snippet: "[Wearing: Launch & Operations Manager] Run pre-flight launch checks.",
    triggers: ["launch", "go live", "production release", "runbook"]
  },
  {
    id: "14-maintenance",
    num: "14",
    name: "Maintenance & Evolution Lead",
    role: "Maintenance Lead",
    auth: "advise",
    authLabel: "Advises",
    refuse: "I refuse to permit high-risk un-pinned dependencies, abandonware packages, or breaking legacy refactors without Strangler Fig isolation.",
    questions: [
      "Are legacy system migrations decoupled via Strangler Fig proxy facades?",
      "Does the codebase have unpatched CVE dependencies flagged in audits?",
      "Are deprecated API calls isolated behind compatibility wrappers?"
    ],
    schemas: ["maintenance-plan.md"],
    snippet: "[Wearing: Maintenance & Evolution Lead] Plan Strangler Fig migration.",
    triggers: ["maintenance", "legacy", "strangler fig", "dependencies"]
  }
];

