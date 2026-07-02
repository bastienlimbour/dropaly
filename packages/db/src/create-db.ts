import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

/** Options used to create the Dropaly database client and connection pool. */
export interface CreateDbOptions {
  /** PostgreSQL connection string consumed by the underlying `pg` pool. */
  databaseUrl: string;
}

/** Database handle configured with the Dropaly Drizzle schema. */
export type Db = NodePgDatabase<typeof schema>;

/** PostgreSQL pool owned by `createDb`; callers are responsible for closing it. */
export type DbPool = Pool;

/** Database resources created for application startup. */
export interface CreateDbResult {
  db: Db;
  dbPool: DbPool;
}

/**
 * Creates a Drizzle database handle backed by a PostgreSQL connection pool.
 *
 * The returned pool remains open until the caller closes it with `dbPool.end()`.
 * Connection errors can surface later, when the pool first acquires a connection
 * or when a query runs.
 *
 * @example
 * ```ts
 * const { db, dbPool } = createDb({ databaseUrl: process.env.DATABASE_URL });
 * await dbPool.end();
 * ```
 */
export function createDb(options: CreateDbOptions): CreateDbResult {
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

/** Transaction handle passed by Drizzle to transaction callbacks. */
export type DbTransaction = Parameters<Parameters<Db["transaction"]>[0]>[0];

/** Database handle accepted by repositories that can run inside or outside a transaction. */
export type DbClient = Db | DbTransaction;
