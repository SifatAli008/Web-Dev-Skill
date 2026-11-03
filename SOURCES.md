# Universal WebDev Skills: Authoritative Sources Registry

This registry tracks authoritative standards, official documentation, regulations, and primary research cited across all 16 skills. All factual assertions in skills must cite a valid `Source ID` from this registry.

---

## 1. Claim Tagging Standard

Every technical claim in this repository is tagged with one of three epistemic levels:
- `[FACT: <SOURCE-ID>]`: Verifiable technical truth sourced directly from an official specification, RFC, statute, or official framework documentation.
- `[BEST PRACTICE: <SOURCE-ID>]`: Industry consensus validated by major engineering organizations (e.g. Google Web.dev, AWS Architecture Center, OWASP Foundation).
- `[JUDGMENT]`: An opinionated architectural or operational trade-off reasoned explicitly based on context, cost, and team velocity.

---

## 2. Sector Sources Registry

### Cross-Cutting & Governance
- **`AGENTS-PROTOCOL`**: Universal WebDev Skills Team Protocol, `AGENTS.md`. [FACT]
- **`DECISIONS-RECORD`**: Project Architectural Decision Records, `DECISIONS.md`. [FACT]
- **`TWELVE-FACTOR`**: The Twelve-Factor App methodology. Stig Sandbeck Mathisen et al. https://12factor.net/ [BEST PRACTICE]
- **`NIST-SSDF`**: NIST Special Publication 800-218: Secure Software Development Framework (SSDF) Version 1.1. https://csrc.nist.gov/pubs/sp/800/218/final [FACT]

### 01 · Product Discovery
- **`JTBD-INTERCOM`**: "Intercom on Jobs-to-be-Done", Des Traynor et al. Intercom Inc. [BEST PRACTICE]
- **`LEAN-STARTUP`**: "The Lean Startup: How Today's Entrepreneurs Use Continuous Innovation", Eric Ries (2011). [BEST PRACTICE]
- **`SHAPE-UP`**: "Shape Up: Stop Running in Circles and Ship Work that Matters", Ryan Singer, 37signals (2019). [BEST PRACTICE]

### 02 · Solution Architecture
- **`FOWLER-ARCH`**: Martin Fowler's Architecture & MonolithFirst guides. https://martinfowler.com/bliki/MonolithFirst.html [BEST PRACTICE]
- **`SYSTEM-DESIGN-PRIMER`**: Donne Martin, The System Design Primer. https://github.com/donnemartin/system-design-primer [BEST PRACTICE]
- **`RFC-9110`**: HTTP Semantics, IETF RFC 9110 (June 2022). https://www.rfc-editor.org/rfc/rfc9110.html [FACT]

### 03 · UX/UI & Accessibility
- **`WCAG-2-2`**: Web Content Accessibility Guidelines (WCAG) 2.2, W3C Recommendation (October 2023). https://www.w3.org/TR/WCAG22/ [FACT]
- **`WAI-ARIA-1-2`**: Accessible Rich Internet Applications (WAI-ARIA) 1.2, W3C Recommendation (June 2023). https://www.w3.org/TR/wai-aria-1.2/ [FACT]
- **`REF-DESIGN-TOKENS`**: W3C Design Tokens Community Group Specification. https://design-tokens.github.io/community-group/format/ [BEST PRACTICE]

### 04 · Frontend Engineering
- **`REACT-DOCS`**: Official React Documentation and Server Components Specification. https://react.dev/ [FACT]
- **`MDN-WEB-DOCS`**: MDN Web Docs, Mozilla Developer Network. https://developer.mozilla.org/ [FACT]
- **`WEB-DEV`**: web.dev guidance by the Google Chrome Developer Relations team. https://web.dev/ [BEST PRACTICE]

### 05 · Backend & Data
- **`POSTGRES-DOCS`**: PostgreSQL 16/17 Official Documentation (Transactions, Isolation Levels, Indexes). https://www.postgresql.org/docs/ [FACT]
- **`USE-THE-INDEX-LUKE`**: Markus Winand, "Use The Index, Luke! A Guide to Database Performance for Developers". https://use-the-index-luke.com/ [BEST PRACTICE]
- **`PRAGMATIC-MIGRATIONS`**: Expand and Contract Pattern for Zero-Downtime Database Migrations. https://martinfowler.com/bliki/ParallelChange.html [BEST PRACTICE]

