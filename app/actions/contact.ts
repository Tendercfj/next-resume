"use server";

import {
  submitContactMessageController,
  submitContactMessageWithStateController,
  type ContactActionResult,
} from "@/lib/controllers/contact-controller";

export type { ContactActionResult };

export async function submitContactMessage(
  formData: FormData,
): Promise<ContactActionResult> {
  return submitContactMessageController(formData);
}

export async function submitContactMessageWithState(
  _previousState: ContactActionResult,
  formData: FormData,
): Promise<ContactActionResult> {
  return submitContactMessageWithStateController(_previousState, formData);
}
