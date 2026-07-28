import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api/responses";
import { prisma } from "@/lib/prisma";
import { calculateCategoryIndex, calculateDailyScore } from "@/lib/scoring";
import { checkInSubmitSchema, validateJsonBody } from "@/validators";

export const dynamic = "force-dynamic";

async function resolvePatientId(
  patientIdParam?: string | null
): Promise<string> {
  if (patientIdParam && patientIdParam !== "demo") {
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
  try {
    const body = await validateJsonBody(request, checkInSubmitSchema);

    // Fallback demo mode when database is unavailable
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let submittedCheckIn: any = null;
    let dbAvailable = true;

    try {
      const patientId = await resolvePatientId(body.patientId);

      let checkInDate = new Date();
      if (body.date) {
        checkInDate = new Date(body.date);
      }
      checkInDate.setHours(0, 0, 0, 0);

      submittedCheckIn = await prisma.$transaction(
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
    } catch (dbError) {
      console.warn("Database unavailable, using fallback demo mode:", dbError);
      dbAvailable = false;
    }

    // Fallback demo response when DB is unavailable
    if (!dbAvailable || !submittedCheckIn) {
      const fallbackQuestions = [
        {
          id: "q1",
          category: "ADHERENCE",
          type: "YES_NO",
          weight: 1,
          direction: "HIGHER_BETTER",
          rangeMin: null,
          rangeMax: null,
          hardMin: null,
          hardMax: null
        },
        {
          id: "q2",
          category: "ADHERENCE",
          type: "YES_NO",
          weight: 1,
          direction: "HIGHER_BETTER",
          rangeMin: null,
          rangeMax: null,
          hardMin: null,
          hardMax: null
        },
        {
          id: "q3",
          category: "SYMPTOM",
          type: "SCALE",
          weight: 1,
          direction: "HIGHER_WORSE",
          rangeMin: 1,
          rangeMax: 5,
          hardMin: null,
          hardMax: null
        },
        {
          id: "q4",
          category: "SYMPTOM",
          type: "SCALE",
          weight: 1,
          direction: "HIGHER_BETTER",
          rangeMin: 1,
          rangeMax: 5,
          hardMin: null,
          hardMax: null
        },
        {
          id: "q5",
          category: "SYMPTOM",
          type: "NUMERIC",
          weight: 1,
          direction: "HIGHER_WORSE",
          rangeMin: 50,
          rangeMax: 140,
          hardMin: null,
          hardMax: null
        },
        {
          id: "q6",
          category: "SYMPTOM",
          type: "NUMERIC",
          weight: 1,
          direction: "HIGHER_WORSE",
          rangeMin: 96,
          rangeMax: 104,
          hardMin: null,
          hardMax: null
        }
      ];

      const answersWithQuestions = body.answers.map((ans) => {
        const q =
          fallbackQuestions.find((fq) => fq.id === ans.questionId) ||
          fallbackQuestions[0];
        return {
          question: q,
          answer: {
            questionId: ans.questionId,
            boolValue: ans.booleanValue,
            scaleValue: ans.scaleValue,
            numericValue: ans.numericValue,
            skipped: ans.skipped
          }
        };
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const symptomIndex = calculateCategoryIndex(
        answersWithQuestions as any,
        "SYMPTOM"
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adherenceIndex = calculateCategoryIndex(
        answersWithQuestions as any,
        "ADHERENCE"
      );
      const overallScore = calculateDailyScore(symptomIndex, adherenceIndex);

      submittedCheckIn = {
        id: `demo-${Date.now()}`,
        patientId: body.patientId || "demo",
        date: new Date(),
        completed: true,
        score: {
          overallScore,
          symptomIndex,
          adherenceIndex
        },
        answers: body.answers.map((ans) => ({
          id: `ans-${Date.now()}-${ans.questionId}`,
          questionId: ans.questionId,
          boolValue: ans.booleanValue,
          booleanValue: ans.booleanValue,
          scaleValue: ans.scaleValue,
          numericValue: ans.numericValue,
          skipped: ans.skipped,
          question:
            fallbackQuestions.find((fq) => fq.id === ans.questionId) ||
            fallbackQuestions[0]
        }))
      };
    } else {
      // Compute score using official scoring engine (DB available)
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const symptomIndex = calculateCategoryIndex(
        answersWithQuestions as any,
        "SYMPTOM"
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adherenceIndex = calculateCategoryIndex(
        answersWithQuestions as any,
        "ADHERENCE"
      );
      const overallScore = calculateDailyScore(symptomIndex, adherenceIndex);

      submittedCheckIn = {
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
    }

    if (!submittedCheckIn) {
      return errorResponse("Failed to record check-in submission", {
        status: 500
      });
    }

    return successResponse(submittedCheckIn, { status: 201 });
  } catch (error) {
    console.error("Error submitting check-in:", error);
    return errorResponse("Failed to submit check-in", { status: 400 });
  }
}
