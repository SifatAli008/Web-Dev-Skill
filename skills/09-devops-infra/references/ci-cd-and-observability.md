# CI/CD Automation, Health Probes, & Observability Reference

> **Loading Level:** L2 Reference Document  
> **Load Condition:** Load when writing multi-stage Dockerfiles, authoring GitHub Actions workflows, or instrumenting liveness/readiness probes.

---

## 1. Foundations: Multi-Stage Production Dockerfile

```dockerfile
# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder
WORKDIR /app
# Peer Review 06-security: Minimize package layer footprint
RUN apk add --no-cache libc6-compat
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Stage 2: Minimal Production Runner (No dev tools, no package managers)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Run as non-root user for security
USER node
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

---

## 2. Professional Practice: Liveness vs Readiness Probes

Never mix process liveness with dependency availability!

```typescript
// /api/health/liveness -> verifies Node event loop is unblocked
app.get('/api/health/liveness', (req, res) => {
  res.status(200).json({ status: 'live', uptime: process.uptime() });
});

// /api/health/readiness -> verifies DB and Cache are reachable
app.get('/api/health/readiness', async (req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;
    await redis.ping();
    res.status(200).json({ status: 'ready' });
  } catch (err) {
    // Return 503 so load balancer stops routing traffic to this replica
    res.status(503).json({ status: 'unready', error: err.message });
  }
});
```

---

## 3. Advanced Practice: GitHub Actions Zero-Downtime Rollback

```yaml
name: Deploy Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy Canary / Green
        run: ./scripts/deploy-release.sh ${{ github.sha }}
      - name: Health Check Verification
        run: |
          for i in {1..12}; do
            STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://canary.example.com/api/health/readiness)
            if [ "$STATUS" -eq 200 ]; then
              echo "Health check passed!"
              exit 0
            fi
            sleep 5
          done
          echo "Health check failed! Triggering automated rollback..."
          ./scripts/rollback-release.sh
          exit 1
```
