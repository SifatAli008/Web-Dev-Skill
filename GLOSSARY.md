# Universal WebDev Skills: Shared Engineering Glossary

This glossary defines standard terminology used across all 15 specialist skills. Skills link to this document to maintain token efficiency and prevent redundant explanations.

---

### Core Concepts & Methodologies

- **ACID**: Atomicity, Consistency, Isolation, Durability. The four standard properties guaranteed by relational database management systems for state transactions.
- **ADR (Architectural Decision Record)**: A structured document that captures an important architectural decision made along with its context and consequences.
- **ASVS (Application Security Verification Standard)**: A community-driven OWASP standard defining technical security controls for web applications.
- **Blue-Green Deployment**: A zero-downtime deployment strategy using two identical production environments (Blue active, Green idle) to switch router traffic instantly.
- **Canary Release**: Staged deployment where a new version is served to a small percentage (e.g., 5%) of production traffic before full cutover.
- **CLS (Cumulative Layout Shift)**: Core Web Vital metric measuring visual stability. Target: `<= 0.1`.
- **Content Security Policy (CSP)**: An HTTP response header allowing site administrators to restrict the resources (JavaScript, CSS, Images) that the browser is allowed to load.
- **CSRF (Cross-Site Request Forgery)**: An attack that tricks an authenticated user's browser into executing unauthorized actions on a trusted web application.
- **DSAR (Data Subject Access Request)**: A formal request under GDPR/CCPA allowing users to access, export, or delete their stored personal data.
- **Expand and Contract (Parallel Change)**: A zero-downtime database migration pattern where a schema is expanded (new columns/tables added without breaking old code), migrated gradually, and old structures are contracted (dropped) only after all code is updated.
- **IDOR (Insecure Direct Object Reference)**: An authorization vulnerability where an application provides direct access to objects based on user-supplied input without verifying permissions.
- **Idempotency**: The mathematical property wherein an operation produce the same result whether applied once or multiple times consecutively. Vital for payment processing and queue consumers.
- **INP (Interaction to Next Paint)**: Core Web Vital measuring responsiveness to user interactions. Target: `<= 200ms`.
- **JTBD (Jobs to be Done)**: A framework focusing on the specific task or transformation a user is "hiring" a product to achieve.
- **LCP (Largest Contentful Paint)**: Core Web Vital measuring loading performance. Target: `<= 2.5s`.
- **MoSCoW Prioritization**: Scope categorization into **M**ust have, **S**hould have, **C**ould have, and **W**on't have (this cycle).
- **OWASP (Open Worldwide Application Security Project)**: Non-profit foundation producing standards and educational resources for web application security.
- **RBAC / ABAC**: Role-Based Access Control (permissions assigned to roles) vs Attribute-Based Access Control (permissions evaluated dynamically from context, user, and resource attributes).
- **ROPA (Record of Processing Activities)**: A statutory document required under GDPR Article 30 detailing what personal data is processed, why, and for how long.
- **SSRF (Server-Side Request Forgery)**: An attack where a web server is coerced into making unauthorized network requests to internal resources or third-party services.
- **STRIDE**: Threat modeling taxonomy: **S**poofing, **T**ampering, **R**epudiation, **I**nformation Disclosure, **D**enial of Service, **E**levation of Privilege.
- **WCAG 2.2 AA**: Web Content Accessibility Guidelines Level AA compliance, covering minimum contrast ratios (4.5:1 text), keyboard accessibility, focus indicators, and touch targets (44x44 CSS px).
- **XSS (Cross-Site Scripting)**: An injection attack where malicious scripts are injected into otherwise benign and trusted websites.

