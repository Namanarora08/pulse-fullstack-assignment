import { NextResponse } from "next/server";

import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";

type SuccessResponseOptions = {
  status?: number;
};

type ErrorResponseOptions = {
  status?: number;
  details?: unknown;
};

export function successResponse<TData>(
  data: TData,
  options: SuccessResponseOptions = {}
) {
  const body: ApiSuccessResponse<TData> = {
    success: true,
    data
  };

  return NextResponse.json(body, { status: options.status ?? 200 });
}

export function errorResponse(
  message: string,
  options: ErrorResponseOptions = {}
) {
  const body: ApiErrorResponse = {
    success: false,
    error: {
      message,
      details: options.details
    }
  };

  return NextResponse.json(body, { status: options.status ?? 500 });
}
