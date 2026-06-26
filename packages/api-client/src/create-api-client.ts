import createClient from "openapi-fetch";
import type { Middleware } from "openapi-fetch";

import { createApiClientError, createNetworkApiError } from "./error";
import type { paths } from "./types/api-types.gen";

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

async function parseErrorBody(response: Response): Promise<unknown> {
  const text = await response
    .clone()
    .text()
    .catch(() => undefined);

  if (!text) return undefined;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

const errorMiddleware: Middleware = {
  async onResponse({ response }) {
    if (!response.ok) {
      throw createApiClientError(response, await parseErrorBody(response));
    }

    return response;
  },
  onError({ error }) {
    return createNetworkApiError(error);
  },
};

export function createApiClient(options: CreateApiClientOptions) {
  const client = createClient<paths>({
    baseUrl: options.baseUrl,
    credentials: options.credentials,
    fetch: options.fetch ?? globalThis.fetch,
  });
  client.use(errorMiddleware);

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
