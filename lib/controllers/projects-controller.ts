import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/controllers/api-response";
import { isInputValidationError } from "@/lib/resume/errors";
import {
  getPublishedProjectBySlug,
  listPublishedProjects,
} from "@/lib/services/resume-service";

export async function getProjectsController(
  request: Request,
): Promise<Response> {
  const resumeSlug = readOptionalSearchParam(request, "resumeSlug");

  try {
    const projects = await listPublishedProjects(resumeSlug);

    return successResponse(projects);
  } catch (error) {
    if (isInputValidationError(error)) {
      return validationErrorResponse(error);
    }

    console.error("Failed to load published projects", error);

    return errorResponse("Unable to load projects", 500);
  }
}

export async function getProjectController(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const resumeSlug = readOptionalSearchParam(request, "resumeSlug");
  const { slug } = await params;

  try {
    const project = await getPublishedProjectBySlug(slug, resumeSlug);

    if (!project) {
      return errorResponse("Project not found", 404);
    }

    return successResponse(project);
  } catch (error) {
    if (isInputValidationError(error)) {
      return validationErrorResponse(error);
    }

    console.error("Failed to load published project", error);

    return errorResponse("Unable to load project", 500);
  }
}

function readOptionalSearchParam(
  request: Request,
  name: string,
): string | undefined {
  return new URL(request.url).searchParams.get(name)?.trim() || undefined;
}
