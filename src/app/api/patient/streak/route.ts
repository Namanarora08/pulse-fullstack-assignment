import { guardRoute } from "@/lib/api/auth-guard";
import { errorResponse, successResponse } from "@/lib/api/responses";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function resolvePatientId(patientIdParam: string): Promise<string> {
  if (patientIdParam) {
    const existing = await prisma.patient.findUnique({
      where: { id: patientIdParam },
      select: { id: true }
    });
    if (existing) return existing.id;
  }

  const demoPatient = await prisma.patient.findFirst({
    where: {
      OR: [
        { email: "patient.stable@pulsecare.dev" },
        { name: { contains: "Avery" } }
      ]
    },
    select: { id: true }
  });

  if (demoPatient) return demoPatient.id;

  const firstPatient = await prisma.patient.findFirst({ select: { id: true } });
  return firstPatient?.id || "demo";
}

interface CheckInItemForStreak {
  id: string;
  date: Date;
  answers: Array<{ id: string }>;
}

export async function GET() {
  const { session, response } = await guardRoute(["patient"]);
  if (!session) return response;

  try {
    const patientId = await resolvePatientId(session.userId);

    const checkIns: CheckInItemForStreak[] = await prisma.dailyCheckIn.findMany(
      {
        where: { patientId },
        select: { id: true, date: true, answers: { select: { id: true } } },
        orderBy: { date: "desc" }
      }
    );

    // A check-in counts as completed if it has at least one answer recorded
    const completedCheckIns = checkIns.filter(
      (c: CheckInItemForStreak) => c.answers.length > 0
    );

    let streakCount = 0;
    if (completedCheckIns.length > 0) {
      const dates = completedCheckIns.map(
        (c: CheckInItemForStreak) =>
          new Date(c.date).toISOString().split("T")[0]
      );

      const uniqueDates: string[] = Array.from(new Set<string>(dates)).sort(
        (a: string, b: string) => (a < b ? 1 : -1)
      );

      const today = new Date().toISOString().split("T")[0];
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterday = yesterdayDate.toISOString().split("T")[0];

      const checkDate = uniqueDates.includes(today)
        ? new Date(today)
        : uniqueDates.includes(yesterday)
          ? new Date(yesterday)
          : null;

      if (checkDate) {
        while (true) {
          const formatted = checkDate.toISOString().split("T")[0];
          if (uniqueDates.includes(formatted)) {
            streakCount++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }

    return successResponse({
      patientId,
      currentStreak: streakCount,
      totalCompleted: completedCheckIns.length,
      history: completedCheckIns.map((c: CheckInItemForStreak) => c.date)
    });
  } catch (error) {
    console.error("Error calculating streak:", error);
    return errorResponse("Failed to calculate streak", { status: 500 });
  }
}
