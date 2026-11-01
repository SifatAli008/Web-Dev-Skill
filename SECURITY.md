# Security Policy

The Universal WebDev Skills project treats application security, supply chain safety, and data privacy as fundamental engineering invariants.

---

## 1. Reporting a Vulnerability

If you discover a security vulnerability or weakness within this repository (including core skills, playbooks, tools, or adapters), please do **NOT** open a public GitHub issue.

Please report vulnerabilities privately via our security disclosure channel:
- **Email:** `security@universal-webdev-skills.local` (or via GitHub Private Vulnerability Reporting)
- **PGP Key:** Available upon request or in GitHub Security Advisory portal

### Response Service Level Agreements (SLAs)
- **Initial Acknowledgment:** Within **4 hours**
- **Triage & Threat Assessment:** Within **12 hours**
- **Containment & Remediation:** Within **24 hours**
- **Public Disclosure:** Coordinated release within **30 days** of fix deployment

---

## 2. Core Repository Security Invariants

Every skill, playbook, template, and reference project in this repository is statically scanned by `tools/scan-skills.js` and audited against the following non-negotiable invariants:

1. **No Remote Execution Pipes:** Never instruct an agent or user to execute unverified remote shell pipes (e.g., `curl | sh`, `wget | bash`). All dependencies and tools must be pinned or installed via verifiable package managers.
2. **Zero Plaintext Secrets:** No passwords, API keys, tokens, or private certificates may be hardcoded or committed to git history. Environment variables and secret managers are mandatory.
3. **No TLS/SSL Bypass:** Instructions must never disable certificate verification (such as disabling Node TLS verification or passing insecure/unverified flags to HTTP clients).
4. **Strict SQL Parameterization:** All database queries must use prepared statements and parameterized inputs. Raw string concatenation into queries is forbidden.
5. **Binding Gate Authority:** Application Security Lead (`skills/06-security`) and Privacy Officer (`skills/07-privacy-compliance`) retain absolute, non-overridable veto power over software releases unless explicitly acknowledged in `DECISIONS.md` under an `ACCEPTED-RISK` entry.

---

## 3. Supported Versions

| Version | Supported | Security Patch Support |
|---|---|---|
| `v0.1.x` | Yes | Active maintenance and patch updates |
| `< v0.1.0` | No | Pre-release; please upgrade to v0.1.0 |

