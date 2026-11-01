/**
 * Test Suite for 02-ecommerce-api-prod (Universal WebDev Skills PROD-tier)
 * Verifies:
 * - Health probes (liveness, readiness)
 * - Atomic inventory locking & rollback
 * - Idempotency deduplication & replay caching
 * - Zero-downtime expand-and-contract schema migrations
 * - Strict security headers
 */

import assert from 'node:assert';
import { handleRequest, createDatabase } from './server.js';

console.log('=== Running Golden Reference Project 2 Tests (E-commerce PROD) ===\n');

const db = createDatabase(true);

// Test 1: Liveness and Readiness Health Probes
{
  const liveness = handleRequest('GET', '/api/health/liveness', null, {}, db);
  assert.strictEqual(liveness.status, 200);
  const liveData = JSON.parse(liveness.body);
  assert.strictEqual(liveData.status, 'ok');

  const readiness = handleRequest('GET', '/api/health/readiness', null, {}, db);
  assert.strictEqual(readiness.status, 200);
  const readyData = JSON.parse(readiness.body);
  assert.strictEqual(readyData.database, 'connected');
  console.log('[PASS] Test 1: Liveness and Readiness health probes return 200 OK with operational status.');
}

// Test 2: Idempotency Key Requirement
{
  const res = handleRequest('POST', '/api/orders', JSON.stringify({
    user_id: 'usr-100',
    product_id: 'prod-1',
    quantity: 1
  }), {}, db);

  assert.strictEqual(res.status, 400);
  const body = JSON.parse(res.body);
  assert.match(body.error, /Missing Idempotency-Key/i);
  console.log('[PASS] Test 2: Missing Idempotency-Key header is rejected with 400 Bad Request.');
}

// Test 3: Successful Order Creation with Inventory Deduction
{
  const initialStock = db.prepare('SELECT stock FROM products WHERE id = ?').get('prod-1').stock;

  const res = handleRequest('POST', '/api/orders', JSON.stringify({
    user_id: 'usr-100',
    product_id: 'prod-1',
    quantity: 2
  }), { 'Idempotency-Key': 'idemp-tx-1' }, db);

  assert.strictEqual(res.status, 201);
  const order = JSON.parse(res.body);
  assert.strictEqual(order.status, 'confirmed');
  assert.strictEqual(order.total_cents, 14900 * 2); // $149.00 * 2 = $298.00

  const remainingStock = db.prepare('SELECT stock FROM products WHERE id = ?').get('prod-1').stock;
  assert.strictEqual(remainingStock, initialStock - 2);
  console.log('[PASS] Test 3: Valid order creates order record and deducts inventory atomically.');
}

// Test 4: Idempotency Replay (Zero Double Billing / Double Deduction)
{
  const stockBeforeReplay = db.prepare('SELECT stock FROM products WHERE id = ?').get('prod-1').stock;

  const replayRes = handleRequest('POST', '/api/orders', JSON.stringify({
    user_id: 'usr-100',
    product_id: 'prod-1',
    quantity: 2
  }), { 'Idempotency-Key': 'idemp-tx-1' }, db);

  assert.strictEqual(replayRes.status, 201);
  assert.strictEqual(replayRes.headers['Idempotent-Replayed'], 'true');

  const stockAfterReplay = db.prepare('SELECT stock FROM products WHERE id = ?').get('prod-1').stock;
  assert.strictEqual(stockAfterReplay, stockBeforeReplay, 'Replayed request must not double-decrement stock!');
  console.log('[PASS] Test 4: Idempotent replay returns cached response with Idempotent-Replayed header and 0 stock drift.');
}

// Test 5: Insufficient Inventory Prevention (No Negative Stock)
{
  const res = handleRequest('POST', '/api/orders', JSON.stringify({
    user_id: 'usr-200',
    product_id: 'prod-2', // has 5 in stock
    quantity: 99 // over-allocation attempt
  }), { 'Idempotency-Key': 'idemp-tx-2' }, db);

  assert.strictEqual(res.status, 409);
  const body = JSON.parse(res.body);
  assert.strictEqual(body.error, 'Insufficient inventory');

  const currentStock = db.prepare('SELECT stock FROM products WHERE id = ?').get('prod-2').stock;
  assert.strictEqual(currentStock, 5, 'Failed order must rollback and not modify stock');
  console.log('[PASS] Test 5: Insufficient inventory rejected with 409 Conflict without modifying stock.');
}

// Test 6: Zero-Downtime Expand-and-Contract Migration
{
  // 6a. Expand: Add customer_email column
  const expandRes = handleRequest('POST', '/api/admin/migrations/expand', null, {}, db);
  assert.strictEqual(expandRes.status, 200);

  // 6b. Place new order with customer_email column present (dual-write compatibility)
  const orderWithEmailRes = handleRequest('POST', '/api/orders', JSON.stringify({
    user_id: 'usr-300',
    product_id: 'prod-2',
    quantity: 1,
    customer_email: 'buyer@example.com'
  }), { 'Idempotency-Key': 'idemp-tx-3' }, db);

  assert.strictEqual(orderWithEmailRes.status, 201);
  const savedOrder = db.prepare('SELECT customer_email FROM orders WHERE user_id = ?').get('usr-300');
  assert.strictEqual(savedOrder.customer_email, 'buyer@example.com');

  // 6c. Contract: Backfill legacy orders without downtime
  const contractRes = handleRequest('POST', '/api/admin/migrations/contract', null, {}, db);
  assert.strictEqual(contractRes.status, 200);

  const legacyOrder = db.prepare('SELECT customer_email FROM orders WHERE user_id = ?').get('usr-100');
  assert.strictEqual(legacyOrder.customer_email, 'legacy@order.local');
  console.log('[PASS] Test 6: Zero-downtime expand-and-contract schema migration executes without order disruption.');
}

// Test 7: Security Headers Verification
{
  const res = handleRequest('GET', '/api/products', null, {}, db);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers['X-Content-Type-Options'], 'nosniff');
  assert.strictEqual(res.headers['X-Frame-Options'], 'DENY');
  assert.ok(res.headers['Content-Security-Policy'].includes("default-src 'none'"));
  assert.ok(res.headers['Strict-Transport-Security'].includes('max-age=31536000'));
  assert.ok(res.headers['Cache-Control'].includes('no-store'));
  console.log('[PASS] Test 7: Production defensive security headers (CSP, HSTS, nosniff, DENY, no-store) verified.');
}

console.log('\nAll 7 E-commerce PROD API tests PASSED: 0 critical findings.\n');

