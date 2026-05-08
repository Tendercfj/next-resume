"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

import {
  type ContactActionResult,
  submitContactMessageWithState,
} from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: ContactActionResult = {
  ok: false,
  message: "",
};

type ContactFormProps = {
  resumeSlug: string;
};

export function ContactForm({ resumeSlug }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    submitContactMessageWithState,
    initialState,
  );

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  const hasError = (field: string) => Boolean(state.issues?.[field]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="resumeSlug" value={resumeSlug} />
      <FieldGroup className="md:grid md:grid-cols-2">
        <Field data-invalid={hasError("senderName")}>
          <FieldLabel htmlFor="senderName">姓名</FieldLabel>
          <Input
            id="senderName"
            name="senderName"
            placeholder="你的名字"
            autoComplete="name"
            aria-invalid={hasError("senderName")}
            disabled={pending}
            required
          />
          <FieldError>{state.issues?.senderName}</FieldError>
        </Field>
        <Field data-invalid={hasError("senderEmail")}>
          <FieldLabel htmlFor="senderEmail">邮箱</FieldLabel>
          <Input
            id="senderEmail"
            name="senderEmail"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            aria-invalid={hasError("senderEmail")}
            disabled={pending}
            required
          />
          <FieldError>{state.issues?.senderEmail}</FieldError>
        </Field>
      </FieldGroup>
      <FieldGroup className="md:grid md:grid-cols-2">
        <Field data-invalid={hasError("senderCompany")}>
          <FieldLabel htmlFor="senderCompany">公司或来源</FieldLabel>
          <Input
            id="senderCompany"
            name="senderCompany"
            placeholder="公司、团队或看到简历的渠道"
            autoComplete="organization"
            aria-invalid={hasError("senderCompany")}
            disabled={pending}
          />
          <FieldError>{state.issues?.senderCompany}</FieldError>
        </Field>
        <Field data-invalid={hasError("subject")}>
          <FieldLabel htmlFor="subject">主题</FieldLabel>
          <Input
            id="subject"
            name="subject"
            placeholder="合作、面试或项目咨询"
            aria-invalid={hasError("subject")}
            disabled={pending}
          />
          <FieldError>{state.issues?.subject}</FieldError>
        </Field>
      </FieldGroup>
      <Field data-invalid={hasError("message")}>
        <FieldLabel htmlFor="message">消息</FieldLabel>
        <Textarea
          id="message"
          name="message"
          placeholder="简单说说你想聊的事情。"
          aria-invalid={hasError("message")}
          disabled={pending}
          required
          className="min-h-28 resize-y"
        />
        <FieldDescription>
          表单会通过 Server Action 写入联系消息，不会在前端暴露数据库细节。
        </FieldDescription>
        <FieldError>{state.issues?.message}</FieldError>
      </Field>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={pending} className="cursor-pointer">
          <Send data-icon="inline-start" />
          {pending ? "提交中" : "发送消息"}
        </Button>
        {state.message ? (
          <p
            className="text-sm text-muted-foreground"
            role={state.ok ? "status" : "alert"}
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
