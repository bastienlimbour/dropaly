import { and, asc, eq } from "drizzle-orm";

import type { Db } from "@dropaly/db";
import { todo } from "@dropaly/db/schema";

const publicTodoColumns = {
  id: todo.id,
  text: todo.text,
  completed: todo.completed,
};

export const todoRepository = (db: Db) => ({
  async listByUserId(userId: string) {
    return db
      .select(publicTodoColumns)
      .from(todo)
      .where(eq(todo.userId, userId))
      .orderBy(asc(todo.id));
  },

  async createForUser(input: { userId: string; text: string }) {
    const [row] = await db
      .insert(todo)
      .values({ userId: input.userId, text: input.text })
      .returning(publicTodoColumns);

    if (!row) {
      throw new Error("Failed to create todo");
    }

    return row;
  },

  async updateCompletionForUser(input: {
    userId: string;
    id: number;
    completed: boolean;
  }) {
    const [row] = await db
      .update(todo)
      .set({ completed: input.completed })
      .where(and(eq(todo.id, input.id), eq(todo.userId, input.userId)))
      .returning(publicTodoColumns);

    return row ?? null;
  },

  async deleteForUser(input: { userId: string; id: number }) {
    const rows = await db
      .delete(todo)
      .where(and(eq(todo.id, input.id), eq(todo.userId, input.userId)))
      .returning({ id: todo.id });

    return rows.length > 0;
  },
});

export type TodoRepository = ReturnType<typeof todoRepository>;
