import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/controllers/api-response";
import { isInputValidationError } from "@/lib/resume/errors";
import { getPublishedResume } from "@/lib/services/resume-service";

export async function getResumeController(request: Request): Promise<Response> {
  const slug = readOptionalSearchParam(request, "slug");

  try {
    const resume = await getPublishedResume(slug);

    if (!resume) {
      return errorResponse("Resume not found", 404);
    }

    return successResponse(resume);
  } catch (error) {
    if (isInputValidationError(error)) {
      return validationErrorResponse(error);
    }

    console.error("Failed to load published resume", error);

    return errorResponse("Unable to load resume", 500);
  }
}

function readOptionalSearchParam(
  request: Request,
  name: string,
): string | undefined {
  return new URL(request.url).searchParams.get(name)?.trim() || undefined;
}
