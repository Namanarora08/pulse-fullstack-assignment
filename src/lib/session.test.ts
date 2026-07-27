import { describe, expect, it } from "vitest";

import { SessionPayload, signSession, verifySession } from "./session";

const payload: SessionPayload = {
  role: "patient",
  userId: "pat-rahul-88201",
  token: "pat-tok-test",
  authenticatedAt: new Date().toISOString()
};

describe("session cookie signing", () => {
  it("round-trips a signed session", async () => {
    const cookie = await signSession(payload);
    await expect(verifySession(cookie)).resolves.toMatchObject({
      role: "patient",
      userId: "pat-rahul-88201"
    });
  });

  it("rejects a forged unsigned session", async () => {
    const forged = btoa(JSON.stringify({ ...payload, role: "admin" }));
    await expect(verifySession(forged)).resolves.toBeNull();
    await expect(verifySession(`${forged}.deadbeef`)).resolves.toBeNull();
  });

  it("rejects a tampered payload", async () => {
    const cookie = await signSession(payload);
    const [, signature] = cookie.split(".");
    const tampered = btoa(JSON.stringify({ ...payload, role: "admin" }))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    await expect(verifySession(`${tampered}.${signature}`)).resolves.toBeNull();
  });

  it("rejects an expired session", async () => {
    const cookie = await signSession({
      ...payload,
      authenticatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    });
    await expect(verifySession(cookie)).resolves.toBeNull();
  });
});
