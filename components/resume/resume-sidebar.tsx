import { Award, GraduationCap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
        <div className="flex flex-col gap-6">
          {skillGroups.map((group) => (
            <SkillGroup key={group.id} group={group} />
          ))}
        </div>
      </ResumeSection>

      <div className="h-px bg-border" />

      <ResumeSection eyebrow="Education" title="教育背景">
        <div className="flex flex-col divide-y divide-border">
          {education.map((item) => (
            <EducationItem key={item.id} education={item} />
          ))}
        </div>
      </ResumeSection>

      {certifications.length > 0 ? (
        <>
          <div className="h-px bg-border" />
          <ResumeSection eyebrow="Awards" title="证书与奖项">
            <div className="flex flex-col divide-y divide-border">
              {certifications.map((certification) => (
                <CertificationItem
                  key={certification.id}
                  certification={certification}
                />
              ))}
            </div>
          </ResumeSection>
        </>
      ) : null}
    </aside>
  );
}

function SkillGroup({ group }: { group: SkillGroup }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h4 className="text-sm font-semibold text-foreground">{group.name}</h4>
        {group.description ? (
          <p className="text-xs text-muted-foreground">{group.description}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        {group.items.map((item) => (
          <div key={item.id} className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <span className="text-sm text-foreground">{item.name}</span>
              {item.level ? (
                <span className="text-xs text-muted-foreground">
                  {skillLevelLabels[item.level]}
                </span>
              ) : null}
            </div>
            {item.keywords.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {item.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationItem({ education }: { education: Education }) {
  return (
    <div className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0">
      <div className="flex items-start gap-2">
        <GraduationCap
          className="mt-0.5 size-3.5 shrink-0 text-primary"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">
            {education.school}
          </span>
          <span className="text-xs text-muted-foreground">
            {[education.degree, education.major].filter(Boolean).join(" · ")}
          </span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {formatDateRange(education)}
          </span>
          {education.description ? (
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {education.description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function CertificationItem({
  certification,
}: {
  certification: Certification;
}) {
  return (
    <div className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0">
      <div className="flex items-start gap-2">
        <Award
          className="mt-0.5 size-3.5 shrink-0 text-primary"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">
            {certification.title}
          </span>
          <span className="text-xs text-muted-foreground">
            {[certification.issuer, formatMonth(certification.issuedOn)]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </div>
      </div>
    </div>
  );
}
