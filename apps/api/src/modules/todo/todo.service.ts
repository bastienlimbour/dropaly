import type { Db } from "@dropaly/db";

import { AppError } from "@/errors/app-error";
import type { AuthenticatedUser } from "@/modules/auth/authenticated-user";
import type { Id } from "@/schemas/id.schema";
import { todoRepository } from "./todo.repository";
import type { CreateTodo, UpdateTodo } from "./todo.schema";

interface TodoServiceDeps {
  db: Db;
}

export function makeTodoService(deps: TodoServiceDeps) {
  const repo = todoRepository(deps.db);
  return {
    async list({ user }: { user: AuthenticatedUser }) {
      return repo.listByOwnerId({ ownerId: user.id });
    },

    async create(input: { user: AuthenticatedUser; data: CreateTodo }) {
      return repo.createForOwner({
        ownerId: input.user.id,
        data: input.data,
      });
    },

    async update(input: { user: AuthenticatedUser; todoId: Id; data: UpdateTodo }) {
      const todo = await repo.updateOwnedByUser({
        ownerId: input.user.id,
        todoId: input.todoId,
        data: input.data,
      });

      if (!todo) {
        throw new AppError({
          statusCode: 404,
          code: "TODO_NOT_FOUND",
          message: "Todo not found.",
        });
      }

      return todo;
    },

    async delete(input: { user: AuthenticatedUser; todoId: Id }) {
      const todo = await repo.deleteOwnedByUser({
        ownerId: input.user.id,
        todoId: input.todoId,
      });

      if (!todo) {
        throw new AppError({
          statusCode: 404,
          code: "TODO_NOT_FOUND",
          message: "Todo not found.",
        });
      }
    },
  };
}
