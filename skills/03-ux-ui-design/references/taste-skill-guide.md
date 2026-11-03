# Leonxlnx Taste-Skill v2: Complete Anti-Slop Frontend Reference Guide

> **Loading Level:** L2 Reference Document  
> **Trigger Condition:** Load when conducting Brief Inference, tuning quantitative design dials (`DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY`), selecting layout families, or executing Section 14 Final Pre-Flight quality audits.  
> **Source Standard:** `Leonxlnx/taste-skill` (`design-taste-frontend`) & `nexu-io/open-design`

---

## 1. Section 0: Brief Inference & Mandatory Design Read

Before generating markup or CSS tokens, the agent must inspect the prompt context (domain, target audience, explicit keywords, technical constraints) and emit a single-line **Design Read**:

```text
[Design Read]: <Page Kind> | ICP: <Target Audience> | Vibe: <Mood Keywords> | Dials: [V=<1-10>, M=<1-10>, D=<1-10>] | Profile: <Taste Profile>
```

### Why Brief Inference Matters
AI models default to statistical convergence—producing the identical purple-indigo gradient hero with three equal feature cards. Brief inference breaks the default mode by committing to an intentional design direction before any code is generated.

---

## 2. Section 1: The Three Quantitative Design Dials (1–10 Scale)

| Dial | Scale (1–10) | Low Value (1–3) | Medium Value (4–6) | High Value (7–10) |
|---|---|---|---|---|
| **`DESIGN_VARIANCE`** | Layout predictability & asymmetry | Clean corporate symmetry, 12-column grid alignment, predictable card patterns. | Balanced editorial, mixed 2-column and 3-column rhythms. | High asymmetry, split 50/50 screens, staggered bento cells, overlapping cards, unorthodox negative space. |
| **`MOTION_INTENSITY`** | Animation & dynamic behavior | Static or subtle CSS-only `:hover` transitions (`150ms ease`). | Tactile micro-interactions: active press scale (`0.98`), smooth accordion reveals. | Physics-based spring animations, sticky scroll-triggered narratives, parallax, canvas particle dynamics. |
| **`VISUAL_DENSITY`** | Information per viewport | Airy gallery whitespace, oversized padding (`py-24`), single focal point. | Standard SaaS rhythm, balanced card padding (`p-6` to `p-8`), clear visual breathing room. | High-density developer cockpit, compact tables, small font steps (`text-xs`), dense telemetry cards. |

### Archetype Dial Presets

| Archetype | Typical Domain | `DESIGN_VARIANCE` | `MOTION_INTENSITY` | `VISUAL_DENSITY` | Recommended Taste Profile |
|---|---|---|---|---|---|
| **Developer Tools & Infrastructure** | CLI, DBs, Cloud, APIs | 3 | 2 | 8 | **Industrial-Brutalist** or **Minimalist** |
| **B2B Enterprise SaaS** | CRM, ERP, HR, Analytics | 3 | 4 | 6 | **Minimalist** |
| **High-End Consumer & Lifestyle** | Mobile apps, Wellness, D2C | 7 | 6 | 3 | **Soft-Consumer** |
| **Publishing, Media & Deep Tech** | Newsletters, Research, Essays | 8 | 4 | 5 | **Editorial** |
| **Creative Agencies & Portfolios** | Design studios, Artists, Architects | 9 | 8 | 3 | **Industrial-Brutalist** or **Editorial** |
| **FinTech & Trading** | Wallets, Exchange, Accounting | 2 | 3 | 9 | **Minimalist** or **Industrial-Brutalist** |

---

## 3. Sections 2–13: The Anti-Slop Visual Architecture

### A. Layout Family Diversity (Rule of Four)
Never stack identical layout structures sequentially. Every high-converting landing page must compose at least **4 distinct layout families**:

