import { getProjectsController } from "@/lib/controllers/projects-controller";

export const runtime = "nodejs";

export async function GET(request: Request): Promise<Response> {
  return getProjectsController(request);
}
