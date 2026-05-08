import type { InputValidationError } from "@/lib/resume/errors";
import type { Issues } from "@/lib/resume/errors";

export function successResponse<T>(data: T, init?: ResponseInit): Response {
  return Response.json(
    {
      ok: true,
      data,
    },
    init,
  );
}

export function errorResponse(
  error: string,
  status: number,
  issues?: Issues,
): Response {
  return Response.json(
    {
      ok: false,
      error,
      ...(issues ? { issues } : {}),
    },
    { status },
  );
}

export function validationErrorResponse(
  error: InputValidationError,
): Response {
  return errorResponse("Invalid request", 400, error.issues);
}