1. **Family 1 — Asymmetric Split Hero:** 50/50 split with headline and outcome copy on the left, live interactive component or tactile preview on the right.
2. **Family 2 — Asymmetric Bento Grid:** Multi-span grid (`col-span-2`, `row-span-2`, `col-span-1`) highlighting primary vs secondary features with differing visual weights.
3. **Family 3 — Alternating Feature Flow:** 2-column alternating zigzag (Copy left / Preview right $\rightarrow$ Preview left / Copy right) with anchored benefits.
4. **Family 4 — Metrics & Ticker Strip:** Horizontal high-contrast data bar displaying verifiable proof points (uptime, latency, active transactions).
5. **Family 5 — Sticky Narrative Walkthrough:** Left column sticky headline while right column scrolls through step-by-step product capabilities.
6. **Family 6 — Tabbed Interactive Workbench:** Segmented control switcher exposing real interface tabs (code snippet, live preview, audit log).

### B. Bounded Hero Section Discipline
- **Headline Boundary:** Maximum 2 lines on desktop viewport. Outcome-driven value, never a generic company slogan.
- **Subheadline Constraint:** Maximum 20 words directly addressing the primary user objection.
- **Primary CTA Affordance:** Distinct high-contrast button with tactile click-state (`active:scale-[0.98]`), placed strictly above the fold.
- **Viewport Anchor:** Container enforces `min-h-[100dvh]` or disciplined viewport scaling, preventing clipped layouts.

### C. Zero Em-Dash & Copy Hygiene Rule
- **Absolute Prohibition:** Never use em-dashes (`—`) or en-dashes (`–`) anywhere in user interface copy, headlines, or microcopy. Replace with periods, colons, or clean restructuring. Em-dashes in web copy are the #1 tell of raw LLM generation.
- **No Numbered Eyebrows:** Banned: `01. FEATURES` or `02. ARCHITECTURE`. Use concise, natural category tags (`INFRASTRUCTURE`, `SECURITY`, `BILLING`).
- **No Div-Based Fake Screenshots:** Never build fake macOS window buttons (`red/yellow/green dots`) containing placeholder text. Render real, interactive UI components with actual working data.

---

## 4. The 4 Curated Anti-Slop Taste Profiles

