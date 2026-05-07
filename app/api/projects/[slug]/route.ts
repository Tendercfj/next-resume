import {
  getPublishedProjectBySlug,
  isInputValidationError,
} from "@/lib/resume-data";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { searchParams } = new URL(request.url);
  const resumeSlug = searchParams.get("resumeSlug")?.trim() || undefined;
  const { slug } = await params;

  try {
    const project = await getPublishedProjectBySlug(slug, resumeSlug);

    if (!project) {
      return Response.json(
        {
          ok: false,
          error: "Project not found",
        },
        { status: 404 },
      );
    }

    return Response.json({
      ok: true,
      data: project,
    });
  } catch (error) {
    if (isInputValidationError(error)) {
      return Response.json(
        {
          ok: false,
          error: "Invalid request",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("Failed to load published project", error);

    return Response.json(
      {
        ok: false,
        error: "Unable to load project",
      },
      { status: 500 },
    );
  }
}
