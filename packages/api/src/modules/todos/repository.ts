import { db } from "@dropaly/db";
import { todo } from "@dropaly/db/schema";
import { and, asc, eq } from "drizzle-orm";

export type TodoRow = typeof todo.$inferSelect;

export function listTodosByUserId(userId: string) {
  return db
    .select()
    .from(todo)
    .where(eq(todo.userId, userId))
    .orderBy(asc(todo.id));
}

export async function createTodoForUser(input: {
  userId: string;
  text: string;
}) {
  const [row] = await db
    .insert(todo)
    .values({
      userId: input.userId,
      text: input.text,
    })
    .returning();

  if (!row) {
    throw new Error("Failed to create todo");
  }

  return row;
}

export async function updateTodoCompletionForUser(input: {
  userId: string;
  id: number;
  completed: boolean;
}) {
  const [row] = await db
    .update(todo)
    .set({ completed: input.completed })
    .where(and(eq(todo.id, input.id), eq(todo.userId, input.userId)))
    .returning();

  return row ?? null;
}

export async function deleteTodoForUser(input: {
  userId: string;
  id: number;
}) {
  const rows = await db
    .delete(todo)
    .where(and(eq(todo.id, input.id), eq(todo.userId, input.userId)))
    .returning({ id: todo.id });

  return rows.length > 0;
}
