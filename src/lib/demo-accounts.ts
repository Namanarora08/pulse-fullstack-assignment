import {
  AdminRecord,
  AuthSession,
  DEMO_ADMIN,
  DEMO_DOCTORS,
  DEMO_PATIENTS,
  DoctorRecord,
  PatientRecord
} from "./auth";
import { SessionPayload } from "./session";

// Demo deployment credentials. Real deployments must override these with
// environment variables (and back them with hashed credentials in the DB).
const DEMO_DOCTOR_PASSWORD =
  process.env.DEMO_DOCTOR_PASSWORD ?? "Cardiology#2026";
const DEMO_ADMIN_PASSWORD =
  process.env.DEMO_ADMIN_PASSWORD ?? "SystemAdmin#2026";

export function timingSafeEqual(a: string, b: string): boolean {
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);
  let mismatch = aBytes.length ^ bBytes.length;
  const length = Math.max(aBytes.length, bBytes.length);
  for (let i = 0; i < length; i += 1) {
    mismatch |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return mismatch === 0;
}

export function findPatientByAadhaar(aadhaar: string): PatientRecord | null {
  return (
    DEMO_PATIENTS.find((p) => p.aadhaar.replace(/\s/g, "") === aadhaar) ?? null
  );
}

export function authenticateDoctor(
  email: string,
  password: string
): DoctorRecord | null {
  const normalizedEmail = email.trim().toLowerCase();
  const doctor = DEMO_DOCTORS.find(
    (d) => d.email.toLowerCase() === normalizedEmail
  );
  if (!doctor) return null;
  return timingSafeEqual(password, DEMO_DOCTOR_PASSWORD) ? doctor : null;
}

export function authenticateAdmin(
  adminId: string,
  password: string,
  hospitalCode: string
): AdminRecord | null {
  const idMatches =
    timingSafeEqual(adminId.trim().toLowerCase(), DEMO_ADMIN.email) ||
    timingSafeEqual(adminId.trim(), DEMO_ADMIN.id);
  const codeMatches = timingSafeEqual(
    hospitalCode.trim().toUpperCase(),
    DEMO_ADMIN.hospitalCode
  );
  const passwordMatches = timingSafeEqual(password, DEMO_ADMIN_PASSWORD);

  return idMatches && codeMatches && passwordMatches ? DEMO_ADMIN : null;
}

// Rebuilds the full user record for a verified session payload. Records are
// resolved from server-side data rather than trusted from the client.
export function hydrateSession(payload: SessionPayload): AuthSession | null {
  if (payload.role === "patient") {
    const patient =
      DEMO_PATIENTS.find((p) => p.id === payload.userId) ??
      (payload.aadhaar ? findPatientByAadhaar(payload.aadhaar) : null);
    if (!patient) return null;
    return {
      role: "patient",
      user: patient,
      token: payload.token,
      authenticatedAt: payload.authenticatedAt
    };
  }

  if (payload.role === "doctor") {
    const doctor = DEMO_DOCTORS.find((d) => d.id === payload.userId);
    if (!doctor) return null;
    return {
      role: "doctor",
      user: doctor,
      token: payload.token,
      authenticatedAt: payload.authenticatedAt
    };
  }

  if (payload.userId !== DEMO_ADMIN.id) return null;
  return {
    role: "admin",
    user: {
      ...DEMO_ADMIN,
      hospitalCode: payload.hospitalCode ?? DEMO_ADMIN.hospitalCode
    },
    token: payload.token,
    authenticatedAt: payload.authenticatedAt
  };
}
