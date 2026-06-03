import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { todo } from "@dropaly/db/schema";

const todoSelectBaseSchema = createSelectSchema(todo);
const todoInsertBaseSchema = createInsertSchema(todo, {
  text: z.string().trim().min(1).max(500),
});

export const todoSchema = todoSelectBaseSchema.pick({
  id: true,
  text: true,
  completed: true,
});

export const createTodoInputSchema = todoInsertBaseSchema.pick({ text: true });

export const toggleTodoInputSchema = todoSelectBaseSchema.pick({
  id: true,
  completed: true,
});

export const deleteTodoInputSchema = todoSelectBaseSchema.pick({ id: true });

export const deleteTodoOutputSchema = z.object({ deleted: z.boolean() });

export type Todo = z.infer<typeof todoSchema>;
export type CreateTodoInput = z.infer<typeof createTodoInputSchema>;
export type ToggleTodoInput = z.infer<typeof toggleTodoInputSchema>;
export type DeleteTodoInput = z.infer<typeof deleteTodoInputSchema>;
