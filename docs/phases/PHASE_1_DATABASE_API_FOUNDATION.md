# Phase 1 — Database & API Foundation

## Status

🟡 **In Progress**

## Branch

`feat/phase-1-database-api-foundation`

## Goal

Build the first real backend foundation of the API Monitoring SaaS on top of the completed Phase 0 infrastructure.

Phase 1 introduces persistent application data, a structured API architecture, database migrations, validation, centralized error handling, and a clean database access boundary. It should leave the project ready for authentication and monitor CRUD in later phases without prematurely implementing those features.

---

## Phase 1 Progress

### Completed

- [x] Drizzle ORM introduced
- [x] PostgreSQL connection configured
- [x] `packages/database` established as the shared database package
- [x] Initial database schema created
- [x] `users` table created
- [x] `monitors` table created
- [x] `monitor_results` table created
- [x] Primary keys and relationships defined
- [x] Initial indexes defined
- [x] Drizzle migration generated
- [x] Initial migration applied successfully
- [x] Database connectivity verified from the API
- [x] API application/server responsibilities separated
- [x] Centralized API configuration established
- [x] Route organization established
- [x] Database access boundary established
- [x] Centralized error handling implemented
- [x] Request validation with Zod implemented
- [x] `/health` endpoint preserved and verified
- [x] Root `.env` and `.env.example` established
- [x] Environment validation implemented
- [x] Temporary database connectivity endpoint verified and removed after use
- [x] API and database package typechecking verified

### Remaining

- [ ] Finalize API response conventions
- [ ] Add explicit 404 handling
- [ ] Implement graceful server shutdown
- [ ] Implement database pool shutdown
- [ ] Establish API testing foundation
- [ ] Review database constraints and indexes against expected access patterns
- [ ] Review timestamp/deletion strategies
- [ ] Review TypeScript/build/lint configuration
- [ ] Run final Phase 1 verification suite
- [ ] Complete final architecture review
- [ ] Update this document with final verification results
- [ ] Mark Phase 1 complete

---

# 1. Scope

## Database

Phase 1 establishes the initial persistent data model using PostgreSQL and Drizzle ORM.

The initial model intentionally contains only three tables:

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

Purpose:

- Stable user identity
- Basic account metadata
- Ownership boundary for monitors

Current fields include:

- UUID primary key
- Unique email
- Created timestamp
- Updated timestamp

Authentication behavior does not belong to Phase 1.

### `monitors`

Purpose:

Store API monitoring configurations that will eventually be executed by the monitoring engine.

Current concepts include:

- User ownership
- Monitor name
- Target URL
- HTTP method
- Monitoring interval
- Timeout
- Expected status code
- Active state
- Created/updated timestamps

An index exists on `user_id` because monitor lookup by owner is an expected access pattern.

### `monitor_results`

Purpose:

Store the outcome of monitor executions for future uptime and latency analytics.

Current concepts include:

- Monitor relationship
- Success/failure state
- HTTP status code
- Response latency
- Error message
- Execution timestamp

An index exists on `(monitor_id, checked_at)` to support historical result queries by monitor and time.

---

# 2. Database Package

Database functionality is isolated in:

```text
packages/database/
```

Current structure:

```text
packages/database/
├── src/
│   ├── client.ts
│   ├── index.ts
│   └── schema/
│       ├── users.ts
│       ├── monitors.ts
│       ├── monitor-results.ts
│       └── index.ts
├── drizzle/
│   ├── migration files
│   └── meta/
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

## Database ownership rule

The `@api-monitoring/database` package owns:

- PostgreSQL connectivity
- `pg`
- Drizzle ORM
- Database schemas
- Database migrations
- Database-specific infrastructure

The API consumes the database package rather than creating PostgreSQL/Drizzle infrastructure itself.

Preferred dependency direction:

```text
apps/api
    │
    │ @api-monitoring/database
    ▼
packages/database
    │
    ├── Drizzle
    ├── pg
    └── PostgreSQL
```

The API creates one shared database instance from the database package rather than opening connections per request.

---

# 3. Database Schema Organization

Schemas are grouped by responsibility under:

```text
packages/database/src/schema/
```

Related schema definitions should remain in separate files rather than being placed into one large schema file.

The schema index acts as the public schema export.

This organization should continue as the database grows.

Do not create speculative schema files for features that do not yet exist.

---

# 4. Migration Strategy

Drizzle migrations are stored in:

```text
packages/database/drizzle/
```

Generated migration files and migration metadata are committed to Git.

The migration workflow is:

```text
Schema change
    ↓
Generate migration
    ↓
Review generated SQL
    ↓
Apply migration locally
    ↓
Verify database
    ↓
