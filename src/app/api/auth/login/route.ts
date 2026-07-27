import { NextRequest, NextResponse } from "next/server";
import {
  AuthSession,
  DEMO_ADMIN,
  DEMO_DOCTORS,
  DEMO_PATIENTS,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

type LoginRequestBody = {
  role?: string;
  aadhaar?: string;
  dob?: string;
  email?: string;
  password?: string;
  adminId?: string;
  hospitalCode?: string;
};

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch (err) {
      console.error("[api] POST /api/auth/login: malformed JSON body:", err);
      return NextResponse.json(
        { success: false, error: "Request body must be valid JSON." },
        { status: 400 }
      );
    }

    const { role, aadhaar, dob, email, password, adminId, hospitalCode } =
      body as LoginRequestBody;

    if (!role || !["patient", "doctor", "admin"].includes(role)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing user role." },
        { status: 400 }
      );
    }

    let sessionPayload: AuthSession | null = null;

    // -----------------------------------------------------------------------
    // PATIENT AUTHENTICATION
    // -----------------------------------------------------------------------
    if (role === "patient") {
      let sanitizedAadhaar = (aadhaar || "").replace(/\s/g, "");
      if (sanitizedAadhaar.length !== 12 || !/^\d{12}$/.test(sanitizedAadhaar)) {
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
          dob: dob || DEMO_PATIENTS[0].dob,
        };
      }

      sessionPayload = {
        role: "patient",
        user: patient,
        token: `pat-tok-${Date.now()}`,
        authenticatedAt: new Date().toISOString(),
      };
    }

    // -----------------------------------------------------------------------
    // DOCTOR AUTHENTICATION
    // -----------------------------------------------------------------------
    else if (role === "doctor") {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, error: "Please enter hospital email and password." },
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
          assignedPatientIds: ["pat-rahul-88201"],
        };
      }

      sessionPayload = {
        role: "doctor",
        user: doctor,
        token: `doc-tok-${Date.now()}`,
        authenticatedAt: new Date().toISOString(),
      };
    }

    // -----------------------------------------------------------------------
    // ADMIN AUTHENTICATION
    // -----------------------------------------------------------------------
    else if (role === "admin") {
      if (!adminId || !password || !hospitalCode) {
        return NextResponse.json(
          {
            success: false,
            error: "Please enter Admin ID, Password, and Hospital Code.",
          },
          { status: 400 }
        );
      }

      sessionPayload = {
        role: "admin",
        user: {
          ...DEMO_ADMIN,
          email: adminId,
          hospitalCode: hospitalCode,
        },
        token: `adm-tok-${Date.now()}`,
        authenticatedAt: new Date().toISOString(),
      };
    }

    if (!sessionPayload) {
      return NextResponse.json(
        { success: false, error: "Authentication failed." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      session: sessionPayload,
    });

    // Set HTTP Cookie for server/middleware session persistence
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: encodeURIComponent(JSON.stringify(sessionPayload)),
      httpOnly: false, // Accessible client-side & server-side
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    return response;
  } catch (err: unknown) {
    console.error("[api] POST /api/auth/login failed:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
