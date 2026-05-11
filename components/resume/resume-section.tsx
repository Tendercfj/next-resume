import type { ReactNode } from "react";

type ResumeSectionProps = {
  eyebrow: string;
  title: string;
  description?: string;
  variant?: "main" | "compact";
  children: ReactNode;
};

export function ResumeSection({
  eyebrow,
  title,
  description,
  variant = "main",
  children,
}: ResumeSectionProps) {
  if (variant === "compact") {
    return (
      <section className="flex break-inside-avoid flex-col gap-4 border-t border-border pt-6 print:gap-2.5 print:pt-3">
        <div className="flex flex-col gap-1 print:gap-0.5">
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary print:text-[0.58rem]">
            {eyebrow}
          </span>
          <h2 className="text-base font-semibold leading-tight text-foreground print:text-[0.86rem]">
            {title}
          </h2>
          {description ? (
            <p className="text-sm leading-6 text-muted-foreground print:text-[0.72rem] print:leading-4">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </section>
    );
  }

  return (
    <section className="grid break-inside-avoid gap-5 border-t border-border pt-8 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-8 print:grid-cols-[6.5rem_minmax(0,1fr)] print:gap-4 print:pt-4">
      <div className="flex flex-col gap-1 sm:sticky sm:top-8 sm:self-start print:static print:gap-0.5">
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary print:text-[0.58rem]">
          {eyebrow}
        </span>
        <h2 className="text-lg font-semibold leading-tight text-foreground print:text-[0.9rem]">
          {title}
        </h2>
        {description ? (
          <p className="text-sm leading-6 text-muted-foreground print:text-[0.72rem] print:leading-4">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
