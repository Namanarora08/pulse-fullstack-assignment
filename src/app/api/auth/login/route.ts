import { NextRequest, NextResponse } from "next/server";
import {
  AuthSession,
  FullSession,
  DEMO_ADMIN,
  DEMO_DOCTORS,
  DEMO_PATIENTS,
  SESSION_COOKIE_NAME
} from "@/lib/auth";

// In-memory session storage for demo (would be DB in production)
const sessionStore = new Map<string, FullSession>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, aadhaar, dob, email, password, adminId, hospitalCode } = body;

    if (!role || !["patient", "doctor", "admin"].includes(role)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing user role." },
        { status: 400 }
      );
    }

    let fullSession: FullSession | null = null;

    // -----------------------------------------------------------------------
    // PATIENT AUTHENTICATION
    // -----------------------------------------------------------------------
    if (role === "patient") {
      let sanitizedAadhaar = (aadhaar || "").replace(/\s/g, "");
      if (
        sanitizedAadhaar.length !== 12 ||
        !/^\d{12}$/.test(sanitizedAadhaar)
      ) {
        // Fall back to demo patient Aadhaar if empty or improperly formatted
        sanitizedAadhaar = "987654321098";
      }

      // Find matching demo patient or create hydrated patient record
      const formattedAadhaar = `${sanitizedAadhaar.slice(0, 4)} ${sanitizedAadhaar.slice(4, 8)} ${sanitizedAadhaar.slice(8, 12)}`;
      let patient = DEMO_PATIENTS.find(
        (p) => p.aadhaar.replace(/\s/g, "") === sanitizedAadhaar
      );

      if (!patient) {
        // Fallback demo hydration if custom 12-digit Aadhaar is entered
        patient = {
          ...DEMO_PATIENTS[0],
          id: `pat-${sanitizedAadhaar.slice(-5)}`,
          aadhaar: formattedAadhaar,
          dob: dob || DEMO_PATIENTS[0].dob
        };
      }

      const sessionId = `sess-pat-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      const token = `pat-tok-${Date.now()}`;
      const authenticatedAt = new Date().toISOString();
      const expiresAt = new Date(
        Date.now() + 60 * 60 * 24 * 7 * 1000
      ).toISOString(); // 7 days

      fullSession = {
        sessionId,
        role: "patient",
        user: patient,
        token,
        authenticatedAt,
        expiresAt
      };

      // Store full session in memory
      sessionStore.set(sessionId, fullSession);
    }

    // -----------------------------------------------------------------------
    // DOCTOR AUTHENTICATION
    // -----------------------------------------------------------------------
    else if (role === "doctor") {
      if (!email || !password) {
        return NextResponse.json(
          {
            success: false,
            error: "Please enter hospital email and password."
          },
          { status: 400 }
        );
      }

      const normalizedEmail = email.trim().toLowerCase();
      let doctor = DEMO_DOCTORS.find(
        (d) => d.email.toLowerCase() === normalizedEmail
      );

      if (!doctor) {
        doctor = {
          id: `doc-${Date.now()}`,
          name: email.split("@")[0].replace(".", " ").toUpperCase(),
          email: normalizedEmail,
          title: "Attending Specialist",
          department: "Cardiology",
          hospital: "St. Jude Heart Institute",
          assignedPatientIds: ["pat-rahul-88201"]
        };
      }

      const sessionId = `sess-doc-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      const token = `doc-tok-${Date.now()}`;
      const authenticatedAt = new Date().toISOString();
      const expiresAt = new Date(
        Date.now() + 60 * 60 * 24 * 7 * 1000
      ).toISOString(); // 7 days

      fullSession = {
        sessionId,
        role: "doctor",
        user: doctor,
        token,
        authenticatedAt,
        expiresAt
      };

      // Store full session in memory
      sessionStore.set(sessionId, fullSession);
    }

    // -----------------------------------------------------------------------
    // ADMIN AUTHENTICATION
    // -----------------------------------------------------------------------
    else if (role === "admin") {
      if (!adminId || !password || !hospitalCode) {
        return NextResponse.json(
          {
            success: false,
            error: "Please enter Admin ID, Password, and Hospital Code."
          },
          { status: 400 }
        );
      }

      const sessionId = `sess-adm-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      const token = `adm-tok-${Date.now()}`;
      const authenticatedAt = new Date().toISOString();
      const expiresAt = new Date(
        Date.now() + 60 * 60 * 24 * 7 * 1000
      ).toISOString(); // 7 days

      fullSession = {
        sessionId,
        role: "admin",
        user: {
          ...DEMO_ADMIN,
          email: adminId,
          hospitalCode: hospitalCode
        },
        token,
        authenticatedAt,
        expiresAt
      };

      // Store full session in memory
      sessionStore.set(sessionId, fullSession);
    }

    if (!fullSession) {
      return NextResponse.json(
        { success: false, error: "Authentication failed." },
        { status: 401 }
      );
    }

    // Create minimal session for cookie
    const minimalSession: AuthSession = {
      sessionId: fullSession.sessionId,
      role: fullSession.role,
      token: fullSession.token,
      authenticatedAt: fullSession.authenticatedAt,
      expiresAt: fullSession.expiresAt
    };

    const response = NextResponse.json({
      success: true,
      session: fullSession // Return full session in response body for client
    });

    // Set minimal HTTP Cookie for server/middleware session persistence
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: encodeURIComponent(JSON.stringify(minimalSession)),
      httpOnly: true, // Server-side only for middleware security
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    return response;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// Export session store for other API routes to access
export { sessionStore };
