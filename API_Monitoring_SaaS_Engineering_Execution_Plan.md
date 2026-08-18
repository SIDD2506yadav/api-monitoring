# API Monitoring SaaS — Engineering & Product Execution Plan

> Living blueprint for building the API Monitoring SaaS from project setup to a production-ready, monetizable SaaS.
>
> **Principle:** Build incrementally. Do not introduce distributed-system complexity until the product actually needs it.

## 1. Product Vision

Build a developer-focused API and uptime monitoring platform that lets users:

- Monitor HTTP/HTTPS endpoints continuously.
- Detect downtime and performance degradation.
- Track uptime, latency, status codes, and failures.
- Receive alerts when APIs fail and recover.
- Inspect incidents and historical check results.
- Publish public status pages.
- Manage monitors through a clean dashboard.
- Eventually collaborate as a team and pay for higher usage/features.

Long-term, the product can evolve from a focused monitoring tool into a lightweight alternative to products such as UptimeRobot, Better Uptime, Pingdom, Checkly, or parts of Datadog Synthetic Monitoring.

The initial goal is not to compete with enterprise observability platforms. The goal is to build a technically strong, focused monitoring product that can become a real SaaS.

## 2. Why Build This Project?

### Product value

API monitoring solves a real operational problem:

> Is my API working correctly, and if it isn't, when did it fail and why?

A useful platform eventually needs:

- Response-time tracking
- Failure detection
- Incident history
- Notifications
- API authentication
- Response validation
- Multi-step workflows
- Status pages

This creates a natural path from a free utility to a paid SaaS.

### Portfolio value

The project demonstrates:

- React architecture
- Node.js API design
- PostgreSQL data modeling
- Redis
- Background workers
- Job queues
- Scheduling
- Authentication
- RBAC
- API security
- SSRF protection
- Observability
- Testing
- CI/CD
- Docker
- SaaS architecture
- Usage metering
- Billing

Build it as a real engineering project, not just a portfolio demo.

## 3. Core Product Goals

### Goal 1 — Reliable Monitoring

Configured monitors execute automatically at their configured interval and record whether the endpoint succeeded.

### Goal 2 — Useful Diagnostics

Each check records useful information such as HTTP status, response time, response size, error type, error message, and timestamp.

### Goal 3 — Actionable Incidents

Transient failures should not immediately create incidents.

Initial strategy:

```text
Failure → Failure → Failure → Incident OPEN
Successful checks → Incident RESOLVED
```

### Goal 4 — Clear Dashboard

The dashboard should answer:

> How are my APIs doing right now?

within a few seconds.

### Goal 5 — Secure Monitoring

Because users provide arbitrary URLs, the system must be designed to prevent SSRF and abuse.

### Goal 6 — Monetizable Architecture

Eventually support usage limits, plans, teams, API keys, billing, and data retention without forcing billing complexity into the MVP.

## 4. Product Scope

### MVP

#### Authentication

- Registration
- Login
- Logout/session handling
- Protected application routes

#### Monitor Management

- Create, edit, and delete monitors
- Enable/disable monitors
- Configure URL, HTTP method, interval, timeout, and expected status

#### Monitoring

- Execute HTTP checks
- Measure latency
- Record results
- Detect failures and recovery

#### Dashboard

- Total monitors
- Operational monitors
- Down monitors
- Average latency
- Monitor health list
- Uptime percentage
- Recent incidents

#### Monitor Details

- Current status
- Uptime
- Average latency
- P95 latency
- P99 latency
- Response-time chart
- Status/error chart
- Check history

#### Incidents

- Open incident
- Resolve incident
- Incident history

#### Notifications

Start with email notifications for incident opened/down and recovery/resolution.

### Explicitly NOT in MVP

Do not implement early:

