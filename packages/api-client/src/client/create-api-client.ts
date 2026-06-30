import createClient from "openapi-fetch";
import type { Middleware } from "openapi-fetch";

import {
  createApiClientError,
  createNetworkApiError,
} from "../errors/api-client-error";
import { createApiRuntime } from "../runtime/api-runtime";
import type { ApiRuntime, CreateApiRuntimeOptions } from "../runtime/api-runtime";
import type { paths } from "../types/api-types.gen";

export interface CreateApiClientRuntimeOptions {
  runtime: ApiRuntime;
}

export type CreateApiClientOptions =
  | CreateApiClientRuntimeOptions
  | CreateApiRuntimeOptions;

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

function resolveRuntime(options: CreateApiClientOptions) {
  if ("runtime" in options) return options.runtime;

  return createApiRuntime(options);
}

export function createApiClient(options: CreateApiClientOptions) {
  const runtime = resolveRuntime(options);
  const client = createClient<paths>({
    baseUrl: runtime.url(""),
    fetch: runtime.fetch,
  });
  client.use(errorMiddleware);

  return client;
}

export type ApiClient = ReturnType<typeof createApiClient>;
