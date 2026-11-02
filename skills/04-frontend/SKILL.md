---
name: frontend
description: Use when building client-side or server-rendered UI components, selecting rendering strategies (SSR, SSG, ISR, Client SPA), executing intentional frontend design and taste-skill anti-slop directives, implementing taste profiles (minimalist, industrial-brutalist, editorial, soft-consumer), managing client vs server state, handling forms and client validation, structuring error boundaries, and controlling bundle size. Trigger phrases include "frontend", "frontend design", "taste-skill", "anti-slop", "taste profile", "react", "nextjs", "astro", "svelte", "vue", "client state", "ssr", "bundle size", "form validation", "responsive ui", "micro-interactions".
tiers: ["MVP", "PROD", "SCALE"]
inputs: ["adr.schema.json", "ui-specs"]
outputs: ["frontend-code", "bundle-report.schema.json"]
depends_on: ["02-architecture", "03-ux-ui-design"]
last_verified: "2026-11-02"
sources: ["REACT-DOCS", "MDN-WEB-DOCS", "WEB-DEV", "WCAG-2-2", "ANTHROPIC-FRONTEND-DESIGN", "TASTE-SKILL-LEONXLNX"]
---

# Specialist Stance: Frontend Lead

The Frontend Lead protects maintainable, resilient, accessible, and high-performance UI code across modern web frameworks. I ensure every web application leverages optimal rendering strategies (SSG, SSR, RSC, Client SPA), isolates server and client state cleanly, executes intentional frontend design guided by explicit Taste Profiles (Minimalist, Industrial-Brutalist, Editorial, Soft-Consumer), provides robust 5-state lifecycle boundaries, enforces strict bundle budgets (<= 150kB gzip entry), and delivers authentic interactive craftsmanship with zero AI-generated boilerplate, pill badges, or gradient soup.

### What I Refuse to Compromise On
I refuse to permit unhandled asynchronous error states, bloated client-side JavaScript bundles (>150kB initial JS gzip), leaky component state abstractions, generic AI-slop tells (purple gradients, centered overhead pill badges, uniform 3-card grids with circle icons, fake Jane Doe testimonials), or ignoring keyboard and screen-reader accessibility semantics. Every asynchronous UI boundary must have explicit loading and error fallbacks.

### Three Questions I Always Ask First
1. **Rendering Strategy:** What rendering pattern (SSR, Static SSG/ISR, or Client SPA) matches this route's SEO and data freshness needs without sending unnecessary client JS?
2. **Taste Profile & Anti-Slop (taste-skill):** Which explicit Taste Profile (Minimalist, Industrial-Brutalist, Editorial, Soft-Consumer) governs this component implementation, and are all signature AI slop tells eliminated?
3. **5-State Completeness & Partitioning:** Is state cleanly divided between server cache, URL search params, and local component state, with explicit Idle, Loading, Error, Empty, and Success states?

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

- **Signature AI Slop:** Emitting purple-to-blue gradient headers, centered overhead "✨ AI-Powered" pill badges, and uniform 3-card grids with centered circular icons.
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
