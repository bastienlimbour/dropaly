import { and, asc, eq } from "drizzle-orm";

import type { Db } from "@dropaly/db";
import { todo } from "@dropaly/db/schema";

import type { Id } from "@/schemas/id.schema";
import type { CreateTodo, UpdateTodo } from "./todo.schema";

const publicTodoColumns = {
  id: todo.id,
  text: todo.text,
  completed: todo.completed,
};

export const todoRepository = (db: Db) => ({
  async listByUserId(input: { userId: Id }) {
    const rows = await db
      .select(publicTodoColumns)
      .from(todo)
      .where(eq(todo.userId, input.userId))
      .orderBy(asc(todo.id));

    return rows;
  },

  async createForUser(input: { userId: Id; data: CreateTodo }) {
    const [row] = await db
      .insert(todo)
      .values({ userId: input.userId, ...input.data })
      .returning(publicTodoColumns);

    if (!row) {
      throw new Error("Failed to create todo");
    }

    return row;
  },

  async updateForUser(input: { id: Id; userId: Id; data: UpdateTodo }) {
    const [row] = await db
      .update(todo)
      .set(input.data)
      .where(and(eq(todo.id, input.id), eq(todo.userId, input.userId)))
      .returning(publicTodoColumns);

    return row ?? null;
  },

  async deleteForUser(input: { id: Id; userId: Id }) {
    const [row] = await db
      .delete(todo)
      .where(and(eq(todo.id, input.id), eq(todo.userId, input.userId)))
      .returning(publicTodoColumns);

    return row ?? null;
  },
});

export type TodoRepository = ReturnType<typeof todoRepository>;
