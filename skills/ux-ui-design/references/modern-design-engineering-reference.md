# Modern Design Engineering & Craft UI/UX Reference

> **Loading Level:** L2 Operational Reference Guide  
> **Load Condition:** Load when architecting hero sections, composing 3D/WebGL canvases, implementing craft micro-interactions (spotlight cards, animated tabs), choreographing GSAP motion, designing wireframe information architecture, or tuning utilitarian SaaS tool interfaces.  
> **Authoritative Sources:** [BEST PRACTICE: OPENHERO-ARCHETYPES], [BEST PRACTICE: 21ST-DEV-REGISTRY], [FACT: GSAP-GREENSOCK], [BEST PRACTICE: THREEUI-3D-COMPONENTS], [BEST PRACTICE: SCENEAI-SPATIAL], [BEST PRACTICE: TOOLFOLIO-ERGONOMICS], [BEST PRACTICE: DRAFTLY-UX-FLOWS], [BEST PRACTICE: TASTESKILL-DEV], [BEST PRACTICE: SUPERDESIGN-SYSTEMS]

---

## 1. Pillar 1: OpenHero Architecture & Hero Section Engineering (`openhero.art`)

Hero sections determine 80% of visitor conversion. Never emit a generic centered headline over a stock photo or floating purple gradient mesh. Commit to one of the **6 OpenHero Archetypes**:

```markdown
Rule: Hero headline must be <= 2 lines on desktop viewport. Subheadline must be < 20 words outcome-driven. Primary CTA must sit strictly above the fold.
```

### The 6 Proven Hero Archetypes

| Archetype | Layout Geometry | Dominant Assets | Ideal Domain |
|---|---|---|---|
| **1. Asymmetric Split Hero** | 50/50 horizontal split (Headline left, Live interactive widget right) | Functional component preview (live calculator, working form, interactive code snippet) | Developer Tools, B2B SaaS, FinTech |
| **2. Floating UI Showcase** | Single-column centered headline with stacked/cascading elevated interface cards | 3-layer floating UI cards with OKLCH depth shadows and subtle parallax | Collaboration tools, Project management |
| **3. Command Palette Hero** | Minimalist document layout with interactive search/CLI prompt above fold | Working keyboard input (`Cmd+K` / search trigger) returning instant mock results | Developer APIs, Utilities, Search engines |
| **4. Editorial Typographic** | High-contrast serif display with asymmetric pull-quotes and hairline borders | Display typography (`font-serif`), italic accents, literary drop-caps | Media, Newsletters, Deep tech, Research |
| **5. 3D Spatial Canvas Hero** | Full-bleed interactive 3D WebGL background with high-contrast DOM overlay | Three.js / R3F particle field, geometric spatial element, SceneAI mesh lighting | Creative studios, AI platforms, Next-gen tech |
| **6. Bento Showcase Hero** | Headline stacked above multi-cell bento preview grid (`col-span-2`, `row-span-2`) | Live telemetry tiles, metric counters, visual interactive micro-widgets | Analytics platforms, Observability, Portfolios |

### OpenHero Asymmetric Split Hero Blueprint (HTML & CSS)

```html
<section class="hero-split-container">
  <div class="hero-content">
    <div class="hero-badge">INFRASTRUCTURE REPUTATION</div>
    <h1 class="hero-title">Automate compliance across all cloud environments</h1>
    <p class="hero-subtitle">Continuous multi-cloud security scanning with instant evidence collection and automated audit logs.</p>
    <div class="hero-cta-group">
      <button type="button" class="btn-primary">Start Security Audit</button>
      <button type="button" class="btn-secondary">Explore Documentation</button>
    </div>
    <div class="hero-proof-strip">
      <span>Verified across AWS, GCP, and Azure</span>
      <span>•</span>
      <span>SOC 2 Type II Certified</span>
    </div>
  </div>
  <div class="hero-preview">
    <!-- Live, interactive widget instead of a static image -->
    <div class="interactive-audit-card">
      <div class="card-header">
        <span class="status-dot ping"></span>
        <span class="mono-label">LIVE SECURITY MONITOR</span>
      </div>
      <div class="audit-metric-row">
        <span>S3 Bucket Encryption</span>
        <span class="badge-success">100% COMPLIANT</span>
      </div>
      <div class="audit-metric-row">
        <span>IAM MFA Enforcement</span>
        <span class="badge-success">ACTIVE</span>
      </div>
    </div>
  </div>
</section>
```

