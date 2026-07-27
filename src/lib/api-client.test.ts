import { afterEach, describe, expect, it, vi } from "vitest";

import { safeFetchJson } from "./api-client";

function mockFetchResponse(options: {
  ok: boolean;
  status: number;
  contentType: string;
  json?: unknown;
  text?: string;
}) {
  return {
    ok: options.ok,
    status: options.status,
    headers: {
      get: (name: string) =>
        name.toLowerCase() === "content-type" ? options.contentType : null
    },
    json: async () => options.json,
    text: async () => options.text ?? ""
  } as unknown as Response;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("safeFetchJson", () => {
  it("parses a JSON response and reports ok/status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        mockFetchResponse({
          ok: true,
          status: 200,
          contentType: "application/json",
          json: { hello: "world" }
        })
      )
    );

    const result = await safeFetchJson<{ hello: string }>("/api/thing");

    expect(result).toEqual({ ok: true, status: 200, data: { hello: "world" } });
  });

  it("returns an error for a non-JSON (HTML) response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        mockFetchResponse({
          ok: false,
          status: 404,
          contentType: "text/html",
          text: "<!DOCTYPE html><html></html>"
        })
      )
    );

    const result = await safeFetchJson("/api/missing");

    expect(result.ok).toBe(false);
    expect(result.status).toBe(404);
    expect(result.data).toBeNull();
    expect(result.error).toContain("Non-JSON response (404)");
  });

  it("captures thrown network errors as a 500 result", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("Network down");
      })
    );

    const result = await safeFetchJson("/api/thing");

    expect(result).toEqual({
      ok: false,
      status: 500,
      data: null,
      error: "Network down"
    });
  });
});
