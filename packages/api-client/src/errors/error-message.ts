import { ApiClientError } from "./api-client-error";

const DEFAULT_MESSAGE = "Une erreur est survenue. Réessayez dans un instant.";

const ERROR_MESSAGES = {
  // HTTP errors
  BAD_REQUEST: "La requête est invalide.",
  CONFLICT: "Cette action entre en conflit avec des données existantes.",
  DATABASE_UNAVAILABLE: "Le service est temporairement indisponible.",
  FORBIDDEN: "Vous n'avez pas accès à cette ressource.",
  INTERNAL_SERVER_ERROR: "Une erreur serveur est survenue.",
  NOT_FOUND: "La ressource demandée est introuvable.",
  UNAUTHORIZED: "Vous devez être connecté.",

  // Better Auth errors
  INVALID_EMAIL_OR_PASSWORD: "Email ou mot de passe invalide.",

  // Domain errors
  TODO_NOT_FOUND: "Cette tâche est introuvable.",

  // Validation and database errors
  CHECK_VIOLATION: "Les données envoyées sont invalides.",
  DATABASE_CONSTRAINT_VIOLATION: "Une erreur serveur est survenue.",
  FOREIGN_KEY_VIOLATION: "La ressource liée est introuvable.",
  TRANSACTION_RETRY_REQUIRED: "L'action n'a pas pu aboutir. Réessayez.",
  UNIQUE_VIOLATION: "Cette ressource existe déjà.",
  VALIDATION_ERROR: "Les données envoyées sont invalides.",

  // Client and network errors
  NETWORK_ERROR: "Impossible de contacter le serveur.",
  REQUEST_ABORTED: "La requête a été annulée.",

  // Generic API fallback errors
  REQUEST_ERROR: "La requête est invalide.",
} as const;

const STATUS_ERROR_CODES: Record<number, keyof typeof ERROR_MESSAGES> = {
  0: "NETWORK_ERROR",
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  500: "INTERNAL_SERVER_ERROR",
  503: "DATABASE_UNAVAILABLE",
};

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null;
}

function isNetworkError(error: unknown) {
  return (
    error instanceof TypeError &&
    ["Failed to fetch", "fetch failed", "Load failed"].includes(error.message)
  );
}

function getMappedErrorMessage(code: string) {
  if (!isErrorMessageCode(code)) return undefined;

  return ERROR_MESSAGES[code];
}

function isErrorMessageCode(code: string): code is keyof typeof ERROR_MESSAGES {
  return Object.hasOwn(ERROR_MESSAGES, code);
}

export function getErrorCode(error: unknown): string | undefined {
  if (error instanceof ApiClientError) return error.code;

  if (!isRecord(error)) return undefined;

  const code = error["code"];
  if (typeof code === "string") return code;

  const nestedError = error["error"];
  if (!isRecord(nestedError)) return undefined;

  const nestedCode = nestedError["code"];
  if (typeof nestedCode === "string") return nestedCode;

  return undefined;
}

function getErrorStatus(error: unknown): number | undefined {
  if (error instanceof ApiClientError) return error.status;

  if (!isRecord(error)) return undefined;

  const status = error["status"];
  if (typeof status === "number") return status;

  const statusCode = error["statusCode"];
  if (typeof statusCode === "number") return statusCode;

  return undefined;
}

/**
 * Converts API, auth, validation, and network errors to a safe user-facing message.
 *
 * Known machine-readable codes win over HTTP status fallbacks. Unknown inputs use
 * a generic message so raw server details are not shown to users.
 */
export function toUserMessage(error: unknown): string {
  const code = getErrorCode(error);
  const message = code ? getMappedErrorMessage(code) : undefined;
  if (message) return message;

  const status = getErrorStatus(error);
  const statusCode = status === undefined ? undefined : STATUS_ERROR_CODES[status];
  if (statusCode) return ERROR_MESSAGES[statusCode];

  if (isNetworkError(error)) return ERROR_MESSAGES["NETWORK_ERROR"];

  return DEFAULT_MESSAGE;
}
