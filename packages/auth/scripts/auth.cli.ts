import { createDb } from "@dropaly/db";

import { createAuth } from "../src";

const { db } = createDb({
  databaseUrl: "postgres://test:test@localhost:5432/test",
});

// Better Auth CLI entrypoint only. Runtime server code injects auth via createAuth().
export const auth = createAuth({
  db,
  nodeEnv: "development",
  allowedServerHosts: ["localhost:3000"],
  fallbackServerUrl: "http://localhost:3000",
  corsOrigins: ["http://localhost:3001"],
  secret: "test-secret-test-secret-test-secret",
  paymentEnabled: false,
});
