import { protectedProcedure, router } from "../../trpc";
import {
  createTodoInputSchema,
  deleteTodoInputSchema,
  toggleTodoInputSchema,
} from "./schemas";
import { createTodo, deleteTodo, listTodos, toggleTodo } from "./service";

export const todosRouter = router({
  list: protectedProcedure.query(({ ctx }) => {
    return listTodos(ctx.actor);
  }),

  create: protectedProcedure
    .input(createTodoInputSchema)
    .mutation(({ ctx, input }) => {
      return createTodo(ctx.actor, input);
    }),

  toggle: protectedProcedure
    .input(toggleTodoInputSchema)
    .mutation(({ ctx, input }) => {
      return toggleTodo(ctx.actor, input);
    }),

  delete: protectedProcedure
    .input(deleteTodoInputSchema)
    .mutation(({ ctx, input }) => {
      return deleteTodo(ctx.actor, input);
    }),
});
