import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Db } from "@dropaly/db";

import { AppError } from "@/errors/app-error";
import type { Actor } from "@/plugins/auth-context";
import { todoRepository } from "./todo.repository";
import type { TodoRepository } from "./todo.repository";
import { makeTodoService } from "./todo.service";

vi.mock("./todo.repository", () => ({
  todoRepository: vi.fn(),
}));

const actor = {
  id: "user_1",
  email: "user@example.com",
  name: "User",
  role: null,
  sessionId: "session_1",
} satisfies Actor;

function createRepository(): TodoRepository {
  return {
    listByOwnerId: vi.fn(async () => []),
    createForOwner: vi.fn(async () => ({
      id: "todo_1",
      text: "Write tests",
      completed: false,
    })),
    updateOwnedByUser: vi.fn(async () => null),
    deleteOwnedByUser: vi.fn(async () => null),
  };
}

function createService(repository: TodoRepository) {
  vi.mocked(todoRepository).mockReturnValue(repository);
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return makeTodoService({ db: {} as unknown as Db });
}

beforeEach(() => {
  vi.mocked(todoRepository).mockReset();
});

describe("makeTodoService", () => {
  it("hides absent or non-owned todos behind TODO_NOT_FOUND on update", async () => {
    const repository = createRepository();
    const service = createService(repository);

    await expect(
      service.update({ actor, todoId: "todo_1", data: { completed: true } }),
    ).rejects.toMatchObject({
      statusCode: 404,
      code: "TODO_NOT_FOUND",
      message: "Todo not found.",
    });

    // oxlint-disable-next-line typescript/unbound-method
    expect(repository.updateOwnedByUser).toHaveBeenCalledWith({
      ownerId: actor.id,
      todoId: "todo_1",
      data: { completed: true },
    });
  });

  it("hides absent or non-owned todos behind TODO_NOT_FOUND on delete", async () => {
    expect.assertions(2);

    const repository = createRepository();
    const service = createService(repository);

    await service.delete({ actor, todoId: "todo_1" }).catch((error: unknown) => {
      expect(error).toBeInstanceOf(AppError);
      expect(error).toMatchObject({
        statusCode: 404,
        code: "TODO_NOT_FOUND",
        message: "Todo not found.",
      });
    });
  });
});
