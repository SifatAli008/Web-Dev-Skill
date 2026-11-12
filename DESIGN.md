# Universal WebDev Skills: Design System Contract (`DESIGN.md`)

> **Single Source of Truth for Visual Design, Art Direction, and UI Tokens**  
> Conforming to `nexu-io/open-design`, `Leonxlnx/taste-skill` v2, and W3C Design Tokens Community Group standards.

---

## 1. Design Read & Active Art Direction

```text
[Design Read]: Developer Documentation & CLI Platform | ICP: Full-Stack Engineers & AI Agents | Vibe: Precision, High-Contrast, Dense Craft | Dials: [V=3, M=3, D=8] | Profile: Minimalist
```

* **Active Taste Profile:** **Minimalist** (Engineered precision, monochromatic discipline, crisp 1px borders, zero gradient soup).
* **Quantitative Dials (1â€“10 Scale):**
  * `DESIGN_VARIANCE: 3` â€” Structured, predictable document hierarchy, clear table and list alignments.
  * `MOTION_INTENSITY: 3` â€” Subtle micro-interactions, spring snap micro-physics, tactile active press scale (`0.97`).
  * `VISUAL_DENSITY: 8` â€” High-efficiency information density, compact tables, dense code snippets, tight typographic tracking.

---

## 2. Perceptual Color System: Dual-Theme OKLCH & Surface Hierarchy

We employ the **OKLCH (Perceptually Uniform Color Space)** to guarantee mathematically uniform contrast across hues, with standard sRGB fallbacks.

```css
/* Dark Mode Default (:root or :root[data-theme="dark"]) */
:root, :root[data-theme="dark"] {
  /* Surface Layers (3 Clean Architectural Layers) */
  --bg-base: #09090b;
  --bg-base-oklch: oklch(14% 0.005 250);       /* Canvas Base */
  
  --bg-surface: #141416;
  --bg-surface-oklch: oklch(18% 0.008 250);    /* Raised cards, sidebars */
  
  --bg-overlay: #1c1c1f;
  --bg-overlay-oklch: oklch(22% 0.01 250);     /* Modals, tooltips, active states */

  /* Text & Foreground (Perceptually Uniform Contrast Anchors) */
  --text-primary: #f4f4f5;
  --text-primary-oklch: oklch(98% 0.005 250);   /* Contrast 15.6:1 (WCAG AAA) */
  
  --text-secondary: #a1a1aa;
  --text-secondary-oklch: oklch(72% 0.015 250); /* Contrast 7.2:1 (WCAG AA) */
  
  --text-muted: #71717a;
  --text-muted-oklch: oklch(55% 0.02 250);      /* Contrast 4.6:1 (WCAG AA) */

  /* Structural Borders */
  --border-subtle: #27272a;                     /* 1px crisp separation */
  --border-strong: #3f3f46;                     /* High-contrast element borders */
  --border-focus: #3b82f6;
  --border-focus-oklch: oklch(62% 0.19 255);    /* Keyboard focus ring (>= 3:1) */

  /* Functional Accents (Single Sharp Hue - Zero Gradients) */
  --accent-primary: #3b82f6;                    /* Interactive CTA */
  --accent-success: #10b981;                    /* Verification PASS */
  --accent-warning: #f59e0b;                    /* Review Advisory */
  --accent-danger: #ef4444;                     /* Blocker / Hard Veto */

  /* Accessible Data Visualization (Monochromatic Sequential Palette) */
  --chart-1: oklch(62% 0.19 255);
  --chart-2: oklch(55% 0.16 255);
  --chart-3: oklch(48% 0.13 255);
  --chart-4: oklch(40% 0.10 255);
  --chart-5: oklch(32% 0.07 255);
  --chart-highlight: oklch(75% 0.18 55);        /* Amber anomaly/peak marker */
}

/* Light Mode Override (:root[data-theme="light"]) */
:root[data-theme="light"] {
  --bg-base: #fcfcfd;
  --bg-base-oklch: oklch(98.5% 0.002 250);     /* Crisp light canvas */
  --bg-surface: #ffffff;
  --bg-surface-oklch: oklch(100% 0 0);         /* Pure white raised cards */
  --bg-overlay: #f4f4f6;
  --bg-overlay-oklch: oklch(96% 0.005 250);    /* Modals, subtle highlights */

  --text-primary: #09090b;
  --text-primary-oklch: oklch(14% 0.015 250);  /* Deep slate (Contrast 16:1) */
  --text-secondary: #52525b;
  --text-secondary-oklch: oklch(45% 0.02 250); /* Subdued copy (Contrast 7:1) */
  --text-muted: #71717a;
  --text-muted-oklch: oklch(58% 0.018 250);    /* Captions (Contrast 4.6:1) */

  --border-subtle: #e4e4e7;
  --border-strong: #a1a1aa;
  --border-focus: #2563eb;
  --border-focus-oklch: oklch(55% 0.22 255);

  --accent-primary: #2563eb;
  --accent-success: #059669;
  --accent-warning: #d97706;
  --accent-danger: #dc2626;

  --chart-1: oklch(55% 0.22 255);
  --chart-2: oklch(65% 0.18 255);
  --chart-3: oklch(75% 0.14 255);
  --chart-4: oklch(82% 0.10 255);
  --chart-5: oklch(88% 0.06 255);
  --chart-highlight: oklch(65% 0.20 45);
}

/* High Contrast Mode Override */
@media (prefers-contrast: more) {
  :root {
    --border-subtle: currentColor;
    --border-strong: currentColor;
  }
}
```

