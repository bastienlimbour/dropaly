# 0001 - Monorepo Architecture And Module Boundaries

Date: 2026-05-21

Status: Accepted

## Context

Dropaly is currently a small todo boilerplate, but it is expected to grow into a larger product with multiple features, third-party integrations, AI, billing, web, native, and backend concerns.

The goal is to prepare the monorepo for growth without over-engineering. The architecture should favor deep modules: modules centered on real product concepts, exposing a small clear interface while hiding implementation details such as routes, DB queries, provider SDKs, and local wiring.

## Decision

We keep the current high-level monorepo split:

- `apps/server` remains the Fastify HTTP host.
- `packages/api` becomes the backend application API layer for tRPC and backend modules.
- `packages/db` remains the Drizzle/Postgres infrastructure package.
- `packages/auth` remains server-only Better Auth infrastructure.
- `apps/web` and `apps/native` keep platform-specific UI and feature code.

## Package Boundaries

Packages expose explicit public entrypoints. Wildcard exports should be removed progressively.

Target public entrypoints:

- `@dropaly/api` exposes client-safe types only, especially `AppRouter`.
- `@dropaly/api/server` exposes server runtime only: `appRouter`, request context helpers, tRPC context adapter, and backend procedures.
- `@dropaly/db` exposes the Drizzle server client: `db`, `createDb`, and related DB client types if needed.
- `@dropaly/db/schema` exposes Drizzle tables and schema exports.
- `@dropaly/auth/server` exposes server-only Better Auth configuration.
- `@dropaly/ui` remains web-only for now.

Allowed dependency graph:

- `apps/server` may import `@dropaly/api/server`, `@dropaly/auth/server`, and `@dropaly/env/server`.
- `apps/web` may import `@dropaly/api` as type-only, `@dropaly/env/web`, and `@dropaly/ui`.
- `apps/native` may import `@dropaly/api` as type-only and `@dropaly/env/native`.
- `packages/api` may import `@dropaly/auth/server`, `@dropaly/db`, and `@dropaly/db/schema`.
- `packages/auth` may import `@dropaly/db`, `@dropaly/db/schema`, and `@dropaly/env/server`.
- `packages/db` may import `@dropaly/env/server`.
- `packages/ui` must not import `@dropaly/api`, `@dropaly/auth`, or `@dropaly/db`.

Boundary enforcement starts with package exports and dependency discipline. A lint/boundary tool can be added later if conventions start drifting.

## Backend Modules

Backend product concepts live in `packages/api/src/modules/<feature>`.

Standard module structure:

```txt
packages/api/src/modules/<feature>/
  index.ts
  router.ts
  service.ts
  repository.ts
  schemas.ts
```

Responsibilities:

- `router.ts` handles tRPC transport, input validation, output validation when useful, and calls services.
- `service.ts` owns use cases, business rules, authorization calls, and DTO mapping.
- `repository.ts` owns DB queries and returns DB rows. It imports the singleton `db` for now.
- `schemas.ts` owns server-side Zod schemas for inputs and use-case DTOs.
- `index.ts` is the module's internal public interface. It exports the router and only the explicit business ports needed by other modules.

Repositories are private implementation details by default and should not be exported from module `index.ts`.

Inter-module imports are allowed only through `modules/<feature>/index.ts`. Modules must not import another module's `repository.ts`, `schemas.ts`, or `router.ts` directly.

## tRPC Shape

Feature namespaces use plural names aligned with modules:

- API/modules/features use plural names: `todos`, `billing`, `ai`.
- DB tables and entity types use singular names: `todo`, `Todo`.

Example target route names:

- `trpc.todos.list`
- `trpc.todos.create`
- `trpc.todos.toggle`
- `trpc.todos.delete`

Product features are protected by default. Public procedures are explicit exceptions.

## Request Context And Actor

`packages/api` owns a canonical framework-agnostic request context.

Target structure:

```txt
packages/api/src/context.ts
packages/api/src/trpc.ts
packages/api/src/auth/actor.ts
```

Rules:

- `createRequestContext` is the single canonical context builder.
- `createRequestContext` reads the session and builds `actor: Actor | null`.
- `createTRPCContext` is only an adapter from Fastify/tRPC options to `createRequestContext`.
- `publicProcedure` can access `ctx.actor`, but it may be null.
- `protectedProcedure` guarantees `ctx.actor` exists.
- `guestProcedure` guarantees `ctx.actor` does not exist.
- `requireActor(context)` is used by non-tRPC HTTP routes that need authenticated access.

Services receive an explicit `actor` when identity is required. Services must not receive tRPC `ctx` or Better Auth session objects directly.

## Server App

`apps/server` is structured by HTTP responsibility, not product feature.

Target structure:

```txt
apps/server/src/app.ts
apps/server/src/server.ts
apps/server/src/routes/auth.ts
apps/server/src/routes/trpc.ts
apps/server/src/routes/ai.ts
apps/server/src/routes/health.ts
apps/server/src/plugins/cors.ts
```

`apps/server` should remain an adapter layer for Fastify, CORS, Better Auth routing, tRPC mounting, AI streaming HTTP, and health routes. Product logic belongs in `packages/api/src/modules`.

## DB Package

Drizzle schemas stay in `packages/db/src/schema/*` for now.

Public imports:

- `@dropaly/db` for the server-side Drizzle client.
- `@dropaly/db/schema` for schema and table exports.

