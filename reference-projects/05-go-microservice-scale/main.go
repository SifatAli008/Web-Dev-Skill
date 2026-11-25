package main

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"strings"
	"sync"
	"time"
)

type Product struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	PriceCents int64  `json:"price_cents"`
	Stock      int    `json:"stock"`
}

type Order struct {
	ID         string `json:"id"`
	UserID     string `json:"user_id"`
	ProductID  string `json:"product_id"`
	Quantity   int    `json:"quantity"`
	TotalCents int64  `json:"total_cents"`
	Status     string `json:"status"`
	CreatedAt  int64  `json:"created_at"`
}

type IdempotencyRecord struct {
	StatusCode   int
	ResponseBody string
}

type Service struct {
	mu          sync.Mutex
	products    map[string]*Product
	orders      map[string]*Order
	idempotency map[string]IdempotencyRecord
	users       map[string]User
}

type User struct {
	ID           string
	Email        string
	PasswordHash string
	Salt         string
}

func NewService() *Service {
	s := &Service{
		products:    make(map[string]*Product),
		orders:      make(map[string]*Order),
		idempotency: make(map[string]IdempotencyRecord),
		users:       make(map[string]User),
	}
	// Seed initial products
	s.products["prod-1"] = &Product{ID: "prod-1", Name: "Developer Keyboard", PriceCents: 14900, Stock: 25}
	s.products["prod-2"] = &Product{ID: "prod-2", Name: "Ergonomic Chair", PriceCents: 49900, Stock: 10}
	return s
}

func HashPassword(password, salt string) string {
	mac := hmac.New(sha256.New, []byte(salt))
	mac.Write([]byte(password))
	return hex.EncodeToString(mac.Sum(nil))
}

func SecureCompare(a, b string) bool {
	return subtle.ConstantTimeCompare([]byte(a), []byte(b)) == 1
}

func (s *Service) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Security Headers (OWASP Hardening)
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.Header().Set("X-Frame-Options", "DENY")
	w.Header().Set("Content-Security-Policy", "default-src 'self'")
	w.Header().Set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")

	// 1. Health Probes
	if r.Method == http.MethodGet && r.URL.Path == "/api/health/liveness" {
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]string{"status": "ok", "service": "go-microservice-scale"})
		return
	}

	if r.Method == http.MethodGet && r.URL.Path == "/api/health/readiness" {
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]string{"status": "ready", "storage": "healthy"})
		return
	}

	// 2. User Registration
	if r.Method == http.MethodPost && r.URL.Path == "/api/auth/register" {
		var req struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Email == "" || len(req.Password) < 8 {
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "Invalid registration request"})
			return
		}

		s.mu.Lock()
		defer s.mu.Unlock()

		if _, exists := s.users[req.Email]; exists {
			w.WriteHeader(http.StatusConflict)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "Email already exists"})
			return
		}

		saltBytes := make([]byte, 16)
		_, _ = rand.Read(saltBytes)
		salt := hex.EncodeToString(saltBytes)
		pwdHash := HashPassword(req.Password, salt)

		s.users[req.Email] = User{
			ID:           "usr-go-1",
			Email:        req.Email,
			PasswordHash: pwdHash,
			Salt:         salt,
		}

		w.WriteHeader(http.StatusCreated)
		_ = json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
		return
	}

	// 3. Order Processing with Idempotency & Concurrency Mutex
	if r.Method == http.MethodPost && r.URL.Path == "/api/orders" {
		idempKey := r.Header.Get("Idempotency-Key")
		if idempKey == "" {
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "Missing Idempotency-Key header"})
			return
		}

		s.mu.Lock()
		defer s.mu.Unlock()

		if cached, exists := s.idempotency[idempKey]; exists {
			w.Header().Set("Idempotent-Replayed", "true")
			w.WriteHeader(cached.StatusCode)
			_, _ = w.Write([]byte(cached.ResponseBody))
			return
		}

		var req struct {
			UserID    string `json:"user_id"`
			ProductID string `json:"product_id"`
			Quantity  int    `json:"quantity"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Quantity <= 0 {
			w.WriteHeader(http.StatusBadRequest)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "Invalid order payload"})
			return
		}

		prod, exists := s.products[req.ProductID]
		if !exists {
			w.WriteHeader(http.StatusNotFound)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "Product not found"})
			return
		}

		if prod.Stock < req.Quantity {
			w.WriteHeader(http.StatusConflict)
			_ = json.NewEncoder(w).Encode(map[string]string{"error": "Insufficient stock"})
			return
		}

		// Deduct stock atomically
		prod.Stock -= req.Quantity
		order := &Order{
			ID:         "ord-go-1",
			UserID:     req.UserID,
			ProductID:  req.ProductID,
			Quantity:   req.Quantity,
			TotalCents: prod.PriceCents * int64(req.Quantity),
			Status:     "confirmed",
			CreatedAt:  time.Now().Unix(),
		}
		s.orders[order.ID] = order

		bodyBytes, _ := json.Marshal(order)
		s.idempotency[idempKey] = IdempotencyRecord{
			StatusCode:   http.StatusCreated,
			ResponseBody: string(bodyBytes),
		}

		w.WriteHeader(http.StatusCreated)
		_, _ = w.Write(bodyBytes)
		return
	}

	// 4. Safe Search (No SQL / Injection Safe)
	if r.Method == http.MethodGet && strings.HasPrefix(r.URL.Path, "/api/products/search") {
		q := r.URL.Query().Get("q")
		s.mu.Lock()
		defer s.mu.Unlock()

		results := []*Product{}
		for _, p := range s.products {
			if q != "" && strings.Contains(strings.ToLower(p.Name), strings.ToLower(q)) {
				results = append(results, p)
			}
		}

		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(map[string]interface{}{"products": results})
		return
	}

	w.WriteHeader(http.StatusNotFound)
	_ = json.NewEncoder(w).Encode(map[string]string{"error": "Not found"})
}

func main() {
	// Standard entrypoint
}
