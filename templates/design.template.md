# Design System Contract (`DESIGN.md`)

> **Single Source of Truth for Visual Design, Art Direction, and UI Tokens**  
> Conforming to `nexu-io/open-design` and `Leonxlnx/taste-skill` v2 standards.

---

## 1. Design Read & Active Art Direction

```text
[Design Read]: <Page / App Kind> | ICP: <Target Audience> | Vibe: <Mood Keywords> | Dials: [V=<1-10>, M=<1-10>, D=<1-10>] | Profile: <Minimalist | Industrial-Brutalist | Editorial | Soft-Consumer>
```

* **Active Taste Profile:** `[Minimalist | Industrial-Brutalist | Editorial | Soft-Consumer]`
* **Quantitative Dials (1â€“10 Scale):**
  * `DESIGN_VARIANCE: [1-10]` (1-3: Corporate/Symmetric; 4-6: Balanced; 7-10: Asymmetric/Editorial)
  * `MOTION_INTENSITY: [1-10]` (1-3: Static/Hover; 4-6: Tactile Micro-Interactions; 7-10: Physics Springs/Scroll)
  * `VISUAL_DENSITY: [1-10]` (1-3: Airy Luxury; 4-6: Balanced SaaS; 7-10: Dense Cockpit/Data)

---

## 2. Perceptual Color System: Dual-Theme OKLCH & Surface Hierarchy

```css
/* Dark Theme (Default) */
:root, [data-theme="dark"] {
  /* Surfaces */
  --bg-base: #090d16;
  --bg-base-oklch: oklch(14% 0.02 250);
  --bg-surface: #111827;
  --bg-surface-oklch: oklch(18% 0.02 250);
  --bg-overlay: #1e293b;
  --bg-overlay-oklch: oklch(24% 0.02 250);

  /* Foreground / Text */
  --text-primary: #f8fafc;
  --text-primary-oklch: oklch(98% 0.005 250);
  --text-secondary: #94a3b8;
  --text-secondary-oklch: oklch(72% 0.02 250);
  --text-muted: #64748b;
  --text-muted-oklch: oklch(55% 0.02 250);

  /* Structural Borders */
  --border-subtle: #1e293b;
  --border-strong: #334155;
  --border-focus: #3b82f6;
  --border-focus-oklch: oklch(62% 0.22 255);

  /* Functional Accents */
  --accent-primary: #3b82f6;
  --accent-success: #22c55e;
  --accent-warning: #f59e0b;
  --accent-danger: #ef4444;
}

/* Light Theme */
[data-theme="light"] {
  /* Surfaces */
  --bg-base: #f8fafc;
  --bg-base-oklch: oklch(98% 0.005 250);
  --bg-surface: #ffffff;
  --bg-surface-oklch: oklch(100% 0 0);
  --bg-overlay: #f1f5f9;
  --bg-overlay-oklch: oklch(96% 0.008 250);

  /* Foreground / Text */
  --text-primary: #0f172a;
  --text-primary-oklch: oklch(16% 0.02 250);
  --text-secondary: #475569;
  --text-secondary-oklch: oklch(45% 0.02 250);
  --text-muted: #64748b;
  --text-muted-oklch: oklch(58% 0.02 250);

  /* Structural Borders */
  --border-subtle: #e2e8f0;
  --border-strong: #cbd5e1;
  --border-focus: #2563eb;
  --border-focus-oklch: oklch(58% 0.22 255);

  /* Functional Accents */
  --accent-primary: #2563eb;
  --accent-success: #16a34a;
  --accent-warning: #d97706;
  --accent-danger: #dc2626;
}
```

### Zero-FOUC Theme Initialization Script
Embed synchronously in HTML `<head>` before stylesheets load:
```html
<script>
  (function() {
    try {
      var saved = localStorage.getItem('theme');
      var pref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var theme = saved || pref;
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
  })();
</script>
```

---

## 3. Fluid Typography, Modular Spacing & Container Queries

* **Numeric Invariant:** All numbers, pricing, and telemetry must use `font-variant-numeric: tabular-nums`.

```css
:root {
  /* Fluid Typography Formulas (CSS clamp) */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: clamp(0.9375rem, 0.9rem + 0.25vw, 1rem);
  --text-lg: clamp(1.0625rem, 1rem + 0.35vw, 1.125rem);
  --text-xl: clamp(1.125rem, 1rem + 0.6vw, 1.25rem);
  --text-2xl: clamp(1.35rem, 1.1rem + 1.2vw, 1.5rem);
  --text-3xl: clamp(1.65rem, 1.3rem + 1.8vw, 1.875rem);
  --text-4xl: clamp(2rem, 1.4rem + 3.2vw, 2.75rem);

  /* Fluid Spacing Rhythm */
  --space-section-y: clamp(2.5rem, 1.5rem + 4.5vw, 5rem);
  --space-container-x: clamp(1rem, 0.5rem + 2.5vw, 3rem);
}
```

### Container Query Architecture (`@container`)
Responsive component adaptation based on container width rather than viewport window:
```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 380px) {
  .card-inner { flex-direction: row; }
}

@container card (min-width: 600px) {
  .card-inner { display: grid; grid-template-columns: 2fr 1fr 1fr; }
}
```

---

## 4. Spring Physics Motion Tokens

```css
:root {
  --spring-snap: cubic-bezier(0.16, 1, 0.3, 1);
  --spring-snap-duration: 180ms;
  --spring-smooth: cubic-bezier(0.25, 1, 0.5, 1);
  --spring-smooth-duration: 320ms;
}
```

* Buttons must implement tactile squish: `:active { transform: scale(0.97); }`.

