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
    <main className="resume-print-shell relative min-h-screen overflow-hidden bg-background/50 px-4 py-6 text-foreground transition-colors sm:px-6 sm:py-12 print:min-h-0 print:bg-white print:p-0">
      {/* Premium ambient glow backdrops - hidden in print */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-between overflow-hidden opacity-40 blur-[120px] dark:opacity-30 print:hidden">
        <div className="h-[400px] w-[400px] -translate-x-[20%] -translate-y-[20%] rounded-full bg-primary/15" />
        <div className="h-[350px] w-[350px] translate-x-[20%] -translate-y-[10%] rounded-full bg-primary/10" />
      </div>

      <article className="resume-print-sheet mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both rounded-[2rem] bg-card px-5 py-8 shadow-[0_32px_96px_rgba(15,23,42,0.06)] ring-1 ring-border/50 transition-colors sm:px-10 sm:py-12 lg:px-14 lg:py-14 dark:shadow-[0_32px_96px_rgba(0,0,0,0.35)] dark:ring-white/5 print:max-w-none print:rounded-none print:bg-white print:px-0 print:py-0 print:text-black print:shadow-none print:ring-0">
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
              <div className="relative ml-3.5 flex flex-col gap-8 border-l border-border/60 pl-6 py-1.5 print:ml-0 print:border-l-0 print:pl-0 print:gap-4">
                {resume.workExperiences.map((experience) => (
                  <ExperienceCard
                    key={experience.id}
                    experience={experience}
                  />
                ))}
              </div>
            </ResumeSection>

            <ResumeSection eyebrow="Portfolio" title="代表项目">
              <div className="relative ml-3.5 flex flex-col gap-8 border-l border-border/60 pl-6 py-1.5 print:ml-0 print:border-l-0 print:pl-0 print:gap-4">
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
