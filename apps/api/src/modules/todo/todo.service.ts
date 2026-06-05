import type { AuthenticatedContext } from "@/context";
import type { Id } from "@/schemas/id.schemas";
import { todoRepository as defaultTodoRepository } from "./todo.repository";
import type { CreateTodo, UpdateTodo } from "./todo.schemas";

interface TodoServiceDeps {
  todoRepository?: typeof defaultTodoRepository;
}

export function todoService(ctx: AuthenticatedContext, deps: TodoServiceDeps = {}) {
  const repo = (deps.todoRepository ?? defaultTodoRepository)(ctx.db);

  return {
    async list() {
      return repo.listByUserId({ userId: ctx.actor.userId });
    },

    async create(input: { data: CreateTodo }) {
      return repo.createForUser({
        userId: ctx.actor.userId,
        data: input.data,
      });
    },

    async update(input: { id: Id; data: UpdateTodo }) {
      return repo.updateForUser({
        userId: ctx.actor.userId,
        id: input.id,
        data: input.data,
      });
    },

    async delete(input: { id: Id }) {
      return repo.deleteForUser({
        userId: ctx.actor.userId,
        id: input.id,
      });
    },
  };
}
