import { describe, expect, it } from "vitest";

import type { Db } from "@dropaly/db";

import {
  createActorFromSession,
  createRequestContext,
  requireActor,
} from "./context";

const db: Db = undefined!;

describe("createActorFromSession", () => {
  it("maps a session user to an actor", () => {
    expect(
      createActorFromSession({
        user: { id: "user_1", email: "test@example.com", name: "Test" },
      }),
    ).toEqual({
      userId: "user_1",
      email: "test@example.com",
      name: "Test",
    });
  });
});

describe("createRequestContext", () => {
  it("includes db, actor, and requestId", () => {
    const ctx = createRequestContext({
      db,
      requestId: "req_1",
      session: {
        user: { id: "user_1", email: "test@example.com", name: "Test" },
      },
    });

    expect(ctx).toEqual({
      db,
      requestId: "req_1",
      actor: {
        userId: "user_1",
        email: "test@example.com",
        name: "Test",
      },
    });
  });

  it("keeps actor null without a session", () => {
    expect(
      createRequestContext({ db, requestId: "req_1", session: null }).actor,
    ).toBeNull();
  });
});

describe("requireActor", () => {
  it("returns the actor when authenticated", () => {
    const ctx = createRequestContext({
      db,
      requestId: "req_1",
      session: {
        user: { id: "user_1", email: "test@example.com", name: "Test" },
      },
    });

    expect(requireActor(ctx)).toEqual(ctx.actor);
  });

  it("throws when unauthenticated", () => {
    expect(() =>
      requireActor(createRequestContext({ db, requestId: "req_1", session: null })),
    ).toThrow("Authentication required");
  });
});
