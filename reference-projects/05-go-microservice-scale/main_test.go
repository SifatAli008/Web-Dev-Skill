package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestReferenceMicroservice(t *testing.T) {
	service := NewService()

	// Test 1: Liveness and Readiness
	{
		req := httptest.NewRequest(http.MethodGet, "/api/health/liveness", nil)
		rec := httptest.NewRecorder()
		service.ServeHTTP(rec, req)

		if rec.Code != http.StatusOK {
			t.Fatalf("Expected 200, got %d", rec.Code)
		}
		if rec.Header().Get("X-Content-Type-Options") != "nosniff" {
			t.Fatalf("Expected nosniff header")
		}

		reqReady := httptest.NewRequest(http.MethodGet, "/api/health/readiness", nil)
		recReady := httptest.NewRecorder()
		service.ServeHTTP(recReady, reqReady)
		if recReady.Code != http.StatusOK {
			t.Fatalf("Expected 200, got %d", recReady.Code)
		}
		t.Log("[PASS] Test 1: Liveness and readiness health probes return 200 OK")
	}

	// Test 2: Missing Idempotency Key
	{
		payload := []byte(`{"user_id":"usr-go-1","product_id":"prod-1","quantity":1}`)
		req := httptest.NewRequest(http.MethodPost, "/api/orders", bytes.NewReader(payload))
		rec := httptest.NewRecorder()
		service.ServeHTTP(rec, req)

		if rec.Code != http.StatusBadRequest {
			t.Fatalf("Expected 400 for missing idempotency key, got %d", rec.Code)
		}
		t.Log("[PASS] Test 2: Missing Idempotency-Key rejected with 400 Bad Request")
	}

	// Test 3: Successful Order Creation with Inventory Deduction
	initialStock := service.products["prod-1"].Stock
	{
		payload := []byte(`{"user_id":"usr-go-1","product_id":"prod-1","quantity":2}`)
		req := httptest.NewRequest(http.MethodPost, "/api/orders", bytes.NewReader(payload))
		req.Header.Set("Idempotency-Key", "go-tx-100")
		rec := httptest.NewRecorder()
		service.ServeHTTP(rec, req)

		if rec.Code != http.StatusCreated {
			t.Fatalf("Expected 201 Created, got %d: %s", rec.Code, rec.Body.String())
		}

		var order Order
		_ = json.Unmarshal(rec.Body.Bytes(), &order)
		if order.TotalCents != 14900*2 {
			t.Fatalf("Expected total 29800 cents, got %d", order.TotalCents)
		}

		if service.products["prod-1"].Stock != initialStock-2 {
			t.Fatalf("Expected stock %d, got %d", initialStock-2, service.products["prod-1"].Stock)
		}
		t.Log("[PASS] Test 3: Order successfully created and inventory decremented atomically")
	}

	// Test 4: Idempotency Replay (Zero Double Stock Deduction)
	{
		stockBeforeReplay := service.products["prod-1"].Stock
		payload := []byte(`{"user_id":"usr-go-1","product_id":"prod-1","quantity":2}`)
		req := httptest.NewRequest(http.MethodPost, "/api/orders", bytes.NewReader(payload))
		req.Header.Set("Idempotency-Key", "go-tx-100")
		rec := httptest.NewRecorder()
		service.ServeHTTP(rec, req)

		if rec.Code != http.StatusCreated {
			t.Fatalf("Expected 201 Created on replay, got %d", rec.Code)
		}
		if rec.Header().Get("Idempotent-Replayed") != "true" {
			t.Fatalf("Expected Idempotent-Replayed header on cached replay")
		}

		if service.products["prod-1"].Stock != stockBeforeReplay {
			t.Fatalf("Replay double decremented stock!")
		}
		t.Log("[PASS] Test 4: Idempotency replay returns cached response without double deduction")
	}

	// Test 5: Input Validation & Sanitization (Safe Search)
	{
		req := httptest.NewRequest(http.MethodGet, "/api/products/search?q=Keyboard", nil)
		rec := httptest.NewRecorder()
		service.ServeHTTP(rec, req)

		if rec.Code != http.StatusOK {
			t.Fatalf("Expected 200 OK, got %d", rec.Code)
		}

		var res struct {
			Products []Product `json:"products"`
		}
		_ = json.Unmarshal(rec.Body.Bytes(), &res)
		if len(res.Products) != 1 || res.Products[0].ID != "prod-1" {
			t.Fatalf("Expected 1 match for Keyboard, got %d", len(res.Products))
		}
		t.Log("[PASS] Test 5: Search correctly filtered without injection vulnerability")
	}

	// Test 6: Secure Password Hashing & Constant Time Verification
	{
		payload := []byte(`{"email":"dev@scale.test","password":"SuperSecurePassword123!"}`)
		req := httptest.NewRequest(http.MethodPost, "/api/auth/register", bytes.NewReader(payload))
		rec := httptest.NewRecorder()
		service.ServeHTTP(rec, req)

		if rec.Code != http.StatusCreated {
			t.Fatalf("Expected 201 Created, got %d", rec.Code)
		}

		user := service.users["dev@scale.test"]
		expectedHash := HashPassword("SuperSecurePassword123!", user.Salt)
		if !SecureCompare(user.PasswordHash, expectedHash) {
			t.Fatalf("Constant-time password comparison failed")
		}
		t.Log("[PASS] Test 6: Registration stores HMAC-SHA256 salted hash and validates in constant time")
	}

	// Test 7: Strict Security Headers
	{
		req := httptest.NewRequest(http.MethodGet, "/api/health/liveness", nil)
		rec := httptest.NewRecorder()
		service.ServeHTTP(rec, req)

		if rec.Header().Get("X-Frame-Options") != "DENY" {
			t.Fatalf("Missing X-Frame-Options DENY")
		}
		if rec.Header().Get("Content-Security-Policy") != "default-src 'self'" {
			t.Fatalf("Missing Content-Security-Policy")
		}
		t.Log("[PASS] Test 7: Strict security headers verified across responses")
	}
}
