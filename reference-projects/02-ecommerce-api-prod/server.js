/**
 * 02-ecommerce-api-prod: Production E-commerce Order API
 * Built according to Universal WebDev Skills PROD-tier standards.
 *
 * Demonstrates:
 * 1. Idempotency key handling with response caching and conflict protection
 * 2. ACID inventory reduction with atomic transactions (no negative stock)
 * 3. Health probes (/api/health/liveness and /api/health/readiness)
 * 4. Zero-downtime expand-and-contract schema migration
 * 5. Server-authoritative pricing and parameterized queries
 * 6. Hardened production security headers
 */

import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';

// Initialize and seed database
export function createDatabase(inMemory = true) {
  const db = new DatabaseSync(inMemory ? ':memory:' : 'ecommerce_prod.db');

  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price_cents INTEGER NOT NULL,
      stock INTEGER NOT NULL CHECK (stock >= 0)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      total_cents INTEGER NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS idempotency_keys (
      key TEXT PRIMARY KEY,
      status_code INTEGER NOT NULL,
      response_body TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // Seed sample products if empty
  const count = db.prepare('SELECT count(*) as cnt FROM products').get().cnt;
  if (count === 0) {
    const insertProduct = db.prepare('INSERT INTO products (id, name, price_cents, stock) VALUES (?, ?, ?, ?)');
    insertProduct.run('prod-1', 'Mechanical Keyboard', 14900, 10);
    insertProduct.run('prod-2', 'Ergonomic Mouse', 7900, 5);
    insertProduct.run('prod-3', 'USB-C Monitor Hub', 4900, 0); // Out of stock
  }

  return db;
}

// Global DB instance for running server
export const defaultDb = createDatabase(true);

// Standard security headers for PROD tier
export const SECURITY_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Cache-Control': 'no-store, no-cache, must-revalidate'
};

// Expand-and-contract migration execution
export function runExpandMigration(db) {
  // Step 1: Expand - add nullable column customer_email
  try {
    db.exec(`ALTER TABLE orders ADD COLUMN customer_email TEXT;`);
    const stmt = db.prepare('INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)');
    stmt.run(1, 'expand_add_customer_email', new Date().toISOString());
    return { success: true, phase: 'expand', column: 'customer_email' };
  } catch (err) {
    if (err.message.includes('duplicate column')) {
      return { success: true, phase: 'already_expanded' };
    }
    throw err;
  }
}

export function runContractMigration(db) {
  // Step 2: Contract - backfill empty emails and record completion
  db.exec(`UPDATE orders SET customer_email = 'legacy@order.local' WHERE customer_email IS NULL;`);
  const stmt = db.prepare('INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)');
  stmt.run(2, 'contract_backfill_customer_email', new Date().toISOString());
  return { success: true, phase: 'contract', backfilled: true };
}

