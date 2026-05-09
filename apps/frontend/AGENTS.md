# Frontend Agent Guidelines

## Project Overview

This frontend application is part of a Turborepo monorepo.

Main stack:

- React 19
- React Router DOM v7 (Framework Mode, Client Side Rendering)
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack React Query
- Shared types and schemas from `@repo/shared`

The frontend consumes the backend REST API and should maintain strong type safety across the application using the shared package.

---

# Main Principles

- Prioritize simplicity and readability over abstraction.
- Prefer composition over overly generic reusable components.
- Keep components small and focused.
- Avoid premature optimization.
- Avoid unnecessary global state.
- Use React Query for all server state management.
- Keep UI responsive and accessible.
- Prefer explicit typing instead of `any`.
- Reuse schemas/types from `@repo/shared` whenever possible.
- Avoid duplicating backend DTO types in the frontend.

---

# Routing

This project uses:

- React Router DOM v7
- Framework Mode
- Client Side Rendering (CSR)

Guidelines:

- Keep routes colocated with their pages when possible.
- Use nested routes only when they improve clarity.
- Avoid deeply nested route structures.
- Route loaders should remain lightweight.
- Prefer React Query for data fetching and caching.

Suggested structure:

```
src/
  routes/
    dashboard/
    projects/
    auth/
```

---

# API Layer

All API communication should be centralized.

Suggested structure:

```
src/
  services/
    http/
      client.ts
    projects/
      projects.api.ts
    tasks/
      tasks.api.ts
```

Guidelines:

- Keep fetch logic separate from UI components.
- API modules should only contain request logic.
- UI transformations belong in hooks/components, not API clients.
- Prefer typed request/response contracts.

Example:

```
import type { Project } from "@repo/shared";
```

---

# React Query

Use React Query for:

- data fetching
- caching
- mutations
- invalidation
- optimistic updates when useful

Guidelines:

- Keep query keys centralized.
- Prefer object query keys when parameters grow.
- Invalidate queries intentionally.
- Avoid unnecessary refetching.
- Prefer custom hooks wrapping React Query.

Suggested structure:

```
src/
  queries/
    projects/
      use-projects-query.ts
      use-create-project-mutation.ts
```

---

# Components

Use shadcn/ui as the main component system.

Guidelines:

- Prefer shadcn primitives before creating custom UI.
- Create reusable components only after duplication appears.
- Avoid giant smart components.
- Separate presentation from business logic when complexity grows.
- Prefer controlled forms when appropriate.

Suggested structure:

```
src/
  components/
    ui/
    layout/
    forms/
    projects/
```

---

# Styling

Use:

- Tailwind CSS
- shadcn/ui
- utility-first approach

Guidelines:

- Prefer utility classes over custom CSS files.
- Extract reusable patterns into components instead of utility abstractions too early.
- Keep spacing consistent.
- Prioritize responsive layouts.
- Prefer CSS grid/flexbox over fixed positioning.

---

# Forms

Recommended stack:

- React Hook Form
- Zod validation (zod v4, be careful of the deprecateds)
- Shared schemas from `@repo/shared` when possible

Guidelines:

- Keep validation schemas close to forms unless shared with backend.
- Show user-friendly validation messages.
- Handle loading and disabled states correctly.

---

# State Management

Preferred order:

1. Local component state
2. URL/search params
3. React Query cache
4. Global state only if truly necessary

Avoid introducing Redux/Zustand unless clearly justified.

---

# Error Handling

Guidelines:

- Handle API errors gracefully.
- Show meaningful user feedback.
- Avoid silent failures.
- Keep fallback states simple and clear.

---

# Authentication

Authentication is handled by the backend using Better Auth.

Frontend responsibilities:

- Manage session state
- Persist authentication when needed
- Redirect protected routes
- Handle unauthorized states gracefully

Avoid implementing custom auth logic outside backend contracts.

---

# Folder Structure

Suggested structure:

```
src/
  components/
  features/
  hooks/
  lib/
  providers/
  queries/
  routes/
  services/
  types/
  utils/
```

---

# Type Safety

Always prioritize end-to-end type safety.

Use:

```
import type {
  Project,
  Task,
  CreateProjectBody,
} from "@repo/shared";
```

Avoid:

- duplicated DTOs
- duplicated enums
- frontend-only copies of backend contracts

---

# UX Expectations

The application should feel:

- fast
- clean
- responsive
- intuitive

Minimum UX expectations:

- loading states
- empty states
- optimistic feedback when useful
- disabled states during mutations
- proper error handling

---

# Performance

- Use React Query caching effectively.
- Avoid unnecessary rerenders.
- Lazy load routes when beneficial.
- Memoization should only be added when truly useful.

---

# Accessibility

Minimum accessibility expectations:

- semantic HTML
- keyboard navigation
- visible focus states
- accessible forms
- proper button usage
- labels connected to inputs

---

# Testing

Preferred tools:

- Vitest
- React Testing Library

Focus on:

- critical flows
- user interactions
- API state handling

Avoid over-testing implementation details.

---

# Code Style

- Use clear naming.
- Prefer explicitness over cleverness.
- Keep files reasonably small.
- Remove dead code.
- Avoid unnecessary comments.
- Use absolute imports when configured.

---

# Important

This project prioritizes:

- maintainability
- developer experience
- clarity
- consistency
- type safety

Over:

- unnecessary abstractions
- premature optimization
- overengineering
