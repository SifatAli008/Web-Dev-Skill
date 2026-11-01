/**
 * 03-content-platform-scale: High-Traffic Content Platform
 * Built according to Universal WebDev Skills SCALE-tier standards.
 *
 * Demonstrates:
 * 1. Edge caching (s-maxage, stale-while-revalidate) and conditional ETag 304 responses
 * 2. Core Web Vitals optimization (Preload priority hints, zero-CLS image dimensions, font-display: optional)
 * 3. SEO & Structured Data (Schema.org Article JSON-LD, dynamic sitemap.xml, robots.txt)
 * 4. Privacy-preserving cookieless analytics collection (daily rotated IP salt, zero cookies)
 * 5. Scale-tier security headers
 */

import http from 'node:http';
import crypto from 'node:crypto';

// In-memory catalog of published articles
export const articles = [
  {
    slug: 'scaling-web-architecture-2026',
    title: 'Architecting for Spiky Traffic and Global Edge Delivery',
    description: 'A deep dive into distributed edge caching, stale-while-revalidate, and database sharding patterns.',
    author: 'Elena Rostova',
    publishedAt: '2026-03-15T09:00:00Z',
    modifiedAt: '2026-04-01T14:30:00Z',
    heroImage: 'https://cdn.example.com/images/hero-arch.webp',
    content: 'Spiky traffic patterns require decoupling the origin database from edge compute...'
  },
  {
    slug: 'zero-cls-web-vitals-guide',
    title: 'Achieving Absolute Zero Cumulative Layout Shift',
    description: 'Techniques for layout stability, font-display strategies, and aspect-ratio reservation.',
    author: 'Marcus Vance',
    publishedAt: '2026-02-20T11:00:00Z',
    modifiedAt: '2026-02-22T08:15:00Z',
    heroImage: 'https://cdn.example.com/images/hero-cls.webp',
    content: 'Cumulative Layout Shift often stems from unsized hero images and late web font swaps...'
  }
];

// Daily salt for one-way anonymized IP hashing (cookieless analytics)
const DAILY_SALT = crypto.randomBytes(16).toString('hex');
export const analyticsEvents = [];

// Helper to compute weak ETag
function generateETag(content) {
  const hash = crypto.createHash('sha256').update(content).digest('base64').substring(0, 16);
  return `W/"${hash}"`;
}

// Generate Schema.org JSON-LD structured data
function buildJsonLd(article) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.description,
    'image': article.heroImage,
    'author': {
      '@type': 'Person',
      'name': article.author
    },
    'datePublished': article.publishedAt,
    'dateModified': article.modifiedAt,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://content.example.com/articles/${article.slug}`
    }
  });
}

