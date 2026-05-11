# Backend Development Guidelines

This project uses a pragmatic and strongly typed backend architecture focused on maintainability, developer experience, and rapid iteration.

## Stack

- Runtime: Node.js
- Framework: Elysia.js
- Language: TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Authentication: Better Auth
- Validation: Zod / Elysia schemas
- API Style: REST
- Package Manager: pnpm

---

# Architecture Principles

- Prioritize simplicity and maintainability over overengineering.
- Keep modules cohesive and focused.
- Favor strong typing and schema validation across all layers.
- Use a clean and modular architecture without excessive abstraction.
- Prefer explicit code over unnecessary magic.
- Keep the codebase easy to navigate and understand.

---

# Project Structure

The backend should follow a modular architecture organized by domain.

Example:

src/
modules/
auth/
projects/
tasks/
lib/
middleware/
plugins/
db/
app.ts

Each module should follow this structure:

modules/
tasks/
task.controller.ts
task.repository.ts
task.serializers.ts
task.routes.ts

---

Create the schema and types only if needed. If the types could be used in the frontend,
create them in the `packages/shared` module

# Layer Responsibilities

## Controllers

Controllers are responsible for:

- handling HTTP requests
- extracting params/body/query data
- calling services
- returning HTTP responses

Controllers should remain thin and should NOT contain business logic.

---

## Services

Services contain business logic.

Responsibilities:

- validations that belong to business rules
- orchestration between repositories
- transactional logic
- domain-specific operations

Services should not directly depend on HTTP concepts.

---

## Repositories

Repositories are responsible for database access.

Responsibilities:

- Prisma queries
- data persistence
- query composition

Repositories should avoid business logic.

---

# API Design

- Use RESTful conventions.
- Use consistent naming across endpoints.
- Return proper HTTP status codes.
- All request bodies, params, and responses must be validated.
- Avoid deeply nested routes.

Examples:

- GET /projects
- POST /projects
- PATCH /tasks/:id
- GET /tasks?status=done

---

# Validation

- All external input must be validated.
- Prefer shared Zod schemas when possible.
- Reuse schemas from the shared package whenever applicable.
- Never trust client input.
- Request validation should happen close to the controller layer.

---

# Database Guidelines

- Use Prisma ORM.
- Use Prisma migrations for all schema changes.
- Never manually mutate database structure outside migrations.
- Use Prisma seed scripts for local development data.
- Favor clear relational modeling over premature optimization.

---

# Authentication

- Use Better Auth for authentication flows.
- Keep auth configuration isolated in the auth module.
- Protect private routes with middleware/plugins.
- Never expose sensitive data in API responses.

---

# Error Handling

- Use centralized error handling whenever possible.
- Return consistent error response shapes.
- Avoid leaking internal errors to clients.
- Prefer meaningful messages over generic failures.

---

# Type Safety

- Maximize end-to-end type safety.
- Prefer inferred types from schemas.
- Avoid using `any`.
- Shared DTOs and schemas should live in the shared package.

---

# Code Style

- Prefer small and readable functions.
- Use descriptive naming.
- Avoid deeply nested logic.
- Avoid large files.
- Keep controllers thin.
- Business logic belongs in services.
- Database access belongs in repositories.

---

# Performance & Scalability

- Avoid premature optimization.
- Keep queries efficient and predictable.
- Use pagination for list endpoints if necessary.
- Prefer simplicity over unnecessary caching layers.

Redis or distributed caching should NOT be introduced unless explicitly required.

---

# Developer Experience

- The project should be easy to run locally.
- Docker Compose should support local PostgreSQL setup.
- Commands should remain simple and predictable.
- Swagger/OpenAPI documentation should remain functional.

---

# Testing

- Prioritize meaningful tests over excessive coverage.
- Focus on:
  - service logic
  - validation
  - critical API flows

---

# Important Constraints

DO NOT:

- introduce microservices
- introduce CQRS/event sourcing
- add unnecessary abstraction layers
- add complex dependency injection systems
- introduce excessive configuration
- create generic base classes prematurely

This project values clarity and pragmatism.

---

# Goal

The backend should feel:

- modern
- strongly typed
- maintainable
- easy to understand
- production-oriented
- pleasant to work with
