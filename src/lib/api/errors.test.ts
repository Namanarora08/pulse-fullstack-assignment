import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import {
  AppError,
  InvalidJsonBodyError,
  handleApiError,
  isDatabaseUnavailableError
} from "@/lib/api/errors";

function prismaError(name: string, code?: string, meta?: unknown) {
  const error = new Error("prisma failure") as Error & { code?: string; meta?: unknown };
  error.name = name;
  error.code = code;
  error.meta = meta;
  return error;
}

describe("handleApiError", () => {
  it("maps validation failures to 400 with field details", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const parsed = z.object({ id: z.string() }).safeParse({});
    expect(parsed.success).toBe(false);

    const response = handleApiError(parsed.success ? null : parsed.error);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error.details).toBeDefined();
  });

  it("maps malformed JSON bodies to 400", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const response = handleApiError(new InvalidJsonBodyError());

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: { message: "Request body must be valid JSON." }
    });
  });

  it("preserves AppError status codes", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const response = handleApiError(new AppError("Patient not found.", 404));

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({
      error: { message: "Patient not found." }
    });
  });

  it("maps prisma constraint and connectivity errors", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(handleApiError(prismaError("PrismaClientKnownRequestError", "P2002")).status).toBe(409);
    expect(handleApiError(prismaError("PrismaClientKnownRequestError", "P2025")).status).toBe(404);
    expect(handleApiError(prismaError("PrismaClientInitializationError", "P1001")).status).toBe(503);
  });

  it("never leaks internal messages for unknown errors", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const response = handleApiError(new Error("connect ECONNREFUSED 10.0.0.1:5432"));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.message).toBe("An unexpected error occurred.");
  });

  it("logs every handled error", () => {
    const logged = vi.spyOn(console, "error").mockImplementation(() => {});
    handleApiError(new Error("boom"), "GET /api/example");

    expect(logged).toHaveBeenCalled();
  });
});

describe("isDatabaseUnavailableError", () => {
  it("only treats connection level prisma errors as unavailability", () => {
    expect(isDatabaseUnavailableError(prismaError("PrismaClientInitializationError"))).toBe(true);
    expect(isDatabaseUnavailableError(prismaError("PrismaClientKnownRequestError", "P1001"))).toBe(
      true
    );
    expect(isDatabaseUnavailableError(prismaError("PrismaClientKnownRequestError", "P2002"))).toBe(
      false
    );
    expect(isDatabaseUnavailableError(new Error("boom"))).toBe(false);
  });
});
