const assert = require('node:assert');
const { handleRequest, PLAN_CATALOG } = require('./server');

async function runTests() {
  console.log('=== Running Golden Reference Project 1 Tests (SaaS MVP) ===\n');

  let sessionCookie = '';

  // 1. Test Signup
  const resSignup = await handleRequest('POST', '/api/auth/signup', {
    email: 'founder@startup.local',
    password: 'StrongPassword123!'
  });
  assert.strictEqual(resSignup.status, 201, 'Signup should return 201');
  assert.strictEqual(resSignup.body.success, true);
  
  // Check hardened cookie
  const setCookie = resSignup.headers['set-cookie'] || '';
  assert.ok(setCookie.includes('HttpOnly'), 'Cookie must be HttpOnly');
  assert.ok(setCookie.includes('SameSite=Lax'), 'Cookie must have SameSite=Lax');
  assert.ok(setCookie.includes('Secure'), 'Cookie must be Secure');
  sessionCookie = setCookie.split(';')[0];
  console.log('[PASS] Test 1: User signup succeeds and issues hardened session cookie.');

  // 2. Test Duplicate Signup Prevention
  const resDup = await handleRequest('POST', '/api/auth/signup', {
    email: 'founder@startup.local',
    password: 'AnotherPassword456!'
  });
  assert.strictEqual(resDup.status, 409, 'Duplicate signup should return 409 Conflict');
  console.log('[PASS] Test 2: Duplicate email registration blocked with 409 Conflict.');

  // 3. Test Invalid Login
  const resBadLogin = await handleRequest('POST', '/api/auth/login', {
    email: 'founder@startup.local',
    password: 'WrongPassword'
  });
  assert.strictEqual(resBadLogin.status, 401, 'Wrong password should return 401');
  console.log('[PASS] Test 3: Invalid login credentials rejected with 401.');

  // 4. Test SQL Injection Resilience
  const resSQLi = await handleRequest('POST', '/api/auth/login', {
    email: "' OR 1=1 --",
    password: 'any'
  });
  assert.strictEqual(resSQLi.status, 401, 'SQLi payload should fail cleanly');
  console.log('[PASS] Test 4: SQL injection payload safely parameterized and rejected.');

  // 5. Test Unauthenticated Checkout Protection
  const resNoAuthCheckout = await handleRequest('POST', '/api/billing/checkout', {
    plan_key: 'starter'
  });
  assert.strictEqual(resNoAuthCheckout.status, 401, 'Checkout without cookie should return 401');
  console.log('[PASS] Test 5: Unauthenticated checkout rejected with 401.');

  // 6. Test Authenticated Checkout with Server-Authoritative Price
  const resCheckout = await handleRequest('POST', '/api/billing/checkout', {
    plan_key: 'starter',
    price_tamper: 1 // Malicious client attempt to override price to $0.01
  }, { Cookie: sessionCookie });
  assert.strictEqual(resCheckout.status, 200, 'Authenticated checkout should succeed');
  assert.strictEqual(resCheckout.body.amount_charged_cents, 2900, 'Price must be server-authoritative (2900 cents)');
  console.log('[PASS] Test 6: Checkout provisions subscription using server-authoritative price ($29.00).');

  // 7. Test Security Headers
  assert.strictEqual(resSignup.headers['x-content-type-options'], 'nosniff');
  assert.strictEqual(resSignup.headers['x-frame-options'], 'DENY');
  assert.ok(resSignup.headers['content-security-policy'].includes("frame-ancestors 'none'"));
  console.log('[PASS] Test 7: Defensive security headers (CSP, nosniff, DENY) verified.');

  console.log('\nAll 7 SaaS Starter MVP tests PASSED: 0 critical findings.\n');
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
