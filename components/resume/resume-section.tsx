import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

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
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Badge variant="secondary" className="w-fit">
          {eyebrow}
        </Badge>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold leading-tight">{title}</h2>
          {description ? (
            <p className="text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}
