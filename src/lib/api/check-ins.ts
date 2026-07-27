import type { Prisma } from "@prisma/client";

import {
  AnswerWithQuestion,
  calculateCategoryIndex,
  calculateDailyScore,
  Direction,
  QuestionCategory,
  QuestionType
} from "@/lib/scoring";

export const answersWithQuestionInclude = {
  answers: {
    include: { question: true }
  }
} as const;

export interface QuestionRow {
  id: string;
  prompt: string;
  category: string;
  type: string;
  weight: number;
  direction: string;
  rangeMin: number | null;
  rangeMax: number | null;
  hardMin: number | null;
  hardMax: number | null;
}

export interface AnswerRow {
  id: string;
  questionId: string;
  boolValue: boolean | null;
  scaleValue: number | null;
  numericValue: number | null;
  question: QuestionRow;
}

export interface CheckInRow {
  id: string;
  date: Date;
  answers: AnswerRow[];
}

export type AnswerValues = Pick<
  AnswerRow,
  "boolValue" | "scaleValue" | "numericValue"
>;

export type CheckInScore = {
  overallScore: number | null;
  symptomIndex: number | null;
  adherenceIndex: number | null;
};

export function isAnswerSkipped(answer: AnswerValues): boolean {
  return (
    answer.boolValue === null &&
    answer.scaleValue === null &&
    answer.numericValue === null
  );
}

export function toScoringInput(answer: AnswerRow): AnswerWithQuestion {
  return {
    question: {
      id: answer.question.id,
      category: answer.question.category as QuestionCategory,
      type: answer.question.type as QuestionType,
      weight: answer.question.weight,
      direction: answer.question.direction as Direction,
      rangeMin: answer.question.rangeMin,
      rangeMax: answer.question.rangeMax,
      hardMin: answer.question.hardMin,
      hardMax: answer.question.hardMax
    },
    answer: {
      questionId: answer.question.id,
      boolValue: answer.boolValue,
      scaleValue: answer.scaleValue,
      numericValue: answer.numericValue,
      skipped: isAnswerSkipped(answer)
    }
  };
}

export function scoreCheckIn(answers: AnswerRow[]): CheckInScore {
  const scoringInputs = answers.map(toScoringInput);
  const symptomIndex = calculateCategoryIndex(scoringInputs, "SYMPTOM");
  const adherenceIndex = calculateCategoryIndex(scoringInputs, "ADHERENCE");

  return {
    overallScore: calculateDailyScore(symptomIndex, adherenceIndex),
    symptomIndex,
    adherenceIndex
  };
}

/** Serializes an answer row, exposing the value under both naming conventions used by clients. */
export function formatAnswer(answer: AnswerRow) {
  return {
    id: answer.id,
    questionId: answer.questionId,
    boolValue: answer.boolValue,
    booleanValue: answer.boolValue,
    scaleValue: answer.scaleValue,
    numericValue: answer.numericValue,
    skipped: isAnswerSkipped(answer),
    question: answer.question
  };
}

export function toDateKey(date: Date | string): string {
  return new Date(date).toISOString().split("T")[0];
}

export function startOfDay(date?: Date | string | null): Date {
  const value = date ? new Date(date) : new Date();
  value.setHours(0, 0, 0, 0);
  return value;
}

export type AnswerInput = {
  questionId: string;
  scaleValue?: number | null;
  booleanValue?: boolean | null;
  numericValue?: number | null;
  skipped?: boolean | null;
};

/**
 * Creates the check-in for the given day when missing, upserts every submitted
 * answer, and returns the check-in with its answers and questions.
 */
export async function saveCheckInAnswers(
  tx: Prisma.TransactionClient,
  patientId: string,
  date: Date,
  answers: AnswerInput[] = []
) {
  let checkIn = await tx.dailyCheckIn.findFirst({
    where: { patientId, date }
  });

  if (!checkIn) {
    checkIn = await tx.dailyCheckIn.create({
      data: { patientId, date }
    });
  }

  for (const answer of answers) {
    const boolValue =
      answer.booleanValue ??
      (answer as { boolValue?: boolean }).boolValue ??
      null;
    const values = answer.skipped
      ? { boolValue: null, scaleValue: null, numericValue: null }
      : {
          boolValue,
          scaleValue: answer.scaleValue ?? null,
          numericValue: answer.numericValue ?? null
        };

    await tx.answer.upsert({
      where: {
        dailyCheckInId_questionId: {
          dailyCheckInId: checkIn.id,
          questionId: answer.questionId
        }
      },
      update: values,
      create: {
        dailyCheckInId: checkIn.id,
        questionId: answer.questionId,
        ...values
      }
    });
  }

  return tx.dailyCheckIn.findUnique({
    where: { id: checkIn.id },
    include: answersWithQuestionInclude
  });
}