### Zero-FOUC (Flash of Unstyled Content) Theme Initialization
Every web application must place this synchronous script inside the `<head>` prior to any stylesheet or body rendering:
```html
<script>
  (function() {
    try {
      var t = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", t);
    } catch (e) {}
  })();
</script>
```

---

## 3. Fluid Typography & Modular Spacing Math

We use mathematical CSS `clamp()` formulas to provide smooth scaling from mobile (`375px`) to wide desktop (`1440px`) without abrupt breakpoint snaps.

### A. Font Families & Numeric Invariants
* **Primary Sans (UI & Prose):** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`
* **Metadata & Code:** `JetBrains Mono`, `Fira Code`, `ui-monospace`, `monospace`
* **Tabular Numeral Invariant:** All statistics, metrics, prices, and timer values must enforce `font-variant-numeric: tabular-nums` to eliminate layout jitter.

### B. Fluid Type Scale (`clamp()`)
| Token | Mathematical Fluid Formula | Desktop Bound | Line Height | Usage |
|---|---|---|---|---|
| `text-xs` | `0.75rem` (12px fixed) | 12px | 16px | Badges, metadata tags |
| `text-sm` | `0.875rem` (14px fixed) | 14px | 20px | Secondary captions, form notes |
| `text-base`| `clamp(0.9375rem, 0.9rem + 0.25vw, 1rem)` | 16px | 24px | Standard body copy |
| `text-lg` | `clamp(1.0625rem, 1rem + 0.35vw, 1.125rem)` | 18px | 28px | Lead text, card headers |
| `text-xl` | `clamp(1.125rem, 1rem + 0.6vw, 1.25rem)` | 20px | 28px | Section titles |
| `text-2xl` | `clamp(1.35rem, 1.1rem + 1.2vw, 1.5rem)` | 24px | 32px | Major component headings |
| `text-3xl` | `clamp(1.65rem, 1.3rem + 1.8vw, 1.875rem)`| 30px | 36px | Page titles |
| `text-4xl` | `clamp(2rem, 1.4rem + 3.2vw, 2.75rem)` | 44px | 48px | Hero display titles (Max 2 lines) |

### C. Fluid Spacing Rhythm
* `space-section-y: clamp(2.5rem, 1.5rem + 4.5vw, 5rem)` â€” Smooth vertical breathing room between major sections.
* `space-container-x: clamp(1rem, 0.5rem + 2.5vw, 3rem)` â€” Adaptive gutter margins.
* Snapped sub-units: `4px`, `8px`, `12px`, `16px`, `24px` (Card padding), `32px`.

### D. Container Query Architecture (`@container`)
For modular UI components (cards, stat widgets, interactive panels), responsive adaptation must depend on the parent container width rather than the global viewport window:

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

/* Default Compact View: Vertical Stack */
.card-inner {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Horizontal Split: Container >= 380px */
@container card (min-width: 380px) {
  .card-inner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

/* Multi-Column Data View: Container >= 600px */
@container card (min-width: 600px) {
  .card-inner {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 24px;
  }
}
```

