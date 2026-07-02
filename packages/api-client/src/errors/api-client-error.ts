import type { ErrorResponse } from "../types/api-types.gen";

type ApiErrorBody = ErrorResponse;
// type ApiValidationIssue = NonNullable<ErrorResponse["validation"]>[number];

/** Options used to create a normalized API client error. */
export interface ApiClientErrorOptions {
  /** Parsed response body when an HTTP response was available. */
  body?: unknown;
  /** Original error that caused a network-level failure. */
  cause?: unknown;
  /** Stable machine-readable error code when one is known. */
  code?: string;
  /** HTTP status, or `0` when no response was received. */
  status: number;
}

/**
 * Error thrown by the API client for HTTP failures and network failures.
 *
 * `status` is `0` when no HTTP response exists, such as aborted requests or
 * failed network calls. `body` contains the parsed error response when parsing
 * succeeds, otherwise the raw response text or `undefined`.
 */
export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string | undefined;
  readonly body: unknown;
  override readonly cause: unknown;

  constructor(message: string, options: ApiClientErrorOptions) {
    super(message, { cause: options.cause });
    this.name = "ApiClientError";
    this.status = options.status;
    this.code = options.code;
    this.body = options.body;
    this.cause = options.cause;
  }
}

function isApiErrorBody(body: unknown): body is ApiErrorBody {
  return (
    typeof body === "object" &&
    body !== null &&
    "statusCode" in body &&
    "code" in body &&
    "error" in body &&
    "message" in body &&
    typeof body.statusCode === "number" &&
    typeof body.code === "string" &&
    typeof body.error === "string" &&
    typeof body.message === "string"
  );
}

export function createApiClientError(
  response: Response,
  body: unknown,
): ApiClientError {
  if (isApiErrorBody(body)) {
    return new ApiClientError(body.message, {
      body,
      code: body.code,
      status: response.status,
    });
  }

  return new ApiClientError(response.statusText || "API request failed.", {
    body,
    status: response.status,
  });
}

function isAbortError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError"
  );
}

export function createNetworkApiError(error: unknown): ApiClientError {
  if (isAbortError(error)) {
    return new ApiClientError("Request aborted.", {
      body: undefined,
      cause: error,
      code: "REQUEST_ABORTED",
      status: 0,
    });
  }

  return new ApiClientError("Network request failed.", {
    body: undefined,
    cause: error,
    code: "NETWORK_ERROR",
    status: 0,
  });
}
