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
    preValidation: app.requireAuthenticatedUser,
    async handler(request, reply) {
      const user = request.getAuthenticatedUser();
      const todos = await todoService.list({ user });
      return reply.status(200).send(todos);
    },
  });

  app.route({
    method: "POST",
    url: "/todos",
    preValidation: app.requireAuthenticatedUser,
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
      const user = request.getAuthenticatedUser();
      const todo = await todoService.create({ user, data: request.body });

      return reply.status(201).send(todo);
    },
  });

  app.route({
    method: "PATCH",
    url: "/todos/:id",
    preValidation: app.requireAuthenticatedUser,
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
      const user = request.getAuthenticatedUser();
      const todo = await todoService.update({
        user,
        todoId: request.params.id,
        data: request.body,
      });

      return reply.status(200).send(todo);
    },
  });

  app.route({
    method: "DELETE",
    url: "/todos/:id",
    preValidation: app.requireAuthenticatedUser,
    schema: {
      tags: ["todos"],
      operationId: "deleteTodo",
      params: idParamsSchema,
      response: {
        204: z.void(),
        401: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    async handler(request, reply) {
      const user = request.getAuthenticatedUser();
      await todoService.delete({ user, todoId: request.params.id });

      return reply.status(204);
    },
  });
};