- Multi-region monitoring
- Geographic monitoring
- Complex workflow chains
- AI root-cause analysis
- Slack/Discord integrations
- SMS
- Full billing integration
- Complex organization hierarchy
- Advanced API testing
- Kubernetes
- Microservices
- Multiple worker clusters

Introduce these only after the core monitoring loop is reliable.

## 5. Architecture Strategy

### Version 1 — Foundation

```text
React → Node API → PostgreSQL
```

Purpose:

- Establish application architecture.
- Build authentication.
- Build monitor CRUD.
- Establish the database model.

### Version 2 — Background Monitoring

```text
React → Node API → PostgreSQL
             ↓
        Redis/BullMQ
             ↓
       Monitoring Worker
```

Purpose:

- Separate monitoring work from user-facing requests.
- Prevent monitoring tasks from blocking the API.
- Introduce asynchronous processing.

### Version 3 — Scalable Monitoring

```text
                    ┌── Worker 1
                    ├── Worker 2
API → Redis/Queue ──┤
                    └── Worker 3
                         ↓
                    PostgreSQL
                         ↓
                    Object Storage
```

Purpose:

- Increase monitoring capacity.
- Scale workers independently.
- Isolate failures.

## 6. Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- TanStack Query

### Backend

- Node.js
- Express
- TypeScript
- Zod

### Database

- PostgreSQL
- Drizzle ORM

### Queue

- Redis
- BullMQ

### Testing

- Vitest
- Supertest
- React Testing Library
- Playwright

### Infrastructure

- Docker
- Docker Compose
- GitHub Actions
- Cloud deployment

## 7. Repository Structure

