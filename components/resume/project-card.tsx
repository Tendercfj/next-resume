import Link from "next/link";
import { ArrowUpRight, Globe2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ResumeProject } from "@/lib/resume/types";

type ProjectCardProps = {
  project: ResumeProject;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="grid break-inside-avoid gap-4 py-7 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_8.5rem] sm:gap-8 print:grid-cols-[minmax(0,1fr)_6.5rem] print:gap-4 print:py-3">
      <div className="flex min-w-0 flex-col gap-3 print:gap-1.5">
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="text-lg font-semibold leading-snug text-foreground print:text-[0.86rem]">
            {project.name}
          </h3>
          {project.isFeatured ? (
            <Badge className="rounded-full text-xs print:hidden">精选</Badge>
          ) : null}
        </div>

        {project.description ? (
          <p className="text-sm leading-7 text-muted-foreground print:text-[0.72rem] print:leading-4">
            {project.description}
          </p>
        ) : null}

        {project.techStack.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 print:gap-1">
            {project.techStack.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="rounded-full text-xs print:border print:border-border print:bg-transparent print:px-1.5 print:py-0 print:text-[0.62rem]"
              >
                {tech}
              </Badge>
            ))}
          </div>
        ) : null}

        {project.highlights.length > 0 ? (
          <ul className="flex flex-col gap-2 text-sm leading-7 text-muted-foreground print:gap-1 print:text-[0.72rem] print:leading-4">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2.5">
                <span className="mt-3 size-1.5 shrink-0 rounded-full bg-primary/70 print:mt-1.5 print:size-1" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex flex-wrap gap-2 print:hidden">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="cursor-pointer rounded-full"
          >
            <Link href={`/projects/${project.slug}`}>
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
              查看详情
            </Link>
          </Button>
          {project.projectUrl ? (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="cursor-pointer rounded-full"
            >
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Globe2 className="size-3.5" aria-hidden="true" />
                演示
              </a>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-2 sm:justify-end">
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground print:bg-transparent print:px-0 print:py-0 print:text-[0.68rem]">
          {project.role ?? "项目成员"}
        </span>
      </div>
    </article>
  );
}
