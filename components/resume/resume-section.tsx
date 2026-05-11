import type { ReactNode } from "react";

type ResumeSectionProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function ResumeSection({
  eyebrow,
  title,
  description,
  children,
}: ResumeSectionProps) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          {eyebrow}
        </span>
        <h2 className="text-xl font-semibold leading-tight text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
