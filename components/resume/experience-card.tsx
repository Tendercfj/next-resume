import { Badge } from "@/components/ui/badge";
import { formatDateRange } from "@/lib/resume/formatters";
import type { WorkExperience } from "@/lib/resume/types";

const employmentTypeLabels: Record<string, string> = {
  full_time: "全职",
  part_time: "兼职",
  contract: "合同",
  internship: "实习",
  freelance: "自由职业",
};

type ExperienceCardProps = {
  experience: WorkExperience;
};

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <article className="grid break-inside-avoid gap-4 py-7 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_8.5rem] sm:gap-8 print:grid-cols-[minmax(0,1fr)_6.5rem] print:gap-4 print:py-3">
      <div className="flex min-w-0 flex-col gap-3 print:gap-1.5">
        <div className="flex flex-col gap-1 print:gap-0.5">
          <h3 className="text-lg font-semibold leading-snug text-foreground print:text-[0.86rem]">
            {experience.role}
          </h3>
          <p className="text-sm font-medium text-muted-foreground print:text-[0.72rem]">
            {experience.company}
            {experience.location ? ` · ${experience.location}` : ""}
          </p>
        </div>

        {experience.summary ? (
          <p className="text-sm leading-7 text-muted-foreground print:text-[0.72rem] print:leading-4">
            {experience.summary}
          </p>
        ) : null}

        {experience.highlights.length > 0 ? (
          <ul className="flex flex-col gap-2 text-sm leading-7 text-muted-foreground print:gap-1 print:text-[0.72rem] print:leading-4">
            {experience.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2.5">
                <span className="mt-3 size-1.5 shrink-0 rounded-full bg-primary/70 print:mt-1.5 print:size-1" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="flex flex-wrap items-start gap-2 sm:justify-end print:gap-1">
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground print:bg-transparent print:px-0 print:py-0 print:text-[0.68rem]">
          {formatDateRange(experience)}
        </span>
        {experience.isCurrent ? (
          <Badge variant="default" className="rounded-full text-xs print:hidden">
            当前
          </Badge>
        ) : null}
        {experience.employmentType ? (
          <Badge variant="secondary" className="rounded-full text-xs print:hidden">
            {employmentTypeLabels[experience.employmentType] ??
              experience.employmentType}
          </Badge>
        ) : null}
      </div>
    </article>
  );
}
