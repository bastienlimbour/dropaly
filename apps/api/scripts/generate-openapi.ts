import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { Auth } from "@dropaly/auth/server";
import type { Db } from "@dropaly/db";

import { createApp } from "@/app";

const currentDir = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(currentDir, "../openapi/openapi.json");

// oxlint-disable-next-line typescript/no-unsafe-type-assertion
const fakeDb = {} as unknown as Db;
// oxlint-disable-next-line typescript/no-unsafe-type-assertion
const fakeAuth = {
  api: { getSession: async () => null },
  handler: async () => new Response(null, { status: 404 }),
} as unknown as Auth;

const app = createApp({
  db: fakeDb,
  auth: fakeAuth,
  corsOrigins: [],
  nodeEnv: "test",
  logger: false,
});

try {
  await app.ready();
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(app.swagger(), null, 2)}\n`);
} finally {
  await app.close();
}
