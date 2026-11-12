# Technical SEO, JSON-LD Structured Data, & Open Graph Reference

> **Loading Level:** L2 Reference Document  
> **Load Condition:** Load when authoring Schema.org JSON-LD scripts, dynamic sitemap generators, or social sharing metadata.

---

## 1. Foundations: Schema.org SoftwareApplication JSON-LD Blueprint

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "DevTracker Pro",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "description": "Autonomous team monitoring and delivery tracking for engineering teams.",
  "offers": {
    "@type": "Offer",
    "price": "29.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2027-12-31"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "128"
  }
}
</script>
```

---

## 2. Professional Practice: Dynamic Sitemap Generation (Next.js)

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://example.com';

  // 1. Static Core Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/features`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 }
  ];

  // 2. Dynamic Blog Routes
  const posts = await getPublishedPosts();
  const dynamicRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
```

---

## 3. Private Route Protection & Noindex (Peer Review 07-privacy-compliance)
Never rely on `robots.txt` alone to protect private customer data. Add HTTP response headers on all authenticated dashboard, invoice, and settings routes:
```http
X-Robots-Tag: noindex, nofollow, noarchive
```
This guarantees that even if a private link is accidentally shared or linked externally, search engine crawlers will never index or cache user data.

---

## 4. Advanced Practice: Generative Engine Optimization (GEO)

To ensure high visibility when AI search agents (Perplexity, ChatGPT Search, Gemini) cite sources:
1. **Direct Answer Paragraphs:** Open key sections with a concise 40–60 word declarative answer answering the user's primary query directly.
2. **Entity-Rich Semantic Headings:** Use explicit H2/H3 headings that reflect full user questions (e.g. `## How Does Row-Level Security Work in PostgreSQL?`).
3. **Structured Tables & Sourced Citations:** Present comparisons and specs in structured Markdown tables with named sources; AI engines disproportionately extract table data into synthesis cards.
