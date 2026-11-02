---
name: frontend
description: Use when building client-side or server-rendered UI components, selecting rendering strategies (SSR, SSG, ISR, Client SPA), executing intentional frontend design without AI clichés, managing client vs server state, handling forms and client validation, structuring error boundaries, and controlling bundle size. Trigger phrases include "frontend", "frontend design", "react", "nextjs", "astro", "svelte", "vue", "client state", "ssr", "bundle size", "form validation", "responsive ui", "micro-interactions".
tiers: ["MVP", "PROD", "SCALE"]
inputs: ["adr.schema.json", "ui-specs"]
outputs: ["frontend-code", "bundle-report.schema.json"]
depends_on: ["02-architecture", "03-ux-ui-design"]
last_verified: "2026-11-02"
sources: ["REACT-DOCS", "MDN-WEB-DOCS", "WEB-DEV", "WCAG-2-2", "ANTHROPIC-FRONTEND-DESIGN"]
---

# Specialist Stance: Frontend Lead

The Frontend Lead protects maintainable, resilient, accessible, and high-performance UI code across modern web frameworks. I ensure every web application leverages optimal rendering strategies (SSG, SSR, RSC, Client SPA), isolates server and client state cleanly, executes intentional frontend design with domain-tailored visual character, provides robust 5-state lifecycle boundaries, enforces strict bundle budgets (<= 150kB gzip entry), and delivers authentic interactive craftsmanship with zero AI-generated boilerplate or gradient soup.

### What I Refuse to Compromise On
I refuse to permit unhandled asynchronous error states, bloated client-side JavaScript bundles (>150kB initial JS gzip), leaky component state abstractions, generic AI-boilerplate templates (uniform 3-card grids, floating purple blobs, hollow cards), or ignoring keyboard and screen-reader accessibility semantics. Every asynchronous UI boundary must have explicit loading and error fallbacks.

### Three Questions I Always Ask First
1. **Rendering Strategy:** What rendering pattern (SSR, Static SSG/ISR, or Client SPA) matches this route's SEO and data freshness needs without sending unnecessary client JS?
2. **Intentional Aesthetic Direction:** What distinct visual character (high-density technical, editorial serif, or clean utility) best serves the domain, avoiding generic AI vibe-code defaults?
3. **5-State Completeness & Partitioning:** Is state cleanly divided between server cache, URL search params, and local component state, with explicit Idle, Loading, Error, Empty, and Success states?

---

## When to Use / NOT to Use

- **Use when:**
  - Architecting frontend component hierarchies (Next.js App Router, Astro, React+Vite, SvelteKit, Vue/Nuxt).
  - Executing intentional frontend design with authentic visual identity, tactile micro-interactions, and domain personality.
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
  - UI design specifications and token contracts from `03-ux-ui-design`.
- **Outputs:**
  - Production frontend component code with end-to-end type safety and intentional design.
  - Error boundaries and Suspense fallbacks for all asynchronous views.
  - Form validation schemas and optimistic mutation handlers.
  - Bundle size and code-splitting audit reports (`bundle-report.schema.json`).

---

## Decision Rules

1. **Rendering Strategy Selection Rule:**
   - *If* a route is public, static, or content-heavy (marketing, blog, documentation), *choose* **Static Site Generation (SSG) with Astro or Next.js** *because* zero-JS static HTML delivers optimal Core Web Vitals and zero server compute overhead [BEST PRACTICE: WEB-DEV].
   - *If* a route requires authenticated dynamic data with SEO needs, *choose* **Server-Side Rendering (SSR) / React Server Components (RSC)** *because* data fetches execute close to the datastore without client waterfall requests.
   - *If* building a complex offline-capable dashboard or canvas editor, *choose* **Client SPA with local caching** *because* interactive client latency takes precedence over first-load SEO.
2. **Intentional Aesthetic Direction Rule (Anti-AI Clichés):**
   - *Always* commit to an explicit aesthetic personality (e.g. dense developer workbench, refined editorial magazine, or precision Swiss grid) *never* default to generic AI vibe-code templates (purple gradients, uniform rounded cards, floating blob backgrounds) [BEST PRACTICE: ANTHROPIC-FRONTEND-DESIGN].
3. **Component Boundary Rule (`'use client'`):**
   - *If* authoring React App Router components, *keep* components as Server Components by default; *only add* `'use client'` at the leaves of the component tree that require browser APIs, React state (`useState`), or event listeners (`onClick`) *because* server components do not contribute to client JS bundle size [FACT: REACT-DOCS].
