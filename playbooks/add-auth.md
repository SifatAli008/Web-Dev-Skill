# Playbook: Add Secure Authentication (`add-auth`)

> **Objective:** Integrate a production-grade, secure authentication system (email/password, OAuth, or passkeys) with session isolation and brute-force protection.

---

## 1. Specialists Involved
- `06-security`: Auth architecture (session cookies vs JWT), cookie hardening, password hashing, rate limiting (HARD VETO).
- `02-architecture`: User domain modeling, session store selection, tenant authorization boundaries.
- `05-backend-data`: User & session database tables, unique constraints, credential hashing.
- `04-frontend`: Login/signup UI forms, accessible error handling, authenticated state management.
- `08-testing-qa`: Auth integration tests (happy path, wrong password, expired session, CSRF).

---

## 2. Ordered Steps

### Step 1: Auth Architecture Decision (`06-security` + `02-architecture`)
1. Decide token transport: Mandate server-managed `HttpOnly`, `Secure`, `SameSite=Lax` cookies. Reject storing JWTs in `localStorage`.
2. Select hashing algorithm: Argon2id (memory: 64MB, iterations: 3) or bcrypt (work factor >= 12).
3. Document in `DECISIONS.md`.

### Step 2: Database Schema & Indexes (`05-backend-data`)
1. Create `users` table:
   ```sql
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email VARCHAR(255) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     role VARCHAR(32) DEFAULT 'user' NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```
2. Create `sessions` table (or configure Redis session store):
   ```sql
   CREATE TABLE sessions (
     id VARCHAR(128) PRIMARY KEY,
     user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     expires_at TIMESTAMPTZ NOT NULL
   );
   CREATE INDEX idx_sessions_user_id ON sessions(user_id);
   ```

### Step 3: Auth Endpoints & Rate Limiting (`06-security` + `05-backend-data`)
1. Implement `POST /api/auth/signup`:
   - Validate input with Zod (email format, password length >= 12).
   - Check if email exists; hash password with Argon2id; insert user; issue session cookie.
2. Implement `POST /api/auth/login`:
   - Enforce rate limiting: maximum 5 failed attempts per IP per 15 minutes.
   - Verify password hash using constant-time comparison to prevent timing attacks.
3. Implement `POST /api/auth/logout`:
   - Delete session record from database; clear cookie with `maxAge: 0`.

### Step 4: Frontend Auth Forms (`04-frontend`)
1. Build `<LoginForm />` and `<SignupForm />` with accessible `<label>` and `aria-describedby` error states.
2. Disable submit button and display loading spinner during request.
3. Handle redirect to `return_to` parameter upon successful login.

### Step 5: Automated Security & Regression Tests (`08-testing-qa`)
1. Test signup with duplicate email -> returns 409 Conflict.
2. Test login with wrong password -> returns 401 Unauthorized.
3. Test 6 consecutive failed logins -> triggers 429 Rate Limited.
4. Verify `HttpOnly` and `SameSite` flags on response `Set-Cookie` header.

---

## 3. Quality Gates
- **Security Gate (`06-security`):** HARD VETO if cookies lack `HttpOnly` or passwords use fast hashes (MD5, SHA).
- **QA Gate (`08-testing-qa`):** Automated auth test suite passes with exit code 0.

---

## 4. Rollback Procedure
If auth deployment causes session invalidation or login failures:
1. Revert to previous application container image.
2. Rollback any destructive schema migrations using recorded rollback script.
3. Clear invalidated session cache keys if corrupted.

---

## 5. Evidence Required to Call Done
1. Terminal test output showing all auth integration tests passing.
2. HTTP response header inspection confirming:
   ```http
   Set-Cookie: __Host-session=...; Path=/; HttpOnly; Secure; SameSite=Lax
   ```

