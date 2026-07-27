import type { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { validateJsonBody, validateSearchParams } from "./request";

function mockRequest(json: () => Promise<unknown>): NextRequest {
  return { json } as unknown as NextRequest;
}

describe("validateJsonBody", () => {
  const schema = z.object({ name: z.string(), age: z.number() });

  it("parses and returns a valid JSON body", async () => {
    const request = mockRequest(async () => ({ name: "Ada", age: 36 }));

    await expect(validateJsonBody(request, schema)).resolves.toEqual({
      name: "Ada",
      age: 36
    });
  });

  it("throws a ZodError when the body does not match the schema", async () => {
    const request = mockRequest(async () => ({ name: "Ada" }));

    await expect(validateJsonBody(request, schema)).rejects.toBeInstanceOf(
      z.ZodError
    );
  });

  it("treats an unparseable body as an empty object", async () => {
    const request = mockRequest(async () => {
      throw new SyntaxError("Unexpected end of JSON input");
    });
    const optionalSchema = z.object({ name: z.string().optional() });

    await expect(validateJsonBody(request, optionalSchema)).resolves.toEqual(
      {}
    );
  });
});

describe("validateSearchParams", () => {
  const schema = z.object({ page: z.string(), sort: z.string().optional() });

  it("parses entries from URLSearchParams", () => {
    const params = new URLSearchParams({ page: "2", sort: "asc" });

    expect(validateSearchParams(params, schema)).toEqual({
      page: "2",
      sort: "asc"
    });
  });

  it("throws when a required param is missing", () => {
    const params = new URLSearchParams({ sort: "asc" });

    expect(() => validateSearchParams(params, schema)).toThrow(z.ZodError);
  });
});
