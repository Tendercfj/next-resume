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
    <article className="flex flex-col gap-3 py-6 first:pt-0 last:pb-0">
      {/* header row */}
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <div className="flex items-baseline gap-2">
          <h3 className="font-semibold text-foreground">{project.name}</h3>
          {project.isFeatured ? (
            <Badge className="text-xs">精选</Badge>
          ) : null}
        </div>
        <span className="shrink-0 text-sm text-muted-foreground">
          {project.role ?? "项目成员"}
        </span>
      </div>

      {/* description */}
      {project.description ? (
        <p className="text-sm leading-7 text-muted-foreground">
          {project.description}
        </p>
      ) : null}

      {/* tech stack */}
      {project.techStack.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      ) : null}

      {/* highlights */}
      {project.highlights.length > 0 ? (
        <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-7 text-muted-foreground">
          {project.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      ) : null}

      {/* actions */}
      <div className="flex flex-wrap gap-2 print:hidden">
        <Button asChild variant="outline" size="sm" className="cursor-pointer">
          <Link href={`/projects/${project.slug}`}>
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
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
              <Globe2 className="size-3.5" aria-hidden="true" />
              演示
            </a>
          </Button>
        ) : null}
      </div>
    </article>
  );
}
