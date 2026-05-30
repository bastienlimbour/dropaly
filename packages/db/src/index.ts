import { drizzle } from "drizzle-orm/node-postgres";

import { env } from "@dropaly/env/server";

import * as schema from "./schema";

export function createDb() {
  return drizzle(env.DATABASE_URL, { schema });
}

export const db = createDb();
