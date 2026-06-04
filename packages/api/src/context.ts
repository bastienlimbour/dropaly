import type { Db } from "@dropaly/db";

export interface Actor {
  userId: string;
  email: string;
  name: string;
}

export interface RequestContext {
  db: Db;
  actor: Actor | null;
  requestId: string;
}

export type AuthenticatedContext = RequestContext & {
  actor: Actor;
};

export interface SessionLike {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export function createActorFromSession(session: SessionLike): Actor {
  return {
    userId: session.user.id,
    email: session.user.email,
    name: session.user.name,
  };
}

export function createRequestContext(options: {
  db: Db;
  session: SessionLike | null;
  requestId: string;
}): RequestContext {
  return {
    db: options.db,
    actor: options.session ? createActorFromSession(options.session) : null,
    requestId: options.requestId,
  };
}

export function requireActor(ctx: RequestContext): Actor {
  if (!ctx.actor) {
    throw new Error("Authentication required");
  }

  return ctx.actor;
}
