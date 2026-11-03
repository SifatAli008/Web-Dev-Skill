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
- **XSS (Cross-Site Scripting)**: An attack where malicious scripts are injected into otherwise benign and trusted websites.

---

### Visual Design, Interaction & UI Architecture Concepts

- **60-30-10 Rule**: An empirical compositional color rule dividing visual weight into 60% dominant base canvas/surfaces, 30% structural secondary text/borders, and 10% high-contrast accent focal points.
- **Affordance**: The actual, physical or digital properties of an interface object that determine how it can be operated (e.g. buttons afford pressing, sliders afford dragging).
- **APCA (Accessible Perceptual Contrast Algorithm)**: A modern perceptual contrast metric (W3C Silver / WCAG 3 candidate) that calculates lightness contrast ($L^c$) dynamically based on spatial frequency, font weight, and background adaptation.
- **Aspect Ratio**: The proportional relationship between an element's width and height (e.g. 16:9 widescreen, 4:3 classic, 1:1 square, 1.618:1 golden rectangle).
- **Asymmetrical Balance**: Compositional equilibrium achieved by balancing unequal visual elements of differing size, color, or contrast (e.g. a small high-contrast badge balancing a large headline).
- **Atomic Design**: Brad Frost's design system methodology decomposing interfaces into Atoms, Molecules, Organisms, Templates, and Pages.
- **Baseline Grid**: A horizontal spatial rhythm (typically 4px or 8px) to which all typographic baselines and vertical component dimensions lock.
- **Bento Box Grid**: A modern layout pattern organizing disparate telemetry and interactive modules into rounded, high-density compartmentalized cells with one dominant anchor tile.
- **Bezold Effect**: An optical phenomenon where the perceived hue and saturation of a color field is fundamentally altered by fine adjacent dividing lines or borders.
- **Bringhurst Measure**: The canonical typographic rule (Robert Bringhurst) stating that the optimal reading measure for sustained comprehension is 45 to 75 characters (ideally 65 characters / `65ch`).
- **Cap Height**: The height of flat capital letters from the baseline (e.g. H, I, T).
- **Chartjunk**: Extraneous, non-data decorative visual noise in charts (heavy grid lines, 3D extrusions, fake textures) that degrades cognitive comprehension (Edward Tufte).
- **Closure**: A Gestalt law stating that the human brain automatically fills in missing parts of incomplete shapes or layouts to perceive a unified whole (e.g. carousel peeking).
- **Common Region**: A Gestalt law establishing that elements enclosed within a shared visual boundary or background surface are perceived as a coherent group.
- **Container Query (`@container`)**: Modern CSS capability allowing component layout and styling to respond to the width of its parent container rather than the global viewport window.
- **Data-to-Ink Ratio**: Edward Tufte's fundamental metric for data graphics: the proportion of graphic pixels/ink devoted to displaying actual data versus total graphic area.
- **Display P3**: A wide-gamut RGB color space capable of displaying ~25% more vibrant chromatic shades than standard sRGB, particularly in greens, cyans, and reds.
- **Dynamic Scrim**: A subtle directional gradient overlay applied over background photography or video to guarantee WCAG 2.2 contrast compliance for overlay text.
- **Elevation**: The perceived physical height of an interface layer along the Z-axis, communicated through 1px border contrast and multi-layer drop shadows.
- **F-Pattern**: The dominant eye-tracking scanpath for dense textual interfaces where users scan horizontally across the top, down slightly, and vertically along the left margin.
- **Figure-Ground**: The perceptual separation of an interface into a focal interactive foreground element (figure) and an underlying background canvas (ground).
- **Focal Point**: An intentional visual center of gravity created through contrast, color saturation, or scale that commands initial user attention.
- **Frosted Glass (Glassmorphism)**: An architectural depth technique pairing background blur (`backdrop-filter: blur()`), translucent fills, and specular rim borders.
- **Gestalt Principles**: Universal psychological laws governing how the human visual cortex automatically organizes raw visual stimuli into grouped, coherent structures.
- **Golden Ratio ($\Phi \approx 1.618$)**: A classical divine proportion where the ratio of the whole to the larger segment equals the ratio of the larger to the smaller segment.
- **Gulf of Evaluation**: Don Norman's concept of the psychological gap between the system's current state and the user's ability to assess whether their goal was met.
- **Gulf of Execution**: Don Norman's concept of the psychological gap between a user's mental goal and their knowledge of how to perform the action in the interface.
- **Information Scent**: Visual and textual signposts that communicate the likelihood that following a link will satisfy the user's informational goal.
- **Inverse Leading**: The typographic rule stating that line-height must vary inversely with font size: tight leading on large headings (1.05–1.15) and generous leading on body text (1.5–1.65).
- **Jakob's Law**: The empirical principle that users spend most of their time on other websites, expecting your site to follow conventional mental models and navigation norms.
- **Kerning**: The micro-adjustment of horizontal space between specific pairs of adjacent letterforms (e.g. "AV", "To") to achieve optical balance.
- **Lie Factor**: Edward Tufte's measure of graphical integrity: the ratio of the size of an effect shown in a graphic to the size of the effect in the underlying data.
- **Modular Scale**: A geometric typographic scale where each step is multiplied by a constant ratio (e.g. Major Third 1.25, Perfect Fourth 1.333).
- **Negative Space (Whitespace)**: The unmarked canvas area between and around active elements, categorized into macro-whitespace (inter-section) and micro-whitespace (intra-component).
- **Optical Centering**: Nudging asymmetric directional elements (e.g. play triangles, right chevrons) along their directional axis to balance geometric and perceptual centers.
- **Peak-End Rule**: The cognitive heuristic wherein users evaluate an experience based predominantly on its highest emotional peak and its final conclusion.
- **Prägnanz (Simplicity)**: A Gestalt law stating that visual stimulus is always interpreted in the simplest, most stable and symmetric form possible.
- **Progressive Disclosure**: The interaction design technique of deferring complex or secondary information until the user explicitly requests it, preventing cognitive overload.
- **Progressive Reduction**: The gradual simplification of an interface's visual signifiers as a user gains expertise and requires fewer instructional prompts.
- **Proximity**: A Gestalt law stating that elements placed physically closer together are perceived as sharing a functional relationship.
- **Rule of Thirds**: A compositional guide dividing a canvas into a 3x3 grid where key focal elements are positioned along the lines or at the 4 intersections.
- **Signifier**: A perceptible visual cue (border, arrow, hover highlight) indicating where and how an affordance can be operated.
- **Simultaneous Contrast (Chevreul)**: The optical shift wherein the perceived brightness and hue of a color is altered by the colors directly adjacent to it.
- **Small Multiples**: Edward Tufte's high-density graphic technique displaying repeated, compact charts sharing identical scales to enable effortless side-by-side comparison.
- **Sparkline**: A miniature, word-sized data graphic embedded directly into running text or telemetry tables without axes or coordinates.
- **Spotlight Border**: An interactive micro-interaction where a subtle radial gradient tracks cursor coordinates across card borders, providing dynamic tactile depth.
- **Steering Law (Accot-Zhai)**: The empirical model predicting the time required to navigate a pointing device through a constrained 2D tunnel (such as cascading flyout menus).
- **Subgrid**: Modern CSS Grid capability (`grid-template-columns: subgrid`) allowing child items to align directly with their parent grid's tracks across siblings.
- **Tabular Numerals (`tabular-nums`)**: Monospaced numeric glyphs ensuring numbers occupy equal horizontal width, preventing visual jitter in tables and timers.
- **Tesler's Law (Conservation of Complexity)**: The principle that every application possesses an irreducible amount of complexity that must either be handled by software or borne by the user.
- **Tracking (Letter-Spacing)**: Uniform horizontal spacing applied across an entire string of characters.
- **Variable Font**: A modern font standard where a single font file contains multiple axes of variation (weight `wght`, width `wdth`, slant `slnt`, optical size `opsz`).
- **Vertical Rhythm**: The consistent vertical spacing of text baselines, margins, and component heights matching a modular baseline grid.
- **View Transitions API**: Web platform standard allowing smooth, hardware-accelerated animated morphing between DOM states and page navigations.
- **Visual Dominance 2:1 Rule**: The design requirement that a primary Call-to-Action button possess at least twice the calculated visual weight of secondary links.
- **Von Restorff Effect (Isolation Effect)**: The cognitive phenomenon where an element that visually differs from surrounding items is more easily noticed and retained in memory.
- **X-Height**: The height of lowercase letters excluding ascenders and descenders; larger x-heights significantly improve digital screen legibility.
- **Z-Pattern**: The eye-tracking path common to low-density landing pages, scanning top-left, top-right, diagonally to bottom-left, and concluding at bottom-right (CTA).
- **Zeigarnik Effect**: The psychological phenomenon where uncompleted tasks occupy working memory, driving users to finish stepped workflows with progress indicators.
- **Zero-FOUC**: The architecture of applying user theme preferences (dark/light) synchronously in `<head>` before CSS renders, preventing the White Flash of Unstyled Content.

