import {
  errorResponse,
  successResponse,
  validationErrorResponse,
} from "@/lib/controllers/api-response";
import { isInputValidationError } from "@/lib/resume/errors";
import type { ContactMessageInput } from "@/lib/resume/types";
import { createContactMessage } from "@/lib/services/resume-service";

export type ContactActionResult = {
  ok: boolean;
  message: string;
  issues?: Record<string, string>;
};

export async function postContactController(
  request: Request,
): Promise<Response> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  if (!isRecord(body)) {
    return errorResponse("Invalid request body", 400);
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

    return successResponse(result, { status: 201 });
  } catch (error) {
    if (isInputValidationError(error)) {
      return validationErrorResponse(error);
    }

    console.error("Failed to create contact message", error);

    return errorResponse("Unable to create contact message", 500);
  }
}

export async function submitContactMessageController(
  formData: FormData,
): Promise<ContactActionResult> {
  try {
    await createContactMessage(contactInputFromFormData(formData));

    return {
      ok: true,
      message: "消息已提交",
    };
  } catch (error) {
    if (isInputValidationError(error)) {
      return {
        ok: false,
        message: "请检查表单内容",
        issues: error.issues,
      };
    }

    console.error("Failed to submit contact message", error);

    return {
      ok: false,
      message: "消息暂时无法提交，请稍后再试",
    };
  }
}

export async function submitContactMessageWithStateController(
  _previousState: ContactActionResult,
  formData: FormData,
): Promise<ContactActionResult> {
  return submitContactMessageController(formData);
}

function contactInputFromFormData(formData: FormData): ContactMessageInput {
  return {
    senderName: formData.get("senderName") ?? formData.get("name"),
    senderEmail: formData.get("senderEmail") ?? formData.get("email"),
    senderCompany: formData.get("senderCompany") ?? formData.get("company"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    resumeSlug: formData.get("resumeSlug"),
    source: "resume_site",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
