import { UserRole } from "./auth";

// Only identifiers live in the cookie; the full user record is hydrated
// server-side so that no PHI is stored in the browser cookie jar.
export interface SessionPayload {
  role: UserRole;
  userId: string;
  email?: string;
  aadhaar?: string;
  dob?: string;
  hospitalCode?: string;
  token: string;
  authenticatedAt: string;
}

// Session cookies are signed with HMAC-SHA256 so that a client cannot forge a
// session (e.g. escalate its own role to "admin"). Web Crypto is used because
// the middleware runs on the edge runtime, where node:crypto is unavailable.

const DEV_FALLBACK_SECRET = "development-only-insecure-session-secret";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 16) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET must be set to at least 16 characters in production."
    );
  }

  return DEV_FALLBACK_SECRET;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "="
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function importKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signSession(
  payloadData: SessionPayload
): Promise<string> {
  const payload = toBase64Url(
    new TextEncoder().encode(JSON.stringify(payloadData))
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    await importKey(),
    new TextEncoder().encode(payload)
  );
  return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifySession(
  cookieValue: string | undefined
): Promise<SessionPayload | null> {
  if (!cookieValue) return null;

  const [payload, signature] = cookieValue.split(".");
  if (!payload || !signature) return null;

  try {
    const valid = await crypto.subtle.verify(
      "HMAC",
      await importKey(),
      fromBase64Url(signature),
      new TextEncoder().encode(payload)
    );
    if (!valid) return null;

    const session = JSON.parse(
      new TextDecoder().decode(fromBase64Url(payload))
    ) as SessionPayload;

    if (
      !session ||
      !session.userId ||
      !["patient", "doctor", "admin"].includes(session.role)
    ) {
      return null;
    }

    const issuedAt = Date.parse(session.authenticatedAt);
    if (
      Number.isNaN(issuedAt) ||
      Date.now() - issuedAt > SESSION_MAX_AGE_SECONDS * 1000
    ) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
