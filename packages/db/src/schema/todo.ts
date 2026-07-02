import { boolean, index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { user } from "./auth";

/**
 * Todos owned by a user.
 *
 * Rows are removed when their owner is deleted. Repository callers should keep
 * Todo absence and cross-user ownership indistinguishable to avoid revealing
 * another user's data.
 */
export const todo = pgTable(
  "todo",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    completed: boolean("completed").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("todo_userId_idx").on(table.userId)],
);
