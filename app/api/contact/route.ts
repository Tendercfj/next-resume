import { postContactController } from "@/lib/controllers/contact-controller";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  return postContactController(request);
}
