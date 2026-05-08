import { ResumePage } from "@/components/resume/resume-page";
import { fallbackResume } from "@/lib/fallback-resume";
import { withFallbackSections } from "@/lib/resume/normalizers";
import type { PublishedResume } from "@/lib/resume/types";
import { getPublishedResume } from "@/lib/services/resume-service";

export const dynamic = "force-dynamic";

type ResumePageData = {
  resume: PublishedResume;
  usingFallbackData: boolean;
};

export default async function Page() {
  const { resume, usingFallbackData } = await loadResume();

  return <ResumePage resume={resume} usingFallbackData={usingFallbackData} />;
}

async function loadResume(): Promise<ResumePageData> {
  try {
    const resume = await getPublishedResume();

    if (!resume) {
      return {
        resume: fallbackResume,
        usingFallbackData: true,
      };
    }

    return {
      resume: withFallbackSections(resume),
      usingFallbackData: false,
    };
  } catch (error) {
    console.error("Failed to load resume for page", error);

    return {
      resume: fallbackResume,
      usingFallbackData: true,
    };
  }
}
