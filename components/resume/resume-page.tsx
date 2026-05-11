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
      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <ResumeHeader
          profile={resume.profile}
          links={resume.links}
          usingFallbackData={usingFallbackData}
        />

        {/* divider */}
        <div className="my-12 h-px bg-border" />

        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
          {/* main column */}
          <div className="flex min-w-0 flex-col gap-14">
            <ResumeSection eyebrow="Experience" title="工作经历">
              <div className="flex flex-col divide-y divide-border">
                {resume.workExperiences.map((experience) => (
                  <ExperienceCard
                    key={experience.id}
                    experience={experience}
                  />
                ))}
              </div>
            </ResumeSection>

            <ResumeSection eyebrow="Projects" title="项目经历">
              <div className="flex flex-col divide-y divide-border">
                {resume.projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </ResumeSection>
          </div>

          {/* sidebar */}
          <ResumeSidebar
            skillGroups={resume.skillGroups}
            education={resume.education}
            certifications={resume.certifications}
          />
        </div>

        <div className="my-12 h-px bg-border print:hidden" />
        <ContactSection profile={resume.profile} />
      </div>
    </main>
  );
}
