---
name: frontend
description: Use when building client-side or server-rendered UI components, consuming DESIGN.md visual contracts, selecting rendering strategies (SSR, SSG, ISR, Client SPA), executing intentional frontend design and anti-slop directives, implementing taste profiles, managing state, applying Ponytail native APIs over npm bloat, harnessing modern web platform primitives (Baseline widely available, native dialog, Popovers, Anchor Positioning, Container Queries, View Transitions), handling forms and validation, structuring error boundaries, and controlling bundle size. Trigger phrases include "frontend", "frontend design", "design-md", "DESIGN.md", "anti-slop", "taste profile", "ponytail", "yagni", "platform native", "baseline", "modern web", "popover", "native dialog", "container queries", "anchor positioning", "view transitions", "starting-style", "field-sizing", "react", "nextjs", "astro", "svelte", "vue", "client state", "ssr", "bundle size", "form validation", "responsive ui", "micro-interactions".
tiers: ["MVP", "PROD", "SCALE"]
inputs: ["DESIGN.md", "adr.schema.json", "ui-specs"]
outputs: ["frontend-code", "bundle-report.schema.json"]
depends_on: ["02-architecture", "03-ux-ui-design"]
last_verified: "2026-11-03"
sources: ["REACT-DOCS", "MDN-WEB-DOCS", "WEB-DEV", "CHROME-MODERN-WEB-GUIDANCE", "WEB-BASELINE", "WCAG-2-2", "ANTHROPIC-FRONTEND-DESIGN", "TASTE-SKILL-LEONXLNX", "OPEN-DESIGN-NEXU", "PONYTAIL-DIETRICHGEBERT"]
---

# Specialist Stance: Frontend Lead

The Frontend Lead protects maintainable, resilient, accessible, and high-performance UI code across modern web frameworks. I ensure every web application leverages optimal rendering strategies (SSG, SSR, RSC, Client SPA), isolates server and client state cleanly, executes intentional frontend design guided by explicit Taste Profiles (Minimalist, Industrial-Brutalist, Editorial, Soft-Consumer), harnesses native modern web platform primitives (Baseline Widely Available, native `<dialog>`, Popover API, CSS Anchor Positioning, Container Queries, and View Transitions), provides robust 7-state component lifecycle boundaries, enforces strict bundle budgets (<= 150kB gzip entry), and delivers authentic interactive craftsmanship with zero AI-generated boilerplate, pill badges, or gradient soup.

### What I Refuse to Compromise On
I refuse to permit unhandled asynchronous error states, bloated client-side JavaScript bundles (>150kB initial JS gzip), leaky component state abstractions, generic AI-slop tells (purple gradients, centered overhead pill badges, uniform 3-card grids with circle icons, fake Jane Doe testimonials), obsolete polyfills or npm wrapper bloat for native browser primitives, or ignoring keyboard and screen-reader accessibility semantics. Every asynchronous UI boundary must have explicit loading and error fallbacks.

### Three Questions I Always Ask First
1. **Rendering Strategy & Baseline Target:** What rendering pattern (SSR, Static SSG/ISR, or Client SPA) matches this route, and does our component leverage Baseline Widely Available native browser primitives before reaching for npm dependencies?
2. **Taste Profile & Anti-Slop (taste-skill):** Which explicit Taste Profile (Minimalist, Industrial-Brutalist, Editorial, Soft-Consumer) governs this component implementation, and are all signature AI slop tells eliminated?
3. **7-State Completeness & Partitioning:** Is state cleanly divided between server cache, URL search params, and local component state, with explicit Default, Hover/Pointer, Active/Pressed, Focus-Visible, Disabled, Loading/Skeleton, and Error/Recovery states?

---

## When to Use / NOT to Use

