# UX/UI Design & WCAG 2.2 AA Quality Checklist

> **Authority:** UX/UI & Accessibility Lead (`03-ux-ui-design`) — A11y Gate  
> **Scope:** Interface Craft, Leonxlnx Taste-Skill Anti-Slop, and WCAG 2.2 AA Accessibility Compliance

---

- [ ] **1. Brief Inference & Taste Profile (taste-skill Section 0 & 1):**
  - [ ] Was a one-line `[Design Read]` explicitly stated before generating UI code?
  - [ ] Are quantitative dials configured (`DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY` 1–10)?
  - [ ] Is exactly one Taste Profile active (Minimalist, Industrial-Brutalist, Editorial, or Soft-Consumer)?
  - [ ] Is `DESIGN.md` published or updated at the repository root?

- [ ] **2. Anti-Slop & Copy Discipline:**
  - [ ] Are 0 em-dashes (`—`) or en-dashes (`–`) present in any copy, headings, or microcopy?
  - [ ] Are all generic purple-to-blue background gradients completely removed?
  - [ ] Are overhead centered "✨ AI-Powered" pill badges forbidden?
  - [ ] Are numbered section eyebrows (`01. / 02.`) replaced with semantic category tags?
  - [ ] Are div-based fake screenshot window dots (`red/yellow/green`) completely eliminated?
  - [ ] Are fake customer testimonials with 5 yellow stars removed?

- [ ] **3. Layout Diversity & Hero Section Discipline:**
  - [ ] Does the page compose at least 4 distinct layout families without repeating identical card grids?
  - [ ] Is the primary hero headline bounded to a maximum of 2 lines?
  - [ ] Is the hero subheadline under 20 words, directly answering the #1 user objection?
  - [ ] Is the primary CTA button strictly visible above the fold without scrolling?
  - [ ] Does the hero section maintain responsive vertical boundaries (`min-h-[100dvh]` on mobile)?

- [ ] **4. Design Tokens, Fluid Math & Visual Hierarchy:**
  - [ ] Do typography and spacing leverage fluid CSS `clamp()` formulas for seamless responsive transitions?
  - [ ] Do all statistics, timers, and prices enforce `font-variant-numeric: tabular-nums`?
  - [ ] Does the primary CTA possess at least $2\times$ the calculated visual dominance index over secondary links?
  - [ ] Do interactive buttons implement tactile spring squish (`:active { transform: scale(0.97); }`)?
  - [ ] Are surfaces restricted to 3 clean architectural layers (Base, Surface, Overlay) with 1px borders?
  - [ ] Are corner radii strictly coordinated (`rounded-sm` for tags, `rounded-md` for buttons, `rounded-lg` for cards)?

- [ ] **5. WCAG 2.2 Level AA Accessibility Gates:**
  - [ ] Does body copy achieve at least 4.5:1 contrast against its background?
  - [ ] Do interactive controls, borders, and icons achieve at least 3:1 contrast?
  - [ ] Are all touch targets at least 44x44 CSS pixels (or 24x24px with adequate spacing)?
  - [ ] Is `outline: none` strictly forbidden unless replaced with a visible high-contrast focus ring?
  - [ ] Is the entire interface fully operable via keyboard (`Tab`, `Enter`, `Space`, `Escape`)?
  - [ ] Do dynamic video/image backgrounds use contrast scrims or backdrop blurs to guarantee text legibility?

- [ ] **6. The 7-State Component Lifecycle & Form Ergonomics:**
  - [ ] Are all 7 discrete states explicitly designed: Idle, Hover, Active (`scale(0.97)`), Focus-Visible, Loading (Zero CLS), Disabled (`aria-disabled`), and Error?
  - [ ] Does every form input have a visible `<label for="...">` element?
  - [ ] Do form validation errors clearly state *what* is wrong and *how* to fix it?

- [ ] **7. Design Theory & Spatial Science Verification:**
  - [ ] Does spacing enforce the Gestalt 2:1 proximity ratio (outer group margin $\ge 2\times$ inner element padding)?
  - [ ] Is color balanced according to the 60-30-10 rule (60% base canvas, 30% structural text/borders, 10% accent)?
  - [ ] Is reading copy bounded to the optimal 45–75 character measure (`max-w-[65ch]`)?
  - [ ] Does line-height scale inversely with font size (1.1–1.2 on display headings, 1.5–1.65 on body)?
  - [ ] Do all spacing and component dimensions snap to the 8-point modular grid (4px micro-adjustments)?
  - [ ] Does text contrast satisfy APCA perceptual criteria ($L^c \ge 75$ body, $L^c \ge 60$ headings)?

- [ ] **8. Atomic Components, Dual-Theme & Container Query Verification:**
  - [ ] Are UI components built on the 12 universal primitives in `skills/03-ux-ui-design/references/component-primitives-reference.md`?
  - [ ] Does dark/light theming implement OKLCH perceptual tokens with a Zero-FOUC inline script in HTML `<head>`?
  - [ ] Are modular card/widget responsive adaptations powered by CSS Container Queries (`@container`)?
  - [ ] Do interactive elements feature tactile micro-interactions (spring curves, spotlight borders, sliding pill motion)?
  - [ ] Are icons standardized to 16/20/24px bounding boxes with consistent 1.5px/2.0px stroke and optical centering?
  - [ ] Do data visualizations utilize sequential OKLCH tokens with geometric shape markers and hidden `<table class="sr-only">` fallbacks?


