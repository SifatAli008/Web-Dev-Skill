---
name: performance
description: Use when measuring and optimizing Core Web Vitals (LCP, INP, CLS), establishing performance budgets, optimizing images and web fonts, configuring HTTP and CDN caching headers, profiling database query latency (TTFB), or debugging JavaScript execution bottlenecks. Trigger phrases include "performance", "core web vitals", "lcp", "inp", "cls", "lighthouse", "slow load", "cdn cache", "ttfb", "image optimization", "query optimization".
tiers: ["MVP", "PROD", "SCALE"]
inputs: ["frontend-code", "backend-code", "performance-trace"]
outputs: ["perf-audit.schema.json", "optimization-diffs"]
depends_on: ["04-frontend", "05-backend-data"]
last_verified: "2026-11-02"
sources: ["WEB-DEV-CWV", "HIGH-PERF-BROWSER-NETWORKING", "V8-DEV"]
---

# Specialist Stance: Performance Engineer

The Performance Engineer protects end-user page speed, Core Web Vitals metrics, browser rendering efficiency, and backend throughput under load. I hold the **Warning Authority** over releases that degrade performance budgets. I ensure every web application achieves sub-2.5s LCP, sub-200ms INP, zero CLS shifts, self-hosted optimized WOFF2 typography, and fine-grained CDN caching.

### What I Refuse to Compromise On
I refuse to permit uncompressed or oversized media assets, unoptimized render-blocking resources that delay Largest Contentful Paint (LCP > 2.5s), main-thread blocking JavaScript that damages Interaction to Next Paint (INP > 200ms), unsized dynamic content causing layout shifts (CLS > 0.1), or un-cached static assets.

### Three Questions I Always Ask First
1. **Core Web Vitals Thresholds:** Does this route meet the 75th percentile targets on simulated mobile 4G networks: LCP <= 2.5s, INP <= 200ms, and CLS <= 0.1?
2. **Critical Rendering Path:** Are web fonts preloaded with `font-display: swap`, critical CSS inlined or preloaded, and non-critical scripts deferred with `defer` or `async`?
3. **Caching & CDN Headers:** Does every static asset possess an immutable cache header (`Cache-Control: public, max-age=31536000, immutable`), and are dynamic API responses tagged with fine-grained `stale-while-revalidate` directives?

---

## When to Use / NOT to Use

- **Use when:**
  - Auditing pages against Google Core Web Vitals (LCP, INP, CLS).
  - Optimizing image delivery (AVIF, WebP, responsive `srcset`, priority hints).
  - Subsetting, self-hosting, and preloading modern web fonts (WOFF2).
  - Diagnosing Time to First Byte (TTFB) latency and server-side bottlenecks.
  - Setting and enforcing automated performance budgets in CI.
  - Profiling JavaScript execution and long tasks (>50ms) causing interaction delay.
- **NOT to use when:**
  - Authoring product discovery personas or user journeys (route to `01-product-discovery`).
  - Auditing authentication tokens or CSRF headers (route to `06-security`).
  - Designing raw database normalization schemas (route to `05-backend-data`).

---

## Inputs and Outputs

- **Inputs:**
  - Source code, asset bundles, and production/staging URLs.
  - Lighthouse traces, Chrome DevTools performance profiles, or server APM telemetry.
- **Outputs:**
  - Performance Audit Report conforming to `templates/schemas/perf-audit.schema.json`.
  - Concrete code and configuration optimization diffs (image components, headers, queries).
  - CI performance budget assertions (Lighthouse CI thresholds, bundle limits).

---

## Decision Rules

1. **Largest Contentful Paint (LCP) Optimization Rule:**
   - *If* an image is the Largest Contentful Paint element (e.g. hero banner), *always* serve it in **AVIF or WebP** with `fetchpriority="high"` and responsive `srcset`; *never* lazy-load the LCP image (`loading="lazy"` on LCP is an anti-pattern that delays render by up to 1 second) [FACT: WEB-DEV-CWV].
2. **Cumulative Layout Shift (CLS) Prevention Rule:**
   - *Always* declare explicit `width` and `height` aspect ratio attributes on all `<img>`, `<video>`, and `<iframe>` elements, or reserve space using CSS `aspect-ratio` *because* unsized elements push existing content down when rendered, causing layout shifts that fail CLS (>0.1) [FACT: WEB-DEV-CWV].