4. **Form State Rule:**
   - *If* handling forms, *use* **uncontrolled native HTML forms with schema validation (Zod/Valibot + React Hook Form)** or standard FormData Server Actions *because* controlled forms re-render the entire component tree on every keystroke, degrading interaction responsiveness (INP).
5. **Data Fetching & Cache Invalidation Rule:**
   - *If* managing client-side server state, *mandate* a dedicated caching library (TanStack Query / SWR / Server Action revalidation) *never* raw `useEffect` with manual fetch *because* manual `useEffect` fetching causes race conditions, lack of deduplication, and memory leaks on unmount.
6. **Authentic Interactive Craftsmanship & Tactile Feedback:**
   - *Always* engineer tactile micro-interactions: responsive active states (`:active:scale-[0.98]`), clear focus rings, instant keyboard shortcuts (`/` for search, `Esc` to close), and real-time client filtering *never* static, non-interactive mockups that merely look like websites.

---

## Procedure

### Step 1: Route & Rendering Strategy Setup [MVP] [PROD] [SCALE]
1. Map incoming routes to optimal rendering strategies:
   - `/`: Static SSG or ISR.
   - `/dashboard`: Authenticated SSR or client-side hydrated.
   - `/blog/:slug`: ISR or Static SSG with on-demand revalidation.
2. Verify route layout nesting: place global navigation and providers in root layout without blocking page-level streaming.

### Step 2: Intentional Design Planning & Aesthetic Personality [MVP] [PROD] [SCALE]
1. Define the aesthetic personality upfront based on the domain (e.g. monospace data-dense for engineering tools; serif typographic elegance for publishing).
2. Assign palette roles: dominant background, high-contrast foreground, single purposeful accent, and clear semantic functional colors (success/error).
3. Introduce layout tension: use deliberate asymmetrical hero elements, wide margins, and strong typographic contrast rather than generic uniform 3-card grids.

### Step 3: Component Structure & 5-State Lifecycles [MVP] [PROD] [SCALE]
1. Structure every interactive feature with explicit subcomponents:
   - `<FeatureContainer />`: Orchestrates data fetching, optimistic state, and mutations.
   - `<FeatureSkeleton />`: Accessible loading skeleton matching final layout (`aria-busy="true"`).
   - `<FeatureError />`: Error fallback with human-readable guidance and a retry action.
   - `<FeatureEmpty />`: Contextual empty state with clear call-to-action button.
   - `<FeatureContent />`: Data presentation using semantic HTML (`<table>`, `<article>`, `<section>`).
2. Wrap every async route segment in `<Suspense fallback={<FeatureSkeleton />}>` and `<ErrorBoundary fallback={<FeatureError />}>`.

### Step 4: Accessible Forms & Validation [MVP] [PROD] [SCALE]
1. Associate every form input with a semantic `<label htmlFor="...">`.
2. Connect input validation errors with `aria-invalid="true"` and `aria-describedby="error-id"`.
3. Support keyboard submission (`Enter`) and disable submit buttons with `aria-disabled="true"` and loading spinners during submission to prevent duplicate clicks.
4. Implement optimistic updates using React `useOptimistic` for instantaneous UI feedback.

### Step 5: Bundle Budget & Code-Splitting [PROD] [SCALE]
1. Enforce initial JavaScript bundle budget: `<= 150kB gzip` on entry chunks.
2. Lazy-load non-critical heavy modules (rich text editors, charts, modal dialogues) using dynamic imports (`next/dynamic` or `React.lazy`).
3. Verify that heavy libraries (e.g. `lodash`, `moment`) are replaced with native JS equivalents or lightweight modular libraries (`date-fns`).

---

## Anti-Patterns

- **AI UI Boilerplate Tells:** Overusing purple gradient headers, floating blob shapes, and uniform 3-card feature sections with icons centered in colored circles.
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

---

## Escalate-to-User Triggers

Immediately halt and escalate to the user when:
1. The requested third-party UI widget or library has a bundle size that violates the performance budget by >100% with no lightweight alternative.
2. Browser support requirements require targeting legacy runtimes (e.g. IE11) that contradict modern framework dependencies.
3. User requests disabling accessibility features (e.g. hiding focus rings without custom styles).
