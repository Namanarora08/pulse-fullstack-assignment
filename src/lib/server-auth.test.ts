import { afterEach, describe, expect, it, vi } from "vitest";

import type { AuthSession } from "./auth";
import { SESSION_COOKIE_NAME } from "./auth";

const getCookie = vi.fn();

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: getCookie })
}));

async function loadSession() {
  const { getServerSession } = await import("./server-auth");
  return getServerSession();
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("getServerSession", () => {
  it("returns null when the session cookie is absent", async () => {
    getCookie.mockReturnValue(undefined);

    await expect(loadSession()).resolves.toBeNull();
  });

  it("parses a URI-encoded JSON session cookie", async () => {
    const session: AuthSession = {
      role: "admin",
      user: {
        id: "admin-1",
        name: "Admin",
        email: "admin@example.com",
        hospitalCode: "H1",
        department: "Ops"
      },
      token: "tok",
      authenticatedAt: "2026-07-27T00:00:00.000Z"
    };
    getCookie.mockReturnValue({
      value: encodeURIComponent(JSON.stringify(session))
    });

    await expect(loadSession()).resolves.toEqual(session);
    expect(getCookie).toHaveBeenCalledWith(SESSION_COOKIE_NAME);
  });

  it("returns null when the cookie value is malformed JSON", async () => {
    getCookie.mockReturnValue({ value: "%7Bnot-json" });

    await expect(loadSession()).resolves.toBeNull();
  });
});
