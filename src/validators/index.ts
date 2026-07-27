import { z } from "zod";

export { validateJsonBody, validateSearchParams } from "@/validators/request";

export const checkInAnswerSchema = z.object({
  questionId: z.string(),
  scaleValue: z.number().optional().nullable(),
  booleanValue: z.boolean().optional().nullable(),
  numericValue: z.number().optional().nullable(),
  skipped: z.boolean().optional().default(false)
});

export const checkInSubmitSchema = z.object({
  patientId: z.string().optional(),
  date: z.string().optional(),
  answers: z.array(checkInAnswerSchema)
});

export const checkInDraftSchema = z.object({
  patientId: z.string().optional(),
  answers: z.array(checkInAnswerSchema)
});

