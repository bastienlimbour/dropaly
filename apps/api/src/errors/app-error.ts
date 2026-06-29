import { STATUS_CODES } from "node:http";

import type { ErrorResponse, ValidationIssue } from "@/schemas/error.schema";

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(options: { message: string; statusCode: number; code: string }) {
    super(options.message);
    this.name = "AppError";
    this.statusCode = options.statusCode;
    this.code = options.code;
  }
}

export function getStatusCodeName(statusCode: number) {
  return STATUS_CODES[statusCode] ?? "Error";
}

export function createErrorResponse(options: {
  message: string;
  statusCode: number;
  error?: string;
  code: string;
  validation?: ValidationIssue[];
}): ErrorResponse {
  return {
    message: options.message,
    statusCode: options.statusCode,
    error: options.error ?? getStatusCodeName(options.statusCode),
    code: options.code,
    ...(options.validation ? { validation: options.validation } : {}),
  };
}
