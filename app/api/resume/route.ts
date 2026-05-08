import { getResumeController } from "@/lib/controllers/resume-controller";

export const runtime = "nodejs";

export async function GET(request: Request): Promise<Response> {
  return getResumeController(request);
}
