import { NextResponse } from "next/server";
import { getServerSession, getFullSession } from "@/lib/server-auth";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { authenticated: false, session: null },
      { status: 401 }
    );
  }

  // Check if session is expired
  if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
    return NextResponse.json(
      { authenticated: false, session: null, error: "Session expired" },
      { status: 401 }
    );
  }

  // Get full session with user data
  const fullSession = await getFullSession(session.sessionId);

  if (!fullSession) {
    return NextResponse.json(
      { authenticated: false, session: null, error: "Session not found" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    session: fullSession
  });
}
