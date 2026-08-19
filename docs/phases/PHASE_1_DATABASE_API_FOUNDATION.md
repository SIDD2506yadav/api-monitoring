# Phase 1 — Database & API Foundation

## Status

🟡 **Planned / Not Started**

## Goal

Build the first real backend foundation of the API Monitoring SaaS on top of the completed Phase 0 infrastructure.

Phase 1 introduces persistent application data, a structured API architecture, database migrations, validation, and centralized error handling. It should leave the project ready for authentication and monitor CRUD in the following phases without prematurely implementing those features.

---

## Starting Point

Phase 0 is complete. The repository currently has:

- pnpm monorepo/workspace
- React + Vite frontend
- Express API
- TypeScript
- Docker Compose
- PostgreSQL development service
- Redis development service
- `/health` API endpoint
- Working development, build, lint, and typecheck workflows

The database package exists as a workspace location but application database access/schema/migrations have not yet been introduced.

---

## Scope

### Database

- [ ] Introduce Drizzle ORM
- [ ] Configure PostgreSQL connection
- [ ] Establish `packages/database` as the shared database package
- [ ] Define initial database schema
- [ ] Add `users` table
- [ ] Add `monitors` table
- [ ] Add `monitor_results` table
- [ ] Define primary keys and relationships
- [ ] Define required indexes based on expected access patterns
- [ ] Configure Drizzle migrations
- [ ] Generate and apply initial migration
- [ ] Verify database connectivity

### API Architecture

- [ ] Separate Express app creation from server startup
- [ ] Establish API configuration module
- [ ] Establish route organization
- [ ] Establish service layer conventions where appropriate
- [ ] Establish database access boundary
- [ ] Add centralized error-handling middleware
- [ ] Add request validation with Zod
- [ ] Define consistent API error responses
- [ ] Preserve `/health` endpoint
- [ ] Add database health/readiness verification

### Configuration & Environment

- [ ] Define required Phase 1 environment variables
- [ ] Validate required environment configuration at startup
- [ ] Keep secrets out of source control
- [ ] Keep `.env.example` synchronized with required variables

### Verification

- [ ] PostgreSQL connection works from the application
- [ ] Initial migration applies successfully
- [ ] Database schema matches the intended model
- [ ] API starts with the new architecture
- [ ] `/health` continues to work
- [ ] Database health check works
- [ ] Invalid request payloads return consistent validation errors
- [ ] Unexpected API errors are handled centrally
- [ ] `pnpm build` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] Development workflow continues to work

---

## Out of Scope

Do **not** implement the following in Phase 1:

- Authentication
- Password hashing
- Sessions/JWT
- Login/signup UI
- Monitor CRUD endpoints
- Monitor execution
- Monitoring workers
- BullMQ queues
- Incident management
- Notifications
- Dashboard functionality
- Status pages
- Billing
- Teams/organizations
- API keys
- Multi-region monitoring
- AI/advanced analytics

These belong to later phases in the execution plan.

---

## Proposed Database Model

The initial application model is intentionally small:

```text
users
  │
  │ one-to-many
  ▼
monitors
  │
  │ one-to-many
  ▼
monitor_results
```

### `users`

Represents an application user.

Expected responsibilities:

- Stable user identity
- Basic account metadata
- Ownership boundary for monitors

Authentication-specific fields should only be added where required by the Phase 1 data model. Authentication behavior itself belongs to Phase 2.

### `monitors`

Represents an API endpoint/configuration that will eventually be executed by the monitoring engine.

The initial schema should capture the configuration required for future monitor execution without implementing execution itself.

Expected concepts include:

- Owner/user relationship
- Monitor name
- Target URL
- HTTP method
- Monitoring interval
- Timeout
- Expected response configuration/status
- Active/enabled state
- Created/updated timestamps

The exact schema should be finalized against the execution plan and actual application requirements before implementation.

### `monitor_results`

Stores the outcome of a monitor execution for future uptime and latency analytics.

Expected concepts include:

- Monitor relationship
- Success/failure state
- HTTP status when available
- Response latency
- Error information when applicable
- Execution timestamp

The schema should be designed for the access patterns expected in later monitoring and analytics phases.

---

## Proposed API Architecture

The API should move from the current single-file server toward a clear separation of concerns:

```text
HTTP Request
     │
     ▼
Express App
     │
     ├── Middleware
     │     ├── Request parsing
     │     ├── Validation
     │     └── Error handling
     │
     ▼
Routes / Controllers
     │
     ▼
Services
     │
     ▼
Database Package
     │
     ▼
PostgreSQL
```

### Responsibilities

**`server.ts`**

- Load startup configuration as required
- Create/start the HTTP server
- Handle graceful shutdown concerns when needed

**`app.ts`**

- Create and configure the Express application
- Register middleware
- Register routes
- Register error handling

**Routes/controllers**

- Translate HTTP requests into application operations
- Perform request-level validation
- Return HTTP responses
- Avoid embedding database implementation details

**Services**

- Hold application/business operations where complexity warrants a service boundary
- Coordinate database operations
- Remain independent of Express request/response objects

**Database package**

- Own PostgreSQL connection/client setup
- Own Drizzle configuration/schema
- Expose database access to the API through a stable package boundary

---

## Validation Strategy

Use **Zod** for runtime validation at API boundaries.

Validation should happen before application logic executes.

Conceptually:

```text
HTTP Request
     ↓
Parse
     ↓
Validate with Zod
     ↓
Valid → route/service
Invalid → structured 4xx response
```

Validation errors should not leak internal implementation details.

---

## Error Handling Strategy

