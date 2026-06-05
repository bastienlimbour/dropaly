import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { getAuthenticatedContext } from "./fastify-context";
import { registerAiRoutes } from "./modules/ai/ai.index";
import { registerTodosRoutes } from "./modules/todo";
import { errorResponseSchema } from "./schemas/error.schemas";

const privateDataSchema = z.object({
  message: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
  }),
});

export function registerApiRoutes(app: FastifyInstance) {
  const api = app.withTypeProvider<ZodTypeProvider>();

  api.get("/health", {
    schema: {
      tags: ["health"],
      response: { 200: z.literal("OK") },
    },
    handler(): "OK" {
      return "OK";
    },
  });

  api.get("/private-data", {
    preHandler: api.requireAuth,
    schema: {
      tags: ["private-data"],
      response: { 200: privateDataSchema, 401: errorResponseSchema },
    },
    handler(request) {
      const ctx = getAuthenticatedContext(request);

      return {
        message: "This is private",
        user: { id: ctx.actor.userId, email: ctx.actor.email, name: ctx.actor.name },
      };
    },
  });

  registerTodosRoutes(api);
  registerAiRoutes(api);
}
