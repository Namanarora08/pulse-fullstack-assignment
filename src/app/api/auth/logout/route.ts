import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Get session from cookie to clean up session store
    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (sessionCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(sessionCookie));
        if (parsed.sessionId) {
          // Clean up session from memory store
          const { sessionStore } = await import("@/app/api/auth/login/route");
          sessionStore.delete(parsed.sessionId);
        }
      } catch {
        // Ignore errors during cleanup
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully"
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: "",
      path: "/",
      maxAge: 0
    });

    return response;
  } catch (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    err
  ) {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully"
    });
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: "",
      path: "/",
      maxAge: 0
    });
    return response;
  }
}