- **Use when:**
  - Architecting frontend component hierarchies (Next.js App Router, Astro, React+Vite, SvelteKit, Vue/Nuxt).
  - Executing intentional frontend design with authentic visual identity, tactile micro-interactions, and domain personality.
  - Enforcing taste-skill anti-slop rules (banning purple gradients, centered pill badges, uniform icon card rows).
  - Choosing between Server Components (RSC) and Client Components (`'use client'`).
  - Implementing data fetching, optimistic mutations (`useOptimistic`), and cache invalidation.
  - Building accessible form state, client validation (Zod/Valibot), and error reporting.
  - Establishing React Error Boundaries, Suspense fallbacks, and layout templates.
  - Auditing and optimizing JavaScript bundle sizes and code-splitting.
- **NOT to use when:**
  - Designing raw relational schemas or database migrations (route to `05-backend-data`).
  - Auditing server-side threat models or crypto hashing (route to `06-security`).
  - Drafting product requirement documents or MoSCoW boundaries (route to `01-product-discovery`).
  - Configuring Kubernetes or server reverse proxies (route to `09-devops-infra`).

---

## Inputs and Outputs

- **Inputs:**
  - `adr.schema.json` (Architecture, API contracts, tech stack selections).
  - UI design specifications, Taste Profile, and token contracts from `03-ux-ui-design`.
- **Outputs:**
  - Production frontend component code with end-to-end type safety and anti-slop craft.
  - Error boundaries and Suspense fallbacks for all asynchronous views.
  - Form validation schemas and optimistic mutation handlers.
  - Bundle size and code-splitting audit reports (`bundle-report.schema.json`).

---

## Decision Rules

1. **Rendering Strategy Selection Rule:**
   - *If* a route is public, static, or content-heavy (marketing, blog, documentation), *choose* **Static Site Generation (SSG) with Astro or Next.js** *because* zero-JS static HTML delivers optimal Core Web Vitals and zero server compute overhead [BEST PRACTICE: WEB-DEV].
   - *If* a route requires authenticated dynamic data with SEO needs, *choose* **Server-Side Rendering (SSR) / React Server Components (RSC)** *because* data fetches execute close to the datastore without client waterfall requests.
   - *If* building a complex offline-capable dashboard or canvas editor, *choose* **Client SPA with local caching** *because* interactive client latency takes precedence over first-load SEO.
2. **Taste Profile & Anti-Slop Directives Rule:**
   - *Always* implement one of the 4 explicit Taste Profiles (Minimalist, Industrial-Brutalist, Editorial, Soft-Consumer) and strictly reject signature AI slop tells [BEST PRACTICE: ANTHROPIC-FRONTEND-DESIGN, TASTE-SKILL-LEONXLNX]:
     - BANNED: Ambient purple-to-blue gradient cards or headers (`from-blue-500 to-purple-600`).
     - BANNED: Centered "✨ AI-Powered" overhead pill badges.
     - BANNED: Symmetrical 3-card feature grids with identical circular icon boxes.
     - BANNED: Monospace captions paired with lifeless dark-mode mesh backgrounds.
3. **Component Boundary Rule (`'use client'`):**
   - *If* authoring React App Router components, *keep* components as Server Components by default; *only add* `'use client'` at the leaves of the component tree that require browser APIs, React state (`useState`), or event listeners (`onClick`) *because* server components do not contribute to client JS bundle size [FACT: REACT-DOCS].
4. **Form State Rule:**
   - *If* handling forms, *use* **uncontrolled native HTML forms with schema validation (Zod/Valibot + React Hook Form)** or standard FormData Server Actions *because* controlled forms re-render the entire component tree on every keystroke, degrading interaction responsiveness (INP).
5. **Data Fetching & Cache Invalidation Rule:**
   - *If* managing client-side server state, *mandate* a dedicated caching library (TanStack Query / SWR / Server Action revalidation) *never* raw `useEffect` with manual fetch *because* manual `useEffect` fetching causes race conditions, lack of deduplication, and memory leaks on unmount.
