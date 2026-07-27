import { cookies } from "next/headers";
import { AuthSession, SESSION_COOKIE_NAME } from "./auth";

// Server helper to parse session from cookies
export async function getServerSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) return null;
    return JSON.parse(decodeURIComponent(sessionCookie)) as AuthSession;
  } catch (err) {
    console.error("Failed to parse session cookie:", err);
    return null;
  }
}
