import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { Auth } from "@dropaly/auth/server";
import type { Db } from "@dropaly/db";

import { createApp } from "@/app";

const currentDir = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(currentDir, "../openapi/openapi.json");

const fakeAuth = {
  api: { getSession: async () => null },
  handler: async () => new Response(null, { status: 404 }),
} as unknown as Auth;

const fakeDb = {} as unknown as Db;

const app = createApp({
  auth: fakeAuth,
  corsOrigins: [],
  db: fakeDb,
  logger: false,
  nodeEnv: "test",
});

try {
  await app.ready();
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(app.swagger(), null, 2)}\n`);
} finally {
  await app.close();
}
