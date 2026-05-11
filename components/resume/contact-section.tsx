import { ContactForm } from "@/components/contact-form";
import type { ResumeProfile } from "@/lib/resume/types";

type ContactSectionProps = {
  profile: ResumeProfile;
};

export function ContactSection({ profile }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="print:hidden"
    >
      <div className="flex flex-col gap-1 mb-5">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Contact
        </span>
        <h2 className="text-base font-semibold leading-tight">想进一步沟通？</h2>
        <p className="text-xs leading-5 text-muted-foreground">
          留下合作、面试或项目咨询信息，服务端校验后写入数据库。
        </p>
      </div>
      <div className="max-w-xl">
        <ContactForm resumeSlug={profile.slug} />
      </div>
    </section>
  );
}
