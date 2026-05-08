import { getHealthController } from "@/lib/controllers/health-controller";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  return getHealthController();
}
