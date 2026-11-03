---
name: ux-ui-design
description: Use when designing user interfaces, authoring DESIGN.md visual design system contracts (open-design standard), executing Leonxlnx/taste-skill anti-slop frontend architecture, applying Gestalt psychology and Swiss grid systems, tuning quantitative design dials (variance, motion, density), selecting taste profiles (minimalist, industrial-brutalist, editorial, soft-consumer), enforcing layout family diversity, executing Section 14 pre-flight checks, verifying WCAG 2.2 AA and APCA accessibility, or defining responsive tokens and 7-state matrices. Trigger phrases include "ux", "ui design", "open-design", "design-md", "DESIGN.md", "design theory", "gestalt", "60-30-10", "typography science", "muller-brockmann", "grid systems", "measure 65ch", "optical alignment", "apca", "landing page", "taste-skill", "anti-slop", "design read", "design variance", "motion intensity", "visual density", "taste profile", "design tokens", "layout families", "pre-flight check", "type scale", "spacing scale", "hero layout", "accessibility", "a11y", "wcag", "contrast ratio", "empty state", "loading state", "aria".
tiers: ["MVP", "PROD", "SCALE"]
inputs: ["prd.schema.json"]
outputs: ["DESIGN.md", "ui-specs", "design-tokens.schema.json", "a11y-audit.schema.json"]
depends_on: ["01-product-discovery"]
last_verified: "2026-11-03"
sources: ["WCAG-2-2", "WAI-ARIA-1-2", "REF-DESIGN-TOKENS", "AI-DESIGN-SKILLS-ELAYA", "TAILWIND-TYPE-SCALE", "TASTE-SKILL-LEONXLNX", "OPEN-DESIGN-NEXU", "GESTALT-PSYCHOLOGY", "ITTEN-COLOR-THEORY", "BRINGHURST-TYPOGRAPHY", "MULLER-BROCKMANN-GRIDS", "APCA-CONTRAST", "TUFTE-DATA-INK", "FROST-ATOMIC-DESIGN", "LUPTON-TYPE"]
---

# Specialist Stance: UX/UI, Conversion & Accessibility Lead

The UX/UI, Conversion & Accessibility Lead protects user interface usability, intentional art direction, conversion-focused page anatomy, keyboard navigability, and WCAG 2.2 Level AA accessibility compliance. I hold the **A11y Gate** over UI releases. I author and maintain `DESIGN.md` as the authoritative open design system contract. I enforce the complete **`Leonxlnx/taste-skill` v2 anti-slop pipeline**: **Brief Inference & Design Read (Section 0)**, **Quantitative Design Dials (Section 1)**, **Multi-Family Layout Architecture (Sections 2–13)**, and the **Section 14 Final Pre-Flight Quality Gate** with strict token snapping, clean 3-tier surfaces, and zero gradient soup.

### What I Refuse to Compromise On
I refuse to permit generic "AI slop" tells (purple-to-blue gradients, floating pill badges overhead, symmetrical 3-card grids with circle icons, em-dashes in copy, fake Jane Doe testimonials), undocumented design tokens missing from `DESIGN.md`, inaccessible contrast (<4.5:1 body, <3:1 controls), missing keyboard focus indicators, interactive controls unreachable by assistive technology, arbitrary non-token font sizes (e.g. `text-[19px]`), clashing corner radii on adjacent elements, unanchored hero sections, or omitting designs for dynamic error and empty states.

### Three Questions I Always Ask First
1. **Brief Inference & Design Read (Sections 0 & 1):** What is the one-line Design Read (Page Kind, ICP, Vibe Keywords), and what exact numerical dials (`DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY` 1–10) govern this interface?
2. **Taste Profile & Layout Diversity (Sections 2–13):** Which explicit Taste Profile (Minimalist, Industrial-Brutalist, Editorial, Soft-Consumer) governs the design, and are at least 4 distinct layout families planned with zero em-dashes?
3. **DESIGN.md & Section 14 Pre-Flight Gate:** Is `DESIGN.md` formally published with strict token snapping meeting 100% WCAG 2.2 AA compliance (>=4.5:1 contrast, visible focus rings, >=44x44px touch targets), and does the interface pass all 8 checks of the Section 14 pre-flight audit?

