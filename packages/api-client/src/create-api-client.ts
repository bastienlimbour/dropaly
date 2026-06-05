import createClient from "openapi-fetch";

// import type { ApiErrorBody } from "./error";
import type { paths } from "./schema";

type ApiHeadersInit = ConstructorParameters<typeof Headers>[0];

export interface CreateApiClientOptions {
  baseUrl: string;
  credentials: "include" | "omit" | "same-origin";
  fetch?: typeof globalThis.fetch;
  getHeaders?: () =>
    | ApiHeadersInit
    | Promise<ApiHeadersInit | undefined>
    | undefined;
}

export function createApiClient(options: CreateApiClientOptions) {
  const client = createClient<paths>({
    baseUrl: options.baseUrl,
    credentials: options.credentials,
    fetch: (request) => options.fetch?.(request) ?? fetch(request),
  });
  // as ApiClient;

  if (options.getHeaders) {
    client.use({
      async onRequest({ request }: { request: Request }) {
        const extraHeaders = await options.getHeaders?.();
        if (!extraHeaders) return request;

        const headers = new Headers(request.headers);
        new Headers(extraHeaders).forEach((value, key) => {
          headers.set(key, value);
        });

        return new Request(request, { headers });
      },
    });
  }

  return client;
}

export type ApiClient = ReturnType<typeof createApiClient>;
