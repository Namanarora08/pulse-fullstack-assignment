import { cookies } from "next/headers";
import { AuthSession, SESSION_COOKIE_NAME, UserRole } from "./auth";
import { hydrateSession } from "./demo-accounts";
import { SessionPayload, verifySession } from "./session";

// Server helper to read and verify the signed session cookie
export async function getSessionPayload(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function getServerSession(): Promise<AuthSession | null> {
  const payload = await getSessionPayload();
  return payload ? hydrateSession(payload) : null;
}

// Returns the verified session payload only when the caller holds one of the
// allowed roles, otherwise null so the route can respond 401/403.
export async function requireRole(
  roles: UserRole[]
): Promise<SessionPayload | null> {
  const payload = await getSessionPayload();
  if (!payload || !roles.includes(payload.role)) return null;
  return payload;
}
