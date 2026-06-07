// src/routes/index.ts
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { errorResponseSchema } from "./schemas/error.schema";

const privateDataSchema = z.object({
  message: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
  }),
});

export const router: FastifyPluginAsyncZod = async (app) => {
  // Public routes
  // await app.register(publicRoutes);

  // Protected routes
  await app.register(async (privateApp) => {
    privateApp.addHook("onRequest", privateApp.requireAuth);
    // await privateApp.register(protectedRoutes);

    privateApp.route({
      method: "GET",
      url: "/private-data",
      schema: {
        tags: ["private-data"],
        operationId: "getPrivateData",
        response: { 200: privateDataSchema, 401: errorResponseSchema },
      },
      handler(request) {
        const actor = request.getActor();
        return {
          message: "This is private",
          user: {
            id: actor.id,
            email: actor.email,
            name: actor.name,
          },
        };
      },
    });
  });

  // Admin routes
  // await app.register(async (adminApp) => {
  //   adminApp.addHook("onRequest", adminApp.requireRole("admin"));

  //   await adminApp.register(adminRoutes, {
  //     prefix: "/admin",
  //   });
  // });
};
