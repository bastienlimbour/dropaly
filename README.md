# Dropaly

## Overview

Dropaly is a mobile-first structured brain dump app.

It helps users capture short thoughts in text or voice and turn them into structured tasks, lists, or notes.

The product bet is simple: users should be able to empty their mind first, then adjust the structure of what matters after capture.

## Core Concepts

- **Capture**: text or voice input that can produce multiple structured cards.
- **Cards**: AI-generated proposals that must be validated before creation.
- **Inbox**: triage area for tasks, notes, and lists without enough context.
- **Tasks**: actionable items with optional date, time, project, and priority.
- **Short notes**: plain text notes for useful thoughts that should not become tasks.
- **Lists**: simple lists with todo/done items.
- **Projects**: lightweight containers for tasks, lists, notes, and sub-projects.

## Tech Stack

- **TypeScript** - For type safety and improved developer experience
- **TanStack Router** - File-based routing with full type safety
- **React Native** - Build mobile apps using React
- **Expo** - Tools for React Native development
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **Fastify** - Fast, low-overhead web framework
- **OpenAPI** - Versioned API contract generated from Fastify/Zod routes
- **openapi-fetch** - Shared typed HTTP client
- **TanStack Query** - Shared server-state query factories
- **Node.js** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Turborepo** - Optimized monorepo build system
- **PWA** - Progressive Web App support

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/server/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
pnpm run db:push
```

Then, run the development server:

```bash
pnpm run dev
```

- The **API** is running at [http://localhost:3000](http://localhost:3000).
- The **web application** is running at [http://localhost:3001](http://localhost:3001).
- The **Expo Go development server** is running at [http://localhost:8081](http://localhost:8081).
- Use Expo Go to run the mobile application with the LAN URL of your machine, for example `exp://192.168.1.101:8081`.

For Expo Go on a physical device, `EXPO_PUBLIC_API_URL` must point to the LAN URL of your machine, for example `EXPO_PUBLIC_API_URL=http://192.168.1.101:3000`. The Fastify server must listen on `SERVER_HOST=0.0.0.0` for that URL to be reachable from the device.

## UI Customization

React web apps in this stack share shadcn/ui primitives through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`
- Adjust shadcn aliases or style config in `packages/ui/components.json` and `apps/web/components.json`

### Add more shared components

Run this from the project root to add more primitives to the shared UI package:

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

Import shared components like this:

```tsx
import { Button } from "@dropaly/ui/components/button";
```

### Add app-specific blocks

If you want to add app-specific blocks instead of shared primitives, run the shadcn CLI from `apps/web`.

## Project Structure

```text
dropaly/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
│   ├── native/      # Mobile application (React Native, Expo)
│   └── server/      # Backend API host (Fastify)
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
│   ├── api/         # Server-only API routes and business logic
│   ├── api-client/  # Shared openapi-fetch client
│   ├── api-contract/# Versioned OpenAPI artifact
│   ├── api-query/   # Shared TanStack Query factories
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `pnpm run dev`: Start all applications in development mode
- `pnpm run build`: Build all applications
- `pnpm run dev:web`: Start only the web application
- `pnpm run dev:server`: Start only the server
- `pnpm run typecheck`: Check TypeScript types across all apps
- `pnpm run dev:native`: Start the React Native/Expo development server
- `pnpm run db:push`: Push schema changes to database
- `pnpm run db:generate`: Generate database client/types
- `pnpm run db:migrate`: Run database migrations
- `pnpm run db:studio`: Open database studio UI
- `cd apps/web && pnpm run generate-pwa-assets`: Generate PWA assets
