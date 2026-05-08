import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  Globe2,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { PrintButton } from "@/components/print-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fallbackResume } from "@/lib/fallback-resume";
import {
  getPublishedResume,
  type Certification,
  type Education,
  type PublishedResume,
  type ResumeLink,
  type ResumeProfile,
  type ResumeProject,
  type SkillGroup,
  type WorkExperience,
} from "@/lib/resume-data";

export const dynamic = "force-dynamic";

type ResumePageData = {
  resume: PublishedResume;
  usingFallbackData: boolean;
};

const employmentTypeLabels: Record<string, string> = {
  full_time: "全职",
  part_time: "兼职",
  contract: "合同",
  internship: "实习",
  freelance: "自由职业",
};

const skillLevelLabels = {
  expert: "专家",
  proficient: "熟练",
  familiar: "熟悉",
} as const;

export default async function Page() {
  const { resume, usingFallbackData } = await loadResume();
  const { profile } = resume;
  const contactItems = getContactItems(profile);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Avatar className="size-20" size="lg">
                {profile.avatarUrl ? (
                  <AvatarImage
                    src={profile.avatarUrl}
                    alt={`${profile.ownerName} 的头像`}
                  />
                ) : null}
                <AvatarFallback className="text-lg">
                  {getInitials(profile.ownerName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col gap-2">
                <Badge variant="secondary" className="w-fit">
                  {usingFallbackData ? "示例简历" : profile.title}
                </Badge>
                <div className="flex flex-col gap-2">
                  <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                    {profile.ownerName}
                  </h1>
                  {profile.headline ? (
                    <p className="text-xl text-muted-foreground">
                      {profile.headline}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
            {profile.summary ? (
              <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                {profile.summary}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {contactItems.map((item) => (
                <Badge key={item.label} variant="outline" className="gap-1.5">
                  <item.icon className="size-3.5" aria-hidden="true" />
                  <span className="max-w-[18rem] truncate">{item.label}</span>
                </Badge>
              ))}
            </div>
            <div className="flex flex-col gap-3 print:hidden sm:flex-row">
              {profile.email ? (
                <Button asChild className="cursor-pointer">
                  <a href={`mailto:${profile.email}`}>
                    <Mail data-icon="inline-start" />
                    联系我
                  </a>
                </Button>
              ) : null}
              <PrintButton />
            </div>
          </div>
          <aside className="flex flex-col gap-3 rounded-lg border bg-card p-4 text-sm shadow-sm">
            <div className="flex items-center gap-2 font-medium">
              <Sparkles className="size-4 text-primary" aria-hidden="true" />
              快速入口
            </div>
            <Separator />
            <div className="flex flex-col gap-1">
              {getProfileLinks(profile, resume.links).map((link) => (
                <ExternalTextLink key={link.label} link={link} />
              ))}
            </div>
          </aside>
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-w-0 flex-col gap-12">
            <Section
              eyebrow="Experience"
              title="工作经历"
              description="按时间与贡献聚焦，方便快速扫描职责和结果。"
            >
              <div className="flex flex-col gap-4">
                {resume.workExperiences.map((experience) => (
                  <ExperienceCard
                    key={experience.id}
                    experience={experience}
                  />
                ))}
              </div>
            </Section>

            <Section
              eyebrow="Projects"
              title="项目经历"
              description="精选项目优先展示，详情页承接更完整的项目上下文。"
            >
              <div className="grid gap-4 md:grid-cols-2">
                {resume.projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </Section>
          </div>

          <aside className="flex min-w-0 flex-col gap-10">
            <Section eyebrow="Skills" title="技能结构">
              <div className="flex flex-col gap-3">
                {resume.skillGroups.map((group) => (
                  <SkillCard key={group.id} group={group} />
                ))}
              </div>
            </Section>

            <Section eyebrow="Education" title="教育背景">
              <div className="flex flex-col gap-3">
                {resume.education.map((item) => (
                  <EducationCard key={item.id} education={item} />
                ))}
              </div>
            </Section>

            {resume.certifications.length > 0 ? (
              <Section eyebrow="Awards" title="证书与奖项">
                <div className="flex flex-col gap-3">
                  {resume.certifications.map((certification) => (
                    <CertificationCard
                      key={certification.id}
                      certification={certification}
                    />
                  ))}
                </div>
              </Section>
            ) : null}
          </aside>
        </div>

        <section
          id="contact"
          className="grid gap-8 rounded-lg border bg-card p-5 shadow-sm print:hidden md:grid-cols-[0.8fr_1.2fr] md:p-6"
        >
          <div className="flex flex-col gap-3">
            <Badge variant="secondary" className="w-fit">
              Contact
            </Badge>
            <h2 className="text-2xl font-semibold leading-tight">
              想进一步沟通？
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              可以留下合作、面试或项目咨询信息。服务端会做输入校验，并写入
              Neon 的 `contact_messages` 表。
            </p>
          </div>
          <ContactForm resumeSlug={profile.slug} />
        </section>
      </div>
    </main>
  );
}

async function loadResume(): Promise<ResumePageData> {
  try {
    const resume = await getPublishedResume();

    if (!resume) {
      return {
        resume: fallbackResume,
        usingFallbackData: true,
      };
    }

    return {
      resume: fillEmptySections(resume),
      usingFallbackData: false,
    };
  } catch (error) {
    console.error("Failed to load resume for page", error);

    return {
      resume: fallbackResume,
      usingFallbackData: true,
    };
  }
}

function fillEmptySections(resume: PublishedResume): PublishedResume {
  return {
    profile: {
      ...fallbackResume.profile,
      ...resume.profile,
      headline: resume.profile.headline ?? fallbackResume.profile.headline,
      summary: resume.profile.summary ?? fallbackResume.profile.summary,
      location: resume.profile.location ?? fallbackResume.profile.location,
      email: resume.profile.email ?? fallbackResume.profile.email,
      phone: resume.profile.phone ?? fallbackResume.profile.phone,
      websiteUrl: resume.profile.websiteUrl ?? fallbackResume.profile.websiteUrl,
      githubUrl: resume.profile.githubUrl ?? fallbackResume.profile.githubUrl,
      linkedinUrl:
        resume.profile.linkedinUrl ?? fallbackResume.profile.linkedinUrl,
    },
    links: resume.links.length > 0 ? resume.links : fallbackResume.links,
    skillGroups:
      resume.skillGroups.length > 0
        ? resume.skillGroups
        : fallbackResume.skillGroups,
    workExperiences:
      resume.workExperiences.length > 0
        ? resume.workExperiences
        : fallbackResume.workExperiences,
    projects: resume.projects.length > 0 ? resume.projects : fallbackResume.projects,
    education:
      resume.education.length > 0 ? resume.education : fallbackResume.education,
    certifications:
      resume.certifications.length > 0
        ? resume.certifications
        : fallbackResume.certifications,
  };
}

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
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

function ExperienceCard({ experience }: { experience: WorkExperience }) {
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

function ProjectCard({ project }: { project: ResumeProject }) {
  return (
    <Card className="transition-colors duration-200 hover:bg-accent/45">
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.role ?? "项目成员"}</CardDescription>
        {project.isFeatured ? (
          <CardAction>
            <Badge>精选</Badge>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {project.description ? (
          <p className="leading-7 text-muted-foreground">
            {project.description}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
        {project.highlights.length > 0 ? (
          <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-6 text-muted-foreground">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        ) : null}
        <div className="flex flex-wrap gap-2 print:hidden">
          <Button asChild variant="outline" size="sm" className="cursor-pointer">
            <Link href={`/projects/${project.slug}`}>
              <ArrowUpRight data-icon="inline-start" />
              查看详情
            </Link>
          </Button>
          {project.projectUrl ? (
            <Button asChild variant="ghost" size="sm" className="cursor-pointer">
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Globe2 data-icon="inline-start" />
                演示
              </a>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
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

function ExternalTextLink({ link }: { link: ResumeLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer noopener"
      className="flex min-w-0 cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-2 text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="flex min-w-0 items-center gap-2">
        <Globe2 className="size-4 shrink-0" aria-hidden="true" />
        <span className="truncate">{link.label}</span>
      </span>
      <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
    </a>
  );
}

function getContactItems(profile: ResumeProfile) {
  return [
    profile.location
      ? {
          label: profile.location,
          icon: MapPin,
        }
      : null,
    profile.email
      ? {
          label: profile.email,
          icon: Mail,
        }
      : null,
    profile.phone
      ? {
          label: profile.phone,
          icon: Phone,
        }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    icon: typeof MapPin;
  }>;
}

function getProfileLinks(profile: ResumeProfile, links: ResumeLink[]) {
  const directLinks: ResumeLink[] = [
    profile.websiteUrl
      ? {
          id: "profile-website",
          label: "个人网站",
          url: profile.websiteUrl,
          icon: "website",
          sortOrder: 0,
        }
      : null,
    profile.githubUrl
      ? {
          id: "profile-github",
          label: "GitHub",
          url: profile.githubUrl,
          icon: "github",
          sortOrder: 1,
        }
      : null,
    profile.linkedinUrl
      ? {
          id: "profile-linkedin",
          label: "LinkedIn",
          url: profile.linkedinUrl,
          icon: "linkedin",
          sortOrder: 2,
        }
      : null,
  ].filter(Boolean) as ResumeLink[];

  const seen = new Set<string>();

  return [...directLinks, ...links]
    .filter((link) => {
      if (seen.has(link.url)) {
        return false;
      }

      seen.add(link.url);
      return true;
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function formatDateRange(
  item:
    | WorkExperience
    | ResumeProject
    | Education
    | { startDate: string | null; endDate: string | null; isCurrent?: boolean },
) {
  const start = formatMonth(item.startDate);
  const end = "isCurrent" in item && item.isCurrent ? "至今" : formatMonth(item.endDate);

  return [start, end].filter(Boolean).join(" - ") || "时间未填写";
}

function formatMonth(date: string | null) {
  if (!date) {
    return null;
  }

  const [year, month] = date.split("-");

  if (!year) {
    return date;
  }

  return month ? `${year}.${month}` : year;
}

function getInitials(name: string) {
  return name.trim().slice(0, 2).toUpperCase();
}
