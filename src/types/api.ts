export type ApiSuccessResponse<TData> = {
  success: true;
  data: TData;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    message: string;
    details?: unknown;
  };
};

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;

export type RouteContext<
  TParams extends Record<string, string> = Record<string, string>
> = {
  params: Promise<TParams>;
};
