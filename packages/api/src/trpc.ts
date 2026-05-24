import { initTRPC, TRPCError } from "@trpc/server";

import type { RequestContext } from "./context";

export const t = initTRPC.context<RequestContext>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.actor) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
      cause: "No actor",
    });
  }

  return next({
    ctx: {
      ...ctx,
      actor: ctx.actor,
    },
  });
});

export const guestProcedure = t.procedure.use(({ ctx, next }) => {
  if (ctx.actor) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "This action is only available to guests",
      cause: "Authenticated actor",
    });
  }

  return next({
    ctx: {
      ...ctx,
      actor: null,
    },
  });
});
