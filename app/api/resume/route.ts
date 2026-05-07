import {
  getPublishedResume,
  isInputValidationError,
} from "@/lib/resume-data";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim() || undefined;

  try {
    const resume = await getPublishedResume(slug);

    if (!resume) {
      return Response.json(
        {
          ok: false,
          error: "Resume not found",
        },
        { status: 404 },
      );
    }

    return Response.json({
      ok: true,
      data: resume,
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

    console.error("Failed to load published resume", error);

    return Response.json(
      {
        ok: false,
        error: "Unable to load resume",
      },
      { status: 500 },
    );
  }
}
