import { checkDatabaseHealth } from "@/lib/resume-data";

export const runtime = "nodejs";

export async function GET() {
  const startedAt = Date.now();

  try {
    const database = await checkDatabaseHealth();

    return Response.json({
      ok: true,
      service: "next-resume",
      database,
      latencyMs: Date.now() - startedAt,
    });
  } catch (error) {
    console.error("Health check failed", error);

    return Response.json(
      {
        ok: false,
        service: "next-resume",
        error: "Health check failed",
      },
      { status: 503 },
    );
  }
}