---

## 5. The 7-State Component Lifecycle Matrix

Every interactive component must explicitly implement:
1. **Idle / Default**
2. **Hover**
3. **Active / Pressed** (`scale(0.97)`)
4. **Focus-Visible** (`2px solid --border-focus; outline-offset: 2px`)
5. **Loading / Pending** (Zero CLS dimension-reserving state)
6. **Disabled** (`aria-disabled="true"` with tooltip)
7. **Error / Invalid** (`aria-invalid="true"` with recovery text)

---

## 6. Anti-Slop Visual Directives & Non-Negotiables

1. **Zero Em-Dashes:** Never use em-dashes (`â€”`) or en-dashes (`â€“`) anywhere in web copy.
2. **Zero Gradient Soup:** No purple-to-blue background gradients; use solid architectural surfaces with 1px borders.
3. **Layout Family Diversity:** Compose at least 4 distinct layout families without repeating identical card grids.
4. **Hero Discipline:** Headline $\le 2$ lines, subheadline $< 20$ words, primary CTA above fold.
5. **Visual Dominance 2:1 Rule:** Primary CTA button must have at least $2\times$ visual weight over secondary links.
6. **WCAG 2.2 AA Compliance:** Body text $\ge 4.5:1$ contrast, controls $\ge 3:1$, touch targets $\ge 44\times 44\text{px}$, visible focus indicator.

---

## 7. Design Theory Foundations & Spatial Architecture

1. **Gestalt Spatial Hierarchy:** Maintain a 2:1 proximity ratio between outer section spacing and inner card padding. Group heterogeneous data inside explicit common region containers (`rounded-xl border`).
2. **60-30-10 Color Composition:** 60% dominant base canvas, 30% structural text/borders, 10% high-contrast accent.
3. **Typographic Measure & Rhythm:** Constrain reading copy to `max-w-[65ch]`. Enforce inverse leading (tight on display titles, relaxed on body). Activate `font-variant-numeric: tabular-nums` for data tables.
4. **8-Point Modular Grid:** Snap all spacing and component dimensions to multiples of 8px (4px micro).
5. **APCA Perceptual Contrast Standard:** Target $L^c \ge 75$ for body copy and $L^c \ge 60$ for large titles.

---

## 8. Craft Micro-Interactions, Textures & Depth

1. **Cursor-Tracking Spotlight Border:**
   ```css
   .spotlight-card::before {
     background: radial-gradient(
       400px circle at var(--mouse-x, -999px) var(--mouse-y, -999px),
       oklch(from var(--accent-primary) l c h / 0.12),
       transparent 40%
     );
   }
   ```
2. **Tactile SVG Noise Texture:** Micro-grain via `feTurbulence` data URI breaking digital banding.
3. **Architectural Frosted Glass:** `backdrop-filter: blur(16px) saturate(180%)` with subtle top rim light border.
4. **Sliding Segmented Pill:** Smooth indicator sliding via `var(--spring-snap)` for tablist transitions.

---

## 9. Optical Iconography & Asset Precision

1. **Stroke Standardization:** 1.5px (desktop fine) or 2.0px (mobile tactile). Consistent within context.
2. **Bounding Boxes:** 16x16px (micro tags), 20x20px (inputs/buttons), 24x24px (nav/headers).
3. **Optical Centering:** Offset directional icons (chevrons, play arrows) +1px on directional axis.
4. **Accessible Inline SVG:** Enforce `aria-hidden="true" focusable="false"` on decorative icons; explicit `aria-label` on icon-only buttons.

---

## 10. Accessible Data Visualization & Charts

1. **Sequential OKLCH Palettes:** Tokenized `--chart-1` through `--chart-5` plus `--chart-highlight`.
2. **Non-Color Multi-Sensory Encoding:** Geometric markers (circles, squares, triangles) and dash patterns (`dashed`, `dotted`).
3. **Screen Reader Accessible Fallback:** Every graphical chart paired with an adjacent `<table class="sr-only">`.

---

## 11. 12 Atomic Component Architecture Specification

Refer to `skills/ux-ui-design/references/component-primitives-reference.md` for full DOM, ARIA, and CSS contracts for:
1. **Dialog / Modal:** Focus trap, scroll lock, `aria-modal="true"`, restore focus on close.
2. **Dropdown / Popover:** Keyboard navigation (`ArrowUp/Down`, `Escape`), collision detection.
3. **Toast / Notification Stack:** Live region (`aria-live="polite"`), auto-dismiss pause on hover, actionable undo.
4. **Tabs / Segmented Control:** `role="tablist"` + `role="tab"` + `role="tabpanel"`, sliding pill indicator.
5. **Accordion / Collapsible:** Pure CSS Grid `grid-template-rows: 0fr -> 1fr` zero-JS height transition.
6. **Input Field:** Visible `<label>`, adjacent recovery microcopy, `aria-invalid` / `aria-describedby`.
7. **Button:** 5 semantic variants (Solid, Outline, Ghost, Danger, Link), tactile squish (`scale(0.97)`).
8. **Table / Data Grid:** Sticky header, tabular figures (`tabular-nums`), row hover, horizontal scroll shadow.
9. **Skeleton Screen:** Zero-CLS dimension-reserving animated shimmer.
10. **Avatar & Badge:** Deterministic initials fallback, bottom-right presence dot with cutout border.
11. **Tooltip:** Zero-delay grouping on adjacent triggers, screen-edge clamping, `role="tooltip"`.
12. **Drawer / Sheet:** Responsive slide-in from bottom/left with `env(safe-area-inset-bottom)`.

