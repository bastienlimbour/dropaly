export interface ApiErrorBody {
  error: string;
  code: string;
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string | undefined;
  readonly body: unknown;

  constructor(options: {
    body: unknown;
    code?: string;
    message: string;
    status: number;
  }) {
    super(options.message);
    this.name = "ApiClientError";
    this.status = options.status;
    this.code = options.code;
    this.body = options.body;
  }
}

function isApiErrorBody(body: unknown): body is ApiErrorBody {
  return (
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    "code" in body &&
    typeof body.error === "string" &&
    typeof body.code === "string"
  );
}

export function throwApiError(error: unknown, response: Response): never {
  const message = isApiErrorBody(error) ? error.error : response.statusText;
  const code = isApiErrorBody(error) ? error.code : undefined;

  const options = {
    body: error,
    message: message || "API request failed",
    status: response.status,
  };

  throw new ApiClientError(code ? { ...options, code } : options);
}
