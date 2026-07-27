import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

import { guardRoute } from "@/lib/api/auth-guard";
import { errorResponse, successResponse } from "@/lib/api/responses";
import { prisma } from "@/lib/prisma";
import { calculateCategoryIndex, calculateDailyScore } from "@/lib/scoring";
import { checkInSubmitSchema, validateJsonBody } from "@/validators";

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

interface QuestionForSubmit {
  id: string;
  category: "SYMPTOM" | "ADHERENCE";
  type: "YES_NO" | "SCALE" | "NUMERIC";
  weight: number;
  direction: "HIGHER_BETTER" | "HIGHER_WORSE";
  rangeMin: number | null;
  rangeMax: number | null;
  hardMin: number | null;
  hardMax: number | null;
}

interface AnswerForSubmit {
  id: string;
  questionId: string;
  boolValue: boolean | null;
  scaleValue: number | null;
  numericValue: number | null;
  question: QuestionForSubmit;
}

export async function POST(request: NextRequest) {
  const { session, response } = await guardRoute(["patient"]);
  if (!session) return response;

  try {
    const body = await validateJsonBody(request, checkInSubmitSchema);
    const patientId = await resolvePatientId(session.userId);

    let checkInDate = new Date();
    if (body.date) {
      checkInDate = new Date(body.date);
      if (Number.isNaN(checkInDate.getTime())) {
        return errorResponse("Invalid date", { status: 400 });
      }
    }
    checkInDate.setHours(0, 0, 0, 0);

    const submittedCheckIn = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        let checkIn = await tx.dailyCheckIn.findFirst({
          where: {
            patientId,
            date: checkInDate
          }
        });

        if (!checkIn) {
          checkIn = await tx.dailyCheckIn.create({
            data: {
              patientId,
              date: checkInDate
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
          include: {
            answers: {
              include: {
                question: true
              }
            }
          }
        });
      }
    );

    if (!submittedCheckIn) {
      return errorResponse("Failed to record check-in submission", {
        status: 500
      });
    }

    // Compute score using official scoring engine
    const answersWithQuestions = submittedCheckIn.answers.map(
      (a: AnswerForSubmit) => ({
        question: {
          id: a.question.id,
          category: a.question.category,
          type: a.question.type,
          weight: a.question.weight,
          direction: a.question.direction,
          rangeMin: a.question.rangeMin,
          rangeMax: a.question.rangeMax,
          hardMin: a.question.hardMin,
          hardMax: a.question.hardMax
        },
        answer: {
          questionId: a.question.id,
          boolValue: a.boolValue,
          scaleValue: a.scaleValue,
          numericValue: a.numericValue,
          skipped:
            a.boolValue === null &&
            a.scaleValue === null &&
            a.numericValue === null
        }
      })
    );

    const symptomIndex = calculateCategoryIndex(
      answersWithQuestions,
      "SYMPTOM"
    );
    const adherenceIndex = calculateCategoryIndex(
      answersWithQuestions,
      "ADHERENCE"
    );
    const overallScore = calculateDailyScore(symptomIndex, adherenceIndex);

    const formattedResponse = {
      id: submittedCheckIn.id,
      patientId: submittedCheckIn.patientId,
      date: submittedCheckIn.date,
      completed: true,
      score: {
        overallScore,
        symptomIndex,
        adherenceIndex
      },
      answers: submittedCheckIn.answers.map((a: AnswerForSubmit) => ({
        id: a.id,
        questionId: a.questionId,
        boolValue: a.boolValue,
        booleanValue: a.boolValue,
        scaleValue: a.scaleValue,
        numericValue: a.numericValue,
        skipped:
          a.boolValue === null &&
          a.scaleValue === null &&
          a.numericValue === null,
        question: a.question
      }))
    };

    return successResponse(formattedResponse, { status: 201 });
  } catch (error) {
    console.error("Error submitting check-in:", error);
    return errorResponse("Failed to submit check-in", { status: 400 });
  }
}
