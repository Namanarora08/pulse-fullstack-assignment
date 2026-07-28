import { cookies } from "next/headers";
import { AuthSession, FullSession, SESSION_COOKIE_NAME } from "./auth";

// Server helper to parse minimal session from cookies
export async function getServerSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) return null;
    return JSON.parse(decodeURIComponent(sessionCookie)) as AuthSession;
  } catch {
    return null;
  }
}

// Server helper to get full session (would fetch from DB in production)
export async function getFullSession(
  sessionId: string
): Promise<FullSession | null> {
  try {
    // In production, this would fetch from database using sessionId
    // For demo, we'll import the session store from login route
    const { sessionStore } = await import("@/app/api/auth/login/route");
    return sessionStore.get(sessionId) || null;
  } catch {
    return null;
  }
}
