import { describe, expect, it, vi } from "vitest";

import { createApiRuntime } from "./create-api-runtime";

describe("createApiRuntime", () => {
  it("resolves relative API paths against the base URL", () => {
    const runtime = createApiRuntime({
      baseUrl: "https://api.test/",
      credentials: "include",
    });

    expect(runtime.url("/api/ai/chat")).toBe("https://api.test/api/ai/chat");
    expect(runtime.url("api/health")).toBe("https://api.test/api/health");
    expect(runtime.url("")).toBe("https://api.test");
  });

  it("keeps absolute URLs unchanged", () => {
    const runtime = createApiRuntime({
      baseUrl: "https://api.test",
      credentials: "include",
    });

    expect(runtime.url("https://other.test/api/health")).toBe(
      "https://other.test/api/health",
    );
  });

  it("applies credentials and merges request headers with runtime headers", async () => {
    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(new Response(null, { status: 204 }));
    const runtime = createApiRuntime({
      baseUrl: "https://api.test",
      credentials: "include",
      fetch,
      getHeaders() {
        return { Cookie: "session=runtime", "X-Runtime": "yes" };
      },
    });

    await runtime.fetch("/api/health", {
      headers: { Cookie: "session=request", "X-Request": "yes" },
      method: "POST",
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://api.test/api/health",
      expect.objectContaining({ credentials: "include", method: "POST" }),
    );

    const init = fetch.mock.calls[0]?.[1];
    expect(init).toBeDefined();
    if (!init) {
      throw new Error("Expected fetch to receive request init.");
    }

    const headers = new Headers(init.headers);
    expect(headers.get("cookie")).toBe("session=runtime");
    expect(headers.get("x-request")).toBe("yes");
    expect(headers.get("x-runtime")).toBe("yes");
  });

  it("supports async runtime headers", async () => {
    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(new Response(null, { status: 204 }));
    const runtime = createApiRuntime({
      baseUrl: "https://api.test",
      credentials: "omit",
      fetch,
      async getHeaders() {
        return { Authorization: "Bearer token" };
      },
    });

    await runtime.fetch("/api/health");

    const init = fetch.mock.calls[0]?.[1];
    expect(init).toBeDefined();
    if (!init) {
      throw new Error("Expected fetch to receive request init.");
    }

    expect(new Headers(init.headers).get("authorization")).toBe("Bearer token");
  });

  it("preserves Request input details while applying runtime policy", async () => {
    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(new Response(null, { status: 204 }));
    const runtime = createApiRuntime({
      baseUrl: "https://api.test",
      credentials: "include",
      fetch,
      getHeaders() {
        return { "X-Runtime": "yes" };
      },
    });
    const request = new Request("https://api.test/api/health", {
      headers: { "X-Request": "yes" },
      method: "PUT",
    });

    await runtime.fetch(request);

    const calledRequest = fetch.mock.calls[0]?.[0];
    expect(calledRequest).toBeInstanceOf(Request);
    if (!(calledRequest instanceof Request)) {
      throw new Error("Expected fetch to receive a Request.");
    }

    expect(calledRequest.method).toBe("PUT");
    expect(calledRequest.credentials).toBe("include");
    expect(calledRequest.headers.get("x-request")).toBe("yes");
    expect(calledRequest.headers.get("x-runtime")).toBe("yes");
  });
});
