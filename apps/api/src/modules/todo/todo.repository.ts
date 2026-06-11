import { and, asc, eq } from "drizzle-orm";

import type { DbClient } from "@dropaly/db";
import { todo } from "@dropaly/db/schema";

import type { Id } from "@/schemas/id.schema";
import type { CreateTodo, UpdateTodo } from "./todo.schema";

const publicTodoColumns = {
  id: todo.id,
  text: todo.text,
  completed: todo.completed,
};

export const todoRepository = (db: DbClient) => ({
  async listByOwnerId(input: { ownerId: Id }) {
    const rows = await db
      .select(publicTodoColumns)
      .from(todo)
      .where(eq(todo.userId, input.ownerId))
      .orderBy(asc(todo.id));

    return rows;
  },

  async createForOwner(input: { ownerId: Id; data: CreateTodo }) {
    const [row] = await db
      .insert(todo)
      .values({ userId: input.ownerId, ...input.data })
      .returning(publicTodoColumns);

    if (!row) {
      throw new Error("Failed to create todo");
    }

    return row;
  },

  async updateOwnedByUser(input: { todoId: Id; ownerId: Id; data: UpdateTodo }) {
    const [row] = await db
      .update(todo)
      .set(input.data)
      .where(and(eq(todo.id, input.todoId), eq(todo.userId, input.ownerId)))
      .returning(publicTodoColumns);

    return row ?? null;
  },

  async deleteOwnedByUser(input: { todoId: Id; ownerId: Id }) {
    const [row] = await db
      .delete(todo)
      .where(and(eq(todo.id, input.todoId), eq(todo.userId, input.ownerId)))
      .returning(publicTodoColumns);

    return row ?? null;
  },
});

export type TodoRepository = ReturnType<typeof todoRepository>;
