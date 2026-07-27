import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { AuthSession, SESSION_COOKIE_NAME } from "@/lib/auth";
import {
  authenticateAdmin,
  authenticateDoctor,
  findPatientByAadhaar,
  hydrateSession
} from "@/lib/demo-accounts";
import {
  SESSION_MAX_AGE_SECONDS,
  SessionPayload,
  signSession
} from "@/lib/session";

const loginSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("patient"),
    aadhaar: z.string().min(12).max(20),
    dob: z.string().optional()
  }),
  z.object({
    role: z.literal("doctor"),
    email: z.string().email(),
    password: z.string().min(1)
  }),
  z.object({
    role: z.literal("admin"),
    adminId: z.string().min(1),
    password: z.string().min(1),
    hospitalCode: z.string().min(1)
  })
]);

const INVALID_CREDENTIALS = "Invalid credentials.";

function newToken(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid or missing credentials." },
      { status: 400 }
    );
  }

  const input = parsed.data;
  let payload: SessionPayload | null = null;

  if (input.role === "patient") {
    const sanitizedAadhaar = input.aadhaar.replace(/\s/g, "");
    if (!/^\d{12}$/.test(sanitizedAadhaar)) {
      return NextResponse.json(
        { success: false, error: INVALID_CREDENTIALS },
        { status: 401 }
      );
    }

    const patient = findPatientByAadhaar(sanitizedAadhaar);
    if (!patient || (input.dob && input.dob !== patient.dob)) {
      return NextResponse.json(
        { success: false, error: INVALID_CREDENTIALS },
        { status: 401 }
      );
    }

    payload = {
      role: "patient",
      userId: patient.id,
      aadhaar: sanitizedAadhaar,
      token: newToken("pat-tok"),
      authenticatedAt: new Date().toISOString()
    };
  } else if (input.role === "doctor") {
    const doctor = authenticateDoctor(input.email, input.password);
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: INVALID_CREDENTIALS },
        { status: 401 }
      );
    }

    payload = {
      role: "doctor",
      userId: doctor.id,
      email: doctor.email,
      token: newToken("doc-tok"),
      authenticatedAt: new Date().toISOString()
    };
  } else {
    const admin = authenticateAdmin(
      input.adminId,
      input.password,
      input.hospitalCode
    );
    if (!admin) {
      return NextResponse.json(
        { success: false, error: INVALID_CREDENTIALS },
        { status: 401 }
      );
    }

    payload = {
      role: "admin",
      userId: admin.id,
      email: admin.email,
      hospitalCode: admin.hospitalCode,
      token: newToken("adm-tok"),
      authenticatedAt: new Date().toISOString()
    };
  }

  const session: AuthSession | null = hydrateSession(payload);
  if (!session) {
    return NextResponse.json(
      { success: false, error: INVALID_CREDENTIALS },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true, session });

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: await signSession(payload),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
    sameSite: "lax"
  });

  return response;
}
