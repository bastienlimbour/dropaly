import {
  type CreateFastifyContextOptions,
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import type { FastifyInstance } from "fastify";

import { appRouter, type AppRouter } from "@dropaly/api/server";

import { getApiContext } from "@/plugins/api-context";

function createTRPCContext({ req }: CreateFastifyContextOptions) {
  return getApiContext(req);
}

export function registerTRPCRoutes(app: FastifyInstance) {
  app.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: appRouter,
      createContext: createTRPCContext,
      onError({ req, path, error }) {
        req.log.error({ err: error, path }, "tRPC error");
      },
    } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
  });
}
