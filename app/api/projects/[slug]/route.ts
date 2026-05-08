import { getProjectController } from "@/lib/controllers/projects-controller";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
): Promise<Response> {
  return getProjectController(request, context);
}
