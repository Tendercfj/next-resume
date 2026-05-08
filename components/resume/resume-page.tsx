import { ContactSection } from "@/components/resume/contact-section";
import { ExperienceCard } from "@/components/resume/experience-card";
import { ProjectCard } from "@/components/resume/project-card";
import { ResumeHeader } from "@/components/resume/resume-header";
import { ResumeSection } from "@/components/resume/resume-section";
import { ResumeSidebar } from "@/components/resume/resume-sidebar";
import type { PublishedResume } from "@/lib/resume/types";

type ResumePageProps = {
  resume: PublishedResume;
  usingFallbackData: boolean;
};

export function ResumePage({ resume, usingFallbackData }: ResumePageProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <ResumeHeader
          profile={resume.profile}
          links={resume.links}
          usingFallbackData={usingFallbackData}
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-w-0 flex-col gap-12">
            <ResumeSection
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
            </ResumeSection>

            <ResumeSection
              eyebrow="Projects"
              title="项目经历"
              description="精选项目优先展示，详情页承接更完整的项目上下文。"
            >
              <div className="grid gap-4 md:grid-cols-2">
                {resume.projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </ResumeSection>
          </div>

          <ResumeSidebar
            skillGroups={resume.skillGroups}
            education={resume.education}
            certifications={resume.certifications}
          />
        </div>

        <ContactSection profile={resume.profile} />
      </div>
    </main>
  );
}
