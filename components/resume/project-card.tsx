import Link from "next/link";
import { ArrowUpRight, Globe2 } from "lucide-react";

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
import type { ResumeProject } from "@/lib/resume/types";

type ProjectCardProps = {
  project: ResumeProject;
};

export function ProjectCard({ project }: ProjectCardProps) {
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
