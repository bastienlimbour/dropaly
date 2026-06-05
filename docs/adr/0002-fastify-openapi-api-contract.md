# 0002 - Fastify OpenAPI API Contract

Date: 2026-06-04

Status: Accepted

## Context

Dropaly needs a standard HTTP API that supports file upload and download, AI streaming, SSE or NDJSON, explicit HTTP status codes and headers, AbortSignal, FormData, Blob, and platform-specific cookie handling.

## Decision

Remove the previous RPC-style API layer and use Fastify routes with Zod schemas as the product API surface. Generate an OpenAPI contract from the server, version the generated `packages/api-contract/openapi.json`, generate `packages/api-client/src/schema.d.ts`, and consume the API through a shared `openapi-fetch` client plus shared TanStack Query factories.

Product API routes live under `/api`. Better Auth remains mounted under `/api/auth/*` and is intentionally outside the generated product API contract. Infra health remains available at `/health`, while typed client health uses `/api/health`.

## Consequences

- `@dropaly/api` is server-only through `@dropaly/api/server`.
- Web and native depend on `@dropaly/api-client` and `@dropaly/api-query`, not server API code.
- Generated OpenAPI artifacts are committed and regenerated with `pnpm openapi:generate`.
- Web requests use browser cookies with `credentials: "include"`.
- Native requests forward Better Auth Expo cookies through the `Cookie` header with `credentials: "omit"`.
