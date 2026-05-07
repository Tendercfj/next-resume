import {
  isInputValidationError,
  listPublishedProjects,
} from "@/lib/resume-data";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const resumeSlug = searchParams.get("resumeSlug")?.trim() || undefined;

  try {
    const projects = await listPublishedProjects(resumeSlug);

    return Response.json({
      ok: true,
      data: projects,
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

    console.error("Failed to load published projects", error);

    return Response.json(
      {
        ok: false,
        error: "Unable to load projects",
      },
      { status: 500 },
    );
  }
}