```text
api-monitoring/
├── apps/
│   ├── web/
│   │   └── src/
│   │       ├── components/
│   │       ├── features/
│   │       ├── pages/
│   │       ├── hooks/
│   │       ├── lib/
│   │       └── app/
│   └── api/
│       └── src/
│           ├── modules/
│           │   ├── auth/
│           │   ├── monitors/
│           │   ├── incidents/
│           │   └── notifications/
│           ├── middleware/
│           ├── infrastructure/
│           └── app/
├── workers/
│   └── monitoring/
│       └── src/
│           ├── jobs/
│           ├── services/
│           └── workers/
├── packages/
│   ├── database/
│   ├── shared/
│   └── config/
├── docker/
├── docs/
├── .github/
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

Do not create empty packages merely to match this structure. Add them when they become useful.

# 8. Development Phases

## Phase 0 — Project Foundation

**Goal:** Create a clean, reproducible development environment.

**Why:** Every later feature depends on predictable tooling and a clean repository.

**Tasks**

- Initialize Git repository
- Configure pnpm workspace
- Configure React/Vite
- Configure Node/Express API
- Configure TypeScript
- Configure `.gitignore`
- Configure environment variables
- Configure Docker Compose
- Add PostgreSQL
- Add Redis
- Add database package
- Add basic health endpoint
- Add development scripts

**Definition of Done**

- `pnpm install` works from root.
- Web app starts.
- API starts.
- PostgreSQL starts.
- Redis starts.
- Health endpoint responds.
- Docker Compose validates.

## Phase 1 — Database & API Foundation

**Goal:** Create the foundation for reliable backend development.

**Why:** Establish the data-access layer before application features.

**Tasks**

- Configure Drizzle
- Configure PostgreSQL connection
- Configure migrations
- Create initial schema
- Add database health check
- Establish API architecture
- Add centralized error handling
- Add request validation
- Add environment configuration

**Initial tables**

```text
users
monitors
monitor_results
```

Later:

```text
incidents
notifications
notification_channels
organizations
organization_members
api_keys
status_pages
subscriptions
usage_records
```

**Definition of Done**

- Database connection works.
- Migration can be generated/applied.
- API can query PostgreSQL.
- Invalid requests receive consistent errors.
- Basic database/API tests pass.

## Phase 2 — Authentication

**Goal:** Securely allow users to create accounts and access their own monitors.

**Why:** Monitoring data must belong to an authenticated user before the main product UI.

**Tasks**

- Registration
- Login
- Logout
- Password hashing
- Session/token strategy
- Authentication middleware
- Protected routes
- Ownership checks
- Authentication tests

**Security**

- Never store plaintext passwords.
- Rate-limit authentication endpoints.
- Avoid leaking whether an account exists.
- Secure session/token handling.

**Definition of Done**

```text
Register → Login → Dashboard → Logout
```

Unauthenticated users cannot access protected monitor data.

## Phase 3 — Monitor CRUD

**Goal:** Allow users to configure APIs.

**Why:** The monitor is the core product entity.

**Initial fields**

```text
id
user_id
name
url
method
headers
query_params
body
interval
timeout
expected_status
max_response_time
enabled
created_at
updated_at
```

**Tasks**

- Create/list/get/update/delete monitor
- Enable/disable
- Validate configuration
- Ownership authorization
- API tests
- Frontend forms

**Definition of Done:** A user can configure and manage a monitor through the UI.

## Phase 4 — Monitoring Engine

**Goal:** Execute configured monitors reliably.

**Why:** This is the core technical challenge.

**Architecture**

```text
Monitor → Queue → Monitoring Worker → HTTP Request → Result → PostgreSQL
```

**Tasks**

- Redis
- BullMQ
- Monitoring worker
- Monitoring job
- HTTP execution service
- Response-time measurement
- Status code/size capture
- Timeout handling
- DNS/connection failure handling
- Result storage
- Repeated scheduling

**Definition of Done:** A configured monitor executes automatically at its interval and persists results.

## Phase 5 — SSRF & Monitoring Security

**Goal:** Prevent abuse of outbound monitoring infrastructure.

**Why:** Arbitrary user URLs create SSRF risk.

Protect against:

- localhost
- loopback addresses
- private IP ranges
- link-local addresses
- cloud metadata endpoints
- DNS rebinding
- redirects to internal addresses

Also enforce:

- Protocol restrictions
- Redirect limits
- Response-size limits
- Timeout limits

**Definition of Done:** Security tests demonstrate that internal/private destinations cannot be monitored.

Treat this as a production blocker, not an optional enhancement.

## Phase 6 — Dashboard & Analytics

**Goal:** Turn raw monitoring data into useful information.

**Dashboard**

- Total monitors
- Healthy monitors
- Down monitors
- Average latency
- Uptime
- Recent incidents

**Monitor details**

- Current health
- Uptime
- Average response time
- P95/P99
- Response-time chart
- Status-code chart
- Recent checks

**Time ranges**

- 1 hour
- 6 hours
- 24 hours
- 7 days
- 30 days

**Definition of Done:** A user can understand current and historical API health from the dashboard.

## Phase 7 — Incident Management

**Goal:** Turn persistent failures into meaningful incidents.

**Why:** A single failed request may be transient.

**Initial strategy**

```text
Failure #1 → Failure #2 → Failure #3 → Incident OPEN
Successful check → Incident RESOLVED
```

**Tasks**

- Incident creation
- State transitions
- Consecutive failure tracking
- Recovery detection
- Incident history
- Duration
- Dashboard display

**Definition of Done:** Transient failures do not immediately create incidents, while persistent failures reliably open incidents.

## Phase 8 — Notifications

**Goal:** Notify users when something important happens.

**Why:** Users should not have to constantly watch the dashboard.

**MVP**

- Incident opened
- Monitor down
- Monitor recovered
- Incident resolved

Start with email.

Later:

- Slack
- Discord
- Webhooks
- SMS

**Definition of Done:** Real failure and recovery events can generate notifications.

## Phase 9 — Public Status Pages

**Goal:** Let customers communicate service health publicly.

**Why:** Status pages provide direct customer value and a natural SaaS feature.

Features:

- Public URL
- Overall health
- Service health
- Uptime
- Current incidents
- Incident history
- Custom branding later

**Definition of Done:** Users can publish selected monitors without exposing private configuration.

## Phase 10 — SaaS & Teams

**Goal:** Transform the single-user application into a multi-tenant SaaS.

**Organization model**

```text
Organization
├── Members
├── Projects
├── Monitors
├── Incidents
├── Status Pages
└── Notifications
```

**Roles**

```text
Owner
Admin
Member
Viewer
```

**Tasks**

- Organizations
- Invitations
- Membership
- RBAC
- Ownership
- Project separation
- Data isolation

**Definition of Done:** Multiple users can collaborate without cross-tenant data access.

## Phase 11 — API Keys & Programmatic Access

**Goal:** Let customers automate monitor management.

Capabilities:

- Create/update/delete monitors
- Enable/disable monitors
- Retrieve results
- Retrieve incidents

Security:

- Secure key storage
- Show secret only once
- Revocation
- Usage tracking

## Phase 12 — Usage Metering

**Goal:** Measure resources consumed by each organization.

Track:

- Monitors
- Checks
- Team members
- Status pages
- API requests
- Data retention
- Notifications

**Definition of Done:** Usage can be calculated accurately per organization and time period.

## Phase 13 — Billing & Monetization

**Goal:** Turn the product into a sustainable SaaS.

### Example plans

**Free**

- 5 monitors
- 5-minute minimum interval
- 7-day retention

**Pro**

- 50 monitors
- 1-minute minimum interval
- 90-day retention

**Team**

- 250 monitors
- 30-second minimum interval
- 365-day retention
- Team collaboration

### Architecture rule

Avoid scattered checks such as:

```text
if plan == "pro"
```

Prefer:

```text
Plan → Entitlements → Usage → Limit validation
```

Introduce Stripe after usage tracking and plan limits are stable.

## Phase 14 — Advanced Monitoring

Features:

- JSON response validation
- Bearer token authentication
- API key authentication
- Basic authentication
- Encrypted secrets
- Custom headers
- Query parameters
- JSON/form bodies
- GET/POST/PUT/PATCH/DELETE
- Response assertions
- JSON path validation

## Phase 15 — Synthetic Monitoring

**Goal:** Test multi-step API workflows.

Example:

```text
POST /login
    ↓