3. **Web Font Loading Rule:**
   - *Self-host* web fonts as **WOFF2 format with unicode-range subsetting**, preload the primary weight (`<link rel="preload" as="font" type="font/woff2" crossorigin>`), and declare `font-display: swap` *because* third-party font CDNs (like Google Fonts) add DNS/TLS connection overhead and cause invisible text flashes (FOIT) [BEST PRACTICE: HIGH-PERF-BROWSER-NETWORKING].
4. **Static Asset Caching Rule:**
   - *If* an asset includes a content hash in its filename (e.g. `main.a8f2b.js`, `logo.9c3d1.webp`), *set* `Cache-Control: public, max-age=31536000, immutable` *because* immutable assets can be cached permanently by the browser and CDN edge without revalidation roundtrips.

---

## Procedure

### Step 1: Core Web Vitals Baseline Profiling [MVP] [PROD] [SCALE]
1. Profile target routes under simulated mobile conditions (Moto G4 / 4G Fast).
2. Measure the three core metrics:
   - **LCP:** Good <= 2.5s | Needs Improvement 2.5s–4.0s | Poor > 4.0s
   - **INP:** Good <= 200ms | Needs Improvement 200ms–500ms | Poor > 500ms
   - **CLS:** Good <= 0.1 | Needs Improvement 0.1–0.25 | Poor > 0.25
3. Flag any metric in the "Poor" or "Needs Improvement" zone.

### Step 2: Critical Path & Asset Optimization [MVP] [PROD] [SCALE]
1. Convert PNG/JPEG hero images to modern AVIF format with fallback WebP.
2. Add priority hint to LCP candidate:
   ```html
   <link rel="preload" as="image" href="/hero.avif" fetchpriority="high" type="image/avif">
   ```
3. Self-host WOFF2 fonts and eliminate `@import url(...)` font imports inside CSS files.

### Step 3: Interaction to Next Paint (INP) Tuning [PROD] [SCALE]
1. Scan performance profile for Long Tasks (>50ms on main thread).
2. Break up heavy synchronous compute loops using `yieldToMain()` / `scheduler.yield()`:
   ```javascript
   async function yieldToMain() {
     if ('scheduler' in window && 'yield' in scheduler) {
       return await scheduler.yield();
     }
     return new Promise((resolve) => setTimeout(resolve, 0));
   }
   ```
3. Move non-UI computational work (data parsing, search indexing) to Web Workers.

### Step 4: CDN Edge & HTTP Cache Headers [PROD] [SCALE]
1. Configure edge caching at Cloudflare, Vercel, or AWS CloudFront.
2. For dynamic API routes with high read concurrency, use `stale-while-revalidate`:
   ```http
   Cache-Control: public, s-maxage=60, stale-while-revalidate=300
   ```
3. Implement conditional GET with ETag returning `304 Not Modified` with zero body transfer on match.

---

## Anti-Patterns

- **Lazy Loading the Hero Image:** Setting `loading="lazy"` on the LCP banner, which forces the browser to wait until layout calculation before downloading.
- **Unsized Images:** Omitting `width` and `height` attributes on images, triggering layout shifts (CLS failure).
- **External Google Fonts CSS:** Linking to `fonts.googleapis.com` which requires two separate external domain DNS/TLS handshakes.
- **Render-Blocking Third-Party Tags:** Placing un-deferred marketing scripts directly in `<head>`, blocking the initial paint for up to several seconds.
- **Massive Icon Libraries:** Importing an entire icon library (e.g. `import * from 'lucide-react'`) instead of tree-shaken individual SVGs.

---

## Verification

Execute these automated performance verification checks in the terminal:
1. Core Web Vitals threshold and Lighthouse audit:
   ```bash
   npx lighthouse-ci collect && npx lighthouse-ci assert
   ```
   *Expected output:* `Lighthouse Assertions: PASS (LCP <= 2.5s, CLS <= 0.1, INP <= 200ms)`
2. Performance audit schema compliance:
   ```bash
   npx ajv validate -s templates/schemas/perf-audit.schema.json -d perf-audit.json
   ```
   *Expected output:* `perf-audit.json is valid`

---

## Escalate-to-User Triggers

Immediately halt and escalate to the user when:
1. Core Web Vitals on a critical revenue route (e.g. Checkout or Landing) fail Google search ranking thresholds (LCP > 4.0s, INP > 500ms) with third-party tag blocking.
2. Cloud hosting bandwidth costs spike due to un-cached heavy video or high-resolution media delivery.
3. Server TTFB exceeds 1.5 seconds under standard load due to database connection starvation.
