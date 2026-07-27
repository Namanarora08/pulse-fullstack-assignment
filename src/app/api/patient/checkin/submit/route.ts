import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

import {
  CheckInRow,
  errorResponse,
  formatAnswer,
  logAndFail,
  resolveDemoPatientId,
  saveCheckInAnswers,
  scoreCheckIn,
  startOfDay,
  successResponse
} from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { checkInSubmitSchema, validateJsonBody } from "@/validators";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await validateJsonBody(request, checkInSubmitSchema);
    const patientId = await resolveDemoPatientId(body.patientId);
    const checkInDate = startOfDay(body.date);

    const submittedCheckIn: CheckInRow | null = await prisma.$transaction(
      (tx: Prisma.TransactionClient) =>
        saveCheckInAnswers(tx, patientId, checkInDate, body.answers)
    );

    if (!submittedCheckIn) {
      return errorResponse("Failed to record check-in submission", {
        status: 500
      });
    }

    const { overallScore, symptomIndex, adherenceIndex } = scoreCheckIn(
      submittedCheckIn.answers
    );

    return successResponse(
      {
        id: submittedCheckIn.id,
        patientId,
        date: submittedCheckIn.date,
        completed: true,
        score: {
          overallScore,
          symptomIndex,
          adherenceIndex
        },
        answers: submittedCheckIn.answers.map(formatAnswer)
      },
      { status: 201 }
    );
  } catch (error) {
    return logAndFail(error, {
      log: "Error submitting check-in",
      message: "Failed to submit check-in",
      status: 400
    });
  }
}
