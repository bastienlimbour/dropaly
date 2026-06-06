import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

export interface CreateDbOptions {
  databaseUrl: string;
}

export function createDb(options: CreateDbOptions) {
  const pool = new Pool({
    connectionString: options.databaseUrl,
  });

  const db = drizzle({
    client: pool,
    schema,
  });

  return {
    db,
    pool,
    async close() {
      await pool.end();
    },
  };
}

export type Db = ReturnType<typeof createDb>["db"];
