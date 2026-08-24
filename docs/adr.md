# Architecture Decision Record: Review Service Extraction & Serverless Function

## ADR-001: Extract Reviews into Standalone Microservice

**Status:** Accepted
**Date:** 2026-08-18

### Decision
Extract the Review feature from the monolithic backend into an independent, standalone Review Service with its own codebase and deployment.

### Context
Reviews were already partially isolated — stored in MongoDB (via Mongoose) while all other data lived in PostgreSQL (via Prisma). This cross-database architecture created operational complexity. The review logic (create, fetch, rating aggregation) is self-contained with minimal coupling to other business logic.

### Consequences
- **Positive:** Independent deployment, single responsibility, can scale reviews independently, eliminates MongoDB dependency entirely (migrated to PostgreSQL)
- **Negative:** Additional network latency for inter-service calls, need to maintain two codebases, eventual consistency between product ratings and review data
- **Mitigation:** Backend gracefully handles Review Service downtime by returning empty reviews; rating sync happens synchronously on review creation

---

## ADR-002: Email Notifications as Vercel Serverless Function

**Status:** Accepted
**Date:** 2026-08-18

### Decision
Implement order confirmation and welcome email notifications as a Vercel Serverless Function running outside the main application.

### Context
Email sending is a background task that should not block the main request-response cycle. Users expect instant feedback on order placement, but email delivery can tolerate slight delays. Serverless functions are ideal for sporadic, event-driven workloads like notifications.

### Consequences
- **Positive:** No resource waste when idle, automatic scaling during traffic spikes, failure in email delivery doesn't affect core functionality, zero infrastructure management
- **Negative:** Cold start latency (acceptable for background tasks), harder to debug than synchronous code, limited execution time (10s on Vercel hobby plan)
- **Mitigation:** Structured logging with timestamps and severity levels for observability; retry logic can be added via webhook triggers
