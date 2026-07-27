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

export class InvalidJsonBodyError extends AppError {
  constructor(cause?: unknown) {
    super("Request body must be valid JSON.", 400);
    this.name = "InvalidJsonBodyError";
    this.cause = cause;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

type PrismaLikeError = Error & { code?: string; meta?: unknown };

function asPrismaError(error: unknown): PrismaLikeError | null {
  if (!(error instanceof Error)) return null;
  return error.name.startsWith("PrismaClient") ? (error as PrismaLikeError) : null;
}

/**
 * True for errors that mean the database itself is unreachable, as opposed to a
 * query/constraint failure that must be surfaced to the caller.
 */
export function isDatabaseUnavailableError(error: unknown): boolean {
  const prismaError = asPrismaError(error);
  if (!prismaError) return false;
  if (prismaError.name === "PrismaClientInitializationError") return true;
  // P1xxx: connection/authentication/timeout level failures.
  return typeof prismaError.code === "string" && prismaError.code.startsWith("P1");
}

function prismaErrorResponse(error: PrismaLikeError) {
  switch (error.code) {
    case "P2002":
      return errorResponse("A record with these values already exists.", {
        status: 409,
        details: error.meta
      });
    case "P2003":
      return errorResponse("Referenced record does not exist.", {
        status: 400,
        details: error.meta
      });
    case "P2025":
      return errorResponse("Record not found.", { status: 404, details: error.meta });
    default:
      if (isDatabaseUnavailableError(error)) {
        return errorResponse("Database is temporarily unavailable.", { status: 503 });
      }
      return null;
  }
}

/**
 * Maps a thrown error to an API response, always logging the underlying cause so
 * failures are never lost, and never leaking internal messages to the client.
 */
export function handleApiError(error: unknown, context?: string) {
  console.error(`[api]${context ? ` ${context}:` : ""}`, error);

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

  const prismaError = asPrismaError(error);
  if (prismaError) {
    const response = prismaErrorResponse(prismaError);
    if (response) return response;
  }

  return errorResponse("An unexpected error occurred.", { status: 500 });
}
