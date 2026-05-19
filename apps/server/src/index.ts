import { google } from "@ai-sdk/google";
import { createContext } from "@dropzen/api/context";
import { appRouter, type AppRouter } from "@dropzen/api/routers/index";
import { auth } from "@dropzen/auth";
import { env } from "@dropzen/env/server";
import fastifyCors from "@fastify/cors";
import {
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import {
  streamText,
  type UIMessage,
  convertToModelMessages,
  wrapLanguageModel,
} from "ai";
import { fromNodeHeaders } from "better-auth/node";
import Fastify from "fastify";

const fastify = Fastify({ logger: true });

fastify.register(fastifyCors, {
  origin: env.CORS_ORIGINS,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
});

fastify.route({
  method: ["GET", "POST"],
  url: "/api/auth/*",
  async handler(request, reply) {
    try {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const headers = fromNodeHeaders(request.headers);
      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        body: request.body ? JSON.stringify(request.body) : undefined,
      });
      const response = await auth.handler(req);
      reply.status(response.status);
      response.headers.forEach((value, key) => reply.header(key, value));
      reply.send(response.body ? await response.text() : null);
    } catch (error) {
      fastify.log.error({ err: error }, "Authentication Error:");
      reply.status(500).send({
        error: "Internal authentication error",
        code: "AUTH_FAILURE",
      });
    }
  },
});

fastify.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext,
    onError({ path, error }) {
      console.error(`Error in tRPC handler on path '${path}':`, error);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
});

interface AiRequestBody {
  id?: string;
  messages: UIMessage[];
}

async function createAiModel() {
  const model = google("gemini-2.5-flash");

  if (process.env.NODE_ENV !== "development") {
    return model;
  }

  const { devToolsMiddleware } = await import("@ai-sdk/devtools");

  return wrapLanguageModel({
    model,
    middleware: devToolsMiddleware(),
  });
}

fastify.post("/ai", async function (request) {
  const { messages } = request.body as AiRequestBody;
  const result = streamText({
    model: await createAiModel(),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
});

fastify.get("/", async () => {
  return "OK";
});

fastify.get("/health", async () => {
  return "OK";
});

fastify.listen({ host: env.SERVER_HOST, port: env.SERVER_PORT }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server running on ${env.SERVER_HOST}:${env.SERVER_PORT}`);
});
