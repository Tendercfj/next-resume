"use server";

import {
  contactInputFromFormData,
  createContactMessage,
  isInputValidationError,
} from "@/lib/resume-data";

export type ContactActionResult = {
  ok: boolean;
  message: string;
  issues?: Record<string, string>;
};

export async function submitContactMessage(
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

export async function submitContactMessageWithState(
  _previousState: ContactActionResult,
  formData: FormData,
): Promise<ContactActionResult> {
  return submitContactMessage(formData);
}
