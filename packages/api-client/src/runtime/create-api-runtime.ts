/** Fetch implementation used by the API runtime. */
export type ApiFetch = typeof globalThis.fetch;

type ApiFetchInput = Parameters<ApiFetch>[0];
type ApiHeadersInit = RequestInit["headers"];
type ApiRequestCredentials = NonNullable<RequestInit["credentials"]>;

/**
 * Runtime policy applied to every API request.
 *
 * `url` resolves API paths against the configured base URL. `fetch` applies the
 * same base URL, credentials, and runtime headers before delegating to the real
 * fetch implementation.
 */
export interface ApiRuntime {
  url: (path: string) => string;
  fetch: ApiFetch;
}

/** Options used to create an API runtime shared by API clients. */
export interface CreateApiRuntimeOptions {
  /** Base URL used for relative API paths. */
  baseUrl: string;
  /** Credentials policy forced on every runtime request. */
  credentials: ApiRequestCredentials;
  /** Optional fetch implementation for tests or non-standard runtimes. */
  fetch?: ApiFetch;
  /** Headers resolved for every request after request-specific headers. */
  getHeaders?: () =>
    | ApiHeadersInit
    | Promise<ApiHeadersInit | undefined>
    | undefined;
}

const ABSOLUTE_URL_PATTERN = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;

function createApiUrl(baseUrl: string, path: string) {
  if (ABSOLUTE_URL_PATTERN.test(path)) return path;

  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  if (!path) return normalizedBaseUrl;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBaseUrl}${normalizedPath}`;
}

function mergeHeaders(...headersInits: Array<ApiHeadersInit | undefined>) {
  const headers = new Headers();

  for (const headersInit of headersInits) {
    if (!headersInit) continue;

    new Headers(headersInit).forEach((value, key) => {
      headers.set(key, value);
    });
  }

  return headers;
}

/**
 * Creates the request runtime used by generated API clients.
 *
 * Relative string inputs are resolved against `baseUrl`; absolute URLs are left
 * untouched. When the input is a `Request`, its URL is preserved while runtime
 * credentials and merged headers are applied. Headers from `getHeaders` win over
 * headers already present on the request.
 */
export function createApiRuntime(options: CreateApiRuntimeOptions): ApiRuntime {
  const fetchImpl = options.fetch ?? globalThis.fetch;

  return {
    url: (path) => createApiUrl(options.baseUrl, path),

    fetch: async (input, init) => {
      const extraHeaders = await options.getHeaders?.();
      const inputHeaders = input instanceof Request ? input.headers : undefined;
      const headers = mergeHeaders(inputHeaders, init?.headers, extraHeaders);
      const requestInit: RequestInit = {
        ...init,
        credentials: options.credentials,
        headers,
      };

      if (input instanceof Request) {
        return fetchImpl(new Request(input, requestInit));
      }

      const requestInput: ApiFetchInput = createApiUrl(
        options.baseUrl,
        String(input),
      );

      return fetchImpl(requestInput, requestInit);
    },
  };
}
