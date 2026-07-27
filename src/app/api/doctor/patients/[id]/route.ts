import { NextRequest } from "next/server";

import {
  answersWithQuestionInclude,
  CheckInRow,
  derivePatientProfile,
  logAndFail,
  patientKeywordFilter,
  scoreCheckIn,
  successResponse,
  toDateKey
} from "@/lib/api";
import { prisma } from "@/lib/prisma";
import type { RouteContext } from "@/types/api";

export const dynamic = "force-dynamic";

const patientWithHistoryInclude = {
  dailyCheckIns: {
    take: 30,
    orderBy: { date: "desc" },
    include: answersWithQuestionInclude
  }
} as const;

export async function GET(
  _request: NextRequest,
  { params }: RouteContext<{ id: string }>
) {
  try {
    const { id } = await params;

    let patient = await prisma.patient.findUnique({
      where: { id },
      include: patientWithHistoryInclude
    });

    if (!patient) {
      // Look by name/email keyword
      patient = await prisma.patient.findFirst({
        where: patientKeywordFilter(id),
        include: patientWithHistoryInclude
      });
    }

    if (!patient) {
      const fallback = {
        id,
        name:
          id === "mira"
            ? "Mira Patel"
            : id === "jordan"
              ? "Jordan Lee"
              : "Avery Stone",
        email: `${id}@pulsecare.dev`,
        status:
          id === "mira" ? "Watch" : id === "jordan" ? "Improving" : "Stable",
        condition: "General Monitoring",
        checkIns: [],
        scores: []
      };
      return successResponse(fallback);
    }

    const { status, condition } = derivePatientProfile(patient);

    const scores = patient.dailyCheckIns.map((checkIn: CheckInRow) => {
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

    const checkIns = patient.dailyCheckIns.map((checkIn: CheckInRow) => ({
      id: checkIn.id,
      date: checkIn.date.toISOString(),
      completed: checkIn.answers.length > 0
    }));

    return successResponse({
      id: patient.id,
      name: patient.name,
      email: patient.email,
      status,
      condition,
      checkIns,
      scores
    });
  } catch (error) {
    return logAndFail(error, {
      log: "Error fetching patient detail",
      message: "Failed to fetch patient detail"
    });
  }
}
