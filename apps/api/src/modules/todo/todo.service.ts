import type { Db } from "@dropaly/db";

import { AppError } from "@/errors/app-error";
import type { Actor } from "@/plugins/auth-context";
import type { Id } from "@/schemas/id.schema";
import { todoRepository } from "./todo.repository";
import type { CreateTodo, UpdateTodo } from "./todo.schema";

interface TodoServiceDeps {
  db: Db;
}

export function makeTodoService(deps: TodoServiceDeps) {
  const repo = todoRepository(deps.db);
  return {
    async list({ actor }: { actor: Actor }) {
      return repo.listByOwnerId({ ownerId: actor.id });
    },

    async create(input: { actor: Actor; data: CreateTodo }) {
      return repo.createForOwner({
        ownerId: input.actor.id,
        data: input.data,
      });
    },

    async update(input: { actor: Actor; todoId: Id; data: UpdateTodo }) {
      const todo = await repo.updateOwnedByUser({
        ownerId: input.actor.id,
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

    async delete(input: { actor: Actor; todoId: Id }) {
      const todo = await repo.deleteOwnedByUser({
        ownerId: input.actor.id,
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
