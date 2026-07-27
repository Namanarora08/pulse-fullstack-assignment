import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

import { guardRoute } from "@/lib/api/auth-guard";
import { errorResponse, successResponse } from "@/lib/api/responses";
import { prisma } from "@/lib/prisma";
import { checkInDraftSchema, validateJsonBody } from "@/validators";

export const dynamic = "force-dynamic";

async function resolvePatientId(patientIdParam: string): Promise<string> {
  if (patientIdParam) {
    const existing = await prisma.patient.findUnique({
      where: { id: patientIdParam },
      select: { id: true }
    });
    if (existing) return existing.id;
  }

  // Fallback to demo patient
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

interface AnswerWithQuestionDetail {
  id: string;
  questionId: string;
  scaleValue: number | null;
  boolValue: boolean | null;
  numericValue: number | null;
  question: {
    id: string;
    prompt: string;
    category: string;
    type: string;
  };
}

export async function GET(request: NextRequest) {
  const { session, response } = await guardRoute(["patient"]);
  if (!session) return response;

  try {
    const patientId = await resolvePatientId(session.userId);

    const { searchParams } = new URL(request.url);
    const dateStr =
      searchParams.get("date") || new Date().toISOString().split("T")[0];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return errorResponse("Invalid date parameter", { status: 400 });
    }
    const checkInDate = new Date(dateStr);
    if (Number.isNaN(checkInDate.getTime())) {
      return errorResponse("Invalid date parameter", { status: 400 });
    }
    checkInDate.setHours(0, 0, 0, 0);

    const checkIn = await prisma.dailyCheckIn.findFirst({
      where: {
        patientId,
        date: checkInDate
      },
      include: {
        answers: {
          include: {
            question: true
          }
        }
      }
    });

    if (!checkIn) {
      return successResponse(null);
    }

    const formattedAnswers = checkIn.answers.map(
      (a: AnswerWithQuestionDetail) => ({
        id: a.id,
        questionId: a.questionId,
        scaleValue: a.scaleValue,
        booleanValue: a.boolValue,
        boolValue: a.boolValue,
        numericValue: a.numericValue,
        skipped:
          a.boolValue === null &&
          a.scaleValue === null &&
          a.numericValue === null,
        question: a.question
      })
    );

    return successResponse({
      id: checkIn.id,
      date: checkIn.date,
      patientId: checkIn.patientId,
      answers: formattedAnswers
    });
  } catch (error) {
    console.error("Error fetching draft check-in:", error);
    return errorResponse("Failed to fetch check-in", { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { session, response } = await guardRoute(["patient"]);
  if (!session) return response;

  try {
    const body = await validateJsonBody(request, checkInDraftSchema);
    const patientId = await resolvePatientId(session.userId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updatedCheckIn = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        let checkIn = await tx.dailyCheckIn.findFirst({
          where: {
            patientId,
            date: today
          }
        });

        if (!checkIn) {
          checkIn = await tx.dailyCheckIn.create({
            data: {
              patientId,
              date: today
            }
          });
        }

        if (body.answers && body.answers.length > 0) {
          for (const ans of body.answers) {
            const boolVal =
              ans.booleanValue ??
              (ans as unknown as { boolValue?: boolean }).boolValue ??
              null;
            const isSkipped = Boolean(ans.skipped);

            await tx.answer.upsert({
              where: {
                dailyCheckInId_questionId: {
                  dailyCheckInId: checkIn.id,
                  questionId: ans.questionId
                }
              },
              update: {
                boolValue: isSkipped ? null : boolVal,
                scaleValue: isSkipped ? null : (ans.scaleValue ?? null),
                numericValue: isSkipped ? null : (ans.numericValue ?? null)
              },
              create: {
                dailyCheckInId: checkIn.id,
                questionId: ans.questionId,
                boolValue: isSkipped ? null : boolVal,
                scaleValue: isSkipped ? null : (ans.scaleValue ?? null),
                numericValue: isSkipped ? null : (ans.numericValue ?? null)
              }
            });
          }
        }

        return tx.dailyCheckIn.findUnique({
          where: { id: checkIn.id },
          include: { answers: true }
        });
      }
    );

    return successResponse(updatedCheckIn);
  } catch (error) {
    console.error("Error updating draft check-in:", error);
    return errorResponse("Failed to save draft check-in", { status: 400 });
  }
}