Extract token
    ↓
GET /profile
    ↓
GET /orders
    ↓
Validate response
```

This moves the product from "Is the API reachable?" to "Does my application workflow actually work?"

## Phase 16 — Multi-Region Monitoring

**Goal:** Run checks from multiple geographic locations.

```text
Queue
 ├── India worker
 ├── Europe worker
 └── US worker
        ↓
     Results
```

Benefits:

- Regional outage detection
- Geographic latency
- Better reliability
- Enterprise capability

Do not implement until single-region monitoring is stable.

## Phase 17 — Advanced Analytics

Features:

- Latency trends
- Availability trends
- P95/P99 trends
- Error-rate trends
- Anomaly detection
- Incident frequency
- Endpoint comparisons
- Deployment correlation

## Phase 18 — AI Incident Analysis

AI should enhance monitoring rather than become the core product.

Potential features:

- Analyze latency anomalies
- Correlate HTTP errors
- Identify unusual patterns
- Compare historical behavior
- Summarize likely causes
- Correlate incidents with deployments

Example:

```text
Incident detected

AI analysis:
"Latency increased by 240% approximately 8 minutes
after deployment X. HTTP 500 responses also increased
from 0.2% to 7.8%."
```

Introduce AI only after reliable monitoring data exists.

# 9. Initial Database Design

## users

```text
id
email
password_hash
name
created_at
updated_at
```

## monitors

```text
id
user_id
name
url
method
headers
query_params
body
interval
timeout
expected_status
max_response_time
enabled
created_at
updated_at
```

## monitor_results

```text
id
monitor_id
status_code
response_time
response_size
success
error_type
error_message
checked_at
```

Later:

```text
incidents
notifications
notification_channels
organizations
organization_members
api_keys
status_pages
subscriptions
usage_records
```

Evolve the schema with the product; avoid prematurely creating every future table.

# 10. API Design Principles

Example endpoints:

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout

GET    /api/monitors
POST   /api/monitors
GET    /api/monitors/:id
PATCH  /api/monitors/:id
DELETE /api/monitors/:id

POST   /api/monitors/:id/enable
POST   /api/monitors/:id/disable

GET    /api/monitors/:id/results
GET    /api/monitors/:id/incidents

GET    /api/dashboard
```