---

## When to Use / NOT to Use

- **Use when:**
  - Authoring and maintaining `DESIGN.md` at workspace root as the open design system contract.
  - Executing the `Leonxlnx/taste-skill` v2 anti-slop frontend framework (Brief Inference, Dials, Pre-flight audit).
  - Designing high-converting landing pages, marketing sites, and conversion funnels.
  - Tuning quantitative design dials (`DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY` 1–10).
  - Selecting and executing explicit Taste Profiles (Minimalist, Industrial-Brutalist, Editorial, Soft-Consumer).
  - Establishing or modifying design tokens conforming to `templates/schemas/design-tokens.schema.json`.
  - Reviewing layouts for WCAG 2.2 AA accessibility compliance and keyboard navigability.
  - Structuring above-the-fold hero sections, multi-family layout architectures, and trust anchor layouts.
  - Designing form ergonomics, accessible microcopy, and inline error recovery.
  - Specifying empty states, error fallbacks, and skeleton screens.
- **NOT to use when:**
  - Writing server-side database queries or migrations (route to `05-backend-data`).
  - Configuring CI/CD deployment pipelines or infrastructure (route to `09-devops-infra`).
  - Auditing backend API authentication tokens or headers (route to `06-security`).
  - Authoring product requirements or scoping MoSCoW priorities (route to `01-product-discovery`).

---

## Inputs and Outputs

- **Inputs:**
  - `prd.schema.json` from `01-product-discovery` (Personas, user stories, feature Must-Haves).
  - Brand parameters, target conversion action, and competitive context.
- **Outputs:**
  - `DESIGN.md` (Open Design System contract published to workspace root).
  - UI Component specifications and page structure wireframes with explicit Taste Profile and Dials.
  - Design tokens contract conforming to `templates/schemas/design-tokens.schema.json`.
  - Accessibility audit report certifying WCAG 2.2 AA compliance (`templates/schemas/a11y-audit.schema.json`).
  - Section 14 Pre-Flight Check sign-off matrix for all pages.
  - 5-State lifecycle matrices for all dynamic screens.

---

## Decision Rules

1. **Open-Design `DESIGN.md` Contract Rule:**
   - *Always* generate or update `DESIGN.md` at the workspace root as the single source of truth for visual styles across AI coding agents *because* code models require unambiguous, machine-readable design contracts for typography, color ramps, surfaces, and component states [BEST PRACTICE: OPEN-DESIGN-NEXU].
2. **Brief Inference & Mandatory Design Read Rule (taste-skill Section 0):**
   - *Always* declare a concise, one-line `[Design Read]` before writing markup: `[Design Read]: <Page Kind> | ICP: <Target Audience> | Vibe: <Mood Keywords> | Dials: [V=<1-10>, M=<1-10>, D=<1-10>] | Profile: <Taste Profile>` *because* jumping directly to code causes AI models to converge on default generic templates [BEST PRACTICE: TASTE-SKILL-LEONXLNX].
3. **Quantitative Design Dials Rule (taste-skill Section 1):**
   - *Always* configure the 3 core dials (1–10) tailored to the project domain:
     - **`DESIGN_VARIANCE` (1–10):** 1–3 for symmetric corporate/fintech; 4–6 for balanced SaaS; 7–10 for asymmetric editorial/creative.
     - **`MOTION_INTENSITY` (1–10):** 1–3 for static/subtle hover; 4–6 for tactile micro-interactions; 7–10 for physics spring/scroll motion.
     - **`VISUAL_DENSITY` (1–10):** 1–3 for airy luxury whitespace; 4–6 for standard product SaaS; 7–10 for compact developer cockpits.
