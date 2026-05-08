import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Code2,
  Globe2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fallbackResume } from "@/lib/fallback-resume";
import {
  getPublishedProjectBySlug,
  type ResumeProject,
} from "@/lib/resume-data";

export const dynamic = "force-dynamic";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await loadProject(slug);

  if (!project) {
    return {
      title: "项目未找到 | Next Resume",
    };
  }

  return {
    title: `${project.name} | Next Resume`,
    description: project.description ?? "项目详情",
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await loadProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Button asChild variant="ghost" className="w-fit cursor-pointer">
          <Link href="/">
            <ArrowLeft data-icon="inline-start" />
            返回简历
          </Link>
        </Button>

        <header className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-2">
            {project.isFeatured ? <Badge>精选项目</Badge> : null}
            {project.role ? <Badge variant="secondary">{project.role}</Badge> : null}
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              {project.name}
            </h1>
            {project.description ? (
              <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                {project.description}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {formatDateRange(project)}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-3 print:hidden">
            {project.projectUrl ? (
              <Button asChild className="cursor-pointer">
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Globe2 data-icon="inline-start" />
                  查看演示
                </a>
              </Button>
            ) : null}
            {project.sourceUrl ? (
              <Button asChild variant="outline" className="cursor-pointer">
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Code2 data-icon="inline-start" />
                  查看源码
                </a>
              </Button>
            ) : null}
          </div>
        </header>

        <Separator />

        <div className="grid gap-5 md:grid-cols-[1fr_280px]">
          <Card>
            <CardHeader>
              <CardTitle>项目亮点</CardTitle>
              <CardDescription>围绕业务价值和工程实现展开。</CardDescription>
            </CardHeader>
            <CardContent>
              {project.highlights.length > 0 ? (
                <ul className="flex list-disc flex-col gap-3 pl-5 leading-7 text-muted-foreground">
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              ) : (
                <p className="leading-7 text-muted-foreground">
                  暂无单独维护的亮点描述。
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="size-4 text-primary" aria-hidden="true" />
                技术栈
              </CardTitle>
              <CardDescription>项目使用的主要技术。</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="print:hidden">
          <CardHeader>
            <CardTitle>继续了解</CardTitle>
            <CardDescription>回到首页查看完整经历和联系入口。</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="cursor-pointer">
              <Link href="/#contact">
                <ArrowUpRight data-icon="inline-start" />
                联系沟通
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

async function loadProject(slug: string) {
  try {
    const project = await getPublishedProjectBySlug(slug);

    if (project) {
      return project;
    }
  } catch (error) {
    console.error("Failed to load project detail", error);
  }

  return fallbackResume.projects.find((project) => project.slug === slug) ?? null;
}

function formatDateRange(project: ResumeProject) {
  const start = formatMonth(project.startDate);
  const end = project.endDate ? formatMonth(project.endDate) : "至今";

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