The API should use centralized error handling rather than implementing ad-hoc error responses in every route.

A consistent error response should provide enough information for the frontend/API consumer to understand the failure while avoiding sensitive internal details.

Conceptually:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed"
  }
}
```

The exact response contract should be finalized during implementation and kept consistent across the API.

---

## Database Migration Strategy

Drizzle migrations will be the source of truth for schema changes.

The workflow should be:

```text
Schema change
    ↓
Drizzle migration generation
    ↓
Migration files committed
    ↓
Migration applied to local PostgreSQL
    ↓
Application uses migrated schema
```

Generated migration files should be committed to the repository so a fresh environment can reproduce the database schema.

Do not rely on manually editing the database as the long-term schema-management mechanism.

### Database Evolution Strategy

The initial database model should remain intentionally small and focused on current product requirements.

The schema is expected to evolve as real product requirements emerge. New features should be introduced through explicit, versioned Drizzle migrations rather than speculative tables or fields being added in advance.

When a new requirement affects the database:

1. Evaluate whether the existing schema can support it.
2. Extend the schema only as required.
3. Generate an explicit migration.
4. Preserve existing data whenever possible.
5. Verify the migration against a representative database state.
6. Commit the migration together with the schema change.

Database simplicity in an early phase must not be treated as a limitation on future functionality. Schema evolution is an expected part of the project lifecycle.

---

## Configuration Strategy

Phase 1 should establish explicit configuration rather than allowing environment access to be scattered throughout application code.

Preferred conceptual structure:

```text
process.env
    ↓
configuration module
    ↓
validated application configuration
    ↓
API / database / infrastructure
```

This makes missing or invalid configuration fail early and makes dependencies easier to understand and test.

---

## Implementation Approach

Phase 1 should be implemented incrementally rather than as one large change.

### Step 1 — Audit

Before changing code:

- Inspect current workspace/package state
- Inspect existing `packages/database`
- Inspect API structure
- Inspect current dependencies
- Confirm PostgreSQL/Redis environment variables
- Confirm Phase 0 remains intact

### Step 2 — Database package

- Configure package metadata
- Install only required database dependencies
- Configure Drizzle
- Establish PostgreSQL client
- Create schema files
- Export the database interface

### Step 3 — Schema & migrations

- Implement initial schema
- Add relationships and indexes
- Generate migration
- Apply migration locally
- Verify resulting PostgreSQL schema

### Step 4 — API restructuring

- Separate `app.ts` and `server.ts`
- Add configuration handling
- Add route organization
- Introduce database package dependency
- Preserve existing `/health`

### Step 5 — Validation & errors

- Add Zod
- Establish validation conventions
- Add centralized error middleware
- Establish API error response shape

### Step 6 — Database health

Extend readiness/health behavior so the API can verify PostgreSQL connectivity without coupling future monitoring logic to the health endpoint.

### Step 7 — Verification

Run the full project verification suite and test the database from a clean local state.

---

## Important Engineering Rules

1. **Do not implement future-phase features early.**
2. **Keep database access inside `packages/database`.**
3. **Do not scatter `process.env` access throughout the application.**
4. **Validate external input at API boundaries.**
5. **Use centralized error handling.**
6. **Keep routes/controllers thin.**
7. **Do not put business logic directly into Express middleware.**
8. **Keep migrations committed and reproducible.**
9. **Prefer small, focused modules over premature abstraction.**
10. **Do not introduce microservices or workers during Phase 1.**
11. **Do not change frontend behavior unless required for Phase 1 integration.**
12. **Do not introduce a second ORM or validation library.**
13. **Prefer evolving the database through explicit migrations over speculative schema design.**

---

## Expected Result

At the end of Phase 1, the system should look approximately like:

```text
                         ┌──────────────────┐
                         │   React / Vite   │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Express API    │
                         │                  │
                         │ Routes           │
                         │ Validation       │
                         │ Error handling   │
                         │ Configuration    │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ packages/database│
                         │                  │
                         │ Drizzle          │
                         │ Schema           │
                         │ DB client        │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   PostgreSQL     │
                         └──────────────────┘

                         ┌──────────────────┐
                         │      Redis       │
                         │   infrastructure │
                         └──────────────────┘
```

Redis remains available as Phase 0 infrastructure but is not required to become part of the application request path during Phase 1.

---

## Definition of Done

Phase 1 is complete only when:

- [ ] Database package is implemented
- [ ] Drizzle is configured
- [ ] PostgreSQL connection works
- [ ] Initial schema is implemented
- [ ] Migrations are generated and reproducible
- [ ] `users`, `monitors`, and `monitor_results` exist in PostgreSQL
- [ ] API architecture is separated into appropriate responsibilities
- [ ] Configuration is centralized and validated
- [ ] Zod validation is established
- [ ] Centralized error handling is established
- [ ] API database health/readiness check works
- [ ] Phase 0 development workflow still works
- [ ] `pnpm build` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] No Phase 2+ functionality has been introduced

---

## Implementation Notes

This section should be updated during implementation with concrete decisions, file locations, dependency choices, and deviations from the plan.

### Decisions

- The Phase 1 database will start with only `users`, `monitors`, and `monitor_results`.
- Future database capabilities will be added when actual product requirements emerge, using explicit Drizzle migrations.
- We will avoid speculative fields and tables unless there is a concrete current requirement for them.

### Problems Encountered

_No problems recorded yet._

### Verification Results

_Not started._

---

## Final Status

🟡 **Planned / Not Started**

### Branch

`feat/phase-1-database-api-foundation`

### Next Step

Audit the current repository and dependencies, then begin implementation from the database package foundation.