---

## 2. Pillar 2: 21st.dev & Superdesign Craft Primitives (`21st.dev`, `superdesign.dev`)

Elite modern web apps reject flat, static, lifeless cards. Every interactive surface implements **craft feedback physics**:

### A. Cursor-Tracking Spotlight Card

```html
<div class="spotlight-card" id="spotlight-card">
  <div class="spotlight-overlay" aria-hidden="true"></div>
  <div class="card-inner">
    <h3>Zero-Latency Caching</h3>
    <p>Edge-native distributed key-value store with sub-10ms global reads.</p>
  </div>
</div>
```

```css
.spotlight-card {
  position: relative;
  border-radius: 1rem;
  border: 1px solid var(--border-base, #27272a);
  background: var(--bg-card, #09090b);
  overflow: hidden;
  padding: 1.5rem;
}

.spotlight-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px),
    rgba(255, 255, 255, 0.08),
    transparent 40%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.spotlight-card:hover .spotlight-overlay {
  opacity: 1;
}
```

```javascript
// Lightweight mouse-tracking without React state re-render
const card = document.getElementById('spotlight-card');
if (card) {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  });
}
```

### B. Animated Tabs & Sliding Segmented Pills

```html
<nav class="sliding-tabs" role="tablist">
  <div class="tab-indicator" id="tab-pill" aria-hidden="true"></div>
  <button type="button" role="tab" aria-selected="true" class="tab-item active">Overview</button>
  <button type="button" role="tab" aria-selected="false" class="tab-item">Metrics</button>
  <button type="button" role="tab" aria-selected="false" class="tab-item">Settings</button>
</nav>
```

```css
.sliding-tabs {
  position: relative;
  display: inline-flex;
  background: var(--bg-surface-secondary, #18181b);
  padding: 0.25rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-base, #27272a);
}

.tab-indicator {
  position: absolute;
  top: 0.25rem;
  bottom: 0.25rem;
  border-radius: 0.375rem;
  background: var(--bg-surface-active, #27272a);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), width 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.tab-item {
  position: relative;
  z-index: 1;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted, #a1a1aa);
  border: none;
  background: transparent;
  cursor: pointer;
}

.tab-item[aria-selected="true"] {
  color: var(--text-primary, #ffffff);
}
```

---

## 3. Pillar 3: ThreeUI & SceneAI 3D Spatial Canvas Architecture (`threeui.com`, `sceneai.art`)

Interactive 3D surfaces and generative spatial depth elevate modern landing pages. However, WebGL must **never** compromise accessibility or device battery.

### Strict 3D Canvas Accessibility & Performance Invariants

1. **Canvas Isolation:** The `<canvas>` element must always carry `aria-hidden="true"` and `tabindex="-1"`.
2. **DOM Overlay:** All headings, buttons, and readable information must reside in an accessible, semantic HTML layer positioned above the canvas.
3. **Context Loss Recovery:** Always listen for `webglcontextlost` and gracefully display a CSS static gradient fallback.
4. **Motion Preference:** When `@media (prefers-reduced-motion: reduce)` matches, pause rotation loops and render static frame.
5. **Visibility Culling:** Disconnect WebGL render loops via `IntersectionObserver` when the canvas scrolls out of viewport.

```html
<!-- Accessible 3D Spatial Canvas Architecture -->
<div class="spatial-hero-wrapper">
  <!-- 3D Canvas isolated from accessibility tree -->
  <canvas id="three-canvas" class="webgl-canvas" aria-hidden="true" tabindex="-1"></canvas>
  
  <!-- Semantic DOM Overlay for Screen Readers & Keyboard Users -->
  <div class="spatial-hero-overlay">
    <h1>Autonomous Edge Intelligence</h1>
    <p>Deploy neural runtime models across 300 global edge locations.</p>
    <button type="button" class="btn-primary">Deploy Cluster</button>
  </div>
</div>
```

---

