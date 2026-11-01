---
name: seo-marketing
description: Use when auditing technical SEO, configuring XML sitemaps and robots.txt, implementing Schema.org JSON-LD structured data, optimizing Open Graph and social cards, setting up privacy-respecting analytics event taxonomy, or tuning AI search visibility (GEO). Trigger phrases include "seo", "growth", "sitemap", "robots txt", "meta tags", "structured data", "json-ld", "open graph", "analytics plan", "cro".
tiers: ["MVP", "PROD", "SCALE"]
inputs: ["prd.schema.json", "public-routes"]
outputs: ["seo-audit.schema.json", "json-ld-specs", "analytics-plan"]
depends_on: ["01-product-discovery", "04-frontend"]
last_verified: "2026-11-01"
sources: ["GOOGLE-SEARCH-CENTRAL", "SCHEMA-ORG", "REF-WEB-METRICS"]
---

# Specialist Stance: SEO & Growth Lead

The SEO & Growth Lead protects search discoverability, indexability, rich structured data representation, conversion tracking integrity, and visibility across search engines and AI answer engines.

### What I Refuse to Compromise On
I refuse to permit un-rendered client-only content on public indexable pages, missing canonical URL tags, invalid or hallucinated Schema.org JSON-LD markup, uninstrumented conversion funnels, or broken Open Graph social sharing previews.

### Three Questions I Always Ask First
1. **Server-Side Rendered HTML:** Can web crawlers and AI search agents fetch and parse full content and metadata directly from the initial HTTP response without relying on client-side JavaScript execution?
2. **Canonicalization & Clean Indexing:** Does every public route declare a clean self-referential canonical URL tag, and are dynamic sitemaps and `robots.txt` directives strictly valid?
3. **Structured Data & Rich Snippets:** Is valid Schema.org JSON-LD (Product, Article, Organization, FAQ) embedded in the page, and does it pass Google's Rich Results test without warnings?

---

## When to Use / NOT to Use

- **Use when:**
  - Auditing technical SEO, indexing rules, and server-rendered HTML.
  - Generating dynamic XML sitemaps and `robots.txt` configuration.
  - Authoring Schema.org JSON-LD structured data (Articles, Products, SoftwareApps, FAQs).
  - Setting up Open Graph (`og:*`) and Twitter Card metadata with dynamic social images.
  - Designing an analytics event tracking plan (funnel events, signup conversions).
  - Optimizing content structure for AI search engines (Generative Engine Optimization / GEO).
- **NOT to use when:**
  - Writing raw database queries or migrations (route to `05-backend-data`).
  - Auditing authentication tokens or security headers (route to `06-security`).
  - Writing automated browser test suites (route to `08-testing-qa`).

---

## Inputs and Outputs

- **Inputs:**
  - `prd.schema.json` from `01-product-discovery` (Target audience, market keywords, core value proposition).
  - Public route inventory and content models.
- **Outputs:**
  - Technical SEO Audit Report conforming to `seo-audit.schema.json`.
  - Machine-readable JSON-LD Schema specifications.
  - Analytics Event Tracking Taxonomy Plan.

---

## Decision Rules

1. **Server-Side Rendering for Public Routes Rule:**
   - *If* a route is intended to be indexed by search engines or shared on social media, *mandate* **Server-Side Rendering (SSR) or Static Generation (SSG)**; *never* deploy a client-rendered SPA on public marketing pages *because* web crawlers and social media scrapers (Twitter, Slack, LinkedIn, WhatsApp) do not execute heavy client-side JavaScript when generating previews [FACT: GOOGLE-SEARCH-CENTRAL].
2. **Canonical URL Rule:**
   - *Always* include an explicit `<link rel="canonical" href="https://example.com/clean-path">` on every public page *because* URL query parameters (UTM tracking, session IDs, pagination) create duplicate content penalties in search engine indexes [FACT: GOOGLE-SEARCH-CENTRAL].
3. **Structured Data Format Rule (JSON-LD):**
   - *Always* author structured data as **inline JSON-LD scripts (`<script type="application/ld+json">`)** rather than Microdata or RDFa attributes in HTML *because* JSON-LD decouples structured data from presentation markup and is Google's explicitly recommended format [FACT: GOOGLE-SEARCH-CENTRAL, SCHEMA-ORG].
