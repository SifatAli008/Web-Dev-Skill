# Playbook: Fix Slow Largest Contentful Paint (`fix-slow-lcp`)

> **Objective:** Diagnose and remediate slow Largest Contentful Paint (LCP > 2.5s) on web pages to bring loading performance to Google Core Web Vitals "Good" thresholds.

---

## 1. Specialists Involved
- `10-performance`: Core Web Vitals profiling, waterfall diagnosis, priority hints, caching headers (Warns).
- `04-frontend`: Image component optimization, font loading adjustments, removing render-blocking JavaScript.
- `09-devops-infra`: Edge CDN caching rules, Brotli/Gzip compression, HTTP/2 or HTTP/3 configuration.
- `08-testing-qa`: Automated Lighthouse CI and Web Vitals regression testing.

---

## 2. Ordered Steps

### Step 1: Diagnose LCP Element & Sub-Parts (`10-performance`)
1. Run Chrome DevTools Performance profile or Lighthouse on simulated 4G mobile.
2. Identify the specific DOM node registered as the LCP element (e.g. `<img>`, `<video>`, or block-level text element).
3. Deconstruct the LCP time into 4 sub-parts:
   - **TTFB (Time to First Byte):** Target < 800ms.
   - **Resource Load Delay:** Target < 200ms.
   - **Resource Load Duration:** Target < 1000ms.
   - **Element Render Delay:** Target < 500ms.

### Step 2: Remediate Resource Load Delay (`10-performance` + `04-frontend`)
1. Remove `loading="lazy"` from the LCP image element immediately (lazy loading the hero image is an anti-pattern that severely delays loading).
2. Inject priority hint in HTML `<head>`:
   ```html
   <link rel="preload" as="image" href="/hero.avif" fetchpriority="high" type="image/avif">
   ```
3. Set `fetchpriority="high"` directly on the `<img>` tag:
   ```html
   <img src="/hero.webp" fetchpriority="high" decoding="async" alt="...">
   ```

### Step 3: Compress and Resize Media (`10-performance`)
1. Convert PNG/JPEG hero images to modern AVIF format with fallback WebP.
2. Implement responsive `srcset` with `sizes` so mobile devices download an appropriately sized ~50kB image rather than a 2MB desktop asset:
   ```html
   <picture>
     <source type="image/avif" srcset="/hero-400.avif 400w, /hero-800.avif 800w" sizes="(max-width: 600px) 100vw, 800px">
     <img src="/hero-800.webp" width="800" height="450" alt="...">
   </picture>
   ```

### Step 4: Eliminate Render-Blocking Resources (`04-frontend`)
1. Eliminate external `@import url(...)` in CSS files.
2. Self-host WOFF2 fonts with `font-display: swap` to prevent Flash of Invisible Text (FOIT).
3. Ensure non-critical JavaScript scripts use `defer` or `async` so they do not block HTML parsing.

### Step 5: CDN Edge Caching & Compression (`09-devops-infra`)
1. Verify edge CDN serves static assets with Brotli compression (`Content-Encoding: br`).
2. Configure immutable caching headers on static images:
   ```http
   Cache-Control: public, max-age=31536000, immutable
   ```

### Step 6: Verify with Automated Lighthouse CI (`08-testing-qa`)
1. Run automated performance audit in CI:
   ```bash
   npx lhci autorun
   ```
2. Assert LCP <= 2.5 seconds on simulated mobile 4G throttle.

---

## 3. Quality Gates
- **Performance Gate (`10-performance`):** LCP must be strictly under 2.5 seconds (75th percentile).
- **QA Gate (`08-testing-qa`):** Zero visual regression or layout shift (CLS <= 0.1) caused by image resizing.

---

## 4. Rollback Procedure
If asset conversion breaks image rendering in older browsers:
1. Re-enable fallback WebP and JPEG picture sources.
2. Purge CDN edge cache: `npx cloudflare-cli purge --all`.

---

## 5. Evidence Required to Call Done
1. Terminal Lighthouse CI output showing LCP score < 2.5s with green status.
2. Network waterfall trace showing LCP image request starts downloading in the first critical network chunk.