Keep business logic out of route handlers:

```text
Route
 ↓
Validation
 ↓
Controller
 ↓
Service
 ↓
Repository/Database
```

# 11. Monitoring Execution Flow

```text
Monitor configuration
        ↓
Scheduler
        ↓
BullMQ job
        ↓
Monitoring worker
        ↓
Security validation
        ↓
HTTP request
        ↓
Measure response
        ↓
Validate result
        ↓
Store result
        ↓
Evaluate incident state
        ↓
Trigger notification if required
```

This flow should be deterministic and heavily tested.

# 12. Security Requirements

Required:

- SSRF protection
- URL validation
- Private IP blocking
- Redirect validation
- Timeout limits
- Response-size limits
- Rate limiting
- Authentication
- Authorization
- Password hashing
- API-key security
- Secret encryption
- Input validation
- SQL injection protection
- Secure CORS
- Secure headers
- Audit logging for sensitive operations

Security should be implemented alongside the relevant feature, not bolted on at the end.

# 13. Testing Strategy

## Unit

Test:

- Validation
- Monitoring logic
- Incident state transitions
- Usage calculations
- Entitlement checks
- Security utilities

## Integration

Test:

```text
API → Database
Queue → Worker → Database
```

## E2E

Test:

```text
Register
 ↓
Login
 ↓
Create monitor
 ↓
Monitor executes
 ↓
View result
 ↓
Incident opens
 ↓
Incident resolves
```

## Security

Explicitly test:

- localhost URLs
- private IPs
- metadata endpoints
- redirects to private IPs
- DNS rebinding scenarios
- oversized responses
- excessive timeouts

# 14. Observability

Before production, track:

- API request duration
- API errors
- Queue depth
- Job failures
- Worker health
- Database latency
- Monitoring success/failure rate
- Notification failures

Eventually:

```text
Logs + Metrics + Error Tracking + Health Checks
```

# 15. Deployment Evolution

## Local

```text
Docker Compose
├── PostgreSQL
└── Redis
```

## Early production

```text
Frontend
   ↓
Managed API
   ↓
Managed PostgreSQL
   ↓
Managed Redis

Worker
   ↓
Managed Redis
```

## Later production

```text
CDN
 ↓
Frontend

Load Balancer
 ↓
API instances
 ↓
PostgreSQL

Redis
 ↓
Worker pool

Object Storage
```

Do not start with Kubernetes. Introduce infrastructure complexity only when justified.

# 16. Development Rules

1. **Incremental architecture** — don't implement future architecture before it is needed.
2. **Small changes** — implement each feature in an isolated branch.
3. **Focused commits** — prefer small, meaningful commits.
4. **Test before moving forward** — each phase has a Definition of Done.
5. **Avoid unnecessary abstractions** — abstract when there is a demonstrated need.
6. **Do not refactor unrelated code during feature work.**
7. **Keep security requirements explicit.**
8. **Prefer measurable, testable requirements over vague goals.**

# 17. Phase Completion Checklist

Before considering a phase complete:

```text
[ ] Feature implemented
[ ] API behavior verified
[ ] Database changes migrated
[ ] Frontend behavior verified
[ ] Error cases handled
[ ] Security implications reviewed
[ ] Tests added
[ ] Existing tests still pass
[ ] Local environment verified
[ ] Documentation updated
[ ] Git branch clean
[ ] PR reviewed
```