### 06 · Application Security
- **`OWASP-TOP-10`**: OWASP Top 10:2021 The Ten Most Critical Web Application Security Risks. https://owasp.org/Top10/ [FACT]
- **`OWASP-ASVS`**: OWASP Application Security Verification Standard (ASVS) 4.0.3. https://owasp.org/www-project-application-security-verification-standard/ [FACT]
- **`CWE-SANS-25`**: 2023 CWE Top 25 Most Dangerous Software Weaknesses. https://cwe.mitre.org/top25/archive/2023/2023_top25_list.html [FACT]
- **`RFC-6749`**: The OAuth 2.0 Authorization Framework. https://www.rfc-editor.org/rfc/rfc6749 [FACT]

### 07 · Privacy & Compliance
- **`GDPR-LEGAL-TEXT`**: Regulation (EU) 2016/679 of the European Parliament and of the Council (General Data Protection Regulation). https://eur-lex.europa.eu/eli/reg/2016/679/oj [FACT]
- **`EDPB-GUIDELINES`**: European Data Protection Board Guidelines on Consent (05/2020) and Data Protection by Design (04/2019). https://edpb.europa.eu/ [FACT]
- **`CCPA-CPRA`**: California Consumer Privacy Act of 2018 as amended by the California Privacy Rights Act of 2020. Cal. Civ. Code § 1798.100 et seq. [FACT]
- **`FTC-FTC-ACT`**: Federal Trade Commission Act, 15 U.S.C. § 45 (Unfair or Deceptive Acts or Practices). [FACT]

### 08 · QA & Testing (SQAT)
- **`PRACTICAL-TEST-PYRAMID`**: Ham Vocke, The Practical Test Pyramid. Martin Fowler bliki. https://martinfowler.com/articles/practical-test-pyramid.html [BEST PRACTICE]
- **`PLAYWRIGHT-DOCS`**: Playwright Official Documentation, Microsoft. https://playwright.dev/ [FACT]
- **`TEST-IN-PROD`**: Charity Majors et al., Observability and Testing in Production. [BEST PRACTICE]
- **`ISO-29119`**: ISO/IEC/IEEE 29119 Software and Systems Engineering — Software Testing standards. https://www.iso.org/standard/64818.html [FACT]
- **`ISO-25010`**: ISO/IEC 25010 Systems and software Quality Requirements and Evaluation (SQuaRE). https://iso25000.com/index.php/en/iso-25000-standards/iso-25010 [FACT]
- **`ISTQB-SQAT`**: International Software Testing Qualifications Board (ISTQB) Certified Tester Foundation and Advanced Syllabi. https://www.istqb.org/ [BEST PRACTICE]
- **`SONARQUBE-QUALITY-GATES`**: SonarQube Clean as You Code Quality Gate methodology and static code metrics. https://docs.sonarsource.com/sonarqube/latest/instance-administration/quality-gates/ [BEST PRACTICE]
- **`STRYKER-MUTATOR`**: Stryker Mutator: Mutation Testing for JavaScript and TypeScript. https://stryker-mutator.io/ [BEST PRACTICE]

