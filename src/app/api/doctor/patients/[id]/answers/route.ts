import { NextRequest } from "next/server";

import {
  answersWithQuestionInclude,
  CheckInRow,
  formatAnswer,
  logAndFail,
  resolvePatientIdByKeyword,
  successResponse
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
      orderBy: { date: "desc" },
      include: answersWithQuestionInclude
    });

    const formatted = checkIns.map((checkIn: CheckInRow) => ({
      id: checkIn.id,
      date: checkIn.date.toISOString(),
      answers: checkIn.answers.map(formatAnswer)
    }));

    return successResponse(formatted);
  } catch (error) {
    return logAndFail(error, {
      log: "Error fetching patient check-in answers",
      message: "Failed to fetch patient check-in answers"
    });
  }
}