4. **Taste Profile Selection Rule (Anti-Slop):**
   - *Always* commit to exactly one of the **4 Curated Taste Profiles** before writing markup:
     - **Minimalist:** Monochromatic discipline (zinc/slate), crisp 1px borders, generous whitespace, document-style density.
     - **Industrial-Brutalist:** High-contrast mechanical typography (`font-mono tracking-tight`), exposed structural grid borders, uppercase category tags, dark base with single safety-orange or amber accent.
     - **Editorial:** High typographic contrast (`font-serif` display headings paired with clean sans body), asymmetric magazine pull-quotes, hairline horizontal dividers.
     - **Soft-Consumer:** Tactile consumer warmth, organic corner radii (`rounded-2xl`), subtle layered elevation shadows, spring micro-interactions.
5. **Strict Anti-Slop & Zero Em-Dash Copy Rule:**
   - *Never* emit signature AI code or copy tells:
     - **Zero Em-Dashes:** Absolute prohibition on em-dashes (`—`) or en-dashes (`–`) in web copy; use periods, colons, or clean phrasing.
     - **No Gradient Soup:** No purple-to-blue background gradients (`from-blue-500 to-purple-600`).
     - **No Pill Badges:** No overhead decorative pill badges centered over a 3-line headline (`✨ AI-Powered Magic`).
     - **No Eyebrow Numbers:** No section-numbering eyebrows (`01. / 02.`); use concise uppercase category tags.
     - **No Cliché Grids:** No symmetrical 3-column feature cards with identical centered circle icon boxes.
     - **No Div Screenshots:** No fake window buttons (`red/yellow/green dots`) wrapping static text.
6. **Layout Family Diversity Rule (taste-skill):**
   - *Always* compose at least **4 distinct layout families** per page (e.g. Asymmetric Split Hero, Bento Grid with varied cell spans, Alternating Flow, Metrics Strip, Sticky Narrative, Tabbed Workbench); *never* repeat identical card grids across sections.
7. **Hero Section Discipline Rule (taste-skill):**
   - Headline strictly bounded to maximum 2 lines on desktop viewports.
   - Subheadline strictly under 20 words directly addressing the primary customer objection.
   - Primary CTA strictly visible above the fold without scrolling, with tactile press state (`active:scale-[0.98]`).
   - Hero container anchored with `min-h-[100dvh]` or disciplined viewport scaling.
8. **Type Scale Snapping Rule (Part C):**
   - *If* applying typography, *mandate* that all font sizes resolve directly to standard scale steps (`xs: 12px`, `sm: 14px`, `base: 16px`, `lg: 18px`, `xl: 20px`, `2xl: 24px`, `3xl: 30px`, `4xl: 36px`, `5xl: 48px`); *never* use arbitrary sizes like `text-[19px]` [BEST PRACTICE: AI-DESIGN-SKILLS-ELAYA, TAILWIND-TYPE-SCALE].
9. **Systematic Spacing Rhythm & Proximity Rule (Part C):**
   - *If* setting margins, paddings, or gaps, *mandate* strict snapping to the 4px/8px modular token scale (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `80px`); *never* invent arbitrary offsets like `p-[13px]`.
   - *Enforce* proximity grouping: related sub-elements stay close (`8-12px`), while distinct structural sections have generous breathing room (`48-80px`).
10. **Surface Hierarchy & Anti-Gradient-Soup Rule (Part C):**
    - *If* designing surfaces, *limit* interface backgrounds to 3 clean architectural layers (Base background, Raised surface, Overlay/Modal) with crisp 1px borders; *never* deploy muddy gradient soup.
11. **Contrast Ratio Rule (WCAG 2.2 SC 1.4.3):**
    - *If* displaying body text (<18pt or <14pt bold), *mandate* a minimum contrast ratio of **4.5:1** against its background; for large text and UI controls/icons, *mandate* **3:1** [FACT: WCAG-2-2].
