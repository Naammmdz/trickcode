# Non-Functional Requirements — TrickCode Platform

> **Version:** 1.0  
> **Date:** 2026-03-11  
> **Status:** Draft

---

## 1. Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-P01 | API response time (p95) for standard requests | ≤ 500ms |
| NFR-P02 | Page initial load time (LCP) | ≤ 2.5s on 4G |
| NFR-P03 | Code execution result returned via JDoodle | ≤ 10s |
| NFR-P04 | Real-time collaboration sync latency (Socket.IO) | ≤ 300ms |
| NFR-P05 | Concurrent active users supported without degradation | ≥ 500 |

---

## 2. Scalability

| ID | Requirement |
|----|-------------|
| NFR-S01 | Backend (Spring Boot) must support horizontal scaling behind a load balancer |
| NFR-S02 | Database connections must use connection pooling (HikariCP) to handle traffic spikes |
| NFR-S03 | Static frontend assets must be served via CDN (Vercel Edge Network) |

---

## 3. Availability & Reliability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-A01 | System uptime (excluding scheduled maintenance) | ≥ 99.5% per month |
| NFR-A02 | Scheduled maintenance window (if required) | Off-peak hours, notified 24h in advance |
| NFR-A03 | Unhandled exceptions must be caught and logged; user sees a friendly error page | Always |

---

## 4. Security

| ID | Requirement |
|----|-------------|
| NFR-SEC01 | All HTTP traffic must be served over HTTPS (TLS 1.2+) |
| NFR-SEC02 | Authentication must use JWT with a configurable expiry (default: 1h access, 7d refresh) |
| NFR-SEC03 | Passwords must be hashed with BCrypt (cost factor ≥ 12) |
| NFR-SEC04 | API endpoints must enforce role-based access control (STUDENT / INSTRUCTOR / ADMIN) |
| NFR-SEC05 | User-submitted code must execute in an isolated sandbox (JDoodle); no direct server execution allowed |
| NFR-SEC06 | All inputs must be validated server-side to prevent SQL injection and XSS |

---

## 5. Usability

| ID | Requirement |
|----|-------------|
| NFR-U01 | UI must be responsive and usable on viewport widths ≥ 375px (mobile) up to 1440px (desktop) |
| NFR-U02 | Core user flows (register → enroll → solve problem) must be completable in ≤ 5 clicks |
| NFR-U03 | Error messages must be human-readable and suggest corrective actions |

---

## 6. Maintainability

| ID | Requirement |
|----|-------------|
| NFR-M01 | Backend code must follow Java package conventions; service/repository layers separated |
| NFR-M02 | Frontend components must be modular; each file ≤ 400 lines |
| NFR-M03 | Environment-specific config (DB URL, API keys) must be stored in `.env` / application properties, never hardcoded |
| NFR-M04 | CI pipeline must run lint + unit tests on every pull request |

---

## 7. Observability

| ID | Requirement |
|----|-------------|
| NFR-O01 | Application must expose health check endpoint (`/actuator/health`) |
| NFR-O02 | Structured logs must include request ID, timestamp, user ID, and HTTP status |
| NFR-O03 | Critical errors (5xx) must trigger an alert notification (email / Slack) |

---

## 8. Data Integrity

| ID | Requirement |
|----|-------------|
| NFR-D01 | All database write operations must be wrapped in transactions |
| NFR-D02 | Enrollment and payment records must not be hard-deleted; soft-delete only |
| NFR-D03 | Production database must have automated daily backups with 7-day retention |

---

*This document covers non-functional aspects only. For functional requirements, refer to the feature specifications and API checklist (`API_Endpoints_Checklist.md`).*