Commit schema + migration
```

Never modify an already-applied migration to represent a new schema change.

Instead, create a new migration.

## Database evolution strategy

The initial database is intentionally small. Future requirements are expected to evolve the schema through explicit, versioned migrations.

When a new requirement affects the database:

1. Evaluate whether the existing schema can support it.
2. Extend the schema only as required.
3. Generate an explicit migration.
4. Preserve existing data whenever possible.
5. Verify the migration against a representative database state.
6. Commit the migration together with the schema change.

Database simplicity in an early phase is not a limitation on future functionality. Schema evolution is expected.

---

# 5. API Architecture

The API has been moved away from a single-file structure toward clear responsibility boundaries.

Current structure:

```text
apps/api/src/
├── config/
│   └── env.ts
├── database/
│   └── index.ts
├── middleware/
│   ├── error-handler.ts
│   └── validate.ts
├── routes/
│   ├── health.ts
│   └── index.ts
├── app.ts
└── server.ts
```

## `app.ts`

Responsibilities:

- Create the Express application
- Register global middleware
- Register routes
- Register error handling

`app.ts` does not start the HTTP server.

## `server.ts`

Responsibilities:

- Load the application
- Start the HTTP server
- Use the configured port

Graceful shutdown remains a remaining Phase 1 task.

## Routes

Routes are organized under:

```text
apps/api/src/routes/
```

The route registry composes the individual route modules.

Current permanent route:

```text
GET /health
```

Temporary database connectivity verification was performed through a separate endpoint and removed after successful verification.

---

# 6. Configuration Strategy

Environment configuration is centralized in:

```text
apps/api/src/config/env.ts
```

The API validates required environment variables using Zod.

Application code should consume the typed configuration object rather than repeatedly accessing `process.env`.

Preferred pattern:

```text
process.env
    ↓
configuration module
    ↓
validated env object
    ↓
application
```

Current required infrastructure configuration includes:

- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `REDIS_URL`

The root `.env` is local-only and must not be committed.

The `.env.example` file is committed and should remain synchronized with required variables.

---

# 7. Validation Strategy

Zod is used for runtime validation at API boundaries.

The intended flow is:

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

Validation should happen before application/business logic executes.

Validation middleware should remain reusable and focused on request-boundary concerns.

Do not introduce additional validation libraries.

---

# 8. Error Handling Strategy

The API uses centralized Express error handling.

Routes should pass errors into the central handler rather than inventing individual response formats.

The error handler is responsible for:

- Handling known application errors
- Handling validation errors
- Returning consistent JSON responses
- Avoiding leakage of internal implementation details
- Handling unexpected errors safely

Conceptually:

```text
Route
  ↓
Error
  ↓
next(error)
  ↓
Central Error Handler
  ↓
Consistent API Response
```

Final API response conventions remain to be documented and standardized before Phase 1 is completed.

---

# 9. Database Integration

The API consumes the shared workspace package:

```text
@api-monitoring/database
```

The API database boundary is:

```text
apps/api/src/database/index.ts
```

It creates the shared database client and pool using the validated `DATABASE_URL`.

The API should not bypass this boundary to instantiate Drizzle or PostgreSQL directly.

## Connectivity verification

Database connectivity was verified successfully through the API.

A temporary database route returned a successful response, confirming the full path:

```text
API
 ↓
@api-monitoring/database
 ↓
Drizzle
 ↓
PostgreSQL
```

After verification, the temporary route and related temporary code were removed.

A permanent database readiness/health endpoint is **not yet implemented** and remains a Phase 1 task if required by the final health/readiness design.

---

# 10. Important Engineering Rules

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
14. **Group related files by responsibility as the application grows.**
15. **Do not create folders or abstractions only for hypothetical future features.**
16. **Temporary debugging/connectivity code must be removed after verification unless it has a legitimate permanent purpose.**

---

# 11. Out of Scope

Do not implement the following as part of Phase 1:

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

# 12. Verification Completed So Far

The following have been verified during Phase 1 implementation:

- [x] PostgreSQL container is running
- [x] Redis container is running
- [x] Initial migration generated
- [x] Initial migration applied
- [x] Three database tables created
- [x] Database package typechecks
- [x] API package typechecks after resolving the Drizzle dependency duplication issue
- [x] API starts successfully
- [x] `/health` works
- [x] Request validation works
- [x] Centralized error route/handling works
- [x] Database connectivity through the API works
- [x] Temporary database connectivity route was removed after verification

---

# 13. Remaining Phase 1 Work

## API

- [ ] Define final API response conventions
- [ ] Add explicit 404 handling
- [ ] Implement graceful server shutdown
- [ ] Implement database pool shutdown
- [ ] Establish API test structure and initial tests

## Database

- [ ] Review schema constraints
- [ ] Review indexes against expected access patterns
- [ ] Confirm timestamp strategy
- [ ] Confirm deletion/cascade strategy
- [ ] Review database pool configuration
- [ ] Document migration workflow

## Project Quality

- [ ] Run full `pnpm build`
- [ ] Run full `pnpm typecheck`
- [ ] Run full `pnpm lint`
- [ ] Review TypeScript configuration
- [ ] Review formatting/linting configuration
- [ ] Review CI expectations

## Finalization

- [ ] Perform final Phase 1 architecture review
- [ ] Update this document with final verification results
- [ ] Confirm no Phase 2+ functionality has slipped into the branch
- [ ] Mark Phase 1 complete

---

# 14. Implementation Sequence From Here

The remaining work should proceed in this order:

```text
1. API response conventions
          ↓
