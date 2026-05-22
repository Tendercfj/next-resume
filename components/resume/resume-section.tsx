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
      <section className="flex break-inside-avoid flex-col gap-4 border-t border-border/60 pt-6 print:gap-2.5 print:pt-3">
        <div className="flex flex-col gap-1 print:gap-0.5">
          <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary print:text-[0.58rem]">
            <span className="size-1 rounded-full bg-primary/50 print:hidden" />
            {eyebrow}
          </span>
          <h2 className="text-[1.05rem] font-bold tracking-tight text-foreground print:text-[0.86rem]">
            {title}
          </h2>
          {description ? (
            <p className="text-xs leading-5 text-muted-foreground print:text-[0.66rem] print:leading-4">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </section>
    );
  }

  return (
    <section className="grid break-inside-avoid gap-5 border-t border-border/60 pt-8 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-8 print:grid-cols-[6.5rem_minmax(0,1fr)] print:gap-4 print:pt-4">
      <div className="flex flex-col gap-1 sm:sticky sm:top-8 sm:self-start print:static print:gap-0.5">
        <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary print:text-[0.58rem]">
          <span className="size-1 rounded-full bg-primary/50 print:hidden" />
          {eyebrow}
        </span>
        <h2 className="text-xl font-bold tracking-tight text-foreground print:text-[0.9rem]">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-xs leading-5 text-muted-foreground print:text-[0.66rem] print:leading-4">
            {description}
          </p>
        ) : null}
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </section>
  );
}
