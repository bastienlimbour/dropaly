import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

export interface CreateDbOptions {
  databaseUrl: string;
}

export function createDb(options: CreateDbOptions) {
  const dbPool = new Pool({
    connectionString: options.databaseUrl,
  });

  const db = drizzle({
    client: dbPool,
    schema,
  });

  return {
    db,
    dbPool,
  };
}

export type Db = ReturnType<typeof createDb>["db"];
