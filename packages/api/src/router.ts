import { protectedProcedure, publicProcedure, router } from "./trpc";
import { todosRouter } from "./modules/todos";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: {
        id: ctx.actor.userId,
        email: ctx.actor.email,
        name: ctx.actor.name,
      },
    };
  }),
  todos: todosRouter,
});

export type AppRouter = typeof appRouter;