Other packages should avoid importing individual schema files such as `@dropaly/db/schema/todo` unless there is a justified exception.

If the number of tables grows substantially, `packages/db` may be reorganized internally by module while preserving the public `@dropaly/db/schema` entrypoint.

## Auth Package

`@dropaly/auth` is server-only.

- Better Auth and Polar integration remain in `@dropaly/auth/server`.
- Web and native Better Auth clients remain inside their apps for now.
- Shared auth client factories can be extracted later only if duplication becomes meaningful.

## AI Module

AI application logic lives in `packages/api/src/modules/ai`.

`apps/server` keeps only a thin `/ai` Fastify streaming route. The route must authenticate through `createRequestContext` and `requireActor`, then call the AI module with the actor.

`/ai` is protected by default because AI usage is costly and likely to involve quotas, history, tools, billing, or personalization.

Provider SDKs, model factories, prompts, and tools should be hidden behind private adapters inside the AI module.

## Billing Module

Billing product logic lives in `packages/api/src/modules/billing`.

- `@dropaly/auth/server` keeps only the Better Auth/Polar integration.
- `modules/billing` owns product-level entitlements and billing decisions.
- Server decisions are authoritative. Clients may display states such as "Pro required", but only the server authorizes or blocks access.
- Other modules depend on billing through explicit ports such as `requireEntitlement(actor, capability)`.
- Other modules should not read Polar or raw plan state directly.

Because billing is not fully implemented yet, the module may initially contain examples or placeholders that define the intended seam.

## Third-Party Integrations And Env

Provider SDKs should be hidden in private adapters inside the module that owns the product concept.

Examples:

- `modules/ai/adapters/google.ts`
- `modules/billing/adapters/polar.ts`

Do not create a global `@dropaly/integrations` package until reuse across multiple modules or runtimes is real.

`env` access is limited to infrastructure and adapters:

- allowed in `apps/server`, `@dropaly/db`, `@dropaly/auth/server`, and private provider adapters;
- avoided in `service.ts` and product business logic.

## Schemas, DTOs, And Validation

Server input validation with Zod is mandatory for product procedures.

`drizzle-zod` may be used in `packages/api/src/modules/<feature>/schemas.ts` to derive private base schemas from Drizzle tables.

Rules:

- Drizzle-derived schemas are private bases, not public API contracts.
- Use-case schemas are explicitly adapted with `pick`, `omit`, `extend`, `refine`, or manual schemas.
- Clients do not import runtime schemas from `@dropaly/api` for now.
- If a schema becomes useful to web, native, and backend, extract it later into a strict pure `@dropaly/domain` package.

Repositories return DB rows. Services map DB rows into explicit DTOs. Routers expose DTOs through tRPC.

Output validation is pragmatic:

- use output Zod schemas when they add real safety;
- examples include billing, sensitive data, non-typed third-party integrations, stable public APIs, and AI structured output;
- do not require output validation for every simple internal DTO.

## Client App Features

Web and native keep platform-specific feature modules.

Target structure:

```txt
apps/web/src/features/<feature>/
  index.ts
  screen.tsx
  api.ts
  schemas.ts
  components/
  hooks/

apps/native/src/features/<feature>/
  index.ts
  screen.tsx
  api.ts
  schemas.ts
  components/
  hooks/
```

Routes and Expo Router files should stay thin and mount feature screens.

`api.ts` in a client feature exposes TanStack Query/tRPC factories:

- `featureQueries`
- `featureMutations`

These factories should return `queryOptions` and `mutationOptions` so callers can use both:

- `queryClient.ensureQueryData(featureQueries.list())` in loaders;
- `useQuery(featureQueries.list())` in components;
- `useMutation(featureMutations.create(queryClient))` for mutations.

Hooks are optional and should be added only when they compose meaningful UI or flow logic.

Client validation schemas are local UX helpers. Server validation remains authoritative.

## Domain Package

Do not create `@dropaly/domain` now.

Create it only when a pure product rule, type, schema, or constant is used by at least two runtimes such as web, native, and backend.

If created, `@dropaly/domain` must stay pure:

- no DB;
- no env;
- no auth runtime;
- no tRPC;
- no React;
- no platform-specific code.

## Build Strategy

Internal packages remain source-first for now. Package exports may point directly to `src` files.

Do not add `dist` builds for every package yet. Build packages individually only if publishing, external consumption, runtime constraints, or tooling issues justify it.

## Consequences

Positive consequences:

- Product logic becomes easier to find and reason about.
- Routes, screens, and HTTP handlers stay thin.
- Package boundaries become explicit and safer.
- Future modules have a consistent shape.
- Auth context and actor handling are shared across tRPC and non-tRPC HTTP routes.
- Provider SDKs and env access stay at technical edges.

Tradeoffs:

- Simple features have a few more files.
- Boundaries require discipline until lint tooling exists.
- Some duplication between web and native validation remains intentional.
- Repositories import the singleton `db` for now, which is simple but less flexible for transactions and isolated tests.

## Revisit When

Revisit these decisions if:

- repositories need transactions, multi-tenant DB clients, or isolated testing;
- multiple modules need the same provider integration;
- web, native, and backend share stable pure domain rules;
- package boundary violations become frequent;
- `@dropaly/ui` naming creates confusion with native UI;
- billing, authorization, or workspace permissions become complex enough to require a dedicated policy layer.
