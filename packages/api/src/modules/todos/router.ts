import { protectedProcedure, router } from "../../trpc";
import {
  createTodoInputSchema,
  deleteTodoInputSchema,
  deleteTodoOutputSchema,
  todoSchema,
  toggleTodoInputSchema,
} from "./schemas";
import { todoService } from "./service";

export const todosRouter = router({
  list: protectedProcedure.output(todoSchema.array()).query(({ ctx }) => {
    return todoService(ctx).list();
  }),

  create: protectedProcedure
    .input(createTodoInputSchema)
    .output(todoSchema)
    .mutation(({ ctx, input }) => {
      return todoService(ctx).create(input);
    }),

  toggle: protectedProcedure
    .input(toggleTodoInputSchema)
    .output(todoSchema.nullable())
    .mutation(({ ctx, input }) => {
      return todoService(ctx).toggle(input);
    }),

  delete: protectedProcedure
    .input(deleteTodoInputSchema)
    .output(deleteTodoOutputSchema)
    .mutation(({ ctx, input }) => {
      return todoService(ctx).delete(input);
    }),
});
