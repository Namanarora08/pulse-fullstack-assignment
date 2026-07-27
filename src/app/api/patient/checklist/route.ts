import { handleApiError, isDatabaseUnavailableError } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/responses";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface DbQuestion {
  id: string;
  prompt: string;
  type: string;
  category: string;
  weight: number;
  direction: string;
  rangeMin: number | null;
  rangeMax: number | null;
  hardMin: number | null;
  hardMax: number | null;
  unit: string | null;
}

export async function GET() {
  try {
    const dbQuestions: DbQuestion[] = await prisma.question.findMany({
      orderBy: { order: "asc" }
    });

    if (dbQuestions.length > 0) {
      const formatted = dbQuestions.map((q: DbQuestion) => ({
        id: q.id,
        prompt: q.prompt,
        text: q.prompt,
        type: q.type,
        category: q.category,
        weight: q.weight,
        direction: q.direction,
        rangeMin: q.rangeMin,
        rangeMax: q.rangeMax,
        hardMin: q.hardMin,
        hardMax: q.hardMax,
        unit: q.unit,
        minValue: q.type === "SCALE" ? 1 : q.rangeMin,
        maxValue: q.type === "SCALE" ? 5 : q.rangeMax,
        minLabel: q.type === "SCALE" ? (q.direction === "HIGHER_BETTER" ? "Low" : "Mild") : null,
        maxLabel: q.type === "SCALE" ? (q.direction === "HIGHER_BETTER" ? "High" : "Severe") : null
      }));
      return successResponse(formatted);
    }
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      return handleApiError(error, "GET /api/patient/checklist");
    }
    console.error(
      "[api] GET /api/patient/checklist: database unavailable, serving fallback questions:",
      error
    );
  }

  // Fallback active checklist questions if DB query returns empty or fails
  const fallbackQuestions = [
    {
      id: "q1",
      prompt: "Did you take all prescribed medications today?",
      text: "Did you take all prescribed medications today?",
      type: "YES_NO",
      category: "ADHERENCE",
      minLabel: null,
      maxLabel: null,
      minValue: null,
      maxValue: null,
      unit: null
    },
    {
      id: "q2",
      prompt: "Did you complete your recommended 20-minute walk?",
      text: "Did you complete your recommended 20-minute walk?",
      type: "YES_NO",
      category: "ADHERENCE",
      minLabel: null,
      maxLabel: null,
      minValue: null,
      maxValue: null,
      unit: null
    },
    {
      id: "q3",
      prompt: "Rate your overall pain level today",
      text: "Rate your overall pain level today",
      type: "SCALE",
      category: "SYMPTOM",
      minLabel: "None",
      maxLabel: "Severe",
      minValue: 1,
      maxValue: 5,
      unit: null
    },
    {
      id: "q4",
      prompt: "Rate your overall energy level today",
      text: "Rate your overall energy level today",
      type: "SCALE",
      category: "SYMPTOM",
      minLabel: "Very Low",
      maxLabel: "Excellent",
      minValue: 1,
      maxValue: 5,
      unit: null
    },
    {
      id: "q5",
      prompt: "Resting heart rate in beats per minute",
      text: "Resting heart rate in beats per minute",
      type: "NUMERIC",
      category: "SYMPTOM",
      minLabel: null,
      maxLabel: null,
      minValue: 50,
      maxValue: 140,
      unit: "bpm"
    },
    {
      id: "q6",
      prompt: "Body temperature in degrees Fahrenheit",
      text: "Body temperature in degrees Fahrenheit",
      type: "NUMERIC",
      category: "SYMPTOM",
      minLabel: null,
      maxLabel: null,
      minValue: 96,
      maxValue: 104,
      unit: "°F"
    }
  ];

  return successResponse(fallbackQuestions);
}

