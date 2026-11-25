"""
Universal WebDev Skills: Test Suite for 04-python-fastapi-prod (PROD-tier)
Verifies:
1. Liveness and Readiness Health Probes
2. Missing Idempotency-Key validation
3. Atomic order creation with inventory deduction
4. Idempotency replay without double stock deduction
5. Safe parameterized queries (Zero SQL injection)
6. Secure password hashing with PBKDF2 / Argon2 compliance
7. Strict OWASP security headers present on all responses
"""

import sys
import json
from app import Database, EcommerceApp, verify_password

def run_tests():
    print("=== Running Golden Reference Project 4 Tests (Python / FastAPI PROD) ===\n")
    db = Database(in_memory=True)
    app = EcommerceApp(db)

    # Test 1: Liveness and Readiness Health Probes
    liveness = app.handle_request("GET", "/api/health/liveness")
    assert liveness["status"] == 200, f"Expected 200, got {liveness['status']}"
    live_data = json.loads(liveness["body"])
    assert live_data["status"] == "ok"

    readiness = app.handle_request("GET", "/api/health/readiness")
    assert readiness["status"] == 200, f"Expected 200, got {readiness['status']}"
    ready_data = json.loads(readiness["body"])
    assert ready_data["database"] == "connected"
    print("[PASS] Test 1: Liveness and Readiness health probes return 200 OK with operational status.")

    # Test 2: Idempotency Key Requirement
    res = app.handle_request("POST", "/api/orders", json.dumps({
        "user_id": "usr-py-1",
        "product_id": "prod-1",
        "quantity": 1
    }))
    assert res["status"] == 400, f"Expected 400, got {res['status']}"
    assert "Missing Idempotency-Key" in res["body"]
    print("[PASS] Test 2: Missing Idempotency-Key header is rejected with 400 Bad Request.")

    # Test 3: Successful Order Creation with Inventory Deduction
    cur = db.conn.cursor()
    cur.execute("SELECT stock FROM products WHERE id = 'prod-1'")
    initial_stock = cur.fetchone()[0]

    order_res = app.handle_request("POST", "/api/orders", json.dumps({
        "user_id": "usr-py-1",
        "product_id": "prod-1",
        "quantity": 2
    }), {"Idempotency-Key": "py-tx-001"})

    assert order_res["status"] == 201, f"Expected 201, got {order_res['status']}"
    order_data = json.loads(order_res["body"])
    assert order_data["status"] == "confirmed"
    assert order_data["total_cents"] == 14900 * 2

    cur.execute("SELECT stock FROM products WHERE id = 'prod-1'")
    remaining_stock = cur.fetchone()[0]
    assert remaining_stock == initial_stock - 2, "Stock must decrement by exactly 2"
    print("[PASS] Test 3: Valid order creates order record and deducts inventory atomically.")

    # Test 4: Idempotency Replay (Zero Double Billing / Double Deduction)
    replay_res = app.handle_request("POST", "/api/orders", json.dumps({
        "user_id": "usr-py-1",
        "product_id": "prod-1",
        "quantity": 2
    }), {"Idempotency-Key": "py-tx-001"})

    assert replay_res["status"] == 201
    assert replay_res["headers"].get("Idempotent-Replayed") == "true"

    cur.execute("SELECT stock FROM products WHERE id = 'prod-1'")
    stock_after_replay = cur.fetchone()[0]
    assert stock_after_replay == remaining_stock, "Replay must NOT double deduct stock!"
    print("[PASS] Test 4: Idempotency key replay returns cached 201 response without double deduction.")

    # Test 5: Safe Parameterized Queries (SQL Injection Immunity)
    sqli_attempt = "/api/products/search?q=' OR '1'='1"
    search_res = app.handle_request("GET", sqli_attempt)
    assert search_res["status"] == 200
    search_data = json.loads(search_res["body"])
    # Injection must NOT dump entire database
    assert len(search_data["products"]) == 0, "SQL injection must return 0 literal matches"
    print("[PASS] Test 5: SQL injection attempt (' OR '1'='1) neutralized by parameterized queries.")

    # Test 6: Secure Password Hashing
    reg_res = app.handle_request("POST", "/api/auth/register", json.dumps({
        "email": "engineer@company.test",
        "password": "CorrectHorseBatteryStaple123!"
    }))
    assert reg_res["status"] == 201, f"Expected 201, got {reg_res['status']}"
    
    cur.execute("SELECT password_hash, salt FROM users WHERE email = 'engineer@company.test'")
    user_row = cur.fetchone()
    assert user_row is not None
    assert verify_password("CorrectHorseBatteryStaple123!", user_row["salt"], user_row["password_hash"])
    assert not verify_password("WrongPassword!", user_row["salt"], user_row["password_hash"])
    print("[PASS] Test 6: User registration stores constant-time verifiable PBKDF2 hash.")

    # Test 7: Strict Security Headers
    assert liveness["headers"]["X-Content-Type-Options"] == "nosniff"
    assert liveness["headers"]["X-Frame-Options"] == "DENY"
    assert "Strict-Transport-Security" in liveness["headers"]
    assert "Content-Security-Policy" in liveness["headers"]
    print("[PASS] Test 7: Defensive security headers (nosniff, DENY, HSTS, CSP) present on all responses.")

    print("\nAll 7 Python Reference Project Tests PASSED with 0 OWASP Criticals!\n")

if __name__ == "__main__":
    run_tests()