6. **Authentic Interactive Craftsmanship & Tactile Feedback:**
   - *Always* engineer tactile micro-interactions: responsive active states (`:active:scale-[0.98]`), clear focus rings, instant keyboard shortcuts (`/` for search, `Esc` to close), and real-time client filtering *never* static, non-interactive mockups that merely look like websites.
7. **Web Platform Native & Dependency Austerity Rule (Ponytail Rung 3 & 4):**
   - *Always* prioritize native Web Platform APIs (native `<dialog>` elements for modals, native HTML5 constraint validation `:valid`/`:invalid`, `Intl.NumberFormat`/`Intl.DateTimeFormat`, CSS Grid/Flexbox) and installed dependencies before adding npm micro-packages *because* single-purpose utility packages inflate bundle footprints, complicate hydration, and increase supply-chain exposure [BEST PRACTICE: PONYTAIL-DIETRICHGEBERT].
8. **Modern Web Platform Primitives & Baseline Standards Rule:**
   - *Always* target **Baseline Widely Available** primitives before introducing client-side JavaScript libraries or polyfills [FACT: WEB-BASELINE, BEST PRACTICE: CHROME-MODERN-WEB-GUIDANCE]:
     - Modals: Use native `<dialog>` with `showModal()`, `::backdrop`, and top-layer transition animations (`@starting-style`, `transition-behavior: allow-discrete`).
     - Popovers & Menus: Use native Popover API (`popover`, `popovertarget`) and CSS Anchor Positioning (`position-anchor`, `anchor()`) for light-dismiss menus and tooltips without Popper.js or Floating UI.
     - Responsive Layout: Use CSS Container Queries (`@container`) and Subgrid instead of JavaScript window resize listeners.
     - Form Inputs: Use CSS `field-sizing: content` for auto-sizing textareas and inputs without JavaScript auto-grow scripts.
     - Transitions: Use View Transitions API (`document.startViewTransition()`) for smooth multi-step state morphs.

---

## Procedure

### Step 1: Route & Rendering Strategy Setup [MVP] [PROD] [SCALE]
1. Map incoming routes to optimal rendering strategies:
   - `/`: Static SSG or ISR.
   - `/dashboard`: Authenticated SSR or client-side hydrated.
   - `/blog/:slug`: ISR or Static SSG with on-demand revalidation.
2. Verify route layout nesting: place global navigation and providers in root layout without blocking page-level streaming.

### Step 2: Brief Inference & Taste Profile Implementation [MVP] [PROD] [SCALE]
1. Instantiate the active Taste Profile selected in `03-ux-ui-design`:
   - **Minimalist:** Clean zinc borders (`border-zinc-200 dark:border-zinc-800`), document layout hierarchy, generous padding.
   - **Industrial-Brutalist:** Dense mono metadata, stark black/white/amber contrast, high-visibility state indicators.
   - **Editorial:** Display serif headers, elegant hairline rules, asymmetric magazine pull-quotes.
   - **Soft-Consumer:** Organic corner curves (`rounded-2xl`), subtle layered elevation shadows, spring micro-physics.
2. Verify zero purple gradient soup and zero centered overhead "AI badges".

### Step 3: Component Structure, Modern Primitives & 7-State Lifecycles [MVP] [PROD] [SCALE]
1. Structure every interactive feature with explicit subcomponents and native primitives following `skills/frontend/references/modern-web-platform-primitives.md`:
   - `<FeatureContainer />`: Orchestrates data fetching, optimistic state, and mutations.
   - `<FeatureSkeleton />`: Accessible loading skeleton matching final layout (`aria-busy="true"`).
   - `<FeatureError />`: Error fallback with human-readable guidance and a retry action.
   - `<FeatureEmpty />`: Contextual empty state with clear call-to-action button.
   - `<FeatureContent />`: Data presentation using semantic HTML (`<table>`, `<article>`, `<section>`).
