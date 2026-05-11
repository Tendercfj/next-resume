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
  const featuredProjects = resume.projects.filter((project) => project.isFeatured);
  const projects =
    featuredProjects.length > 0 ? featuredProjects : resume.projects.slice(0, 3);

  return (
    <main className="resume-print-shell min-h-screen bg-muted/40 px-4 py-5 text-foreground transition-colors sm:px-6 sm:py-10 dark:bg-[#050504] print:min-h-0 print:bg-white print:p-0">
      <article className="resume-print-sheet mx-auto w-full max-w-6xl rounded-[1.5rem] bg-background px-5 py-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-border/80 transition-colors sm:px-9 sm:py-10 lg:px-12 lg:py-12 dark:bg-[#10100e] dark:shadow-[0_24px_90px_rgba(0,0,0,0.5)] dark:ring-white/10 print:max-w-none print:rounded-none print:bg-white print:px-0 print:py-0 print:text-black print:shadow-none print:ring-0">
        <ResumeHeader
          profile={resume.profile}
          links={resume.links}
          usingFallbackData={usingFallbackData}
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-12 print:mt-5 print:grid-cols-[minmax(0,1fr)_14rem] print:gap-5">
          <div className="flex min-w-0 flex-col gap-9 print:gap-5">
            <ResumeSection
              eyebrow="Profile"
              title="职业简介"
              description="Concise introduction"
            >
              <p className="max-w-3xl text-[0.98rem] leading-8 text-muted-foreground whitespace-pre-wrap print:text-[0.82rem] print:leading-5">
                {resume.profile.summary}
              </p>
            </ResumeSection>

            <ResumeSection eyebrow="Work Experience" title="工作经历">
              <div className="flex flex-col divide-y divide-border">
                {resume.workExperiences.map((experience) => (
                  <ExperienceCard
                    key={experience.id}
                    experience={experience}
                  />
                ))}
              </div>
            </ResumeSection>

            <ResumeSection eyebrow="Portfolio" title="代表项目">
              <div className="flex flex-col divide-y divide-border">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </ResumeSection>
          </div>

          <ResumeSidebar
            profile={resume.profile}
            links={resume.links}
            skillGroups={resume.skillGroups}
            education={resume.education}
            certifications={resume.certifications}
          />
        </div>

        <div className="my-10 h-px bg-border print:hidden" />
        <ContactSection profile={resume.profile} />
      </article>
    </main>
  );
}
