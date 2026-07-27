import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

import {
  answersWithQuestionInclude,
  CheckInRow,
  formatAnswer,
  logAndFail,
  resolveDemoPatientId,
  saveCheckInAnswers,
  startOfDay,
  successResponse
} from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { checkInDraftSchema, validateJsonBody } from "@/validators";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = await resolveDemoPatientId(searchParams.get("patientId"));
    const checkInDate = startOfDay(searchParams.get("date"));

    const checkIn: CheckInRow | null = await prisma.dailyCheckIn.findFirst({
      where: {
        patientId,
        date: checkInDate
      },
      include: answersWithQuestionInclude
    });

    if (!checkIn) {
      return successResponse(null);
    }

    return successResponse({
      id: checkIn.id,
      date: checkIn.date,
      patientId,
      answers: checkIn.answers.map(formatAnswer)
    });
  } catch (error) {
    return logAndFail(error, {
      log: "Error fetching draft check-in",
      message: "Failed to fetch check-in"
    });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await validateJsonBody(request, checkInDraftSchema);
    const patientId = await resolveDemoPatientId(body.patientId);

    const updatedCheckIn = await prisma.$transaction(
      (tx: Prisma.TransactionClient) =>
        saveCheckInAnswers(tx, patientId, startOfDay(), body.answers)
    );

    return successResponse(updatedCheckIn);
  } catch (error) {
    return logAndFail(error, {
      log: "Error updating draft check-in",
      message: "Failed to save draft check-in",
      status: 400
    });
  }
}
