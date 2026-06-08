import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

import { errorResponseSchema } from "@/schemas/error.schema";
import { idParamsSchema } from "@/schemas/id.schema";
import { createTodoSchema, todoSchema, updateTodoSchema } from "./todo.schema";
import { makeTodoService } from "./todo.service";

export const todoRoutes: FastifyPluginAsyncZod = async (app) => {
  const todoService = makeTodoService({ db: app.db });

  app.route({
    method: "GET",
    url: "/todos",
    schema: {
      tags: ["todos"],
      operationId: "listTodos",
      response: { 200: todoSchema.array(), 401: errorResponseSchema },
    },
    preHandler: app.requireAuth,
    async handler(request, reply) {
      const actor = request.getActor();
      const todos = await todoService.list({ actor });
      return reply.status(200).send(todos);
    },
  });

  app.route({
    method: "POST",
    url: "/todos",
    preHandler: app.requireAuth,
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
      const actor = request.getActor();
      const todo = await todoService.create({ actor, data: request.body });

      return reply.status(201).send(todo);
    },
  });

  app.route({
    method: "PATCH",
    url: "/todos/:id",
    preHandler: app.requireAuth,
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
      const actor = request.getActor();
      const todo = await todoService.update({
        actor,
        todoId: request.params.id,
        data: request.body,
      });

      if (!todo) {
        return reply
          .status(404)
          .send({ error: "Todo not found", code: "TODO_NOT_FOUND" });
      }

      return reply.status(200).send(todo);
    },
  });

  app.route({
    method: "DELETE",
    url: "/todos/:id",
    preHandler: app.requireAuth,
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
      const actor = request.getActor();
      const result = await todoService.delete({ actor, todoId: request.params.id });

      if (!result) {
        return reply
          .status(404)
          .send({ error: "Todo not found", code: "TODO_NOT_FOUND" });
      }

      return reply.status(204).send(null);
    },
  });
};
