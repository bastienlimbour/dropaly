import createClient from "openapi-fetch";
import type { Middleware } from "openapi-fetch";

import {
  createApiClientError,
  createNetworkApiError,
} from "../errors/api-client-error";
import { createApiRuntime } from "../runtime/create-api-runtime";
import type {
  ApiRuntime,
  CreateApiRuntimeOptions,
} from "../runtime/create-api-runtime";
import type { paths } from "../types/api-types.gen";

/** Options for creating a client from an already configured API runtime. */
export interface CreateApiClientRuntimeOptions {
  runtime: ApiRuntime;
}

/** Options accepted by `createApiClient`. */
export type CreateApiClientOptions =
  | CreateApiClientRuntimeOptions
  | CreateApiRuntimeOptions;

/** OpenAPI client configured for the Dropaly API schema. */
export type ApiClient = ReturnType<typeof createClient<paths>>;

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
  },
  onError({ error }) {
    return createNetworkApiError(error);
  },
};

function resolveRuntime(options: CreateApiClientOptions): ApiRuntime {
  if ("runtime" in options) return options.runtime;

  return createApiRuntime(options);
}

/**
 * Creates a typed client for the Dropaly API.
 *
 * The client installs a middleware that throws `ApiClientError` for non-2xx HTTP
 * responses and network failures. Successful responses keep the default
 * `openapi-fetch` parsing behavior, including parse errors for invalid bodies.
 */
export function createApiClient(options: CreateApiClientOptions): ApiClient {
  const runtime = resolveRuntime(options);
  const client = createClient<paths>({
    baseUrl: runtime.url(""),
    fetch: runtime.fetch,
  });
  client.use(errorMiddleware);

  return client;
}