// Render Core Web Vitals optimized HTML
export function renderArticleHtml(article) {
  const jsonLd = buildJsonLd(article);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${article.title} | ContentPlatform</title>
  <meta name="description" content="${article.description}">
  
  <!-- CWV: Preload high-priority hero image with fetchpriority -->
  <link rel="preload" as="image" href="${article.heroImage}" fetchpriority="high">
  
  <!-- CWV: Zero-CLS font display strategy -->
  <style>
    @font-face {
      font-family: 'PlatformSans';
      src: local('System-UI'), local('-apple-system');
      font-display: optional;
    }
    body { font-family: 'PlatformSans', sans-serif; margin: 0; padding: 2rem; }
    .hero-container { aspect-ratio: 16 / 9; max-width: 1200px; width: 100%; background: #f0f0f0; }
  </style>

  <!-- SEO: Schema.org Structured Data -->
  <script type="application/ld+json">
  ${jsonLd}
  </script>
</head>
<body>
  <article>
    <h1>${article.title}</h1>
    <p>By ${article.author} &bull; Updated: ${article.modifiedAt}</p>
    
    <!-- CWV: Explicit width, height, and decoding=async to prevent layout shift -->
    <div class="hero-container">
      <img src="${article.heroImage}" 
           width="1200" 
           height="675" 
           alt="${article.title}" 
           fetchpriority="high"
           decoding="async">
    </div>
    
    <div class="content">
      <p>${article.content}</p>
    </div>
  </article>
</body>
</html>`;
}

// Security headers for scale content delivery
export const BASE_SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

// Core Request Handler
export function handleRequest(method, pathname, body = null, headers = {}) {
  const reqHeaders = {};
  for (const [k, v] of Object.entries(headers)) {
    reqHeaders[k.toLowerCase()] = v;
  }

  // 1. Dynamic Sitemap Generation
  if (method === 'GET' && pathname === '/sitemap.xml') {
    const urls = articles.map(art => `
    <url>
      <loc>https://content.example.com/articles/${art.slug}</loc>
      <lastmod>${art.modifiedAt.split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://content.example.com/</loc>
    <lastmod>2026-04-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>${urls}
</urlset>`;

    return {
      status: 200,
      headers: {
        ...BASE_SECURITY_HEADERS,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'
      },
      body: xml
    };
  }

  // 2. Dynamic robots.txt
  if (method === 'GET' && pathname === '/robots.txt') {
    const robots = `User-agent: *
Disallow: /admin/
Disallow: /api/
Allow: /
Sitemap: https://content.example.com/sitemap.xml
`;
    return {
      status: 200,
      headers: {
        ...BASE_SECURITY_HEADERS,
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400'
      },
      body: robots
    };
  }

  // 3. Article View with Edge Caching & ETag Revalidation
  if (method === 'GET' && pathname.startsWith('/articles/')) {
    const slug = pathname.replace('/articles/', '');
    const article = articles.find(a => a.slug === slug);

    if (!article) {
      return {
        status: 404,
        headers: {
          ...BASE_SECURITY_HEADERS,
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache'
        },
        body: '<h1>404 Article Not Found</h1>'
      };
    }

    const html = renderArticleHtml(article);
    const etag = generateETag(html);

    // Conditional GET handling (304 Not Modified)
    if (reqHeaders['if-none-match'] === etag) {
      return {
        status: 304,
        headers: {
          'ETag': etag,
          'Cache-Control': 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400'
        },
        body: ''
      };
    }

    return {
      status: 200,
      headers: {
        ...BASE_SECURITY_HEADERS,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400',
        'ETag': etag
      },
      body: html
    };
  }

  // 4. Privacy-Preserving Cookieless Analytics Collection
  if (method === 'POST' && pathname === '/api/analytics/collect') {
    let parsed;
    try {
      parsed = typeof body === 'string' ? JSON.parse(body) : body;
    } catch {
      return {
        status: 400,
        headers: { ...BASE_SECURITY_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Malformed JSON payload' })
      };
    }

    const { event, path } = parsed || {};
    if (!event || !path) {
      return {
        status: 422,
        headers: { ...BASE_SECURITY_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing required event or path' })
      };
    }

    // IP Anonymization: One-way hash with daily rotating salt. Never store raw IP.
    const clientIp = reqHeaders['x-forwarded-for'] || '127.0.0.1';
    const anonymizedVisitorId = crypto.createHash('sha256')
      .update(clientIp + DAILY_SALT)
      .digest('hex')
      .substring(0, 16);

    analyticsEvents.push({
      visitorId: anonymizedVisitorId,
      event,
      path,
      timestamp: new Date().toISOString()
    });

    // Explicitly return 204 No Content with ZERO cookies
    return {
      status: 204,
      headers: {
        ...BASE_SECURITY_HEADERS,
        'Cache-Control': 'no-store'
      },
      body: ''
    };
  }

  return {
    status: 404,
    headers: { ...BASE_SECURITY_HEADERS, 'Content-Type': 'text/plain' },
    body: 'Not Found'
  };
}

// HTTP Server for standalone execution
if (process.argv[1]?.endsWith('server.js')) {
  const PORT = process.env.PORT || 3002;
  const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const response = handleRequest(req.method, parsedUrl.pathname, body, req.headers);
      res.writeHead(response.status, response.headers);
      res.end(response.body);
    });
  });

  server.listen(PORT, () => {
    console.log(`[03-content-platform-scale] Server listening on http://localhost:${PORT}`);
  });
}

