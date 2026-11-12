# Core Web Vitals Optimization & HTTP Caching Reference

> **Loading Level:** L2 Reference Document  
> **Load Condition:** Load when tuning Largest Contentful Paint (LCP), debugging Interaction to Next Paint (INP) bottlenecks, or authoring edge CDN cache policies.

---

## 1. Foundations: The Core Web Vitals (CWV) Targets

| Metric | Full Name | Good (75th Percentile) | Poor | Primary Causes |
|---|---|---|---|---|
| **LCP** | Largest Contentful Paint | `<= 2.5s` | `> 4.0s` | Slow server TTFB, render-blocking JS/CSS, slow resource load (hero images/fonts). |
| **INP** | Interaction to Next Paint | `<= 200ms` | `> 500ms` | Long main-thread JavaScript tasks (>50ms), heavy re-renders, un-virtualized DOM. |
| **CLS** | Cumulative Layout Shift | `<= 0.1` | `> 0.25` | Unsized images/videos, dynamically injected ads/embeds, late font layout swaps. |

---

## 2. Professional Practice: The Zero-Shift Responsive Image Component

```html
<!-- HTML Picture Pattern with Explicit Sizing & Preload Hint -->
<picture>
  <source type="image/avif" srcset="/hero-400.avif 400w, /hero-800.avif 800w, /hero-1200.avif 1200w" sizes="(max-width: 768px) 100vw, 1200px">
  <source type="image/webp" srcset="/hero-400.webp 400w, /hero-800.webp 800w, /hero-1200.webp 1200w" sizes="(max-width: 768px) 100vw, 1200px">
  <img 
    src="/hero-800.webp" 
    alt="Platform overview dashboard" 
    width="1200" 
    height="630" 
    fetchpriority="high"
    decoding="async"
    style="aspect-ratio: 1200 / 630; width: 100%; height: auto;"
  >
</picture>
```

---

## 3. Advanced Practice: Font Optimization & Modern Frameworks (Peer Review 04-frontend)

### Framework Font Loaders (`next/font`)
When building in Next.js, use `next/font/google` or `next/font/local`:
- Fonts are automatically downloaded at build time and self-hosted with zero external Google requests.
- CSS `size-adjust` and fallback font metrics are automatically calculated to achieve **0.0 CLS**.
- Preload tags are injected automatically into the HTML stream.

If using Astro or Vite, use `@fontsource` packages or self-host `.woff2` files in `/public/fonts/` with explicit CSS font metric overrides.

---

## 4. Advanced Practice: The INP Yield Pattern (`scheduler.yield`)

When running expensive client operations (filtering, data parsing, sorting), yield periodically to let the browser process user clicks, taps, and keyboard inputs:

```typescript
export async function yieldToMain() {
  if ('scheduler' in window && 'yield' in (window as any).scheduler) {
    return await (window as any).scheduler.yield();
  }
  return new Promise((resolve) => setTimeout(resolve, 0));
}

// Example: Processing 10,000 records without blocking INP
export async function processLargeDataset(items: any[]) {
  const results = [];
  let lastYield = performance.now();

  for (let i = 0; i < items.length; i++) {
    results.push(transformItem(items[i]));

    // Yield control to the browser every 16ms (1 frame budget)
    if (performance.now() - lastYield > 16) {
      await yieldToMain();
      lastYield = performance.now();
    }
  }

  return results;
}
```
