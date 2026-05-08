import { ContactForm } from "@/components/contact-form";
import { Badge } from "@/components/ui/badge";
import type { ResumeProfile } from "@/lib/resume/types";

type ContactSectionProps = {
  profile: ResumeProfile;
};

export function ContactSection({ profile }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="grid gap-8 rounded-lg border bg-card p-5 shadow-sm print:hidden md:grid-cols-[0.8fr_1.2fr] md:p-6"
    >
      <div className="flex flex-col gap-3">
        <Badge variant="secondary" className="w-fit">
          Contact
        </Badge>
        <h2 className="text-2xl font-semibold leading-tight">想进一步沟通？</h2>
        <p className="text-sm leading-7 text-muted-foreground">
          可以留下合作、面试或项目咨询信息。服务端会做输入校验，并写入 Neon
          的 `contact_messages` 表。
        </p>
      </div>
      <ContactForm resumeSlug={profile.slug} />
    </section>
  );
}
