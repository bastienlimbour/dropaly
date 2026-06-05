import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

import { todo } from "@dropaly/db/schema";

// DB-derived schemas

const todoSelectBaseSchema = createSelectSchema(todo);
const todoInsertBaseSchema = createInsertSchema(todo);
const todoUpdateBaseSchema = createUpdateSchema(todo);

// API schemas

export const todoSchema = todoSelectBaseSchema.pick({
  id: true,
  text: true,
  completed: true,
});

export const createTodoSchema = todoInsertBaseSchema.pick({
  text: true,
});

export const updateTodoSchema = todoUpdateBaseSchema.pick({
  text: true,
  completed: true,
});

// API types

export type Todo = z.infer<typeof todoSchema>;
export type CreateTodo = z.infer<typeof createTodoSchema>;
export type UpdateTodo = z.infer<typeof updateTodoSchema>;

// OpenAPI schemas

z.globalRegistry.add(todoSchema, { id: "Todo" });
// z.globalRegistry.add(todoParamsSchema, { id: "TodoParams" });
z.globalRegistry.add(createTodoSchema, { id: "CreateTodo" });
z.globalRegistry.add(updateTodoSchema, { id: "UpdateTodo" });
