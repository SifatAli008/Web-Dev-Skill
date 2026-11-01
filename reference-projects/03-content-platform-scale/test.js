/**
 * Test Suite for 03-content-platform-scale (Universal WebDev Skills SCALE-tier)
 * Verifies:
 * - Edge caching headers (s-maxage, stale-while-revalidate) and conditional ETag 304 revalidation
 * - Core Web Vitals optimization (Preload priority hints, zero-CLS dimensions, font-display: optional)
 * - SEO structured data (Schema.org JSON-LD Article, dynamic sitemap.xml, robots.txt)
 * - Cookieless, privacy-preserving analytics (no Set-Cookie header, hashed visitor ID)
 * - Defensive production security headers
 */

import assert from 'node:assert';
import { handleRequest, articles, analyticsEvents } from './server.js';

console.log('=== Running Golden Reference Project 3 Tests (Content Platform SCALE) ===\n');

// Test 1: Dynamic Sitemap.xml
{
  const res = handleRequest('GET', '/sitemap.xml');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers['Content-Type'], 'application/xml; charset=utf-8');
  assert.ok(res.body.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'));
  assert.ok(res.body.includes('<loc>https://content.example.com/articles/scaling-web-architecture-2026</loc>'));
  assert.ok(res.body.includes('<lastmod>2026-04-01</lastmod>'));
  console.log('[PASS] Test 1: Dynamic /sitemap.xml renders standard XML urlset with lastmod dates.');
}

// Test 2: Dynamic robots.txt
{
  const res = handleRequest('GET', '/robots.txt');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers['Content-Type'], 'text/plain; charset=utf-8');
  assert.ok(res.body.includes('Disallow: /admin/'));
  assert.ok(res.body.includes('Disallow: /api/'));
  assert.ok(res.body.includes('Sitemap: https://content.example.com/sitemap.xml'));
  console.log('[PASS] Test 2: Dynamic /robots.txt disallows sensitive routes and advertises sitemap.');
}

// Test 3: Core Web Vitals & Schema.org JSON-LD Optimization
{
  const res = handleRequest('GET', '/articles/scaling-web-architecture-2026');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers['Content-Type'], 'text/html; charset=utf-8');

  // Verify LCP Preload Hint
  assert.ok(
    res.body.includes('<link rel="preload" as="image" href="https://cdn.example.com/images/hero-arch.webp" fetchpriority="high">'),
    'Must preload hero image with fetchpriority=high'
  );

  // Verify Zero-CLS explicit dimensions on hero image
  assert.ok(
    res.body.includes('width="1200"') && res.body.includes('height="675"'),
    'Hero image must specify explicit width and height to prevent Cumulative Layout Shift'
  );

  // Verify font-display: optional for layout stability
  assert.ok(
    res.body.includes('font-display: optional;'),
    'Fonts must use font-display: optional or fallback system-ui'
  );

  // Verify Schema.org JSON-LD
  const jsonLdMatch = res.body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(jsonLdMatch, 'Must embed Schema.org JSON-LD script tag');
  const jsonLd = JSON.parse(jsonLdMatch[1].trim());
  assert.strictEqual(jsonLd['@context'], 'https://schema.org');
  assert.strictEqual(jsonLd['@type'], 'Article');
  assert.strictEqual(jsonLd.headline, 'Architecting for Spiky Traffic and Global Edge Delivery');
  assert.strictEqual(jsonLd.author.name, 'Elena Rostova');
  console.log('[PASS] Test 3: Core Web Vitals (fetchpriority preload, zero-CLS dimensions) and Schema.org JSON-LD verified.');
}

// Test 4: Edge Caching & ETag Generation
let etagHeader = '';
{
  const res = handleRequest('GET', '/articles/scaling-web-architecture-2026');
  assert.strictEqual(res.status, 200);
  assert.ok(res.headers['Cache-Control'].includes('s-maxage=3600'));
  assert.ok(res.headers['Cache-Control'].includes('stale-while-revalidate=86400'));
  assert.ok(res.headers['ETag'], 'Response must include ETag header');
  etagHeader = res.headers['ETag'];
  console.log('[PASS] Test 4: Edge caching directives (s-maxage, stale-while-revalidate) and ETag verified.');
}

// Test 5: Conditional GET Revalidation (304 Not Modified)
{
  const res = handleRequest('GET', '/articles/scaling-web-architecture-2026', null, {
    'If-None-Match': etagHeader
  });

  assert.strictEqual(res.status, 304, 'Must return 304 Not Modified when ETag matches');
  assert.strictEqual(res.body, '', '304 response body must be empty');
  assert.strictEqual(res.headers['ETag'], etagHeader);
  console.log('[PASS] Test 5: Conditional GET with If-None-Match returns 304 Not Modified with empty payload.');
}

// Test 6: Cookieless, Privacy-Preserving Analytics Collection
{
  analyticsEvents.length = 0; // reset
  const res = handleRequest('POST', '/api/analytics/collect', JSON.stringify({
    event: 'pageview',
    path: '/articles/scaling-web-architecture-2026'
  }), {
    'x-forwarded-for': '203.0.113.195'
  });

  assert.strictEqual(res.status, 204, 'Analytics endpoint must return 204 No Content');
  assert.strictEqual(res.headers['Set-Cookie'], undefined, 'Cookieless analytics must NEVER set cookies!');
  assert.strictEqual(analyticsEvents.length, 1);
  assert.notStrictEqual(analyticsEvents[0].visitorId, '203.0.113.195', 'Raw IP must NEVER be stored');
  assert.strictEqual(analyticsEvents[0].visitorId.length, 16, 'Visitor ID must be hashed pseudonym');
  console.log('[PASS] Test 6: Cookieless analytics logs anonymized event with 0 cookies and zero PII storage.');
}

// Test 7: Production Security Headers Check
{
  const res = handleRequest('GET', '/articles/scaling-web-architecture-2026');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers['X-Content-Type-Options'], 'nosniff');
  assert.strictEqual(res.headers['X-Frame-Options'], 'SAMEORIGIN');
  assert.ok(res.headers['Content-Security-Policy'].includes("default-src 'self'"));
  assert.ok(res.headers['Strict-Transport-Security'].includes('max-age=31536000'));
  console.log('[PASS] Test 7: Defensive security headers (CSP, HSTS, nosniff, SAMEORIGIN) verified.');
}

console.log('\nAll 7 Content Platform SCALE tests PASSED: 0 critical findings.\n');
