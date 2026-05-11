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
    <article className="flex flex-col gap-3 py-6 first:pt-0 last:pb-0">
      {/* header row */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-semibold text-foreground">{experience.role}</h3>
          <p className="text-sm text-muted-foreground">
            {experience.company}
            {experience.location ? ` · ${experience.location}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className="text-sm tabular-nums text-muted-foreground">
            {formatDateRange(experience)}
          </span>
          {experience.isCurrent ? (
            <Badge variant="default" className="text-xs">当前</Badge>
          ) : null}
          {experience.employmentType ? (
            <Badge variant="secondary" className="text-xs">
              {employmentTypeLabels[experience.employmentType] ??
                experience.employmentType}
            </Badge>
          ) : null}
        </div>
      </div>

      {/* summary */}
      {experience.summary ? (
        <p className="text-sm leading-7 text-muted-foreground">
          {experience.summary}
        </p>
      ) : null}

      {/* highlights */}
      {experience.highlights.length > 0 ? (
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-7 text-muted-foreground">
          {experience.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