```carousel
### Profile 1: Minimalist (Linear / Notion Aesthetic)
- **Palette:** Zinc/slate monochrome (`#09090b` base, `#ffffff` text, `#27272a` borders).
- **Surfaces:** Crisp 1px solid borders, zero blur shadows, razor-sharp discipline.
- **Typography:** Neutral grotesque sans (`Inter`, `Geist`, `system-ui`), tight tracking (`tracking-tight`).
- **Accents:** Single functional accent color used strictly on active controls or states.
<!-- slide -->
### Profile 2: Industrial-Brutalist (Engineering Cockpit)
- **Palette:** Deep pitch/graphite base (`#0c0d0e`), high-visibility amber (`#f59e0b`) or safety orange (`#f97316`) accent.
- **Surfaces:** Exposed structural grid lines, visible column dividing rules, uppercase status badges.
- **Typography:** Fixed-width mono metadata (`JetBrains Mono`, `Fira Code`) paired with stark geometric sans.
- **Density:** Compact padding (`p-3` to `p-4`), dense data tables, live status indicator pings.
<!-- slide -->
### Profile 3: Editorial (Magazine & Deep-Thought Publishing)
- **Palette:** Warm paper/stone background (`#fcfbf9` light, `#141413` dark), charcoal typography (`#262624`).
- **Surfaces:** Hairline horizontal rules (`border-stone-200`), generous vertical margins, asymmetric pull-quotes.
- **Typography:** High-contrast serif display headers (`Newsreader`, `Playfair`, `Merriweather`) paired with clean editorial sans.
- **Pacing:** Asymmetrical rhythm, literary drop-caps or section footnotes, expansive whitespace.
<!-- slide -->
### Profile 4: Soft-Consumer (Tactile Modern Mobile & D2C)
- **Palette:** Warm stone/sand neutral base, saturated pastel or vibrant primary accents.
- **Surfaces:** Organic rounded corners (`rounded-2xl` to `rounded-3xl`), layered multi-stop soft ambient shadows.
- **Typography:** Friendly geometric sans with open apertures (`Plus Jakarta Sans`, `Cabinet Grotesk`).
- **Motion:** Spring micro-physics (`stiffness: 400, damping: 25`), tactile click squish, smooth pill segmented controls.
```

---

## 5. Section 14: Final Pre-Flight Quality Gate Audit Checklist

Before declaring any design deliverable complete, the agent must evaluate and explicitly sign off on this 8-point checklist:

- [ ] **1. Design Read Emitted:** A one-line `[Design Read]` was explicitly declared with ICP, vibe keywords, and dial values.
- [ ] **2. Em-Dash & Punctuation Audit:** 0 em-dashes (`—`) or en-dashes (`–`) present in any headlines, body text, or microcopy.
- [ ] **3. AI Tell Ban Enforced:** 0 purple/blue gradient backgrounds, 0 overhead floating pill badges, 0 fake window dots, 0 fake Jane Doe testimonials.
- [ ] **4. Layout Diversity ($\ge 4$ Families):** At least 4 distinct layout families implemented without repeating identical 3-card grids.
- [ ] **5. Hero Discipline:** Headline is $\le 2$ lines, subtext is $< 20$ words, and primary CTA is visible above fold.
- [ ] **6. Token Snapping (DESIGN.md):** 100% of typography, spacing, and surfaces snap to the design token scale with zero arbitrary values (`text-[19px]`, `p-[13px]`).
- [ ] **7. WCAG 2.2 AA Contrast Gate:** Body copy achieves $\ge 4.5:1$ contrast ratio; interactive controls achieve $\ge 3:1$.
- [ ] **8. 5-State Matrix Defined:** Idle, Loading, Error, Empty, and Success states are explicitly designed for all dynamic components.

---

## 6. Advanced Edge-Case Engineering & Escape Hatches

### A. Dynamic Media & UGC Contrast Solutions
When text overlays user-generated content, dynamic photographic hero banners, or video:
1. **Gradient Scrim:** Always apply a directional CSS gradient beneath text:
   `background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)`.
2. **Backdrop Blur Surface:** Wrap copy in a frosted glass container:
   `background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1)`.
3. **Contrast Drop Shadow:** Apply an optical text contrast anchor:
   `filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.9))`.

### B. 3D WebGL / Canvas Accessibility Architecture
When utilizing Three.js, Spline, or HTML5 Canvas:
- Isolate the `<canvas>` element: apply `aria-hidden="true"` and `tabindex="-1"`.
- Construct an accessible, semantic HTML DOM overlay on top of the canvas containing all text alternatives, headings, and interactive controls (`<button>`, `<a href="...">`).
- Ensure keyboard `Tab` sequence navigates the DOM overlay without getting trapped in the canvas context.

### C. Visual Browser QA (Overcoming LLM Spatial Blindness)
Never declare UI complete based purely on CSS token calculations. Inspect rendered viewports:
- **Mobile (375px):** Verify single-column layout, zero horizontal overflow scroll, 44x44px touch targets.
- **Tablet (768px):** Verify two-column wrapping, headline line-breaks, and navigation drawer behavior.
- **Desktop (1440px):** Verify `max-w-7xl` content container bounding, optical alignment, and z-index layers.

### D. Brand Exception & Escape Hatch Protocol
If an established corporate brand book explicitly mandates colors or layouts that conflict with taste-skill rules (e.g., existing brand colors or pre-existing button shapes):
- Record an explicit `ACCEPTED-RISK: BRAND-IDENTITY` entry in `DECISIONS.md`.
- Document the stakeholder approval and preserve brand consistency while maintaining WCAG 2.2 AA contrast standards.