---

## 4. Spring Physics Motion Architecture

We replace robotic `ease-in-out` transitions with physically modeled spring curves:

```css
:root {
  /* Fast interactive snap for buttons, toggles, chips */
  --spring-snap: cubic-bezier(0.16, 1, 0.3, 1);
  --spring-snap-duration: 180ms;

  /* Smooth layout transition for accordions, modals, navigation drawers */
  --spring-smooth: cubic-bezier(0.25, 1, 0.5, 1);
  --spring-smooth-duration: 320ms;

  /* Expressive dynamic micro-interactions (Soft-Consumer profile) */
  --spring-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

* **Tactile Press Squish:** Every interactive button must implement `:active { transform: scale(0.97); transition: transform var(--spring-snap-duration) var(--spring-snap); }`.

---

## 5. The 7-State Component Lifecycle Matrix

Every interactive component contract must explicitly implement and test **7 discrete states**:

1. **Idle / Default:** Calm baseline affordance with 1px border.
2. **Hover:** Surface brightness increases by 8% or border transitions to `--border-strong`.
3. **Active / Pressed:** Physical squish (`scale(0.97)`) with instantaneous tactile response.
4. **Focus-Visible:** Accessible 2px solid `--border-focus` with 2px `outline-offset` (keyboard only).
5. **Loading / Pending:** Dedicated spinner or shimmer reserving dimensions to guarantee **Zero CLS** (Cumulative Layout Shift).
6. **Disabled:** Communicated via `aria-disabled="true"` with keyboard discoverability and contextual tooltip explanation (avoiding dead HTML `disabled` attributes).
7. **Error / Invalid:** Explicit recovery microcopy with `aria-invalid="true"` and `aria-describedby`.

---

## 6. Cognitive Scanpath & Visual Dominance Budgeting

1. **Visual Dominance 2:1 Rule:** The primary Call-to-Action button must possess at least **$2\times$ the calculated visual weight** (contrast $\times$ area $\times$ saturation) of any secondary link.
2. **Cognitive Eye-Tracking Flow:** Sections must strictly follow an outcome-driven scanpath:
   $$\text{Hero Value Proposition} \longrightarrow \text{Proof Strip} \longrightarrow \text{Interactive Workbench} \longrightarrow \text{Objection Killer} \longrightarrow \text{Frictionless Action}$$
3. **Dynamic Media Contrast Anchors:** Whenever text overlays photography or video, apply a directional dark gradient scrim (`linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)`) or a frosted surface container (`backdrop-filter: blur(12px)`).
4. **WCAG 2.2 Level AA Gate:** Body contrast $\ge 4.5:1$, controls $\ge 3:1$, touch targets $\ge 44\times 44\text{px}$, visible focus indicator.

---

## 7. Design Theory Foundations & Gestalt Spatial Architecture

Conforming to classical visual science (MÃ¼ller-Brockmann, Bringhurst, Itten, Wertheimer, Somers APCA):

1. **Gestalt Spatial Hierarchy (The 2:1 Proximity Ratio):**
   - Margin between unrelated layout blocks must be $\ge 2\times$ the internal padding of elements (`gap-6` outer vs `gap-3` inner).
   - Use explicit common region containers (`bg-surface`, `border border-subtle`, `rounded-xl`) to bind heterogeneous content chunks.
2. **The 60-30-10 Perceptual Color Composition Rule:**
   - **60% Dominant Base:** Background canvas and primary surface fills (`--bg-base`, `--bg-surface`).
   - **30% Structural Secondary:** Typography, borders, icons, secondary containers (`--text-primary`, `--border-subtle`).
   - **10% High-Contrast Accent:** Primary conversion CTA, active states, key data visualization markers (`--accent-primary`).
3. **Typographic Measure & Optical Rhythm:**
   - Long-form prose must be constrained to the optimal 45â€“75 character measure (`max-w-[65ch]`).
   - Inverse leading: display titles enforce tight line-height ($1.1\text{â€“}1.2$); body copy enforces reading line-height ($1.5\text{â€“}1.65$).
   - Activate OpenType features (`font-feature-settings: "cv02", "cv03", "cv04", "cv11", "ss01"`) and hanging punctuation for pull-quotes (`hanging-punctuation: first allow-end`).
4. **8-Point Modular Spatial Grid:**
   - All spacing, margins, paddings, and component heights resolve to integer multiples of $8\text{px}$ (with $4\text{px}$ strictly reserved for micro-adjustments).
5. **APCA Perceptual Contrast Standard:**
   - Body copy ($16\text{px}$, normal weight): Target $L^c \ge 75$.
   - Large headings ($32\text{px}+$, bold): Target $L^c \ge 60$.
   - Interactive controls & secondary text: Target $L^c \ge 45$.

---

## 8. Craft Micro-Interactions, Textures & Depth

Physical, tactile craft distinguishes intentional design from flat synthetic templates.

### A. Cursor-Tracking Spotlight Border
Subtle dynamic lighting responds to cursor proximity without continuous JavaScript layout recomputation:

```css
.spotlight-card {
  position: relative;
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  overflow: hidden;
}

