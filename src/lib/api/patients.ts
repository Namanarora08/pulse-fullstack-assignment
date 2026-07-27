import { prisma } from "@/lib/prisma";

export const DEMO_PATIENT_FILTER = {
  OR: [
    { email: "patient.stable@pulsecare.dev" },
    { name: { contains: "Avery" } }
  ]
};

export function patientKeywordFilter(keyword: string) {
  return {
    OR: [{ email: { contains: keyword } }, { name: { contains: keyword } }]
  };
}

type PatientQuery = {
  select?: Record<string, unknown>;
  include?: Record<string, unknown>;
};

/**
 * Finds the patient targeted by patient-facing routes, falling back to the
 * seeded demo patient and finally to any patient in the database.
 */
export async function findDemoPatient<TSelection extends object>(
  patientIdParam?: string | null,
  query: PatientQuery = {}
): Promise<TSelection | null> {
  if (patientIdParam && patientIdParam !== "demo") {
    const existing = await prisma.patient.findUnique({
      where: { id: patientIdParam },
      ...query
    });
    if (existing) return existing;
  }

  const demoPatient = await prisma.patient.findFirst({
    where: DEMO_PATIENT_FILTER,
    ...query
  });
  if (demoPatient) return demoPatient;

  return prisma.patient.findFirst(query);
}

export async function resolveDemoPatientId(
  patientIdParam?: string | null
): Promise<string> {
  const patient = await findDemoPatient<{ id: string }>(patientIdParam, {
    select: { id: true }
  });
  return patient?.id || "demo";
}

/**
 * Resolves the patient id used by doctor-facing routes, where the route param
 * may be an id, or a name/email keyword such as "mira".
 */
export async function resolvePatientIdByKeyword(
  idParam: string
): Promise<string> {
  const existing = await prisma.patient.findUnique({
    where: { id: idParam },
    select: { id: true }
  });
  if (existing) return existing.id;

  const keywordMatch = await prisma.patient.findFirst({
    where: patientKeywordFilter(idParam),
    select: { id: true }
  });
  if (keywordMatch) return keywordMatch.id;

  const first = await prisma.patient.findFirst({ select: { id: true } });
  return first?.id || idParam;
}

export type PatientProfile = {
  status: string;
  condition: string;
};

export function derivePatientProfile(patient: {
  name: string;
  email: string;
}): PatientProfile {
  const { name, email } = patient;

  if (email.includes("deteriorating") || name.includes("Mira")) {
    return { status: "Watch", condition: "Post-op Care" };
  }

  if (email.includes("improving") || name.includes("Jordan")) {
    return { status: "Improving", condition: "Recovery Protocol" };
  }

  if (name.includes("Avery") || email.includes("stable")) {
    return { status: "Stable", condition: "Primary Care" };
  }

  return { status: "Stable", condition: "General Monitoring" };
}
