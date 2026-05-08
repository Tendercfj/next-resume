import { Award, GraduationCap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateRange, formatMonth } from "@/lib/resume/formatters";
import type {
  Certification,
  Education,
  SkillGroup,
} from "@/lib/resume/types";

import { ResumeSection } from "./resume-section";

const skillLevelLabels = {
  expert: "专家",
  proficient: "熟练",
  familiar: "熟悉",
} as const;

type ResumeSidebarProps = {
  skillGroups: SkillGroup[];
  education: Education[];
  certifications: Certification[];
};

export function ResumeSidebar({
  skillGroups,
  education,
  certifications,
}: ResumeSidebarProps) {
  return (
    <aside className="flex min-w-0 flex-col gap-10">
      <ResumeSection eyebrow="Skills" title="技能结构">
        <div className="flex flex-col gap-3">
          {skillGroups.map((group) => (
            <SkillCard key={group.id} group={group} />
          ))}
        </div>
      </ResumeSection>

      <ResumeSection eyebrow="Education" title="教育背景">
        <div className="flex flex-col gap-3">
          {education.map((item) => (
            <EducationCard key={item.id} education={item} />
          ))}
        </div>
      </ResumeSection>

      {certifications.length > 0 ? (
        <ResumeSection eyebrow="Awards" title="证书与奖项">
          <div className="flex flex-col gap-3">
            {certifications.map((certification) => (
              <CertificationCard
                key={certification.id}
                certification={certification}
              />
            ))}
          </div>
        </ResumeSection>
      ) : null}
    </aside>
  );
}

function SkillCard({ group }: { group: SkillGroup }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{group.name}</CardTitle>
        {group.description ? (
          <CardDescription>{group.description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {group.items.map((item) => (
          <div key={item.id} className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium">{item.name}</span>
              {item.level ? (
                <Badge variant="outline">{skillLevelLabels[item.level]}</Badge>
              ) : null}
            </div>
            {item.keywords.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {item.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function EducationCard({ education }: { education: Education }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="size-4 text-primary" aria-hidden="true" />
          {education.school}
        </CardTitle>
        <CardDescription>
          {[education.degree, education.major].filter(Boolean).join(" · ")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
        <div>{formatDateRange(education)}</div>
        {education.description ? <p>{education.description}</p> : null}
      </CardContent>
    </Card>
  );
}

function CertificationCard({
  certification,
}: {
  certification: Certification;
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="size-4 text-primary" aria-hidden="true" />
          {certification.title}
        </CardTitle>
        <CardDescription>
          {[certification.issuer, formatMonth(certification.issuedOn)]
            .filter(Boolean)
            .join(" · ")}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