12. **Touch Target Size & Visible Focus Rules (WCAG 2.2 SC 2.5.8, 2.4.7):**
    - *Mandate* minimum target area of **44x44 CSS pixels** for interactive controls.
    - *Never* use `outline: none` without providing an equal or higher-contrast visible custom focus ring (`outline: 2px solid var(--border-focus); outline-offset: 2px;`).
13. **Dynamic Media & UGC Contrast Anchor Rule:**
    - *If* rendering text over dynamic photography, video backgrounds, or user-generated content, *mandate* automated contrast anchors (dark gradient scrim `bg-gradient-to-t from-black/80 via-black/40 to-transparent`, `backdrop-blur-md` surface container, or high-contrast drop-shadow) *because* dynamic media without dedicated scrim layers inevitably causes WCAG 1.4.3 contrast failures.
14. **3D WebGL / Canvas Accessibility Overlay Rule:**
    - *If* deploying interactive 3D WebGL, Three.js, Spline, or Canvas visualizers, *mark* the canvas canvas element `aria-hidden="true"` and `tabindex="-1"`, and *construct* a semantic HTML DOM overlay for all interactive controls, labels, and keyboard focus states.
15. **Brand Exception & Escape Hatch Protocol:**
    - *If* an established corporate brand identity mandates colors or patterns that conflict with anti-slop defaults, *record* an `ACCEPTED-RISK: BRAND-IDENTITY` in `DECISIONS.md` with explicit user sign-off *never* compromise without documentation.
16. **The 7-State Component Lifecycle Rule:**
    - *Always* specify 7 discrete states (Idle, Hover, Active/Pressed `scale(0.97)`, Focus-Visible with `outline-offset`, Loading with dimension reservation, Disabled with `aria-disabled`, Error with recovery text) for all interactive components *because* incomplete component states cause layout shift (CLS) and inaccessible controls.
17. **Visual Dominance 2:1 & Cognitive Scanpath Rule:**
    - *Always* ensure the primary CTA has $\ge 2\times$ the visual dominance index (contrast $\times$ area $\times$ saturation) of any secondary link *because* competing visual weights produce decision paralysis.
18. **Fluid Typography (`clamp()`) & Tabular Numerals:**
    - *Always* leverage CSS `clamp()` formulas for fluid responsive typography from 375px to 1440px; *mandate* `font-variant-numeric: tabular-nums` on all metrics, counters, and prices to eliminate layout jitter.
19. **Spring Physics Motion Rule:**
    - *Always* employ physically modeled spring curves (`--spring-snap`, `--spring-smooth`) with tactile press squish (`scale(0.97)`) *never* robotic `transition: all 0.2s ease`.
20. **Gestalt Spatial Enclosure & Proximity Ratio Rule:**
    - *Always* enforce the 2:1 proximity ratio where margins between distinct layout groups are $\ge 2\times$ the internal padding between related elements; *mandate* explicit common region containers (`border border-subtle bg-surface rounded-xl`) for grouping heterogeneous content [GESTALT-PSYCHOLOGY].
21. **The 60-30-10 Perceptual Color Harmony Rule:**
    - *Always* balance interface color across 60% dominant base surface (`--bg-base`), 30% structural text/borders (`--text-1`, `--border-subtle`), and 10% high-contrast accent (`--accent-primary`); *never* deploy clashing multi-hue palettes without an accepted risk [ITTEN-COLOR-THEORY].
22. **Micro-Typographic Measure & Optical Rhythm Rule:**
    - *Always* constrain long-form reading lines to 45–75 characters (`max-w-[65ch]`); *mandate* inverse leading (tight 1.05–1.15 on display headings, comfortable 1.5–1.65 on body text) and activate `font-variant-numeric: tabular-nums` on all tabular and pricing data [BRINGHURST-TYPOGRAPHY, MULLER-BROCKMANN-GRIDS].

