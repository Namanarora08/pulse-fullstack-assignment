import { NextRequest } from "next/server";

import { handleApiError } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/responses";
import { prisma } from "@/lib/prisma";
import {
  calculateCategoryIndex,
  calculateDailyScore,
  Direction,
  QuestionCategory,
  QuestionType
} from "@/lib/scoring";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get("patientId") || "demo";

    let patient = null;

    if (patientId && patientId !== "demo") {
      patient = await prisma.patient.findUnique({
        where: { id: patientId }
      });
    }

    if (!patient) {
      // Look for Avery Stone or stable patient or first patient in DB
      patient = await prisma.patient.findFirst({
        where: {
          OR: [
            { email: "patient.stable@pulsecare.dev" },
            { name: { contains: "Avery" } }
          ]
        }
      });
    }

    if (!patient) {
      patient = await prisma.patient.findFirst();
    }

    const resolvedPatientId = patient?.id;

    let dailyCheckIns: Array<{
      id: string;
      date: Date;
      answers: Array<{
        boolValue: boolean | null;
        scaleValue: number | null;
        numericValue: number | null;
        question: {
          id: string;
          category: string;
          type: string;
          weight: number;
          direction: string;
          rangeMin: number | null;
          rangeMax: number | null;
          hardMin: number | null;
          hardMax: number | null;
        };
      }>;
    }> = [];

    if (resolvedPatientId) {
      dailyCheckIns = await prisma.dailyCheckIn.findMany({
        where: { patientId: resolvedPatientId },
        take: 30,
        orderBy: { date: "desc" },
        include: {
          answers: {
            include: { question: true }
          }
        }
      });
    }

    // Compute scores for each check-in using scoring engine
    const scoreHistory = dailyCheckIns.map((ci) => {
      const answersWithQuestions = ci.answers.map((a) => ({
        question: {
          id: a.question.id,
          category: a.question.category as QuestionCategory,
          type: a.question.type as QuestionType,
          weight: a.question.weight,
          direction: a.question.direction as Direction,
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
          skipped: a.boolValue === null && a.scaleValue === null && a.numericValue === null
        }
      }));

      const symptomIndex = calculateCategoryIndex(answersWithQuestions, "SYMPTOM");
      const adherenceIndex = calculateCategoryIndex(answersWithQuestions, "ADHERENCE");
      const overallScore = calculateDailyScore(symptomIndex, adherenceIndex);

      return {
        date: ci.date.toISOString().split("T")[0],
        score: overallScore,
        symptomIndex: symptomIndex ?? undefined,
        adherenceIndex: adherenceIndex ?? undefined
      };
    });

    const recentCheckIns = dailyCheckIns.map((ci) => ({
      id: ci.id,
      date: ci.date.toISOString(),
      completed: ci.answers.length > 0
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
    return handleApiError(error, "GET /api/patient/dashboard");
  }
}

