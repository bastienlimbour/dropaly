type ApiFetch = typeof globalThis.fetch;
type ApiFetchInput = Parameters<ApiFetch>[0];
type ApiHeadersInit = RequestInit["headers"];
type ApiRequestCredentials = NonNullable<RequestInit["credentials"]>;

export interface ApiRuntime {
  url: (path: string) => string;
  fetch: ApiFetch;
}

export interface CreateApiRuntimeOptions {
  baseUrl: string;
  credentials: ApiRequestCredentials;
  fetch?: ApiFetch;
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