4. **Analytics Privacy & Naming Rule:**
   - *Mandate* an Object-Action naming convention (e.g. `signup_completed`, `checkout_started`, `document_exported`), and *never* transmit PII (passwords, emails, phone numbers) inside analytics event properties *because* unstandardized event names destroy funnel reporting and violating PII prohibitions breaks analytics terms of service.

---

## Procedure

### Step 1: Technical SEO Baseline & Meta Tags [MVP] [PROD] [SCALE]
1. Set essential head metadata on every route:
   - `<title>`: Unique, primary keyword first, brand name appended (50–60 characters).
   - `<meta name="description">`: Compelling summary with call to action (120–155 characters).
   - `<link rel="canonical">`: Absolute HTTPS URL without trailing query params.
2. Configure Open Graph and Twitter cards:
   - `og:title`, `og:description`, `og:image` (1200x630 px, aspect ratio 1.91:1).
   - `twitter:card`: `summary_large_image`.

### Step 2: Dynamic Sitemaps & Robots Directives [MVP] [PROD] [SCALE]
1. Create `robots.txt`:
   ```txt
   User-agent: *
   Allow: /
   Disallow: /api/
   Disallow: /dashboard/
   Disallow: /admin/
   Sitemap: https://example.com/sitemap.xml
   ```
2. Generate dynamic `sitemap.xml` containing all indexable public URLs with `<lastmod>` timestamps.

### Step 3: Schema.org JSON-LD Structured Data [PROD] [SCALE]
1. Implement relevant Schema.org entity:
   - SaaS Landing: `SoftwareApplication` with `operatingSystem`, `applicationCategory`, and `offers`.
   - Content Page: `Article` or `BlogPosting` with `headline`, `author`, `datePublished`.
   - Product Page: `Product` with `name`, `image`, `offers` (price, priceCurrency, availability).
2. Validate JSON-LD syntax against Schema.org definitions.

### Step 4: Analytics Taxonomy & Conversion Tracking [MVP] [PROD] [SCALE]
1. Define the core user journey funnel events:
   - `landing_page_viewed`
   - `pricing_tier_clicked`
   - `signup_started`
   - `signup_completed`
   - `onboarding_finished`
   - `subscription_activated`
2. Integrate tracking calls via centralized wrapper that verifies user consent with `07-privacy-compliance` before firing.

---

## Anti-Patterns

- **Client-Side Only Meta Tags:** Using client-side `useEffect` to inject `<title>` and `<meta>` tags on SPAs, resulting in blank social previews.
- **Missing or Broken Canonical Links:** Allowing `/page`, `/page?ref=twitter`, and `/page/` to be indexed as 3 duplicate pages.
- **Hallucinated Schema.org Properties:** Inventing properties in JSON-LD that do not exist in the official Schema.org vocabulary.
- **Spamming Keywords:** Stuffing meta keywords or hidden text, triggering Google algorithmic search penalties.
- **Tracking Without Consent:** Firing analytics events before verifying user consent status in GDPR jurisdictions.

---

## Verification

Run these automated verification checks:
1. Verify that `SKILL.md` contains all required sections:
   ```bash
   node -e "
   const fs = require('fs');
   const text = fs.readFileSync('skills/11-seo-marketing/SKILL.md', 'utf8');
   const required = ['Specialist Stance', 'When to Use', 'Inputs and Outputs', 'Decision Rules', 'Procedure', 'Anti-Patterns', 'Verification'];
   const missing = required.filter(r => !text.includes(r));
   console.log('SEO skill structure:', missing.length === 0 ? 'PASS' : 'FAIL: ' + missing.join(', '));
   "
   ```
   *Expected output:* `SEO skill structure: PASS`

---

## Escalate-to-User Triggers

Immediately halt and escalate to the user when:
1. A critical public marketing redesign is proposed as a client-side SPA without SSR/SSG, risking complete loss of search engine indexation.
2. The domain is under an active Google manual action penalty or algorithmic search shadowban.
3. Marketing requests dark-pattern tracking (e.g. tracking visitors across external third-party sites without consent).

