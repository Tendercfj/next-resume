import type { ResumeLink, ResumeProfile } from "@/lib/resume/types";

export function getProfileLinks(
  profile: ResumeProfile,
  links: ResumeLink[],
) {
  const directLinks: ResumeLink[] = [
    profile.websiteUrl
      ? {
          id: "profile-website",
          label: "个人网站",
          url: profile.websiteUrl,
          icon: "website",
          sortOrder: 0,
        }
      : null,
    profile.githubUrl
      ? {
          id: "profile-github",
          label: "GitHub",
          url: profile.githubUrl,
          icon: "github",
          sortOrder: 1,
        }
      : null,
    profile.linkedinUrl
      ? {
          id: "profile-linkedin",
          label: "LinkedIn",
          url: profile.linkedinUrl,
          icon: "linkedin",
          sortOrder: 2,
        }
      : null,
  ].filter(Boolean) as ResumeLink[];

  const seen = new Set<string>();

  return [...directLinks, ...links]
    .filter((link) => {
      if (seen.has(link.url)) {
        return false;
      }

      seen.add(link.url);
      return true;
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
