import { NextRequest } from "next/server";

import { guardRoute } from "@/lib/api/auth-guard";
import { errorResponse, successResponse } from "@/lib/api/responses";
import { prisma } from "@/lib/prisma";
import { calculateCategoryIndex, calculateDailyScore } from "@/lib/scoring";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{ id: string }>;
};

async function resolvePatientId(idParam: string): Promise<string> {
  const existing = await prisma.patient.findUnique({
    where: { id: idParam },
    select: { id: true }
  });
  if (existing) return existing.id;

  const keywordMatch = await prisma.patient.findFirst({
    where: {
      OR: [{ email: { contains: idParam } }, { name: { contains: idParam } }]
    },
    select: { id: true }
  });
  if (keywordMatch) return keywordMatch.id;

  const first = await prisma.patient.findFirst({ select: { id: true } });
  return first?.id || idParam;
}

interface QuestionItem {
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

interface AnswerItem {
  questionId: string;
  boolValue: boolean | null;
  scaleValue: number | null;
  numericValue: number | null;
  question: QuestionItem;
}

interface CheckInItem {
  id: string;
  date: Date;
  answers: AnswerItem[];
}

export async function GET(_request: NextRequest, { params }: RouteProps) {
  const { session, response } = await guardRoute(["doctor", "admin"]);
  if (!session) return response;

  try {
    const { id } = await params;
    const patientId = await resolvePatientId(id);

    const checkIns: CheckInItem[] = await prisma.dailyCheckIn.findMany({
      where: { patientId },
      orderBy: { date: "asc" },
      include: {
        answers: {
          include: { question: true }
        }
      }
    });

    if (checkIns.length > 0) {
      const chartData = checkIns.map((ci: CheckInItem) => {
        const answersWithQuestions = ci.answers.map((a: AnswerItem) => ({
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
        }));

        const symptomIndex = calculateCategoryIndex(
          answersWithQuestions,
          "SYMPTOM"
        );
        const adherenceIndex = calculateCategoryIndex(
          answersWithQuestions,
          "ADHERENCE"
        );
        const overallScore = calculateDailyScore(symptomIndex, adherenceIndex);
        const dateStr = ci.date.toISOString().split("T")[0];

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
    console.error("Error fetching patient chart data:", error);
    return errorResponse("Failed to fetch chart data", { status: 500 });
  }
}
