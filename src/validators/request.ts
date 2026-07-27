import type { NextRequest } from "next/server";
import type { ZodSchema, z } from "zod";

import { InvalidJsonBodyError } from "@/lib/api/errors";

export async function validateJsonBody<TSchema extends ZodSchema>(
  request: NextRequest,
  schema: TSchema
): Promise<z.infer<TSchema>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    throw new InvalidJsonBodyError(error);
  }

  return schema.parse(body);
}

export function validateSearchParams<TSchema extends ZodSchema>(
  searchParams: URLSearchParams,
  schema: TSchema
): z.infer<TSchema> {
  return schema.parse(Object.fromEntries(searchParams.entries()));
}
