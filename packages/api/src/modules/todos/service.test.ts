import { describe, expect, it } from "vitest";

import type { Db } from "@dropaly/db";

import type { AuthenticatedContext } from "../../context";
import { todoService } from "./service";

const db: Db = undefined!;

const ctx: AuthenticatedContext = {
  db,
  requestId: "test",
  actor: {
    userId: "user_1",
    email: "test@example.com",
    name: "Test",
  },
};

describe("todoService", () => {
  it("returns the repository public todo shape directly", async () => {
    const service = todoService(ctx, {
      todoRepository: () => ({
        listByUserId: async () => [{ id: 1, text: "Hello", completed: false }],
        createForUser: async () => ({
          id: 2,
          text: "Created",
          completed: false,
        }),
        updateCompletionForUser: async () => ({
          id: 1,
          text: "Hello",
          completed: true,
        }),
        deleteForUser: async () => true,
      }),
    });

    await expect(service.list()).resolves.toEqual([
      { id: 1, text: "Hello", completed: false },
    ]);
    await expect(service.create({ text: "Created" })).resolves.toEqual({
      id: 2,
      text: "Created",
      completed: false,
    });
    await expect(service.toggle({ id: 1, completed: true })).resolves.toEqual({
      id: 1,
      text: "Hello",
      completed: true,
    });
    await expect(service.delete({ id: 1 })).resolves.toEqual({ deleted: true });
  });

  it("passes the authenticated actor user id to the repository", async () => {
    const calls: unknown[] = [];
    const service = todoService(ctx, {
      todoRepository: () => ({
        listByUserId: async (userId) => {
          calls.push({ method: "list", userId });

          return [];
        },
        createForUser: async (input) => {
          calls.push({ method: "create", input });

          return {
            id: 1,
            text: input.text,
            completed: false,
          };
        },
        updateCompletionForUser: async (input) => {
          calls.push({ method: "toggle", input });

          return null;
        },
        deleteForUser: async (input) => {
          calls.push({ method: "delete", input });

          return false;
        },
      }),
    });

    await service.list();
    await service.create({ text: "Created" });
    await service.toggle({ id: 1, completed: true });
    await service.delete({ id: 2 });

    expect(calls).toEqual([
      { method: "list", userId: "user_1" },
      {
        method: "create",
        input: { userId: "user_1", text: "Created" },
      },
      {
        method: "toggle",
        input: { userId: "user_1", id: 1, completed: true },
      },
      { method: "delete", input: { userId: "user_1", id: 2 } },
    ]);
  });
});
