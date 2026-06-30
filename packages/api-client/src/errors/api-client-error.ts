import type { ErrorResponse } from "../types/api-types.gen";

export type ApiErrorBody = ErrorResponse;
export type ApiValidationIssue = NonNullable<ErrorResponse["validation"]>[number];

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string | undefined;
  readonly body: unknown;
  override readonly cause: unknown;

  constructor(
    message: string,
    options: {
      body?: unknown;
      cause?: unknown;
      code?: string;
      status: number;
    },
  ) {
    super(message, { cause: options.cause });
    this.name = "ApiClientError";
    this.status = options.status;
    this.code = options.code;
    this.body = options.body;
    this.cause = options.cause;
  }
}

export function isApiErrorBody(body: unknown): body is ApiErrorBody {
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

export function createApiClientError(response: Response, body: unknown) {
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

export function createNetworkApiError(error: unknown) {
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
