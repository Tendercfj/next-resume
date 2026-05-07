import {
  createContactMessage,
  isInputValidationError,
} from "@/lib/resume-data";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        ok: false,
        error: "Invalid JSON body",
      },
      { status: 400 },
    );
  }

  if (!isRecord(body)) {
    return Response.json(
      {
        ok: false,
        error: "Invalid request body",
      },
      { status: 400 },
    );
  }

  try {
    const result = await createContactMessage({
      senderName: body.senderName ?? body.name,
      senderEmail: body.senderEmail ?? body.email,
      senderCompany: body.senderCompany ?? body.company,
      subject: body.subject,
      message: body.message,
      resumeSlug: body.resumeSlug,
      source: body.source ?? "api_contact",
      userAgent: request.headers.get("user-agent"),
    });

    return Response.json(
      {
        ok: true,
        data: result,
      },
      { status: 201 },
    );
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

    console.error("Failed to create contact message", error);

    return Response.json(
      {
        ok: false,
        error: "Unable to create contact message",
      },
      { status: 500 },
    );
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
