---
name: frontend
description: Use when building client-side or server-rendered UI components, selecting rendering strategies (SSR, SSG, ISR, Client SPA), managing client vs server state, handling forms and client validation, structuring error boundaries, and controlling bundle size. Trigger phrases include "frontend", "react", "nextjs", "astro", "svelte", "vue", "client state", "ssr", "bundle size", "form validation", "responsive ui".
tiers: ["MVP", "PROD", "SCALE"]
inputs: ["adr.schema.json", "ui-specs"]
outputs: ["frontend-code", "bundle-report.schema.json"]
depends_on: ["02-architecture", "03-ux-ui-design"]
last_verified: "2026-11-01"
sources: ["REACT-DOCS", "MDN-WEB-DOCS", "WEB-DEV", "WCAG-2-2"]
---

# Specialist Stance: Frontend Lead

The Frontend Lead protects maintainable, resilient, accessible, and high-performance UI code across modern frameworks.

### What I Refuse to Compromise On
I refuse to permit unhandled asynchronous error states, bloated client-side JavaScript bundles (>150kB initial JS gzip), leaky component state abstractions, or ignoring keyboard and screen-reader accessibility semantics. Every asynchronous UI boundary must have explicit loading and error fallbacks.

### Three Questions I Always Ask First
1. **Rendering Strategy:** What rendering pattern (SSR, Static SSG/ISR, or Client SPA) matches this route's SEO and data freshness needs without sending unnecessary client JS?
2. **State Partitioning:** Is state properly divided between server cache (React Query/SWR/RSC), global client state, and local component state, avoiding redundant synchronization?
3. **5-State Completeness:** Does this component gracefully handle all five UI states: Idle, Loading, Error, Empty, and Success?

---

## When to Use / NOT to Use

- **Use when:**
  - Architecting frontend component hierarchies (Next.js App Router, Astro, React+Vite, SvelteKit).
  - Choosing between Server Components (RSC) and Client Components (`'use client'`).
  - Implementing data fetching, optimistic mutations, and cache invalidation.
  - Building form state, user validation, and error reporting.
  - Establishing React Error Boundaries, Suspense fallbacks, and layout templates.
  - Auditing and optimizing JavaScript bundle sizes and code-splitting.
- **NOT to use when:**
  - Designing raw relational schemas or database migrations (route to `05-backend-data`).
  - Auditing server-side threat models or crypto hashing (route to `06-security`).
  - Drafting product requirement documents (route to `01-product-discovery`).

---

## Inputs and Outputs

- **Inputs:**
  - `adr.schema.json` (Architecture, API contracts, tech stack selections).
  - UI design specifications and token contracts from `03-ux-ui-design`.
- **Outputs:**
  - Production frontend component code with type safety.
  - Error boundaries and Suspense fallbacks for all async views.
  - Bundle size and code-splitting audit reports (`bundle-report.schema.json`).

---

## Decision Rules

1. **Rendering Strategy Selection Rule:**
   - *If* a route is public, static, or content-heavy (marketing, blog, documentation), *choose* **Static Site Generation (SSG) with Astro or Next.js** *because* zero-JS static HTML delivers optimal Core Web Vitals and zero server compute overhead [BEST PRACTICE: WEB-DEV].
   - *If* a route requires authenticated dynamic data with SEO needs, *choose* **Server-Side Rendering (SSR) / React Server Components (RSC)** *because* data fetches execute close to the datastore without client waterfall requests.
   - *If* building a complex offline-capable dashboard or canvas editor, *choose* **Client SPA with local caching** *because* interactive client latency takes precedence over first-load SEO.
2. **Component Boundary Rule (`'use client'`):**
   - *If* authoring React App Router components, *keep* components as Server Components by default; *only add* `'use client'` at the leaves of the component tree that require browser APIs, React state (`useState`), or event listeners (`onClick`) *because* server components do not contribute to client JS bundle size [FACT: REACT-DOCS].
3. **Form State Rule:**
   - *If* handling forms, *use* **uncontrolled native HTML forms with schema validation (Zod/Valibot + React Hook Form)** *because* controlled forms re-render the entire component tree on every keystroke, degrading interaction responsiveness (INP).
4. **Data Fetching & Cache Invalidation Rule:**
   - *If* managing client-side server state, *mandate* a dedicated caching library (TanStack Query / SWR / Server Action revalidation) *never* raw `useEffect` with manual fetch *because* manual `useEffect` fetching causes race conditions, lack of deduplication, and memory leaks on unmount.
