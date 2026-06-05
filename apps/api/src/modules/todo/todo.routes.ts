import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { getAuthenticatedContext } from "@/fastify-context";
import { errorResponseSchema } from "@/schemas/error.schemas";
import { idParamsSchema } from "@/schemas/id.schemas";
import { createTodoSchema, todoSchema, updateTodoSchema } from "./todo.schemas";
import { todoService } from "./todo.service";

export function registerTodosRoutes(app: FastifyInstance) {
  const api = app.withTypeProvider<ZodTypeProvider>();

  api.get("/todos", {
    preHandler: api.requireAuth,
    schema: {
      tags: ["todos"],
      operationId: "listTodos",
      response: { 200: todoSchema.array(), 401: errorResponseSchema },
    },
    async handler(request, reply) {
      const ctx = getAuthenticatedContext(request);
      const todos = await todoService(ctx).list();
      return reply.status(200).send(todos);
    },
  });

  api.post("/todos", {
    preHandler: api.requireAuth,
    schema: {
      tags: ["todos"],
      operationId: "createTodo",
      body: createTodoSchema,
      response: {
        201: todoSchema,
        401: errorResponseSchema,
      },
    },
    async handler(request, reply) {
      const ctx = getAuthenticatedContext(request);
      const todo = await todoService(ctx).create({ data: request.body });

      return reply.status(201).send(todo);
    },
  });

  api.patch("/todos/:id", {
    preHandler: api.requireAuth,
    schema: {
      tags: ["todos"],
      operationId: "updateTodo",
      params: idParamsSchema,
      body: updateTodoSchema,
      response: {
        200: todoSchema,
        401: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    async handler(request, reply) {
      const ctx = getAuthenticatedContext(request);
      const todo = await todoService(ctx).update({
        id: request.params.id,
        data: request.body,
      });

      if (!todo) {
        return reply
          .status(404)
          .send({ error: "Todo not found", code: "TODO_NOT_FOUND" });
      }

      return todo;
    },
  });

  api.delete("/todos/:id", {
    preHandler: api.requireAuth,
    schema: {
      tags: ["todos"],
      operationId: "deleteTodo",
      params: idParamsSchema,
      response: {
        204: z.null(),
        401: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    async handler(request, reply) {
      const ctx = getAuthenticatedContext(request);
      const result = await todoService(ctx).delete({ id: request.params.id });
      console.log("result", result);
      if (!result) {
        return reply
          .status(404)
          .send({ error: "Todo not found", code: "TODO_NOT_FOUND" });
      }

      return reply.status(204).send(null);
    },
  });
}
