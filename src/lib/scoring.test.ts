import { describe, expect, it } from "vitest";

import {
  calculateCategoryIndex,
  calculateDailyScore,
  calculateEmaSeries,
  calculateTrend,
  normalizeAnswer,
  QuestionData
} from "./scoring";

describe("Scoring Engine - Answer Normalization", () => {
  it("normalizes YES_NO HIGHER_BETTER answers", () => {
    const q: QuestionData = {
      id: "q1",
      category: "ADHERENCE",
      type: "YES_NO",
      weight: 1,
      direction: "HIGHER_BETTER"
    };

    expect(normalizeAnswer(q, { questionId: "q1", boolValue: true })).toBe(100);
    expect(normalizeAnswer(q, { questionId: "q1", boolValue: false })).toBe(0);
  });

  it("normalizes YES_NO HIGHER_WORSE answers", () => {
    const q: QuestionData = {
      id: "q2",
      category: "SYMPTOM",
      type: "YES_NO",
      weight: 1,
      direction: "HIGHER_WORSE"
    };

    expect(normalizeAnswer(q, { questionId: "q2", boolValue: true })).toBe(0);
    expect(normalizeAnswer(q, { questionId: "q2", boolValue: false })).toBe(100);
  });

  it("normalizes SCALE answers with direction", () => {
    const qBetter: QuestionData = {
      id: "q3",
      category: "SYMPTOM",
      type: "SCALE",
      weight: 2,
      direction: "HIGHER_BETTER",
      minValue: 0,
      maxValue: 10
    };

    expect(normalizeAnswer(qBetter, { questionId: "q3", scaleValue: 5 })).toBe(50);
    expect(normalizeAnswer(qBetter, { questionId: "q3", scaleValue: 10 })).toBe(100);

    const qWorse: QuestionData = {
      ...qBetter,
      direction: "HIGHER_WORSE"
    };

    expect(normalizeAnswer(qWorse, { questionId: "q3", scaleValue: 8 })).toBe(20);
  });

  it("normalizes NUMERIC answers within ideal range and boundaries", () => {
    const qNum: QuestionData = {
      id: "q4",
      category: "SYMPTOM",
      type: "NUMERIC",
      weight: 3,
      direction: "HIGHER_BETTER",
      rangeMin: 97.0,
      rangeMax: 99.0,
      hardMin: 95.0,
      hardMax: 104.0
    };

    // Ideal reading -> 100
    expect(normalizeAnswer(qNum, { questionId: "q4", numericValue: 98.6 })).toBe(100);
    // Hard min breach -> 0
    expect(normalizeAnswer(qNum, { questionId: "q4", numericValue: 94.0 })).toBe(0);
    // Interpolated reading between hardMin and rangeMin
    expect(normalizeAnswer(qNum, { questionId: "q4", numericValue: 96.0 })).toBe(50);
  });

  it("returns null for skipped or missing answers", () => {
    const q: QuestionData = {
      id: "q5",
      category: "SYMPTOM",
      type: "YES_NO",
      weight: 1,
      direction: "HIGHER_BETTER"
    };

    expect(normalizeAnswer(q, { questionId: "q5", skipped: true, boolValue: true })).toBeNull();
    expect(normalizeAnswer(q, { questionId: "q5" })).toBeNull();
  });
});

describe("Scoring Engine - Indices & Daily Scores", () => {
  it("computes weighted category index correctly ignoring skipped questions", () => {
    const q1: QuestionData = {
      id: "q1",
      category: "SYMPTOM",
      type: "SCALE",
      weight: 3,
      direction: "HIGHER_BETTER",
      minValue: 0,
      maxValue: 10
    };
    const q2: QuestionData = {
      id: "q2",
      category: "SYMPTOM",
      type: "YES_NO",
      weight: 1,
      direction: "HIGHER_BETTER"
    };

    const items = [
      { question: q1, answer: { questionId: "q1", scaleValue: 10 } }, // 100 * 3
      { question: q2, answer: { questionId: "q2", boolValue: false } } // 0 * 1
    ];

    // (100 * 3 + 0 * 1) / 4 = 75
    expect(calculateCategoryIndex(items, "SYMPTOM")).toBe(75);
  });

  it("calculates overall daily score correctly", () => {
    expect(calculateDailyScore(80, 90)).toBe(84); // 80*0.6 + 90*0.4
    expect(calculateDailyScore(75, null)).toBe(75);
    expect(calculateDailyScore(null, null)).toBeNull();
  });
});

describe("Scoring Engine - EMA & Trend Calculation", () => {
  it("computes EMA series handling null missing days", () => {
    const rawScores = [70, 80, null, 90];
    const emaSeries = calculateEmaSeries(rawScores, 0.5);

    expect(emaSeries[0]).toBe(70);
    expect(emaSeries[1]).toBe(75); // 0.5 * 80 + 0.5 * 70
    expect(emaSeries[2]).toBe(75); // Missing day retains prior EMA
    expect(emaSeries[3]).toBe(82.5); // 0.5 * 90 + 0.5 * 75
  });

  it("evaluates trend labels with baseline gating", () => {
    // Under baseline threshold -> "Baseline"
    expect(calculateTrend(85, 75, 2, 3)).toBe("Baseline");

    // Above baseline threshold -> Evaluates Improving / Stable / Deteriorating
    expect(calculateTrend(85, 75, 5, 3)).toBe("Improving");
    expect(calculateTrend(70, 80, 5, 3)).toBe("Deteriorating");
    expect(calculateTrend(76, 75, 5, 3)).toBe("Stable");
  });
});
