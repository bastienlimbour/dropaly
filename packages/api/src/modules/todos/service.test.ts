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

function todoRepository() {
  return {
    listByUserId: () =>
      Promise.resolve([{ id: 1, text: "Hello", completed: false }]),
    createForUser: () =>
      Promise.resolve({
        id: 2,
        text: "Created",
        completed: false,
      }),
    updateCompletionForUser: () =>
      Promise.resolve({
        id: 1,
        text: "Hello",
        completed: true,
      }),
    deleteForUser: () => Promise.resolve(true),
  };
}
describe("todoService", () => {
  it("returns the repository public todo shape directly", async () => {
    const service = todoService(ctx, { todoRepository });

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
        listByUserId: (userId) => {
          calls.push({ method: "list", userId });

          return Promise.resolve([]);
        },
        createForUser: async (input) => {
          calls.push({ method: "create", input });

          return Promise.resolve({
            id: 1,
            text: input.text,
            completed: false,
          });
        },
        updateCompletionForUser: (input) => {
          calls.push({ method: "toggle", input });

          return Promise.resolve(null);
        },
        deleteForUser: (input) => {
          calls.push({ method: "delete", input });
          return Promise.resolve(false);
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