# 18. Portfolio Milestones

### Milestone 1

Full-stack monitoring application with authentication and monitor CRUD.

### Milestone 2

Background monitoring system using Redis, BullMQ, and workers.

### Milestone 3

Incident detection, historical analytics, and notifications.

### Milestone 4

Secure multi-tenant SaaS architecture.

### Milestone 5

Usage-based monetization and billing.

### Milestone 6

Advanced synthetic/API workflow monitoring.

These can later become separate portfolio case studies.

# 19. Monetization Strategy

Initial model: usage-based.

Possible dimensions:

- Number of monitors
- Check frequency
- Data retention
- Team members
- Status pages
- API usage
- Synthetic checks
- Monitoring regions

Possible progression:

```text
Free → Pro → Team → Business
```

First objective: prove that users find monitoring useful. Pricing complexity comes later.

# 20. Cost Control

Monitoring products execute requests continuously, so track:

- Number of checks
- Check frequency
- Worker CPU
- Redis memory
- PostgreSQL storage
- Result retention
- Notification volume
- Logs

Example:

A monitor running every 30 seconds produces:

```text
120 checks/hour
2,880 checks/day
86,400 checks/month
```

Therefore pricing and usage limits should eventually reflect infrastructure cost.

# 21. What Makes This Project Advanced?

The project demonstrates an engineering progression:

```text
CRUD
 ↓
Authentication
 ↓
Background jobs
 ↓
Scheduling
 ↓
Workers
 ↓
Distributed processing
 ↓
Security
 ↓
Incident management
 ↓
Analytics
 ↓
Multi-tenancy
 ↓
Usage metering
 ↓
Billing
 ↓
Synthetic monitoring
 ↓
Multi-region execution
 ↓
AI-assisted incident analysis
```

This progression is more valuable than simply adding many unrelated features.

# 22. Recommended Implementation Order

```text
Phase 0  Project Foundation
   ↓
Phase 1  Database & API Foundation
   ↓
Phase 2  Authentication
   ↓
Phase 3  Monitor CRUD
   ↓
Phase 4  Monitoring Engine
   ↓
Phase 5  SSRF & Security
   ↓
Phase 6  Dashboard & Analytics
   ↓
Phase 7  Incidents
   ↓
Phase 8  Notifications
   ↓
Phase 9  Public Status Pages
   ↓
Phase 10 Teams & SaaS
   ↓
Phase 11 API Keys
   ↓
Phase 12 Usage Metering
   ↓
Phase 13 Billing
   ↓
Phase 14 Advanced Monitoring
   ↓
Phase 15 Synthetic Monitoring
   ↓
Phase 16 Multi-Region
   ↓
Phase 17 Advanced Analytics
   ↓
Phase 18 AI Incident Analysis
```

# 23. Current Project Status

At the start of this plan:

```text
Phase 0 — Project Foundation
IN PROGRESS
```

Current focus:

- Repository setup
- pnpm workspace
- React app
- Node API
- TypeScript
- PostgreSQL
- Redis
- Docker Compose
- Database package

Do not begin feature development until the foundation is stable.

# 24. Final Product Vision

The intended end-to-end experience:

```text
Create account
      ↓
Create API monitor
      ↓
Choose monitoring interval
      ↓
Worker executes checks
      ↓
Results stored
      ↓
Dashboard shows health
      ↓
Failures create incidents
      ↓
User receives notification
      ↓
API recovers
      ↓
Incident resolves
      ↓
Historical analytics available
      ↓
Public status page available
      ↓
Team members collaborate
      ↓
Usage is measured
      ↓
Customer upgrades plan
```

The product should remain understandable, secure, maintainable, and testable at every stage.

> **Build the simplest architecture that can support the current phase, then evolve it when the product requires it.**