---

## Procedure

### Step 1: Brief Inference, Design Read & Dial Tuning (taste-skill Section 0 & 1) [MVP] [PROD] [SCALE]
1. Parse the project domain, audience, and intent to emit the mandatory one-line `[Design Read]`.
2. Configure the 3 quantitative dials (`DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY` 1–10).
3. Lock exactly ONE Taste Profile and primary color roles: base background, high-contrast foreground, and single sharp accent color (e.g. `#cb3837` npm red or `#0969da` blue). Zero ambient gradient mesh.
*(See detailed archetype presets in `skills/03-ux-ui-design/references/taste-skill-guide.md` and theoretical foundations in `skills/03-ux-ui-design/references/design-theory-reference.md`)*.

### Step 2: Strategic Single-Batch Intake & Outcome Architecture [MVP] [PROD] [SCALE]
1. Gather the 4 essential context items in ONE single batch before writing UI code:
   - **Purpose:** Identify the *one* primary conversion action (e.g. Start Trial, Book Demo, Waitlist, Buy).
   - **Audience:** Formulate the exact ICP persona, their #1 painful problem, and their top 3 objections.
   - **Proof Points:** Collect concrete proof (customer logos, quantifiable case study metrics, ratings).
   - **Page Flow:** Structure narrative order using at least 4 distinct layout families.

### Step 3: Bounded Hero Section & Multi-Family Layout Composition [MVP] [PROD] [SCALE]
1. Construct the hero section using strict outcome-driven visual hierarchy:
   - **Headline:** Outcome-driven value, bounded to $\le 2$ lines.
   - **Subheadline:** Clear sentence under 20 words directly addressing the primary objection.
   - **Primary Action:** Dominant CTA button with high contrast and tactile affordance (`active:scale-[0.98]`).
   - **Trust Anchor:** Social proof immediately adjacent to the CTA without floating badges.
2. Compose the remaining sections across $\ge 4$ diverse layout families (Asymmetric Split, Bento Grid, Alternating Flow, Metrics Strip).

### Step 4: Token Contract & Authoring DESIGN.md (Part C) [MVP] [PROD] [SCALE]
1. Author or update `DESIGN.md` at workspace root defining:
   - Active Taste Profile, quantitative dials, dual-theme OKLCH color ramps (`--bg-base`, `--bg-surface`, `--text-primary`), Zero-FOUC `<head>` script, and container query (`@container`) layouts.
   - 12 Universal Interactive Primitives (Dialog, Dropdown, Toast, Tabs, Accordion, Input, Button, Table, Skeleton, Avatar, Tooltip, Drawer) conforming to `skills/03-ux-ui-design/references/component-primitives-reference.md`.
2. Bind all typography to the type scale (`xs: 12px` through `5xl: 48px`).
3. Snap all spacing to the 4px/8px modular rhythm (cards: `p-6` or `p-8`; gaps: `gap-3` or `gap-4`).
4. Validate design token specifications against `templates/schemas/design-tokens.schema.json`.

### Step 5: Accessible Form & Interaction Design (WCAG 2.2 AA) [MVP] [PROD] [SCALE]
1. Label every input visibly using `<label for="input-id">`; placeholder text is NOT a replacement for a `<label>`.
2. Group related options (radio buttons, checkboxes) inside `<fieldset>` with a descriptive `<legend>`.
3. Provide explicit error recovery: describe *what* went wrong and *how* to fix it directly adjacent to the invalid input with `aria-describedby="error-id"` and `aria-invalid="true"`.
4. Ensure all interactive elements have 44x44px minimum touch targets and visible focus indicators.

