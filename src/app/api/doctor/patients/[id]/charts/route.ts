import { NextRequest } from "next/server";

import {
  answersWithQuestionInclude,
  CheckInRow,
  logAndFail,
  resolvePatientIdByKeyword,
  scoreCheckIn,
  successResponse,
  toDateKey
} from "@/lib/api";
import { prisma } from "@/lib/prisma";
import type { RouteContext } from "@/types/api";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: RouteContext<{ id: string }>
) {
  try {
    const { id } = await params;
    const patientId = await resolvePatientIdByKeyword(id);

    const checkIns: CheckInRow[] = await prisma.dailyCheckIn.findMany({
      where: { patientId },
      orderBy: { date: "asc" },
      include: answersWithQuestionInclude
    });

    if (checkIns.length > 0) {
      const chartData = checkIns.map((checkIn: CheckInRow) => {
        const { overallScore, symptomIndex, adherenceIndex } = scoreCheckIn(
          checkIn.answers
        );
        const dateStr = toDateKey(checkIn.date);

        return {
          date: dateStr,
          label: dateStr.slice(5, 10),
          score: overallScore,
          value: overallScore,
          symptomIndex: symptomIndex ?? undefined,
          adherenceIndex: adherenceIndex ?? undefined
        };
      });

      return successResponse(chartData);
    }

    // Fallback chart data if no history recorded yet
    const fallbackData = [
      { label: "Mon", value: 68, score: 68 },
      { label: "Tue", value: 72, score: 72 },
      { label: "Wed", value: 70, score: 70 },
      { label: "Thu", value: 76, score: 76 },
      { label: "Fri", value: 73, score: 73 },
      { label: "Sat", value: 71, score: 71 },
      { label: "Sun", value: 74, score: 74 }
    ];

    return successResponse(fallbackData);
  } catch (error) {
    return logAndFail(error, {
      log: "Error fetching patient chart data",
      message: "Failed to fetch chart data"
    });
  }
}
