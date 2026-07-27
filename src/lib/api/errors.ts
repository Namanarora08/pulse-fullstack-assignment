import { ZodError } from "zod";

import { errorResponse } from "@/lib/api/responses";

export class AppError extends Error {
  readonly statusCode: number;
  readonly details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return errorResponse("Invalid request payload.", {
      status: 400,
      details: error.flatten()
    });
  }

  if (isAppError(error)) {
    return errorResponse(error.message, {
      status: error.statusCode,
      details: error.details
    });
  }

  return errorResponse("An unexpected error occurred.", { status: 500 });
}
