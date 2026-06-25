# Dropaly

Dropaly is a mobile-first productivity application for capturing unstructured thoughts and turning them into actionable tasks, lists, and notes.

The project is currently in an architecture-first phase. The product scope is still evolving, but the repository already demonstrates the intended technical foundation: a TypeScript monorepo, a modular Fastify API, shared contracts, shared clients, web and mobile apps, authentication, PostgreSQL persistence, and an AI chat integration.

## Current Status

This is a work in progress.

Implemented foundations include:

- Monorepo structure with Turborepo and pnpm workspaces.
- Node.js/Fastify API with module-based route registration.
- Authentication with Better Auth and PostgreSQL persistence.
- Drizzle schema for auth and todos.
- OpenAPI contract generated from Fastify/Zod routes.
- Typed API client generated from the OpenAPI contract.
- Shared TanStack Query factories used by web and mobile clients.
- React web app with TanStack Router.
- Expo mobile app with Expo Router.
- AI chat endpoint using the Vercel AI SDK and a Google model adapter.
- Standardized API error handling with tests.

Still in progress:

- Product-specific capture, inbox, notes, lists, and project workflows.
- Production-ready billing configuration.
- Full migration history and deployment pipeline.
- UI/UX polish beyond the current architecture validation screens.

## Product Direction

The long-term goal is to help users empty their mind quickly, then structure the result afterwards.

Core concepts:

- **Capture**: text or voice input that can produce structured suggestions.
- **Cards**: AI-generated proposals to validate before creating content.
- **Inbox**: triage area for tasks, notes, and lists without enough context.
- **Tasks**: actionable items with optional date, time, project, and priority.
- **Short notes**: plain text notes that should not become tasks.
- **Lists**: simple lists with todo/done items.
- **Projects**: lightweight containers for tasks, lists, notes, and sub-projects.

## Architecture Highlights

The backend is intentionally organized to keep framework code, application logic, and persistence concerns separate.

- `apps/api/src/app.ts` creates the Fastify app, registers plugins, configures OpenAPI, and mounts modules under `/api`.
- API modules live in `apps/api/src/modules/*`.
- The todo module follows a simple `routes -> service -> repository` split.
- Fastify plugins inject shared dependencies such as `db` and `auth`.
- `auth-context` resolves the current actor from Better Auth sessions.
- `auth-guards` exposes route guards such as `requireAuth` and `requireRole`.
- `error-handler` standardizes validation, auth, HTTP, database, and unexpected errors.
- Zod schemas are used for request/response validation and OpenAPI generation.
- Drizzle schemas live in `packages/db` and are consumed by the API and auth packages.

The frontend apps consume the API through shared packages:

- `apps/api/openapi/openapi.json` stores the generated OpenAPI artifact.
- `packages/api-client` provides a typed `openapi-fetch` client.
- `packages/api-query` provides reusable TanStack Query options.
- `apps/web` and `apps/mobile` share the same API contract and query layer.

## Tech Stack

- TypeScript
- Node.js
- Fastify
- PostgreSQL
- Drizzle ORM
- Better Auth
- OpenAPI
- openapi-fetch
- TanStack Query
- TanStack Router
- React
- Expo / React Native
- Vercel AI SDK
- Turborepo
- pnpm
- oxlint / oxfmt
- Vitest

## Repository Structure

```text
dropaly/
|-- apps/
|   |-- api/       # Fastify API host
|   |-- web/       # React web app with TanStack Router
|   `-- mobile/    # Expo mobile app with Expo Router
|-- packages/
|   |-- api-client/   # Typed OpenAPI client
|   |-- api-query/    # Shared TanStack Query factories
|   |-- auth/         # Better Auth server configuration
|   |-- config/       # Shared lint/format/TypeScript config
|   |-- db/           # Drizzle schema and database tooling
|   |-- ui/           # Shared design tokens/utilities
|   |-- ui-mobile/    # Mobile UI primitives
|   `-- ui-web/       # Web UI primitives
|-- docs/             # Project and agent documentation
|-- pnpm-workspace.yaml
|-- turbo.json
`-- README.md
```

## Requirements

- Node.js `^22.22.3`
- pnpm `^11.1.3`
- Docker, for the local PostgreSQL database

The expected versions are also declared in `package.json` and `.tool-versions`.

## Environment Variables

Create local env files from the provided examples:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env
```

For Expo on a physical device, `EXPO_PUBLIC_API_URL` must point to the LAN URL of your machine, for example `http://192.168.1.101:3000`. The API must listen on `SERVER_HOST=0.0.0.0` to be reachable from the device.

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the local database:

```bash
pnpm db:start
```

Apply the current schema during local prototyping:

```bash
pnpm db:push
```

Start all apps in development mode:

```bash
pnpm dev
```

Default local URLs:

- API: `http://localhost:3000`
- API docs: `http://localhost:3000/docs`
- Web app: `http://localhost:3001`
- Expo dev server: `http://localhost:8081`

## Useful Commands

- `pnpm dev`: start all applications in development mode.
- `pnpm dev:api`: start only the Fastify API.
- `pnpm dev:web`: start only the web app.
- `pnpm dev:mobile`: start only the Expo app.
- `pnpm typecheck`: run TypeScript checks across the workspace.
- `pnpm lint`: run oxlint across the workspace.
- `pnpm format:check`: check formatting with oxfmt.
- `pnpm test`: run tests across packages that define tests.
- `pnpm check`: run typecheck, lint, format check, and tests.
- `pnpm openapi:generate`: regenerate the OpenAPI contract and typed API schema.
- `pnpm db:start`: start the local PostgreSQL container.
- `pnpm db:stop`: stop the local PostgreSQL container.
- `pnpm db:push`: push the current Drizzle schema to the database.
- `pnpm db:generate`: generate SQL migrations from Drizzle schema changes.
- `pnpm db:migrate`: apply generated Drizzle migrations.
- `pnpm db:studio`: open Drizzle Studio.

## OpenAPI Workflow

API routes define their request and response schemas with Zod. The OpenAPI artifact and typed client schema are generated from the API source.

After changing API routes or schemas, run:

```bash
pnpm openapi:generate
```

Commit both generated files when they change:

- `apps/api/openapi/openapi.json`
- `packages/api-client/src/schema.d.ts`

## Drizzle Migration Workflow

During early prototyping, `pnpm db:push` is useful because it applies the current schema directly to the local database. For a public project and future production-like workflow, prefer generated migrations.

Recommended initial migration workflow:

```bash
pnpm db:start
pnpm db:generate
pnpm db:migrate
```

Then inspect and commit the generated migration files under `packages/db/src/migrations/`.

Recommended workflow for future schema changes:

- Modify Drizzle schema files in `packages/db/src/schema/*`.
- Run `pnpm db:generate` to create a migration.
- Review the generated SQL before applying it.
- Run `pnpm db:migrate` locally.
- Update affected API schemas, repositories, tests, and OpenAPI artifacts if needed.
- Commit the schema change and migration together.

Use `db:push` only for local experiments that are not meant to be preserved. Once migrations exist, avoid mixing persistent schema changes made by `db:push` with migration-based changes.

## Quality Gates

The repository uses:

- `oxlint` for linting.
- `oxfmt` for formatting.
- `tsc --noEmit` for type checking.
- `vitest` for tests.
- `lefthook` for local Git hooks.
- GitHub Actions for CI.

Run the full local check with:

```bash
pnpm check
```

## License

No license has been selected yet.
