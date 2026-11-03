# Universal WebDev Skills: Shared Engineering Glossary

This glossary defines standard terminology used across all 16 specialist skills. Skills link to this document to maintain token efficiency and prevent redundant explanations.

---

### Core Concepts & Methodologies

- **7-State Lifecycle Matrix**: The complete interaction state coverage required for interactive UI primitives: Default, Hover/Pointer, Active/Pressed, Focus-Visible, Disabled, Loading/Skeleton, and Error/Recovery.
- **ACID**: Atomicity, Consistency, Isolation, Durability. The four standard properties guaranteed by relational database management systems for state transactions.
- **ADR (Architectural Decision Record)**: A structured document that captures an important architectural decision made along with its context and consequences.
- **ASVS (Application Security Verification Standard)**: A community-driven OWASP standard defining technical security controls for web applications.
- **Blue-Green Deployment**: A zero-downtime deployment strategy using two identical production environments (Blue active, Green idle) to switch router traffic instantly.
- **Canary Release**: Staged deployment where a new version is served to a small percentage (e.g., 5%) of production traffic before full cutover.
- **CLS (Cumulative Layout Shift)**: Core Web Vital metric measuring visual stability. Target: `<= 0.1`.
- **Cognitive Complexity**: Metric assessing how difficult a unit of code is for a human developer to understand. SQAT target: `<= 15` per function.
- **Content Security Policy (CSP)**: An HTTP response header allowing site administrators to restrict the resources (JavaScript, CSS, Images) that the browser is allowed to load.
- **CSRF (Cross-Site Request Forgery)**: An attack that tricks an authenticated user's browser into executing unauthorized actions on a trusted web application.
- **Cyclomatic Complexity**: Quantitative measure of the number of linearly independent paths through a program's source code (McCabe). SQAT target: `<= 10` per function.
- **Doherty Threshold**: In HCI, the empirical requirement that system response time should remain under 400ms to preserve user focus, flow state, and productivity.
- **DSAR (Data Subject Access Request)**: A formal request under GDPR/CCPA allowing users to access, export, or delete their stored personal data.
- **Expand and Contract (Parallel Change)**: A zero-downtime database migration pattern where a schema is expanded (new columns/tables added without breaking old code), migrated gradually, and old structures are contracted (dropped) only after all code is updated.
- **Fitts's Law**: An empirical model of human motor movement ($MT = a + b \log_2(2D/W)$) predicting that time to acquire a target is a function of distance and target size.
- **Hick-Hyman Law**: The empirical principle that human decision reaction time increases logarithmically with the number of alternative choices ($RT = b \log_2(n+1)$).
- **IDOR (Insecure Direct Object Reference)**: An authorization vulnerability where an application provides direct access to objects based on user-supplied input without verifying permissions.
- **Idempotency**: The mathematical property wherein an operation produce the same result whether applied once or multiple times consecutively. Vital for payment processing and queue consumers.
- **INP (Interaction to Next Paint)**: Core Web Vital measuring responsiveness to user interactions. Target: `<= 200ms`.
- **JTBD (Jobs to be Done)**: A framework focusing on the specific task or transformation a user is "hiring" a product to achieve.
- **KLM (Keystroke-Level Model)**: A quantitative GOMS-based technique to predict expert task execution duration by summing component operator times (keystroke, pointing, homing, mental preparation).
- **LCP (Largest Contentful Paint)**: Core Web Vital measuring loading performance. Target: `<= 2.5s`.
- **MoSCoW Prioritization**: Scope categorization into **M**ust have, **S**hould have, **C**ould have, and **W**on't have (this cycle).
- **Mutation Testing**: A fault-based testing technique where automated faults ("mutants") are seeded into code to verify that test suites fail when bugs are introduced. Target mutation score: `>= 70%`.
- **OKLCH**: A perceptual color space ($L$: lightness, $C$: chroma, $H$: hue) designed to align with human visual perception, guaranteeing uniform contrast steps across dark and light themes without lightness distortion.
- **OWASP (Open Worldwide Application Security Project)**: Non-profit foundation producing standards and educational resources for web application security.
- **Quality Gate**: A verifiable set of Boolean conditions (test coverage, zero critical static analysis issues, security clearance, mutation score) that a codebase must satisfy before passing to the next deployment phase.
- **RBAC / ABAC**: Role-Based Access Control (permissions assigned to roles) vs Attribute-Based Access Control (permissions evaluated dynamically from context, user, and resource attributes).
- **ROPA (Record of Processing Activities)**: A statutory document required under GDPR Article 30 detailing what personal data is processed, why, and for how long.
- **SQAT (Software Quality Assurance and Testing)**: The unified discipline combining Software Quality Assurance (SQA: process quality, static code analysis, quality gates, defect prevention) and Software Quality Control / Testing (SQC/ST: dynamic verification, test execution, regression testing).
- **SSRF (Server-Side Request Forgery)**: An attack where a web server is coerced into making unauthorized network requests to internal resources or third-party services.
- **STRIDE**: Threat modeling taxonomy: **S**poofing, **T**ampering, **R**epudiation, **I**nformation Disclosure, **D**enial of Service, **E**levation of Privilege.
- **WCAG 2.2 AA**: Web Content Accessibility Guidelines Level AA compliance, covering minimum contrast ratios (4.5:1 text), keyboard accessibility, focus indicators, and touch targets (44x44 CSS px).
- **XSS (Cross-Site Scripting)**: An injection attack where malicious scripts are injected into otherwise benign and trusted websites.