.spotlight-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    400px circle at var(--mouse-x, -999px) var(--mouse-y, -999px),
    oklch(from var(--accent-primary) l c h / 0.12),
    transparent 40%
  );
  pointer-events: none;
  transition: opacity 300ms ease;
  opacity: 0;
}

.spotlight-card:hover::before {
  opacity: 1;
}
```

### B. Tactile Noise Micro-Texture (`feTurbulence`)
Breaks digital color banding and adds subtle tactile materiality to surfaces:

```css
.texture-grain {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.035'/%3E%3C/svg%3E");
}
```

### C. Frosted Architectural Glassmorphism
Clean multi-layer diffusion with high-contrast rim lighting:

```css
.glass-surface {
  background: oklch(from var(--bg-surface) l c h / 0.72);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid oklch(100% 0 0 / 0.12);
  box-shadow: 0 4px 24px -1px oklch(0% 0 0 / 0.08);
}
```

### D. Sliding Segmented Pill Motion
Tabs, toggles, and view filters utilize a continuous spring-physics sliding pill indicator:

```css
.segmented-pill {
  position: relative;
  display: inline-flex;
  padding: 4px;
  background: var(--bg-base);
  border-radius: var(--radius-full);
  border: 1px solid var(--border-subtle);
}

.segmented-indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  border-radius: var(--radius-full);
  background: var(--bg-surface);
  box-shadow: 0 1px 3px oklch(0% 0 0 / 0.1);
  transition: transform var(--spring-snap-duration) var(--spring-snap),
              width var(--spring-snap-duration) var(--spring-snap);
}
```

---

## 9. Optical Iconography & Asset Precision

1. **Stroke Weight Standardization:**
   - Desktop standard: `1.5px` (crisp, elegant, high-density).
   - Mobile / Touch target: `2.0px` (optical punch, tactile clarity).
   - Never mix stroke weights across the same visual container.
2. **Standardized Bounding Boxes:**
   - **16x16px (Micro):** Status badges, inline meta tags, table row icons (12px visual graphic).
   - **20x20px (Action):** Form inputs, buttons, dropdown triggers (16px visual graphic).
   - **24x24px (Navigation):** Header navigation, section anchors, modal headers (20px visual graphic).
3. **Optical Centering & Centroid Offsets:**
   - Asymmetric icons (e.g. Play triangle `â–¶`, right chevron `â€º`) must be shifted $+1\text{px}$ to $+1.5\text{px}$ along the directional axis to align the geometric centroid with the visual weight center.
   - Circular icons must render $\sim 10\%$ larger than square glyphs in the same box to balance perceived area.
4. **Accessible Inline SVG Contract:**
   ```html
   <!-- Decorative Icon -->
   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
     <path d="M5 12h14M12 5l7 7-7 7"/>
   </svg>
   ```

---

## 10. Accessible Data Visualization & Charts

1. **Sequential & Categorical Palette Tokens (OKLCH):**
   ```css
   :root {
     --chart-1: oklch(65% 0.18 250); /* Primary blue */
     --chart-2: oklch(70% 0.16 190); /* Cyan/Teal */
     --chart-3: oklch(75% 0.18 145); /* Emerald */
     --chart-4: oklch(75% 0.18 70);  /* Amber */
     --chart-5: oklch(65% 0.22 30);  /* Coral */
     --chart-highlight: oklch(70% 0.24 330); /* Magenta callout */
     --chart-grid: oklch(from var(--border-subtle) l c h / 0.5);
   }
   ```
2. **Multi-Sensory Non-Color Encoding:**
   - Never rely on color alone to communicate data series.
   - Line charts must use distinct geometric point markers (circle `â—`, square `â– `, triangle `â–²`) and stroke patterns (`solid`, `dashed`, `dotted`).
   - Line endpoints must feature direct text labels rather than disconnected legend tables.
3. **Screen Reader Accessible Fallback (`sr-only` Data Table):**
   - Every graphical canvas or SVG chart must feature an adjacent accessible table for assistive technology:
   ```html
   <div role="region" aria-label="Quarterly Revenue Chart">
     <svg aria-hidden="true" class="chart-canvas"><!-- visual chart --></svg>
     <table class="sr-only">
       <caption>Quarterly Revenue 2026</caption>
       <thead><tr><th>Quarter</th><th>Revenue ($M)</th></tr></thead>
       <tbody><tr><td>Q1</td><td>4.2</td></tr><tr><td>Q2</td><td>5.8</td></tr></tbody>
     </table>
   </div>
   ```

---

## 11. 12 Atomic Component Architecture Specification

All interactive UI widgets must implement the canonical accessibility, DOM structure, and interaction contracts specified in `skills/ux-ui-design/references/component-primitives-reference.md`:

| Primitive | Primary ARIA Semantics | Keyboard Triggers | Focus Management Contract |
| :--- | :--- | :--- | :--- |
| **1. Dialog** | `role="dialog" aria-modal="true"` | `Escape` dismisses | Traps focus; restores focus to trigger on close |
| **2. Dropdown** | `role="menu"` on list, `aria-haspopup="menu"` | `Enter`, `Space`, `ArrowUp/Down` | Traps focus in menu; wraps arrow traversal |
| **3. Toast** | `role="region" aria-live="polite"` | Auto-dismiss, Undo button | Non-blocking; pauses countdown timer on hover |
| **4. Tabs** | `role="tablist"` + `role="tab"` + `role="tabpanel"` | `ArrowLeft`, `ArrowRight` | Selection follows focus; sliding pill motion |
| **5. Accordion** | `<details>` / `<summary>` or `aria-expanded` | `Enter`, `Space` | Smooth CSS Grid 0fr $\rightarrow$ 1fr height animation |
| **6. Input Field** | Visible `<label for="...">`, `aria-invalid` | Native form controls | Direct adjacent error message recovery copy |
| **7. Button** | `<button type="button|submit">` | `Enter`, `Space` | Tactile spring squish (`scale(0.97)` on `:active`) |
| **8. Table** | `<table>` with `<thead>`, `<tbody>`, `tabular-nums` | Table navigation | Sticky headers, row hover affordance, horizontal scroll shadow |
| **9. Skeleton** | `role="status" aria-busy="true"` | None | Zero-CLS dimension-reserving shimmer recipe |
| **10. Avatar** | `role="img" aria-label="Name"` | None | Uppercase initials error fallback, status ring dot |
| **11. Tooltip** | `role="tooltip"` bound by `aria-describedby` | Hover or focus | Grouped 0ms delay on adjacent elements; viewport clamp |
| **12. Drawer** | `role="dialog" aria-modal="true"` | `Escape`, swipe gesture | Slide-in transform with safe-area inset compensation |