## 4. Pillar 4: GSAP High-Performance Motion Choreography (`gsap.com`)

Animations must never induce layout recalculation, frame drops, or scroll jank. Enforce **GSAP production motion standards**:

### Core GSAP Invariants
- **Hardware-Accelerated Properties Only:** Animate `x`, `y`, `scale`, `rotation`, and `opacity`. Never animate `width`, `height`, `top`, `left`, or `margin`.
- **ScrollTrigger Scrubbing:** Map narrative animations directly to scroll progress with `scrub: 1` or `scrub: 0.5` for fluid physics.
- **Flip Plugin for Shared Layouts:** Use GSAP Flip (First, Last, Invert, Play) when elements transition between two disparate DOM containers.
- **Typographic Staggers (SplitText):** Reveal headlines line-by-line or word-by-word with `stagger: 0.05` and `power2.out` easing.

### GSAP ScrollTrigger Sequence Pattern

```javascript
// High-performance GSAP ScrollTrigger sequence
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHeroScrollAnimation() {
  // Check user motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.feature-showcase-section',
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse'
    }
  });

  tl.from('.feature-card', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power2.out'
  });
}
```

---

## 5. Pillar 5: Draftly UX Flow & Wireframe Information Architecture (`draftly.space`)

Before generating production layouts, map the user journey through disciplined **spatial information architecture**:

```
[Napkin Idea] 
      │
      ▼
[1. User Job / JTBD Definition] ──> "What specific transformation is the user hiring this screen to achieve?"
      │
      ▼
[2. Low-Fidelity Spatial Wireframe] ──> Block out zones: Global Nav (64px) -> Hero/Action Zone -> Primary Data -> Secondary Proof
      │
      ▼
[3. Progressive Disclosure Journey] ──> Level 1: Glanceable summary -> Level 2: Contextual drawer -> Level 3: Modal configuration
      │
      ▼
[4. High-Fidelity Craft Implementation] ──> Tokens, Taste Profile, 7-state components, accessible markup
```

### Cognitive Load Guardrails
- **Miller's Chunking:** Never display more than $7 \pm 2$ unorganized navigation links or form fields simultaneously.
- **Hick-Hyman Law:** Cap primary decision branches on any single view to $\le 5$ options.
- **Progressive Disclosure:** Hide advanced parameters behind accessible collapsible drawers (`<details>` or native popover).

---

## 6. Pillar 6: Toolfolio Utilitarian SaaS & Dashboard Ergonomics (`toolfolio.com`)

Utilitarian developer tools and micro-SaaS interfaces demand extreme density, keyboard efficiency, and instant response:

### Utilitarian Dashboard Blueprint
1. **Header Cockpit:** Real-time system status ping, active environment indicator (`Production | us-east-1`), and keyboard command palette trigger (`Cmd+K`).
2. **Dense Metric Cards:** Monospace values (`font-mono tabular-nums`), percentage delta badges with color + directional icon ($\uparrow / \downarrow$).
3. **Glanceable Data Tables:** Compact row padding (`py-2`), hover row highlights, explicit column sorting headers, and zero horizontal scroll on desktop.
4. **Keyboard Accelerators:**
   - `Cmd+K` / `Ctrl+K`: Global command search.
   - `/`: Instant filter/search table rows.
   - `Esc`: Dismiss active overlay/modal.
   - `J` / `K`: Keyboard row navigation.
5. **Sub-100ms Doherty Feedback:** When a user toggles an action or triggers an update, reflect visual state immediately with optimistic updates before waiting for remote network completion.

---

## 7. Pillar 7: TasteSkill Anti-Slop Directives Integration (`tasteskill.dev`)

Every component and page layout must pass the **TasteSkill Anti-Slop Directive**:
- Mandatory `[Design Read]` declared prior to generating markup.
- Commitment to one of 4 Taste Profiles (**Minimalist**, **Industrial-Brutalist**, **Editorial**, **Soft-Consumer**).
- Zero signature AI tells: No ambient purple-to-blue gradient cards, no centered "✨ AI-Powered" overhead pill badges, no uniform 3-card grids with circular icon boxes, no fake window dots, and strictly zero em-dashes (`—`) in UI copy.
