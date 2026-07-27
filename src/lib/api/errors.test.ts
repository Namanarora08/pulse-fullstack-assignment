import { describe, expect, it } from "vitest";
import { z } from "zod";

import { AppError, handleApiError, isAppError } from "./errors";

describe("AppError", () => {
  it("defaults to a 500 status and carries optional details", () => {
    const err = new AppError("Something failed");

    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("AppError");
    expect(err.message).toBe("Something failed");
    expect(err.statusCode).toBe(500);
    expect(err.details).toBeUndefined();
  });

  it("accepts a custom status code and details", () => {
    const err = new AppError("Not found", 404, { id: "x" });

    expect(err.statusCode).toBe(404);
    expect(err.details).toEqual({ id: "x" });
  });
});

describe("isAppError", () => {
  it("narrows AppError instances and rejects other values", () => {
    expect(isAppError(new AppError("x"))).toBe(true);
    expect(isAppError(new Error("x"))).toBe(false);
    expect(isAppError("x")).toBe(false);
    expect(isAppError(null)).toBe(false);
  });
});

describe("handleApiError", () => {
  it("maps a ZodError to a 400 with flattened details", async () => {
    const schema = z.object({ email: z.string() });
    let zodError: unknown;
    try {
      schema.parse({ email: 123 });
    } catch (err) {
      zodError = err;
    }

    const response = handleApiError(zodError);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error.message).toBe("Invalid request payload.");
    expect(body.error.details).toHaveProperty("fieldErrors");
  });

  it("maps an AppError to its status and message", async () => {
    const response = handleApiError(
      new AppError("Forbidden", 403, { reason: "role" })
    );
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body).toEqual({
      success: false,
      error: { message: "Forbidden", details: { reason: "role" } }
    });
  });

  it("falls back to a generic 500 for unknown errors", async () => {
    const response = handleApiError(new Error("kaboom"));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error.message).toBe("An unexpected error occurred.");
  });
});