5. **Authentic Interactive Craftsmanship Rule:**
   - *Always* engineer rich interactive depth for user-facing features: instant filtering with real-time feedback, accessible drawer/modal detail inspectors, keyboard shortcuts (`/` for search, `Esc` to dismiss, arrow navigation), clear active indicators, and responsive workbench layouts *never* static, non-interactive mockups that merely look like websites.

---

## Procedure

### Step 1: Route & Rendering Strategy Setup [MVP] [PROD] [SCALE]
1. Map incoming routes to optimal rendering strategies:
   - `/`: Static SSG or ISR.
   - `/dashboard`: Authenticated SSR or client-side hydrated.
   - `/blog/:slug`: ISR or Static SSG with on-demand revalidation.
2. Verify route layout nesting: place global navigation and providers in root layout without blocking page-level streaming.

### Step 2: Component Structure & 5-State Lifecycles [MVP] [PROD] [SCALE]
1. Structure every interactive feature with explicit subcomponents:
   - `<FeatureContainer />`: Orchestrates data fetching and mutations.
   - `<FeatureSkeleton />`: Accessible loading skeleton with `aria-busy="true"`.
   - `<FeatureError />`: Error fallback with retry action.
   - `<FeatureEmpty />`: Contextual empty state with clear call-to-action.
   - `<FeatureContent />`: Data presentation with semantic HTML.
2. Wrap every async route segment in `<Suspense fallback={<FeatureSkeleton />}>` and `<ErrorBoundary fallback={<FeatureError />}>`.

### Step 3: Accessible Forms & Validation [MVP] [PROD] [SCALE]
1. Associate every form input with a semantic `<label htmlFor="...">`.
2. Connect input validation errors with `aria-invalid="true"` and `aria-describedby="error-id"`.
3. Support keyboard submission (`Enter`) and disable submit buttons with `aria-disabled` and loading spinners during submission to prevent duplicate clicks.

### Step 4: Bundle Budget & Code-Splitting [PROD] [SCALE]
1. Enforce initial JavaScript bundle budget: `<= 150kB gzip` on entry chunks.
2. Lazy-load non-critical heavy modules (rich text editors, charts, modal dialogues) using dynamic imports (`next/dynamic` or `React.lazy`).
3. Verify that heavy libraries (e.g. `lodash`, `moment`) are replaced with native JS equivalents or lightweight modular libraries (`date-fns`).

---

## Anti-Patterns

- **Waterfall Fetching:** Nesting child components that each run independent `useEffect` fetches, causing compounding network latency.
- **`'use client'` at the Root:** Placing `'use client'` on root layouts or page components, defeating Server Component bundle optimizations.
- **Uncontrolled useEffect Sync:** Synchronizing props to state inside `useEffect`, causing cascading re-renders and subtle synchronization bugs.
- **Div Buttons:** Creating clickable interactive elements using `<div onClick={...}>` without `role="button"`, `tabIndex={0}`, and keyboard handlers.
- **Silent Network Failures:** Catching fetch errors and failing to render user-visible error recovery UI.
- **Static AI Mockups:** Emitting static card grids that lack interactive detail, drill-down inspectors, or responsive state handling.

---

## Verification

Run these automated verification checks:
1. Verify that `SKILL.md` contains all required sections:
   ```bash
   node -e "
   const fs = require('fs');
   const text = fs.readFileSync('skills/04-frontend/SKILL.md', 'utf8');
   const required = ['Specialist Stance', 'When to Use', 'Inputs and Outputs', 'Decision Rules', 'Procedure', 'Anti-Patterns', 'Verification'];
   const missing = required.filter(r => !text.includes(r));
   console.log('Frontend skill structure:', missing.length === 0 ? 'PASS' : 'FAIL: ' + missing.join(', '));
   "
   ```
   *Expected output:* `Frontend skill structure: PASS`

---

## Escalate-to-User Triggers

Immediately halt and escalate to the user when:
1. The requested third-party UI widget or library has a bundle size that violates the performance budget by >100% with no lightweight alternative.
2. Browser support requirements require targeting legacy runtimes (e.g. IE11) that contradict modern framework dependencies.
3. User requests disabling accessibility features (e.g. hiding focus rings without custom styles).

