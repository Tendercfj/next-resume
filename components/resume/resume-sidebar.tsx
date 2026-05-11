import { ArrowUpRight, Award, GraduationCap, Languages } from "lucide-react";

import { formatDateRange, formatMonth } from "@/lib/resume/formatters";
import { getProfileLinks } from "@/lib/resume/profile-links";
import type {
  Certification,
  Education,
  ResumeLink,
  ResumeProfile,
  SkillGroup,
  SkillItem,
} from "@/lib/resume/types";

import { ResumeSection } from "./resume-section";

const skillLevelLabels = {
  expert: "专家",
  proficient: "熟练",
  familiar: "熟悉",
} as const;

type ResumeSidebarProps = {
  profile: ResumeProfile;
  links: ResumeLink[];
  skillGroups: SkillGroup[];
  education: Education[];
  certifications: Certification[];
};

export function ResumeSidebar({
  profile,
  links,
  skillGroups,
  education,
  certifications,
}: ResumeSidebarProps) {
  const { technicalGroups, softGroups } = splitSkillGroups(skillGroups);
  const profileLinks = getProfileLinks(profile, links);
  const portfolioLink =
    profileLinks.find((link) => /作品|portfolio|website|个人网站/i.test(link.label)) ??
    profileLinks[0];
  const languageLabel = getLocaleLabel(profile.locale);

  return (
    <aside className="flex min-w-0 flex-col gap-8 lg:pt-1 print:gap-4">
      <ResumeSection
        eyebrow="Technical Skills"
        title="专业技能"
        variant="compact"
      >
        <div className="flex flex-col gap-6 print:gap-3">
          {technicalGroups.map((group) => (
            <SkillGroupBlock key={group.id} group={group} />
          ))}
        </div>
      </ResumeSection>

      {softGroups.length > 0 ? (
        <ResumeSection eyebrow="Soft Skills" title="软技能" variant="compact">
          <div className="flex flex-col gap-5 print:gap-3">
            {softGroups.map((group) => (
              <SkillGroupBlock key={group.id} group={group} compact />
            ))}
          </div>
        </ResumeSection>
      ) : null}

      <ResumeSection eyebrow="Education" title="教育背景" variant="compact">
        <div className="flex flex-col divide-y divide-border">
          {education.map((item) => (
            <EducationItem key={item.id} education={item} />
          ))}
        </div>
      </ResumeSection>

      {certifications.length > 0 ? (
        <ResumeSection eyebrow="Awards" title="证书与奖项" variant="compact">
          <div className="flex flex-col divide-y divide-border">
            {certifications.map((certification) => (
              <CertificationItem
                key={certification.id}
                certification={certification}
              />
            ))}
          </div>
        </ResumeSection>
      ) : null}

      <ResumeSection eyebrow="Languages" title="语言" variant="compact">
        <div className="flex items-start gap-3 text-sm print:gap-2 print:text-[0.72rem]">
          <Languages
            className="mt-0.5 size-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-col gap-1 print:gap-0.5">
            <span className="font-medium text-foreground">{languageLabel}</span>
            <span className="text-xs text-muted-foreground print:text-[0.64rem]">
              当前简历内容语言
            </span>
          </div>
        </div>
      </ResumeSection>

      {portfolioLink ? (
        <ResumeSection eyebrow="Portfolio" title="作品集" variant="compact">
          <a
            href={portfolioLink.url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 print:text-[0.72rem]"
          >
            Visit portfolio
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </ResumeSection>
      ) : null}
    </aside>
  );
}

function SkillGroupBlock({
  group,
  compact = false,
}: {
  group: SkillGroup;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 print:gap-2">
      <div className="flex flex-col gap-0.5">
        <h4 className="text-sm font-semibold text-foreground print:text-[0.78rem]">
          {group.name}
        </h4>
        {group.description ? (
          <p className="text-xs leading-5 text-muted-foreground print:text-[0.66rem] print:leading-4">
            {group.description}
          </p>
        ) : null}
      </div>
      <div
        className={
          compact
            ? "flex flex-col gap-3 print:gap-2"
            : "flex flex-col gap-4 print:gap-2"
        }
      >
        {group.items.map((item) => (
          <SkillItemRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function SkillItemRow({ item }: { item: SkillItem }) {
  return (
    <div className="flex flex-col gap-2 print:gap-0.5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-foreground print:text-[0.72rem]">
          {item.name}
        </span>
        {item.level ? (
          <span className="text-xs text-muted-foreground print:text-[0.64rem]">
            {skillLevelLabels[item.level]}
          </span>
        ) : null}
      </div>
      {item.keywords.length > 0 ? (
        <p className="text-xs leading-5 text-muted-foreground print:text-[0.64rem] print:leading-4">
          {item.keywords.join(" / ")}
        </p>
      ) : null}
    </div>
  );
}

function EducationItem({ education }: { education: Education }) {
  return (
    <div className="flex flex-col gap-1 py-5 first:pt-0 last:pb-0 print:py-2.5">
      <div className="flex items-start gap-2">
        <GraduationCap
          className="mt-0.5 size-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground print:text-[0.72rem]">
            {education.school}
          </span>
          <span className="text-xs text-muted-foreground print:text-[0.64rem]">
            {[education.degree, education.major].filter(Boolean).join(" · ")}
          </span>
          <span className="text-xs tabular-nums text-muted-foreground print:text-[0.64rem]">
            {formatDateRange(education)}
          </span>
          {education.description ? (
            <p className="mt-1 text-xs leading-5 text-muted-foreground print:text-[0.64rem] print:leading-4">
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
    <div className="flex flex-col gap-1 py-5 first:pt-0 last:pb-0 print:py-2.5">
      <div className="flex items-start gap-2">
        <Award
          className="mt-0.5 size-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground print:text-[0.72rem]">
            {certification.title}
          </span>
          <span className="text-xs text-muted-foreground print:text-[0.64rem]">
            {[certification.issuer, formatMonth(certification.issuedOn)]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </div>
      </div>
    </div>
  );
}

function splitSkillGroups(skillGroups: SkillGroup[]) {
  if (skillGroups.length <= 2) {
    return {
      technicalGroups: skillGroups,
      softGroups: [],
    };
  }

  return {
    technicalGroups: skillGroups.slice(0, 2),
    softGroups: skillGroups.slice(2),
  };
}

function getLocaleLabel(locale: string) {
  if (locale.toLowerCase().startsWith("zh")) {
    return "中文";
  }

  if (locale.toLowerCase().startsWith("en")) {
    return "English";
  }

  return locale;
}
