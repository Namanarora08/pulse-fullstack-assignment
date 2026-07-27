export type QuestionType = "YES_NO" | "SCALE" | "NUMERIC";
export type QuestionCategory = "SYMPTOM" | "ADHERENCE";
export type Direction = "HIGHER_BETTER" | "HIGHER_WORSE";

export interface QuestionData {
  id: string;
  category: QuestionCategory;
  type: QuestionType;
  weight: number;
  direction: Direction;
  minValue?: number | null;
  maxValue?: number | null;
  rangeMin?: number | null;
  rangeMax?: number | null;
  hardMin?: number | null;
  hardMax?: number | null;
}

export interface AnswerData {
  questionId: string;
  boolValue?: boolean | null;
  scaleValue?: number | null;
  numericValue?: number | null;
  skipped?: boolean | null;
}

export interface AnswerWithQuestion {
  question: QuestionData;
  answer: AnswerData;
}

/**
 * Normalizes a single raw answer into a 0-100 score.
 * 100 indicates optimal health / adherence; 0 indicates severe symptom / non-adherence.
 */
export function normalizeAnswer(question: QuestionData, answer: AnswerData): number | null {
  if (answer.skipped) {
    return null;
  }

  const { type, direction } = question;

  if (type === "YES_NO") {
    if (typeof answer.boolValue !== "boolean") return null;
    if (direction === "HIGHER_BETTER") {
      return answer.boolValue ? 100 : 0;
    } else {
      return answer.boolValue ? 0 : 100;
    }
  }

  if (type === "SCALE") {
    if (typeof answer.scaleValue !== "number") return null;
    const min = question.minValue ?? 1;
    const max = question.maxValue ?? 5;
    if (max <= min) return 100;

    const clampedVal = Math.max(min, Math.min(max, answer.scaleValue));
    const rawPct = ((clampedVal - min) / (max - min)) * 100;

    return direction === "HIGHER_BETTER" ? rawPct : 100 - rawPct;
  }

  if (type === "NUMERIC") {
    if (typeof answer.numericValue !== "number") return null;
    const val = answer.numericValue;

    const rMin = question.rangeMin ?? null;
    const rMax = question.rangeMax ?? null;
    const hMin = question.hardMin ?? null;
    const hMax = question.hardMax ?? null;

    // Ideal range check
    if (rMin !== null && rMax !== null && val >= rMin && val <= rMax) {
      return 100;
    }

    if (rMin !== null && val < rMin) {
      if (hMin !== null && val <= hMin) return 0;
      if (hMin !== null) {
        return Math.max(0, Math.min(100, ((val - hMin) / (rMin - hMin)) * 100));
      }
      // If no hardMin, simple distance degradation
      return Math.max(0, 100 - (rMin - val) * 10);
    }

    if (rMax !== null && val > rMax) {
      if (hMax !== null && val >= hMax) return 0;
      if (hMax !== null) {
        return Math.max(0, Math.min(100, ((hMax - val) / (hMax - rMax)) * 100));
      }
      return Math.max(0, 100 - (val - rMax) * 10);
    }

    // Default Fallback
    return Math.max(0, Math.min(100, val));
  }

  return null;
}

/**
 * Calculates weighted index for a specific question category (0-100).
 */
export function calculateCategoryIndex(
  items: AnswerWithQuestion[],
  category: QuestionCategory
): number | null {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const item of items) {
    if (item.question.category !== category) continue;

    const normalized = normalizeAnswer(item.question, item.answer);
    if (normalized === null) continue;

    const w = item.question.weight || 1;
    totalWeightedScore += normalized * w;
    totalWeight += w;
  }

  if (totalWeight === 0) return null;
  return Math.round((totalWeightedScore / totalWeight) * 10) / 10;
}

/**
 * Computes overall daily score from Symptom and Adherence indices.
 */
export function calculateDailyScore(
  symptomIndex: number | null,
  adherenceIndex: number | null
): number | null {
  if (symptomIndex === null && adherenceIndex === null) return null;
  if (symptomIndex === null) return adherenceIndex;
  if (adherenceIndex === null) return symptomIndex;

  // 60% Symptom Index, 40% Adherence Index weight
  return Math.round((symptomIndex * 0.6 + adherenceIndex * 0.4) * 10) / 10;
}

/**
 * Calculates Exponential Moving Average (EMA) smoothing over daily scores.
 * Alpha default is 0.35 for fast responsiveness.
 */
export function calculateEmaSeries(
  scores: (number | null)[],
  alpha: number = 0.35
): (number | null)[] {
  const result: (number | null)[] = [];
  let prevEma: number | null = null;

  for (const score of scores) {
    if (score === null) {
      result.push(prevEma);
      continue;
    }

    if (prevEma === null) {
      prevEma = score;
    } else {
      prevEma = alpha * score + (1 - alpha) * prevEma;
    }

    result.push(Math.round(prevEma * 10) / 10);
  }

  return result;
}

export type HealthTrend = "Improving" | "Stable" | "Deteriorating" | "Baseline";

/**
 * Determines health trend based on baseline comparison and gating.
 * Minimum baseline requirement is 3 check-in days.
 */
export function calculateTrend(
  currentScore: number | null,
  baselineScore: number | null,
  completedDays: number,
  baselineGatingThreshold: number = 3
): HealthTrend {
  if (completedDays < baselineGatingThreshold || currentScore === null || baselineScore === null) {
    return "Baseline";
  }

  const diff = currentScore - baselineScore;

  if (diff >= 4) {
    return "Improving";
  } else if (diff <= -4) {
    return "Deteriorating";
  }

  return "Stable";
}
