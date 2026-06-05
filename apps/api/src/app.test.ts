import { describe, expect, it } from "vitest";

import type { Auth } from "@dropaly/auth/server";
import type { Db } from "@dropaly/db";

import { createApp } from "./app";

describe("createApp", () => {
  it("registers health routes with injected dependencies", async () => {
    const auth: Auth = undefined!;
    const db: Db = undefined!;
    const app = createApp({
      auth,
      corsOrigins: [],
      db,
      logger: false,
      nodeEnv: "test",
    });

    const response = await app.inject({ method: "GET", url: "/health" });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("OK");

    await app.close();
  });
});
