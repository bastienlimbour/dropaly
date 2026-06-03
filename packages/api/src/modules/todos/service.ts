import type { AuthenticatedContext } from "../../context";
import { todoRepository as defaultTodoRepository } from "./repository";
import type {
  CreateTodoInput,
  DeleteTodoInput,
  Todo,
  ToggleTodoInput,
} from "./schemas";

type TodoServiceDeps = {
  todoRepository?: typeof defaultTodoRepository;
};

export const todoService = (
  ctx: AuthenticatedContext,
  deps: TodoServiceDeps = {},
) => {
  const repo = (deps.todoRepository ?? defaultTodoRepository)(ctx.db);

  return {
    list(): Promise<Todo[]> {
      return repo.listByUserId(ctx.actor.userId);
    },

    create(input: CreateTodoInput): Promise<Todo> {
      return repo.createForUser({
        userId: ctx.actor.userId,
        text: input.text,
      });
    },

    toggle(input: ToggleTodoInput): Promise<Todo | null> {
      return repo.updateCompletionForUser({
        userId: ctx.actor.userId,
        id: input.id,
        completed: input.completed,
      });
    },

    async delete(input: DeleteTodoInput): Promise<{ deleted: boolean }> {
      const deleted = await repo.deleteForUser({
        userId: ctx.actor.userId,
        id: input.id,
      });

      return { deleted };
    },
  };
};