// Core Request Handler (Pure in-memory execution for fast, reliable testing)
export function handleRequest(method, pathname, body = null, headers = {}, db = defaultDb) {
  const reqHeaders = {};
  for (const [k, v] of Object.entries(headers)) {
    reqHeaders[k.toLowerCase()] = v;
  }

  // 1. Liveness Probe (Does the process respond?)
  if (method === 'GET' && pathname === '/api/health/liveness') {
    return {
      status: 200,
      headers: SECURITY_HEADERS,
      body: JSON.stringify({ status: 'ok', uptime: process.uptime() })
    };
  }

  // 2. Readiness Probe (Is the database connected and ready for traffic?)
  if (method === 'GET' && pathname === '/api/health/readiness') {
    try {
      db.prepare('SELECT 1').get();
      return {
        status: 200,
        headers: SECURITY_HEADERS,
        body: JSON.stringify({ status: 'ready', database: 'connected' })
      };
    } catch (err) {
      return {
        status: 503,
        headers: SECURITY_HEADERS,
        body: JSON.stringify({ status: 'unhealthy', error: 'Database unavailable' })
      };
    }
  }

  // 3. Products List
  if (method === 'GET' && pathname === '/api/products') {
    const products = db.prepare('SELECT id, name, price_cents, stock FROM products').all();
    return {
      status: 200,
      headers: SECURITY_HEADERS,
      body: JSON.stringify({ products })
    };
  }

  // 4. Create Order (with Idempotency and Transactional Inventory Lock)
  if (method === 'POST' && pathname === '/api/orders') {
    const idempotencyKey = reqHeaders['idempotency-key'];
    if (!idempotencyKey) {
      return {
        status: 400,
        headers: SECURITY_HEADERS,
        body: JSON.stringify({ error: 'Missing Idempotency-Key header' })
      };
    }

    // Check if idempotent response already exists
    const existing = db.prepare('SELECT status_code, response_body FROM idempotency_keys WHERE key = ?').get(idempotencyKey);
    if (existing) {
      return {
        status: existing.status_code,
        headers: {
          ...SECURITY_HEADERS,
          'Idempotent-Replayed': 'true'
        },
        body: existing.response_body
      };
    }

    let parsed;
    try {
      parsed = typeof body === 'string' ? JSON.parse(body) : body;
    } catch {
      return {
        status: 400,
        headers: SECURITY_HEADERS,
        body: JSON.stringify({ error: 'Malformed JSON payload' })
      };
    }

    const { user_id, product_id, quantity, customer_email } = parsed || {};

    if (!user_id || !product_id || typeof quantity !== 'number' || quantity <= 0) {
      return {
        status: 422,
        headers: SECURITY_HEADERS,
        body: JSON.stringify({ error: 'Invalid parameters: user_id, product_id, and positive quantity required' })
      };
    }

    // Atomic Transaction: Check stock, deduct inventory, record order, save idempotency
    db.exec('BEGIN IMMEDIATE TRANSACTION;');
    try {
      const product = db.prepare('SELECT id, name, price_cents, stock FROM products WHERE id = ?').get(product_id);
      if (!product) {
        db.exec('ROLLBACK;');
        return {
          status: 404,
          headers: SECURITY_HEADERS,
          body: JSON.stringify({ error: 'Product not found' })
        };
      }

      if (product.stock < quantity) {
        db.exec('ROLLBACK;');
        return {
          status: 409,
          headers: SECURITY_HEADERS,
          body: JSON.stringify({
            error: 'Insufficient inventory',
            requested: quantity,
            available: product.stock
          })
        };
      }

      // Decrement stock defensively (concurrency guard)
      const updateResult = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?')
        .run(quantity, product_id, quantity);

      if (updateResult.changes === 0) {
        db.exec('ROLLBACK;');
        return {
          status: 409,
          headers: SECURITY_HEADERS,
          body: JSON.stringify({ error: 'Concurrent inventory conflict. Please retry.' })
        };
      }

      const orderId = `ord-${crypto.randomUUID()}`;
      const totalCents = product.price_cents * quantity;
      const createdAt = new Date().toISOString();

      // Check if orders table has customer_email column (expand-contract compatibility)
      const tableInfo = db.prepare("PRAGMA table_info(orders)").all();
      const hasEmailCol = tableInfo.some(col => col.name === 'customer_email');

      if (hasEmailCol) {
        db.prepare(
          'INSERT INTO orders (id, user_id, product_id, quantity, total_cents, status, created_at, customer_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).run(orderId, user_id, product_id, quantity, totalCents, 'confirmed', createdAt, customer_email || null);
      } else {
        db.prepare(
          'INSERT INTO orders (id, user_id, product_id, quantity, total_cents, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).run(orderId, user_id, product_id, quantity, totalCents, 'confirmed', createdAt);
      }

      const responsePayload = JSON.stringify({
        order_id: orderId,
        user_id,
        product_id,
        quantity,
        total_cents: totalCents,
        status: 'confirmed',
        created_at: createdAt
      });

      // Save idempotency record
      db.prepare(
        'INSERT INTO idempotency_keys (key, status_code, response_body, created_at) VALUES (?, ?, ?, ?)'
      ).run(idempotencyKey, 201, responsePayload, createdAt);

      db.exec('COMMIT;');

      return {
        status: 201,
        headers: SECURITY_HEADERS,
        body: responsePayload
      };
    } catch (err) {
      db.exec('ROLLBACK;');
      return {
        status: 500,
        headers: SECURITY_HEADERS,
        body: JSON.stringify({ error: 'Order processing failed', details: err.message })
      };
    }
  }

  // 5. Expand & Contract Admin Endpoints
  if (method === 'POST' && pathname === '/api/admin/migrations/expand') {
    const result = runExpandMigration(db);
    return {
      status: 200,
      headers: SECURITY_HEADERS,
      body: JSON.stringify(result)
    };
  }

  if (method === 'POST' && pathname === '/api/admin/migrations/contract') {
    const result = runContractMigration(db);
    return {
      status: 200,
      headers: SECURITY_HEADERS,
      body: JSON.stringify(result)
    };
  }

  return {
    status: 404,
    headers: SECURITY_HEADERS,
    body: JSON.stringify({ error: 'Route not found' })
  };
}

// HTTP Server for running independently if started via CLI
if (process.argv[1]?.endsWith('server.js')) {
  const PORT = process.env.PORT || 3001;
  const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const response = handleRequest(req.method, parsedUrl.pathname, body, req.headers, defaultDb);
      res.writeHead(response.status, response.headers);
      res.end(response.body);
    });
  });

  server.listen(PORT, () => {
    console.log(`[02-ecommerce-api-prod] Server listening on http://localhost:${PORT}`);
  });
}
