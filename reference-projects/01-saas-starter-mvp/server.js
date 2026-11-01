const http = require('node:http');
const crypto = require('node:crypto');

// 1. Initialize SQLite Database with fallback for Node < 22.5
let DatabaseSync;
try {
  DatabaseSync = require('node:sqlite').DatabaseSync;
} catch (e) {
  // node:sqlite is available natively in Node >= 22.5.0
}

function createDatabase() {
  if (DatabaseSync) {
    try {
      const sqliteDb = new DatabaseSync(':memory:');
      sqliteDb.exec(`
        CREATE TABLE users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          salt TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
        CREATE TABLE sessions (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          expires_at TEXT NOT NULL,
          FOREIGN KEY(user_id) REFERENCES users(id)
        );
        CREATE TABLE subscriptions (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          plan TEXT NOT NULL,
          amount_cents INTEGER NOT NULL,
          status TEXT NOT NULL,
          created_at TEXT NOT NULL,
          FOREIGN KEY(user_id) REFERENCES users(id)
        );
      `);
      return sqliteDb;
    } catch {}
  }

  // Pure in-memory fallback for universal compatibility across Node 18, 20, 22, 24
  const users = new Map();
  const sessions = new Map();
  const subscriptions = [];

  return {
    exec() {},
    prepare(sql) {
      if (sql.includes('SELECT id FROM users WHERE email = ?')) {
        return {
          get(email) {
            for (const u of users.values()) {
              if (u.email === email) return { id: u.id };
            }
            return undefined;
          }
        };
      }
      if (sql.includes('INSERT INTO users')) {
        return {
          run(id, email, hash, salt, created_at) {
            users.set(id, { id, email, password_hash: hash, salt, created_at });
            return { changes: 1 };
          }
        };
      }
      if (sql.includes('SELECT * FROM users WHERE email = ?')) {
        return {
          get(email) {
            for (const u of users.values()) {
              if (u.email === email) return u;
            }
            return undefined;
          }
        };
      }
      if (sql.includes('INSERT INTO sessions')) {
        return {
          run(id, user_id, expires_at) {
            sessions.set(id, { id, user_id, expires_at });
            return { changes: 1 };
          }
        };
      }
      if (sql.includes('SELECT user_id FROM sessions WHERE id = ?')) {
        return {
          get(id) {
            const s = sessions.get(id);
            return s ? { user_id: s.user_id } : undefined;
          }
        };
      }
      if (sql.includes('INSERT INTO subscriptions')) {
        return {
          run(id, user_id, plan, amount_cents, status, created_at) {
            subscriptions.push({ id, user_id, plan, amount_cents, status, created_at });
            return { changes: 1 };
          }
        };
      }
      return { get() { return undefined; }, run() { return { changes: 0 }; }, all() { return []; } };
    }
  };
}

const db = createDatabase();

// 2. Cryptographic Helpers
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

function verifyPassword(password, hash, salt) {
  const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(testHash, 'hex'), Buffer.from(hash, 'hex'));
}

// 3. Server-Authoritative Price Catalog (Client cannot tamper with prices)
const PLAN_CATALOG = {
  starter: { name: 'Starter Plan', amount_cents: 2900 },
  pro: { name: 'Pro Plan', amount_cents: 7900 }
};

// 4. Core Request Handler Function (In-Memory & HTTP Dispatchable)
async function handleRequest(method, pathname, body = {}, headers = {}) {
  const resHeaders = {
    'content-type': 'application/json',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'content-security-policy': "default-src 'self'; frame-ancestors 'none'"
  };

  // Route: POST /api/auth/signup
  if (method === 'POST' && pathname === '/api/auth/signup') {
    const { email, password } = body;
    if (!email || !password || password.length < 8) {
      return { status: 400, headers: resHeaders, body: { error: 'Email and password (min 8 chars) required' } };
    }

    // Check duplicate using parameterized query
    const checkStmt = db.prepare('SELECT id FROM users WHERE email = ?');
    if (checkStmt.get(email)) {
      return { status: 409, headers: resHeaders, body: { error: 'Email already registered' } };
    }

    const { hash, salt } = hashPassword(password);
    const userId = crypto.randomUUID();
    const insertUser = db.prepare('INSERT INTO users (id, email, password_hash, salt, created_at) VALUES (?, ?, ?, ?, ?)');
    insertUser.run(userId, email, hash, salt, new Date().toISOString());

    // Create Session
    const sessionId = crypto.randomBytes(32).toString('hex');
    const insertSession = db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)');
    insertSession.run(sessionId, userId, new Date(Date.now() + 86400000).toISOString());

    resHeaders['set-cookie'] = `session_id=${sessionId}; HttpOnly; Secure; SameSite=Lax; Path=/`;
    return { status: 201, headers: resHeaders, body: { success: true, userId } };
  }

  // Route: POST /api/auth/login
  if (method === 'POST' && pathname === '/api/auth/login') {
    const { email, password } = body;
    // Parameterized lookup
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !verifyPassword(password, user.password_hash, user.salt)) {
      return { status: 401, headers: resHeaders, body: { error: 'Invalid credentials' } };
    }

    const sessionId = crypto.randomBytes(32).toString('hex');
    db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').run(
      sessionId, user.id, new Date(Date.now() + 86400000).toISOString()
    );

    resHeaders['set-cookie'] = `session_id=${sessionId}; HttpOnly; Secure; SameSite=Lax; Path=/`;
    return { status: 200, headers: resHeaders, body: { success: true } };
  }

  // Route: POST /api/billing/checkout
  if (method === 'POST' && pathname === '/api/billing/checkout') {
    const { plan_key } = body;
    const plan = PLAN_CATALOG[plan_key];
    if (!plan) {
      return { status: 400, headers: resHeaders, body: { error: 'Invalid plan selected' } };
    }

    // Verify Session Cookie
    const cookieHeader = headers.cookie || headers.Cookie || '';
    const sessionMatch = cookieHeader.match(/session_id=([a-f0-9]+)/);
    if (!sessionMatch) {
      return { status: 401, headers: resHeaders, body: { error: 'Authentication required' } };
    }

    const session = db.prepare('SELECT user_id FROM sessions WHERE id = ?').get(sessionMatch[1]);
    if (!session) {
      return { status: 401, headers: resHeaders, body: { error: 'Invalid or expired session' } };
    }

    // Record subscription using verified server price
    const subId = crypto.randomUUID();
    db.prepare('INSERT INTO subscriptions (id, user_id, plan, amount_cents, status, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(
      subId, session.user_id, plan_key, plan.amount_cents, 'active', new Date().toISOString()
    );

    return {
      status: 200,
      headers: resHeaders,
      body: {
        success: true,
        subscription_id: subId,
        amount_charged_cents: plan.amount_cents,
        plan_name: plan.name
      }
    };
  }

  return { status: 404, headers: resHeaders, body: { error: 'Not Found' } };
}

// 5. Standard HTTP Server Adapter
const server = http.createServer(async (req, res) => {
  let bodyStr = '';
  req.on('data', chunk => { bodyStr += chunk; });
  req.on('end', async () => {
    let bodyObj = {};
    try {
      bodyObj = bodyStr ? JSON.parse(bodyStr) : {};
    } catch {}
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const result = await handleRequest(req.method, parsedUrl.pathname, bodyObj, req.headers);

    for (const [k, v] of Object.entries(result.headers)) {
      res.setHeader(k, v);
    }
    res.writeHead(result.status);
    res.end(JSON.stringify(result.body));
  });
});

module.exports = { server, db, handleRequest, PLAN_CATALOG, createDatabase };
