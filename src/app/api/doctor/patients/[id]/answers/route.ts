import { NextRequest } from "next/server";

import { guardRoute } from "@/lib/api/auth-guard";
import { errorResponse, successResponse } from "@/lib/api/responses";
import { prisma } from "@/lib/prisma";

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

interface AnswerWithQuestion {
  id: string;
  scaleValue: number | null;
  boolValue: boolean | null;
  numericValue: number | null;
  question: {
    prompt: string;
    category: string;
    type: string;
  };
}

interface DailyCheckInItem {
  id: string;
  date: Date;
  answers: AnswerWithQuestion[];
}

export async function GET(_request: NextRequest, { params }: RouteProps) {
  const { session, response } = await guardRoute(["doctor", "admin"]);
  if (!session) return response;

  try {
    const { id } = await params;
    const patientId = await resolvePatientId(id);

    const checkIns: DailyCheckInItem[] = await prisma.dailyCheckIn.findMany({
      where: { patientId },
      orderBy: { date: "desc" },
      include: {
        answers: {
          include: {
            question: true
          }
        }
      }
    });

    const formatted = checkIns.map((ci: DailyCheckInItem) => ({
      id: ci.id,
      date: ci.date.toISOString(),
      answers: ci.answers.map((a: AnswerWithQuestion) => ({
        id: a.id,
        scaleValue: a.scaleValue,
        boolValue: a.boolValue,
        booleanValue: a.boolValue,
        numericValue: a.numericValue,
        skipped:
          a.boolValue === null &&
          a.scaleValue === null &&
          a.numericValue === null,
        question: {
          prompt: a.question.prompt,
          category: a.question.category,
          type: a.question.type
        }
      }))
    }));

    return successResponse(formatted);
  } catch (error) {
    console.error("Error fetching patient check-in answers:", error);
    return errorResponse("Failed to fetch patient check-in answers", {
      status: 500
    });
  }
}
