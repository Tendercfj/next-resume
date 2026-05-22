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
    <article className="group relative grid break-inside-avoid gap-4 py-1 transition-all duration-300 sm:grid-cols-[minmax(0,1fr)_9.5rem] sm:gap-8 print:grid-cols-[minmax(0,1fr)_6.5rem] print:gap-4">
      {/* Interactive Timeline Dot - hidden in print */}
      <span 
        className="absolute -left-[33px] top-1.5 size-3.5 rounded-full border-2 border-card bg-muted transition-all duration-300 ring-2 ring-border/50 group-hover:scale-125 group-hover:bg-primary group-hover:ring-primary/30 print:hidden" 
        aria-hidden="true"
      />

      <div className="flex min-w-0 flex-col gap-3 print:gap-1.5">
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="text-lg font-bold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary print:text-[0.86rem]">
            {project.name}
          </h3>
          {project.isFeatured ? (
            <Badge className="rounded-full bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 text-[0.68rem] font-bold tracking-wide print:hidden">精选</Badge>
          ) : null}
        </div>

        {project.description ? (
          <p className="text-sm leading-7 text-muted-foreground/90 print:text-[0.72rem] print:leading-4">
            {project.description}
          </p>
        ) : null}

        {project.techStack.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 print:gap-1">
            {project.techStack.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="rounded-full border border-border/50 bg-muted/30 px-2.5 py-0.5 text-[0.7rem] font-medium text-muted-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-primary transition-all duration-300 print:border print:border-border print:bg-transparent print:px-1.5 print:py-0 print:text-[0.62rem]"
              >
                {tech}
              </Badge>
            ))}
          </div>
        ) : null}

        {project.highlights.length > 0 ? (
          <ul className="flex flex-col gap-2 text-sm leading-7 text-muted-foreground/90 print:gap-1 print:text-[0.72rem] print:leading-4">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2.5">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary/45 transition-colors duration-300 group-hover:bg-primary print:mt-1.5 print:size-1" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex flex-wrap gap-2 pt-1 print:hidden">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="group/btn cursor-pointer rounded-full border-border bg-card shadow-sm hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all duration-300"
          >
            <Link href={`/projects/${project.slug}`}>
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" aria-hidden="true" />
              查看详情
            </Link>
          </Button>
          {project.projectUrl ? (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="group/btn cursor-pointer rounded-full hover:bg-primary/5 hover:text-primary transition-all duration-300"
            >
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Globe2 className="size-3.5 transition-transform duration-300 group-hover/btn:rotate-12 group-hover/btn:scale-110" aria-hidden="true" />
                演示
              </a>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-2 sm:justify-end">
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary print:bg-transparent print:px-0 print:py-0 print:text-[0.68rem]">
          {project.role ?? "项目成员"}
        </span>
      </div>
    </article>
  );
}
