import { fallbackResume } from "@/lib/fallback-resume";
import type { PublishedResume } from "@/lib/resume/types";

export function withFallbackSections(resume: PublishedResume): PublishedResume {
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
