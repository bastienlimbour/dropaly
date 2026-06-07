import type { Db } from "@dropaly/db";

import type { Actor } from "@/plugins/auth-session";
import type { Id } from "@/schemas/id.schema";
import { todoRepository as defaultTodoRepository } from "./todo.repository";
import type { CreateTodo, UpdateTodo } from "./todo.schema";

interface TodoServiceDeps {
  db: Db;
  todoRepository?: typeof defaultTodoRepository;
}

export function makeTodoService(deps: TodoServiceDeps) {
  const repo = (deps.todoRepository ?? defaultTodoRepository)(deps.db);

  return {
    async list({ actor }: { actor: Actor }) {
      return repo.listByUserId({ userId: actor.id });
    },

    async create({ actor, data }: { actor: Actor; data: CreateTodo }) {
      return repo.createForUser({
        userId: actor.id,
        data,
      });
    },

    async update({
      actor,
      todoId,
      data,
    }: {
      actor: Actor;
      todoId: Id;
      data: UpdateTodo;
    }) {
      return repo.updateForUser({
        userId: actor.id,
        id: todoId,
        data,
      });
    },

    async delete({ actor, todoId }: { actor: Actor; todoId: Id }) {
      return repo.deleteForUser({
        userId: actor.id,
        id: todoId,
      });
    },
  };
}