2. 404 handling
          ↓
3. Graceful server shutdown
          ↓
4. Database pool shutdown
          ↓
5. API testing foundation
          ↓
6. Database/schema review
          ↓
7. Full build/typecheck/lint verification
          ↓
8. Final architecture review
          ↓
9. Update Phase 1 documentation
          ↓
10. Mark Phase 1 complete
```

Do not start Phase 2 until the Phase 1 completion criteria have been reviewed.

---

# 15. Definition of Done

Phase 1 is complete when:

### Database

- [x] Database package is implemented
- [x] Drizzle is configured
- [x] PostgreSQL connection works
- [x] Initial schema is implemented
- [x] Initial migration exists and has been applied
- [x] `users`, `monitors`, and `monitor_results` exist in PostgreSQL
- [x] API can consume the database package

### API

- [x] Express application exists
- [x] `app.ts` and `server.ts` are separated
- [x] Routes are organized
- [x] `/health` works
- [x] Centralized error handling exists
- [x] Request validation exists
- [x] Database integration exists
- [ ] API response conventions are finalized
- [ ] 404 handling is implemented
- [ ] Graceful shutdown is implemented
- [ ] Database pool shutdown is implemented
- [ ] API testing foundation is established

### Configuration

- [x] Environment configuration exists
- [x] Environment variables are validated
- [x] `.env.example` exists
- [x] Secrets are excluded from Git

### Quality

- [ ] Full build passes
- [ ] Full typecheck passes
- [ ] Full lint passes
- [ ] Final architecture review completed

---

# 16. Architectural Decisions

## Dedicated Database Package

Database functionality is isolated in `packages/database`.

**Reason:**

- Keeps database infrastructure separate from HTTP concerns
- Allows future packages/apps to reuse database functionality
- Prevents the API from owning database connection setup
- Creates a clear dependency boundary

## Separate Application and Server

`app.ts` constructs the Express application while `server.ts` starts the server.

**Reason:**

- Clear responsibilities
- Easier testing
- Prevents server startup from being coupled to application construction

## Centralized Environment Validation

Environment variables are validated once through Zod.

**Reason:**

- Fail fast on invalid configuration
- Provides typed configuration
- Prevents scattered `process.env` usage

## Centralized Error Handling

Errors flow through one Express error handler.

**Reason:**

- Consistent API responses
- Prevents internal errors from leaking to clients
- Makes future application-specific errors easier to support

## Reusable Request Validation Middleware

Zod validation is implemented as middleware.

**Reason:**

- Keeps validation separate from route logic
- Allows schemas to be reused
- Establishes a consistent validation pattern

## Route Organization

Routes are separated from `app.ts`.

**Reason:**

- Prevents `app.ts` from becoming a large file
- Makes future feature modules easier to introduce
- Establishes a predictable API structure

## Avoid Premature Abstractions

The project does not introduce controllers, services, repositories, custom error classes, dependency injection, or generic CRUD abstractions unless actual complexity requires them.

**Reason:**

The project is still in its foundation stage. Abstractions should solve demonstrated problems rather than hypothetical future ones.

---

# 17. Notes for Future Phases

Whenever an architectural decision, constraint, important implementation lesson, or database evolution rule is discovered, update this document or the main execution plan rather than leaving the decision only in chat history.

The goal is for a future developer or coding agent to be able to read the project documentation and understand:

- What was implemented
- Why it was implemented
- Which architectural decisions were made
- Which rules should be followed
- What remains to be done
- What has already been verified
- What is intentionally out of scope

---

# 18. Final Status

🟡 **In Progress**

Phase 1 database and API foundation is substantially implemented. The remaining work is primarily API hardening, lifecycle management, testing, final quality verification, and architecture review.

### Next Step

Complete the remaining API foundation tasks, beginning with **API response conventions**.