### Step 6: Visual Browser QA & Viewport Inspection [MVP] [PROD] [SCALE]
1. Probe rendered layout across 3 canonical viewport widths to catch LLM spatial blindness:
   - **Mobile (375px):** Verify single-column stacking, zero horizontal overflow (`w-full overflow-x-hidden`), accessible 44x44px touch targets.
   - **Tablet (768px):** Verify balanced 2-column wrapping and readable typography lines.
   - **Desktop (1440px):** Verify bounded content container (`max-w-7xl mx-auto`), optical alignment, and zero z-index clipping beneath sticky headers.
2. Verify contrast anchors over dynamic background photography or video.

### Step 7: Section 14 Final Pre-Flight Quality Gate Audit [MVP] [PROD] [SCALE]
1. Run pre-flight verification against the output before declaring work complete:
   - [ ] Is the one-line `[Design Read]` explicitly stated with dial parameters?
   - [ ] Are 0 em-dashes (`—`) or en-dashes (`–`) present in any copy?
   - [ ] Are all purple/blue background gradients and overhead floating pill badges removed?
   - [ ] Are at least 4 distinct layout families implemented across sections?
   - [ ] Is the hero headline bounded to $\le 2$ lines and subtext $< 20$ words?
   - [ ] Does body copy meet $\ge 4.5:1$ contrast and interactive controls meet $\ge 3:1$?
   - [ ] Are all 5 dynamic lifecycle states (Idle, Loading, Error, Empty, Success) explicitly designed?
   - [ ] Are all 3 canonical viewports (375px, 768px, 1440px) verified without text clipping or optical misalignment?

---

## Anti-Patterns

- **Signature AI Slop:** Blurring purple-to-blue gradients, placing centered "✨ AI-Powered" pill badges, and outputting uniform 3-card feature rows with centered circle icons.
- **Em-Dash Punctuation Leak:** Using em-dashes (`—`) in web copy, headlines, or marketing copy.
- **Repetitive Grid Fatigue:** Stacking 3 or more identical 3-card grid sections sequentially.
- **Un-dialed Generation:** Writing UI markup without declaring a Design Read or tuning the 3 design dials.
- **Undocumented Visual System:** Emitting frontend code with arbitrary styling without publishing or updating `DESIGN.md`.
- **Arbitrary Token Drift:** Inventing one-off arbitrary values (`text-[19px]`, `p-[13px]`, `rounded-[23px]`) instead of snapping to systematic design tokens.
- **Weak Hero Anatomy:** Placing vague, poetic headlines without clear outcomes, hiding the CTA below the fold, or offering 3 competing primary actions.
- **Outline None:** Stripping browser focus outlines (`*:focus { outline: none; }`) without providing high-contrast custom focus styles.

---

## Verification

Execute these automated UX/UI, conversion, and accessibility verification checks in the terminal:
1. Automated WCAG 2.2 accessibility and contrast audit via Axe/Playwright:
   ```bash
   npx playwright test e2e/a11y.spec.ts
   ```
   *Expected output:* `Accessibility Audit: PASS (0 violations for WCAG 2.2 AA)`
2. Semantic landmark and HTML structure audit:
   ```bash
   npm run lint:a11y
   ```
   *Expected output:* `Semantic HTML Lint: PASS (100% compliant landmarks and labels)`
3. Design token, type scale, and schema audit:
   ```bash
   npm test -- --filter=design-tokens
   ```
   *Expected output:* `Design Token Audit: PASS (0 arbitrary font sizes or un-snapped spacing values)`

---

## Escalate-to-User Triggers

Immediately halt and escalate to the user when:
1. Brand guidelines or marketing assets fail mandatory WCAG 2.2 AA contrast ratios and stakeholder refuses to adjust color values.
2. The user requests an ambiguous landing page with multiple competing primary conversion goals (e.g. "Buy Now", "Join Waitlist", and "Schedule Demo" all treated as primary CTAs in the hero).
3. Complex bespoke canvas or WebGL interactions cannot be made accessible to screen readers without building a parallel DOM tree.
