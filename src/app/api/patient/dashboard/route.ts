import { NextRequest } from "next/server";

import {
  answersWithQuestionInclude,
  CheckInRow,
  findDemoPatient,
  logAndFail,
  scoreCheckIn,
  successResponse,
  toDateKey
} from "@/lib/api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PatientRecord = {
  id: string;
  name: string;
  email: string;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId") || "demo";

    const patient = await findDemoPatient<PatientRecord>(patientId);

    let dailyCheckIns: CheckInRow[] = [];

    if (patient?.id) {
      dailyCheckIns = await prisma.dailyCheckIn.findMany({
        where: { patientId: patient.id },
        take: 30,
        orderBy: { date: "desc" },
        include: answersWithQuestionInclude
      });
    }

    // Compute scores for each check-in using scoring engine
    const scoreHistory = dailyCheckIns.map((checkIn: CheckInRow) => {
      const { overallScore, symptomIndex, adherenceIndex } = scoreCheckIn(
        checkIn.answers
      );

      return {
        date: toDateKey(checkIn.date),
        score: overallScore,
        symptomIndex: symptomIndex ?? undefined,
        adherenceIndex: adherenceIndex ?? undefined
      };
    });

    const recentCheckIns = dailyCheckIns.map((checkIn: CheckInRow) => ({
      id: checkIn.id,
      date: checkIn.date.toISOString(),
      completed: checkIn.answers.length > 0
    }));

    const dashboardData = {
      patient: patient
        ? {
            id: patient.id,
            name: patient.name,
            email: patient.email,
            condition: "General Monitoring",
            status: "Stable"
          }
        : {
            id: patientId,
            name: "Avery Stone",
            condition: "General Monitoring",
            status: "Stable"
          },
      latestCheckIn: recentCheckIns[0] || null,
      recentCheckIns,
      scoreHistory
    };

    return successResponse(dashboardData);
  } catch (error) {
    return logAndFail(error, {
      log: "Error fetching patient dashboard",
      message: "Failed to fetch patient dashboard"
    });
  }
}
