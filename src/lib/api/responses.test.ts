import { describe, expect, it } from "vitest";

import { errorResponse, successResponse } from "./responses";

describe("successResponse", () => {
  it("wraps data in a success envelope with a default 200 status", async () => {
    const response = successResponse({ id: "abc" });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: { id: "abc" }
    });
  });

  it("honors a custom status code", async () => {
    const response = successResponse({ created: true }, { status: 201 });

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: { created: true }
    });
  });
});

describe("errorResponse", () => {
  it("wraps a message in an error envelope with a default 500 status", async () => {
    const response = errorResponse("Boom");

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: { message: "Boom", details: undefined }
    });
  });

  it("includes a custom status and details", async () => {
    const response = errorResponse("Invalid", {
      status: 400,
      details: { field: "email" }
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: { message: "Invalid", details: { field: "email" } }
    });
  });
});
