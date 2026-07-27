import { describe, expect, it } from "vitest";

import {
  checkInAnswerSchema,
  checkInDraftSchema,
  checkInSubmitSchema
} from "./index";

describe("checkInAnswerSchema", () => {
  it("defaults skipped to false when omitted", () => {
    const parsed = checkInAnswerSchema.parse({
      questionId: "q1",
      scaleValue: 3
    });

    expect(parsed).toEqual({ questionId: "q1", scaleValue: 3, skipped: false });
  });

  it("accepts nullable value fields", () => {
    const parsed = checkInAnswerSchema.parse({
      questionId: "q1",
      scaleValue: null,
      booleanValue: null,
      numericValue: null
    });

    expect(parsed.skipped).toBe(false);
  });

  it("rejects an answer missing questionId", () => {
    expect(() => checkInAnswerSchema.parse({ scaleValue: 1 })).toThrow();
  });

  it("rejects a non-numeric scaleValue", () => {
    expect(() =>
      checkInAnswerSchema.parse({ questionId: "q1", scaleValue: "high" })
    ).toThrow();
  });
});

describe("checkInSubmitSchema", () => {
  it("accepts optional patientId/date with an answers array", () => {
    const parsed = checkInSubmitSchema.parse({
      patientId: "pat-1",
      date: "2026-07-27",
      answers: [{ questionId: "q1", booleanValue: true }]
    });

    expect(parsed.answers).toHaveLength(1);
    expect(parsed.answers[0].skipped).toBe(false);
  });

  it("requires the answers array", () => {
    expect(() => checkInSubmitSchema.parse({ patientId: "pat-1" })).toThrow();
  });
});

describe("checkInDraftSchema", () => {
  it("parses a draft with only answers", () => {
    const parsed = checkInDraftSchema.parse({
      answers: [{ questionId: "q1", numericValue: 98.6 }]
    });

    expect(parsed.answers[0].numericValue).toBe(98.6);
  });
});
