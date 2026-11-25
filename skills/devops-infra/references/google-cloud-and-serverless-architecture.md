# Google Cloud Architecture & Serverless Web Engineering Reference

> **Loading Level:** L2 Reference Document  
> **Load Condition:** Load when designing cloud infrastructure, deploying to Google Cloud Run, configuring Workload Identity Federation for keyless CI/CD, or applying Google Well-Architected Framework pillars.

---

## 1. Foundations: Google Cloud Architecture Framework (3 Core Pillars)

Based on the official Google Cloud Architecture Framework and `google/skills` standards, every production web application must satisfy three core architectural pillars:

### Pillar 1: Security & Identity (Zero-Trust & Least Privilege)
- **Workload Identity Federation:** Never generate or store static service account JSON keys in GitHub Secrets or CI environments. Authenticate external CI/CD workflows using OpenID Connect (OIDC) tokens exchanged dynamically for short-lived access credentials (`google-github-actions/auth`).
- **Principle of Least Privilege:** Grant fine-grained, pre-defined IAM roles rather than broad primitive roles (e.g. grant `roles/run.developer` and `roles/iam.serviceAccountUser` instead of `roles/editor`).
- **Secret Manager Runtime Injection:** Mount application secrets directly from Google Secret Manager as environment variables or volume mounts in Cloud Run services at runtime; never bake `.env` or credentials into container images.

### Pillar 2: Reliability & Operational Resilience
- **Container Health Probes:** Distinguish between **Startup Probes** (allows heavy framework boots like Next.js/NestJS without premature restart) and **Liveness Probes** (verifies event loop is unblocked).
- **Graceful SIGTERM Connection Draining:** Cloud Run sends a `SIGTERM` signal 10 seconds before terminating an instance (during scale-down or new revision rollouts). The HTTP server must catch `SIGTERM`, stop accepting new connections via `server.close()`, and drain inflight requests before exiting with code 0.
- **Canary Revisions & Traffic Splitting:** Roll out new revisions with gradual traffic splitting (e.g. 5% $\rightarrow$ 25% $\rightarrow$ 100%) and verify error rates and latency before decommissioning previous revisions.

### Pillar 3: Cost Optimization & Concurrency Tuning
- **Autoscaling Down to Zero:** Set `min-instances: 0` for development, staging, and low-traffic backends to eliminate idle compute spend. For latency-sensitive production APIs, set `min-instances: 1` to prevent cold starts.
- **Concurrency Right-Sizing:** Set container concurrency based on application runtime:
  - Node.js / Go / Async Python: `concurrency: 80` (handles up to 80 concurrent HTTP requests per container instance).
  - Heavy synchronous compute or CPU-intensive tasks: `concurrency: 1-10`.
- **CPU Allocation Strategy:** Use `cpu-throttling: true` (CPU allocated only during request processing) for standard web applications to reduce costs; use `cpu-throttling: false` only for background queue workers or long-lived WebSocket connections.

---

## 2. Professional Practice: Google Cloud Run Container Contract

Cloud Run requires container images to comply with a strict, lightweight operational contract:

```dockerfile
# Stage 1: Build & Package
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Minimal Cloud Run Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Cloud Run injects PORT (defaults to 8080)
ENV PORT=8080

# Run strictly as non-root user for security (OWASP / Google SRE)
USER node

COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/package.json ./package.json

EXPOSE 8080

CMD ["node", "dist/server.js"]
```

### Server Graceful Shutdown Implementation (Node.js / Express)
```typescript
import express from 'express';

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/api/health/liveness', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});

// Cloud Run SIGTERM Handler: 10-second drain window before SIGKILL
process.on('SIGTERM', () => {
  console.log('SIGTERM received: initiating graceful shutdown and draining connections...');
  server.close(() => {
    console.log('All connections drained. Exiting cleanly.');
    process.exit(0);
  });

  // Force exit if connections fail to drain within 9 seconds
  setTimeout(() => {
    console.error('Graceful drain timeout exceeded. Forcing shutdown.');
    process.exit(1);
  }, 9000);
});
```

---

## 3. Advanced Practice: Keyless GitHub Actions CI/CD with Workload Identity

Eliminate all static service account keys from CI pipelines:

```yaml
name: Deploy Web Application to Google Cloud Run

on:
  push:
    branches: [main]

permissions:
  contents: read
  id-token: write # Required for requesting the OIDC token

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source
        uses: actions/checkout@v4

      # Authenticate to GCP using Workload Identity Federation (Zero static keys)
      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: 'projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider'
          service_account: 'cloud-run-deployer@PROJECT_ID.iam.gserviceaccount.com'

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2

      - name: Authorize Docker Push to Artifact Registry
        run: gcloud auth configure-docker us-central1-docker.pkg.dev

      - name: Build and Push Container Image
        run: |
          IMAGE_URI="us-central1-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/web-repo/web-app:${{ github.sha }}"
          docker build -t "$IMAGE_URI" .
          docker push "$IMAGE_URI"

      - name: Deploy to Cloud Run with Health Probes & Traffic Splitting
        run: |
          gcloud run deploy web-app \
            --image="us-central1-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/web-repo/web-app:${{ github.sha }}" \
            --region=us-central1 \
            --platform=managed \
            --allow-unauthenticated \
            --port=8080 \
            --concurrency=80 \
            --min-instances=0 \
            --max-instances=10 \
            --timeout=30s
```

---

## 4. Event-Driven Decoupling: Cloud Pub/Sub & Cloud Tasks

For asynchronous web workloads exceeding the synchronous 200ms budget (e.g. video processing, bulk emails, webhook fan-out):

1. **Cloud Tasks:** Use for guaranteed point-to-point rate-limited HTTP dispatch with exponential backoff retries and execution scheduling.
2. **Cloud Pub/Sub:** Use for high-volume fan-out event streams where multiple downstream subscribers ingest identical events.
3. **Dead-Letter Topics (DLQ):** Always attach a Dead-Letter Topic with maximum delivery attempts ($\le 5$) so failing poison-pill messages do not exhaust queue resources or trigger infinite execution loops.

---

## 5. Agent Skills Ecosystem Interoperability (`skills.sh` & `google/skills`)

Universal WebDev Skills conforms strictly to the open Agent Skills specification utilized across the ecosystem by Google (`google/skills`), Anthropic (`anthropics/skills`), and Vercel:

- **Universal Installer Compatibility:** Developers can load Universal WebDev Skills into compatible agent environments via:
  ```bash
  npx skills add SifatAli008/Web-Dev-Skill
  ```
- **L0-L1-L2 Progressive Disclosure:** Prevents context window explosion by allowing the agent to discover capabilities via `skills.index.json` (L0), load operational rules in `SKILL.md` (L1), and deep-dive into detailed architecture guides (L2) only when actively deploying to cloud infrastructure.
