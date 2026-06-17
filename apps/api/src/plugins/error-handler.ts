import { isAPIError as isBetterAuthAPIError } from "better-auth/api";
import { DrizzleQueryError } from "drizzle-orm/errors";
import type { FastifyError, FastifyPluginAsync } from "fastify";
import { fastifyPlugin } from "fastify-plugin";
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from "fastify-type-provider-zod";
import { DatabaseError } from "pg";

import { createErrorResponse, HttpError } from "@/errors/http-error";

const POSTGRES_UNAVAILABLE_CODES = new Set([
  "08000",
  "08003",
  "08006",
  "08001",
  "08004",
  "08007",
  "08P01",
  "57P01",
  "57P02",
  "57P03",
]);

const SYSTEM_CONNECTION_CODES = new Set([
  "ECONNRESET",
  "ECONNREFUSED",
  "EHOSTUNREACH",
  "ENOTFOUND",
  "ETIMEDOUT",
]);

interface ErrorResponseOptions {
  statusCode: number;
  code: string;
  message: string;
}

const POSTGRES_ERROR_RESPONSES: Record<string, ErrorResponseOptions> = {
  "23505": {
    statusCode: 409,
    code: "UNIQUE_VIOLATION",
    message: "Resource already exists.",
  },
  "23503": {
    statusCode: 409,
    code: "FOREIGN_KEY_VIOLATION",
    message: "Referenced resource does not exist.",
  },
  "23514": {
    statusCode: 400,
    code: "CHECK_VIOLATION",
    message: "Invalid input.",
  },
  "23502": {
    statusCode: 500,
    code: "DATABASE_CONSTRAINT_VIOLATION",
    message: "Internal server error.",
  },
  "40001": {
    statusCode: 503,
    code: "TRANSACTION_RETRY_REQUIRED",
    message: "Request could not be completed. Please retry.",
  },
};

const DATABASE_UNAVAILABLE_RESPONSE: ErrorResponseOptions = {
  statusCode: 503,
  code: "DATABASE_UNAVAILABLE",
  message: "Database is temporarily unavailable.",
};

function mapDatabaseError(error: DrizzleQueryError) {
  const cause = error.cause;

  if (cause instanceof DatabaseError) {
    const code = cause.code;
    const response = code ? POSTGRES_ERROR_RESPONSES[code] : undefined;

    if (response) {
      return createErrorResponse(response);
    }

    if (code && POSTGRES_UNAVAILABLE_CODES.has(code)) {
      return createErrorResponse(DATABASE_UNAVAILABLE_RESPONSE);
    }
  }

  if (
    cause instanceof Error &&
    "code" in cause &&
    typeof cause.code === "string" &&
    SYSTEM_CONNECTION_CODES.has(cause.code)
  ) {
    return createErrorResponse(DATABASE_UNAVAILABLE_RESPONSE);
  }

  return undefined;
}

const errorHandlerPluginFn: FastifyPluginAsync = async (app) => {
  app.setNotFoundHandler((request, reply) => {
    request.log.info({ path: request.url }, "Route not found");
    return reply.status(404).send(
      createErrorResponse({
        statusCode: 404,
        code: "NOT_FOUND",
        message: "Route not found.",
      }),
    );
  });

  app.setErrorHandler<FastifyError>((error, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      request.log.info({ err: error }, "Request validation failed");
      return reply.status(400).send(
        createErrorResponse({
          statusCode: 400,
          code: "VALIDATION_ERROR",
          message: "Invalid request.",
          validation: error.validation,
        }),
      );
    }

    if (isResponseSerializationError(error)) {
      request.log.error({ err: error }, "Response serialization failed");
      return reply.status(500).send(
        createErrorResponse({
          statusCode: 500,
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error.",
        }),
      );
    }

    if (error instanceof HttpError) {
      request.log.info({ err: error, code: error.code }, "Handled HTTP error");
      return reply.status(error.statusCode).send(
        createErrorResponse({
          statusCode: error.statusCode,
          code: error.code,
          message: error.message,
        }),
      );
    }

    if (isBetterAuthAPIError(error)) {
      const isServerError = error.statusCode >= 500;

      if (isServerError && error.body?.code === "FAILED_TO_GET_SESSION") {
        request.log.error(
          { err: error, code: DATABASE_UNAVAILABLE_RESPONSE.code },
          "Auth session database error",
        );
        return reply
          .status(DATABASE_UNAVAILABLE_RESPONSE.statusCode)
          .send(createErrorResponse(DATABASE_UNAVAILABLE_RESPONSE));
      }

      const code =
        error.body?.code ??
        (typeof error.status === "string" ? error.status : "REQUEST_ERROR");
      const message = error.body?.message ?? error.message;

      request.log[isServerError ? "error" : "info"](
        { err: error, code },
        "Handled auth API error",
      );
      return reply.status(error.statusCode).send(
        createErrorResponse({
          statusCode: error.statusCode,
          code: isServerError ? "INTERNAL_SERVER_ERROR" : code,
          message: isServerError ? "Internal server error." : message,
        }),
      );
    }

    if (error instanceof DrizzleQueryError) {
      const databaseError = mapDatabaseError(error);
      if (databaseError) {
        request.log.error(
          { err: error, code: databaseError.code },
          "Database error",
        );
        return reply.status(databaseError.statusCode).send(databaseError);
      }
    }

    const statusCode =
      error.statusCode != null && error.statusCode >= 400 ? error.statusCode : 500;
    const isServerError = statusCode >= 500;

    request.log[isServerError ? "error" : "info"](
      { err: error },
      "Unhandled request error",
    );

    return reply.status(statusCode).send(
      createErrorResponse({
        statusCode,
        code: isServerError
          ? "INTERNAL_SERVER_ERROR"
          : error.code || "REQUEST_ERROR",
        message: isServerError
          ? "Internal server error."
          : error.message || "Request error.",
      }),
    );
  });
};

export const errorHandlerPlugin = fastifyPlugin(errorHandlerPluginFn, {
  name: "error-handler",
});
