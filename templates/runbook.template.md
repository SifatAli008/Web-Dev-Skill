# Production Operations Runbook

> **Schema Conformance:** `templates/schemas/runbook.schema.json`  
> **Author:** `09-devops-infra`  
> **Authority Status:** APPROVED | REJECTED

---

## 1. Service Overview
- **Service Name:** [Service Name]
- **Environment:** [staging | production]
- **Target Tier:** [MVP | PROD | SCALE]
- **On-Call Lead:** [Name / Slack handle]

## 2. Standard Deployment Procedure
| Step | Action / Command | Expected Output | Timeout |
|---|---|---|---|
| 1 | `git checkout main && git pull` | Clean working tree | 30s |
| 2 | `pnpm run db:migrate` | Migrations applied with `SET lock_timeout = '2s'` | 60s |
| 3 | `docker compose up -d --build` | Container started | 120s |
| 4 | `curl -f http://localhost:3000/api/health/readiness` | HTTP 200 `{"status":"ready"}` | 10s |

## 3. Automated Health Checks
- **Liveness Endpoint:** `/api/health/liveness` (Target: HTTP 200, timeout 3s)
- **Readiness Endpoint:** `/api/health/readiness` (Target: HTTP 200, checks DB and Cache)

## 4. Automated Rollback Procedure
- **Trigger Conditions:** `/api/health/readiness` returns non-200 for 3 consecutive intervals OR error rate > 1.0%.
- **Rollback Command:** `./scripts/rollback.sh [previous_image_sha]`
- **Maximum Allowed Downtime:** < 60 seconds.
- **Rollback Verified in Staging:** Yes / No

## 5. Metric Thresholds & Alert Actions
| Metric | Threshold | Action |
|---|---|---|
| HTTP 5xx Error Rate | > 1.0% over 5 min | PagerDuty alert to on-call engineer |
| Database CPU | > 80% over 10 min | Inspect `pg_stat_statements` for runaway queries |
| Worker Queue Depth | > 500 unprocessed jobs | Horizontally scale worker container instances |