### 09 · DevOps & Infrastructure
- **`GOOGLE-SRE-BOOK`**: Site Reliability Engineering: How Google Runs Production Systems, Betsy Beyer et al. (O'Reilly, 2016). https://sre.google/sre-book/table-of-contents/ [BEST PRACTICE]
- **`OPEN-TELEMETRY`**: OpenTelemetry Specification, Cloud Native Computing Foundation (CNCF). https://opentelemetry.io/docs/specs/ [FACT]
- **`12-FACTOR-CONFIG`**: Declarative Environment Configuration and Parity. https://12factor.net/config [BEST PRACTICE]

### 10 · Performance Engineering
- **`WEB-DEV-CWV`**: Google Core Web Vitals Guidance (LCP, INP, CLS). https://web.dev/explore/metrics [FACT]
- **`HIGH-PERF-BROWSER-NETWORKING`**: Ilya Grigorik, "High Performance Browser Networking" (O'Reilly, 2013). https://hpbn.co/ [BEST PRACTICE]
- **`V8-DEV`**: V8 JavaScript Engine Performance & Garbage Collection Guidelines. https://v8.dev/blog [BEST PRACTICE]

### 11 · SEO & Growth
- **`GOOGLE-SEARCH-CENTRAL`**: Google Search Central Documentation (Crawling, Indexing, JavaScript SEO). https://developers.google.com/search/docs [FACT]
- **`SCHEMA-ORG`**: Schema.org Structured Data Specifications. https://schema.org/ [FACT]
- **`REF-WEB-METRICS`**: W3C Web Performance Working Group Navigation and Resource Timing. https://www.w3.org/TR/navigation-timing-2/ [FACT]

### 12 · Business & Monetization
- **`STRIPE-ENGINEERING-DOCS`**: Stripe API & Webhook Handling Guides, Stripe Inc. https://stripe.com/docs [FACT]
- **`TAX-CALC-BASICS`**: Streamlined Sales Tax (SST) & EU VAT MOSS / OSS Directive guidance. [FACT]
- **`SAAS-METRICS`**: David Skok, "SaaS Metrics 2.0 – A Guide to Measuring and Improving what Matters". [BEST PRACTICE]

### 13 · Launch & Operations
- **`LAUNCH-CHECKLISTS`**: Google Cloud Architecture Framework: Production Readiness Review. https://cloud.google.com/architecture/framework/operational-excellence [BEST PRACTICE]
- **`INCIDENT-COMMAND-SYSTEM`**: FEMA Incident Command System applied to SRE and Technology Outages. [BEST PRACTICE]
- **`BLAMELESS-POSTMORTEMS`**: Etsy's Guide to Blameless Postmortems, John Allspaw (2012). [BEST PRACTICE]

### 14 · Maintenance & Evolution
- **`LEGACY-CODE-FEATHERS`**: Michael Feathers, "Working Effectively with Legacy Code" (Prentice Hall, 2004). [BEST PRACTICE]
- **`REFACTORING-FOWLER`**: Martin Fowler, "Refactoring: Improving the Design of Existing Code" (Addison-Wesley, 2nd ed. 2018). [BEST PRACTICE]
- **`DEPENDENCY-HEALTH`**: OpenSSF (Open Source Security Foundation) Scorecard and Dependency Hygiene. https://scorecard.dev/ [BEST PRACTICE]

### 15 · Human-Computer Interaction & Cognitive Ergonomics
- **`NORMAN-DESIGN-EVERYDAY-THINGS`**: Don Norman, "The Design of Everyday Things: Revised and Expanded Edition" (Basic Books, 2013). [BEST PRACTICE]
- **`FITTS-LAW-1954`**: Paul M. Fitts, "The information capacity of the human motor system in controlling the amplitude of movement", Journal of Experimental Psychology (1954). [FACT]
- **`HICK-HYMAN-LAW`**: William E. Hick (1952) & Ray Hyman (1953), "On the rate of gain of information", Quarterly Journal of Experimental Psychology. [FACT]
- **`DOHERTY-THRESHOLD`**: Walter J. Doherty and Ahrvid J. Thadhani, "The Economic Value of Rapid Response Time", IBM Systems Journal, Vol. 21, No. 1 (1982). [FACT]
- **`MILLER-CHUNKING-1956`**: George A. Miller, "The Magical Number Seven, Plus or Minus Two: Some Limits on Our Capacity for Processing Information", Psychological Review (1956). [FACT]
- **`TESLER-COMPLEXITY-CONSERVATION`**: Larry Tesler, Law of Conservation of Complexity, ACM Interactions (1984). [BEST PRACTICE]
- **`GOMS-KLM-CARD-MORAN-NEWELL`**: Stuart K. Card, Thomas P. Moran, and Allen Newell, "The Psychology of Human-Computer Interaction" (CRC Press, 1983). [FACT]
- **`NIELSEN-10-HEURISTICS`**: Jakob Nielsen, "10 Usability Heuristics for User Interface Design", Nielsen Norman Group (1994). [BEST PRACTICE]


