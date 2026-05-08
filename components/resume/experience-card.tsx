import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle>{experience.role}</CardTitle>
        <CardDescription>
          {experience.company}
          {experience.location ? ` · ${experience.location}` : ""}
        </CardDescription>
        <CardAction>
          <Badge variant={experience.isCurrent ? "default" : "outline"}>
            {experience.isCurrent ? "当前" : formatDateRange(experience)}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {!experience.isCurrent ? null : (
            <Badge variant="outline">{formatDateRange(experience)}</Badge>
          )}
          {experience.employmentType ? (
            <Badge variant="secondary">
              {employmentTypeLabels[experience.employmentType] ??
                experience.employmentType}
            </Badge>
          ) : null}
        </div>
        {experience.summary ? (
          <p className="leading-7 text-muted-foreground">
            {experience.summary}
          </p>
        ) : null}
        {experience.highlights.length > 0 ? (
          <ul className="flex list-disc flex-col gap-2 pl-5 leading-7 text-muted-foreground">
            {experience.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}