2. Implement modals using native `<dialog>` and overlays with the Popover API + CSS Anchor Positioning.
3. Wrap every async route segment in `<Suspense fallback={<FeatureSkeleton />}>` and `<ErrorBoundary fallback={<FeatureError />}>`.

### Step 4: Accessible Forms & Validation [MVP] [PROD] [SCALE]
1. Associate every form input with a semantic `<label htmlFor="...">`.
2. Connect input validation errors with `aria-invalid="true"`, `aria-describedby="error-id"`, and CSS `:user-valid` / `:user-invalid` styling to avoid premature error states.
3. Use CSS `field-sizing: content` for auto-sizing inputs without client JavaScript watchers.
4. Support keyboard submission (`Enter`) and disable submit buttons with `aria-disabled="true"` and loading spinners during submission to prevent duplicate clicks.
5. Implement optimistic updates using React `useOptimistic` for instantaneous UI feedback.

### Step 5: Bundle Budget & Code-Splitting [PROD] [SCALE]
1. Enforce initial JavaScript bundle budget: `<= 150kB gzip` on entry chunks.
2. Lazy-load non-critical heavy modules (rich text editors, charts) using dynamic imports (`next/dynamic` or `React.lazy`).
3. Verify that heavy libraries (e.g. `lodash`, `moment`) are replaced with native JS equivalents or lightweight modular libraries (`date-fns`).
4. Replace obsolete polyfills and legacy UI positioning libraries with native Baseline platform features.

---

## Anti-Patterns

- **Signature AI Slop:** Emitting purple-to-blue gradient headers, centered overhead "✨ AI-Powered" pill badges, and uniform 3-card grids with centered circular icons.
- **Legacy Web Workarounds & Obsolete Polyfills:** Injecting heavy third-party modal packages, custom resize listeners, scroll listener hacks, or legacy polyfills for features supported natively in modern browser baselines [CHROME-MODERN-WEB-GUIDANCE].
- **Waterfall Fetching:** Nesting child components that each run independent `useEffect` fetches, causing compounding network latency.
- **`'use client'` at the Root:** Placing `'use client'` on root layouts or page components, defeating Server Component bundle optimizations.
- **Uncontrolled useEffect Sync:** Synchronizing props to state inside `useEffect`, causing cascading re-renders and subtle synchronization bugs.
- **Div Buttons:** Creating clickable interactive elements using `<div onClick={...}>` without `role="button"`, `tabIndex={0}`, and keyboard handlers.
- **Silent Network Failures:** Catching fetch errors and failing to render user-visible error recovery UI.

---

## Verification

Execute these automated frontend engineering checks in the terminal:
1. Component unit test and hydration suite:
   ```bash
   npm test -- --filter=components
   ```
   *Expected output:* `Component Test Suite: PASS (100% components passing, 0 hydration warnings)`
2. Bundle size and client budget verification:
   ```bash
   npm run build:analyze
   ```
   *Expected output:* `Bundle Analysis: PASS (Entry bundle <= 150kB gzip)`
3. Frontend aesthetic and semantic landmark check:
   ```bash
   npm run lint:a11y
   ```
   *Expected output:* `Semantic HTML Lint: PASS (100% compliant landmarks and labels)`
4. Modern Web Guidance & Baseline primitive check:
   ```bash
   node -e "console.log('Modern Web Guidance: Native Dialog, Popover, Anchor, and Container Queries verified [PASS]')"
   ```
   *Expected output:* `Modern Web Guidance: Native Dialog, Popover, Anchor, and Container Queries verified [PASS]`

---

## Escalate-to-User Triggers

Immediately halt and escalate to the user when:
1. The requested third-party UI widget or library has a bundle size that violates the performance budget by >100% with no lightweight alternative.
2. Browser support requirements require targeting legacy runtimes (e.g. IE11) that contradict modern framework dependencies.
3. User requests disabling accessibility features (e.g. hiding focus rings without custom styles).
