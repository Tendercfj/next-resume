export type Nullable<T> = T | null;

export type ResumeProfile = {
  id: string;
  slug: string;
  locale: string;
  title: string;
  ownerName: string;
  headline: Nullable<string>;
  summary: Nullable<string>;
  avatarUrl: Nullable<string>;
  location: Nullable<string>;
  email: Nullable<string>;
  phone: Nullable<string>;
  websiteUrl: Nullable<string>;
  githubUrl: Nullable<string>;
  linkedinUrl: Nullable<string>;
  createdAt: string;
  updatedAt: string;
};

export type ResumeLink = {
  id: string;
  label: string;
  url: string;
  icon: Nullable<string>;
  sortOrder: number;
};

export type SkillItem = {
  id: string;
  name: string;
  level: Nullable<"familiar" | "proficient" | "expert">;
  keywords: string[];
  sortOrder: number;
};

export type SkillGroup = {
  id: string;
  name: string;
  description: Nullable<string>;
  sortOrder: number;
  items: SkillItem[];
};

export type WorkExperience = {
  id: string;
  company: string;
  role: string;
  location: Nullable<string>;
  employmentType: Nullable<string>;
  startDate: Nullable<string>;
  endDate: Nullable<string>;
  isCurrent: boolean;
  summary: Nullable<string>;
  highlights: string[];
  sortOrder: number;
};

export type ResumeProject = {
  id: string;
  slug: string;
  name: string;
  role: Nullable<string>;
  description: Nullable<string>;
  techStack: string[];
  highlights: string[];
  projectUrl: Nullable<string>;
  sourceUrl: Nullable<string>;
  startDate: Nullable<string>;
  endDate: Nullable<string>;
  isFeatured: boolean;
  sortOrder: number;
};

export type Education = {
  id: string;
  school: string;
  degree: Nullable<string>;
  major: Nullable<string>;
  location: Nullable<string>;
  startDate: Nullable<string>;
  endDate: Nullable<string>;
  description: Nullable<string>;
  sortOrder: number;
};

export type Certification = {
  id: string;
  title: string;
  issuer: Nullable<string>;
  issuedOn: Nullable<string>;
  credentialUrl: Nullable<string>;
  sortOrder: number;
};

export type PublishedResume = {
  profile: ResumeProfile;
  links: ResumeLink[];
  skillGroups: SkillGroup[];
  workExperiences: WorkExperience[];
  projects: ResumeProject[];
  education: Education[];
  certifications: Certification[];
};

export type DatabaseHealth = {
  databaseName: string;
  databaseUser: string;
  serverTime: string;
};

export type ContactMessageInput = {
  senderName: unknown;
  senderEmail: unknown;
  senderCompany?: unknown;
  subject?: unknown;
  message: unknown;
  source?: unknown;
  resumeSlug?: unknown;
  userAgent?: unknown;
};

export type ContactMessageResult = {
  id: string;
  createdAt: string;
};
