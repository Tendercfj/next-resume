import * as resumeDao from "@/lib/dao/resume-dao";
import { InputValidationError, type Issues } from "@/lib/resume/errors";
import type {
  Certification,
  ContactMessageInput,
  ContactMessageResult,
  DatabaseHealth,
  Education,
  Nullable,
  PublishedResume,
  ResumeLink,
  ResumeProfile,
  ResumeProject,
  SkillGroup,
  SkillItem,
  WorkExperience,
} from "@/lib/resume/types";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

type NormalizedContactMessageInput = {
  senderName: string;
  senderEmail: string;
  senderCompany: Nullable<string>;
  subject: Nullable<string>;
  message: string;
  source: string;
  resumeSlug: Nullable<string>;
  userAgent: Nullable<string>;
};

export function isValidResumeSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const row = await resumeDao.queryHealth();

  if (!row) {
    throw new Error("Database health check returned no rows");
  }

  return {
    databaseName: row.database_name,
    databaseUser: row.database_user,
    serverTime: row.server_time,
  };
}

export async function getPublishedResume(
  slug?: string,
): Promise<Nullable<PublishedResume>> {
  const profile = await getPublishedResumeProfile(slug, "slug");

  if (!profile) {
    return null;
  }

  const resumeId = profile.id;
  const [
    linkRows,
    skillGroupRows,
    skillItemRows,
    workRows,
    projectRows,
    educationRows,
    certificationRows,
  ] = await Promise.all([
    resumeDao.listVisibleLinks(resumeId),
    resumeDao.listVisibleSkillGroups(resumeId),
    resumeDao.listVisibleSkillItems(resumeId),
    resumeDao.listVisibleWorkExperiences(resumeId),
    resumeDao.listVisibleProjectsByResumeId(resumeId),
    resumeDao.listVisibleEducation(resumeId),
    resumeDao.listVisibleCertifications(resumeId),
  ]);

  return {
    profile,
    links: linkRows.map(mapLink),
    skillGroups: mapSkillGroups(skillGroupRows, skillItemRows),
    workExperiences: workRows.map(mapWorkExperience),
    projects: projectRows.map(mapProject),
    education: educationRows.map(mapEducation),
    certifications: certificationRows.map(mapCertification),
  };
}

export async function listPublishedProjects(
  resumeSlug?: string,
): Promise<ResumeProject[]> {
  const profile = await getPublishedResumeProfile(resumeSlug, "resumeSlug");

  if (!profile) {
    return [];
  }

  const rows = await resumeDao.listVisibleProjectsByResumeId(profile.id);

  return rows.map(mapProject);
}

export async function getPublishedProjectBySlug(
  slug: string,
  resumeSlug?: string,
): Promise<Nullable<ResumeProject>> {
  const projectSlug = normalizeRequiredSlug(
    slug,
    "slug",
    "项目 slug 格式不正确",
  );
  const profile = await getPublishedResumeProfile(resumeSlug, "resumeSlug");

  if (!profile) {
    return null;
  }

  const rows = await resumeDao.findVisibleProjectBySlug(profile.id, projectSlug);

  return rows[0] ? mapProject(rows[0]) : null;
}

export async function createContactMessage(
  rawInput: ContactMessageInput,
): Promise<ContactMessageResult> {
  const input = normalizeContactMessageInput(rawInput);
  const resumeId = await resolvePublishedResumeId(input.resumeSlug);
  const row = await resumeDao.insertContactMessage({
    resumeId,
    senderName: input.senderName,
    senderEmail: input.senderEmail,
    senderCompany: input.senderCompany,
    subject: input.subject,
    message: input.message,
    source: input.source,
    userAgent: input.userAgent,
  });

  if (!row) {
    throw new Error("Contact message insert returned no rows");
  }

  return {
    id: row.id,
    createdAt: toDateString(row.created_at) ?? "",
  };
}

async function getPublishedResumeProfile(
  rawSlug: string | undefined,
  issueField: "slug" | "resumeSlug",
): Promise<Nullable<ResumeProfile>> {
  const slug = normalizeOptionalResumeSlug(rawSlug, issueField);
  const row = await resumeDao.findPublishedResumeProfile(slug);

  return row ? mapProfile(row) : null;
}

async function resolvePublishedResumeId(
  resumeSlug: Nullable<string>,
): Promise<Nullable<string>> {
  const row = await resumeDao.findPublishedResumeId(resumeSlug ?? undefined);

  if (resumeSlug && !row) {
    throw new InputValidationError({ resumeSlug: "没有找到已发布简历" });
  }

  return row?.id ?? null;
}

function normalizeOptionalResumeSlug(
  slug: string | undefined,
  issueField: "slug" | "resumeSlug",
): string | undefined {
  const normalized = slug?.trim();

  if (!normalized) {
    return undefined;
  }

  if (!isValidResumeSlug(normalized)) {
    throw new InputValidationError({
      [issueField]: "简历 slug 格式不正确",
    });
  }

  return normalized;
}

function normalizeRequiredSlug(
  slug: string,
  issueField: string,
  message: string,
): string {
  const normalized = slug.trim();

  if (!normalized || !isValidResumeSlug(normalized)) {
    throw new InputValidationError({ [issueField]: message });
  }

  return normalized;
}

function normalizeContactMessageInput(
  rawInput: ContactMessageInput,
): NormalizedContactMessageInput {
  const issues: Issues = {};
  const senderName = readRequiredString(
    rawInput.senderName,
    "senderName",
    "姓名",
    120,
    issues,
  );
  const senderEmail = readRequiredString(
    rawInput.senderEmail,
    "senderEmail",
    "邮箱",
    254,
    issues,
  );
  const message = readRequiredString(
    rawInput.message,
    "message",
    "消息内容",
    5000,
    issues,
  );
  const senderCompany = readOptionalString(
    rawInput.senderCompany,
    "senderCompany",
    "公司或来源",
    160,
    issues,
  );
  const subject = readOptionalString(
    rawInput.subject,
    "subject",
    "主题",
    200,
    issues,
  );
  const resumeSlug = readOptionalString(
    rawInput.resumeSlug,
    "resumeSlug",
    "简历 slug",
    100,
    issues,
  );
  const source =
    readOptionalString(rawInput.source, "source", "来源", 80, issues) ??
    "resume_site";
  const userAgent = readOptionalString(
    rawInput.userAgent,
    "userAgent",
    "User-Agent",
    500,
    issues,
  );

  if (senderEmail && !EMAIL_PATTERN.test(senderEmail)) {
    issues.senderEmail = "邮箱格式不正确";
  }

  if (resumeSlug && !isValidResumeSlug(resumeSlug)) {
    issues.resumeSlug = "简历 slug 格式不正确";
  }

  if (Object.keys(issues).length > 0) {
    throw new InputValidationError(issues);
  }

  return {
    senderName,
    senderEmail,
    senderCompany,
    subject,
    message,
    source,
    resumeSlug,
    userAgent,
  };
}

function readRequiredString(
  value: unknown,
  field: string,
  label: string,
  maxLength: number,
  issues: Issues,
): string {
  if (typeof value !== "string") {
    issues[field] = `${label}不能为空`;
    return "";
  }

  const trimmed = value.trim();

  if (!trimmed) {
    issues[field] = `${label}不能为空`;
  } else if (trimmed.length > maxLength) {
    issues[field] = `${label}不能超过 ${maxLength} 个字符`;
  }

  return trimmed;
}

function readOptionalString(
  value: unknown,
  field: string,
  label: string,
  maxLength: number,
  issues: Issues,
): Nullable<string> {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    issues[field] = `${label}格式不正确`;
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.length > maxLength) {
    issues[field] = `${label}不能超过 ${maxLength} 个字符`;
  }

  return trimmed;
}

function mapProfile(row: resumeDao.ResumeRow): ResumeProfile {
  return {
    id: row.id,
    slug: row.slug,
    locale: row.locale,
    title: row.title,
    ownerName: row.owner_name,
    headline: row.headline,
    summary: row.summary,
    avatarUrl: row.avatar_url,
    location: row.location,
    email: row.email,
    phone: row.phone,
    websiteUrl: row.website_url,
    githubUrl: row.github_url,
    linkedinUrl: row.linkedin_url,
    createdAt: toDateString(row.created_at) ?? "",
    updatedAt: toDateString(row.updated_at) ?? "",
  };
}

function mapLink(row: resumeDao.LinkRow): ResumeLink {
  return {
    id: row.id,
    label: row.label,
    url: row.url,
    icon: row.icon,
    sortOrder: row.sort_order,
  };
}

function mapSkillGroups(
  groupRows: resumeDao.SkillGroupRow[],
  itemRows: resumeDao.SkillItemRow[],
): SkillGroup[] {
  const itemsByGroupId = new Map<string, SkillItem[]>();

  for (const row of itemRows) {
    const items = itemsByGroupId.get(row.group_id) ?? [];

    items.push({
      id: row.id,
      name: row.name,
      level: row.level,
      keywords: toStringArray(row.keywords),
      sortOrder: row.sort_order,
    });
    itemsByGroupId.set(row.group_id, items);
  }

  return groupRows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    sortOrder: row.sort_order,
    items: itemsByGroupId.get(row.id) ?? [],
  }));
}

function mapWorkExperience(
  row: resumeDao.WorkExperienceRow,
): WorkExperience {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    location: row.location,
    employmentType: row.employment_type,
    startDate: toDateString(row.start_date),
    endDate: toDateString(row.end_date),
    isCurrent: row.is_current,
    summary: row.summary,
    highlights: toStringArray(row.highlights),
    sortOrder: row.sort_order,
  };
}

function mapProject(row: resumeDao.ProjectRow): ResumeProject {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    role: row.role,
    description: row.description,
    techStack: toStringArray(row.tech_stack),
    highlights: toStringArray(row.highlights),
    projectUrl: row.project_url,
    sourceUrl: row.source_url,
    startDate: toDateString(row.start_date),
    endDate: toDateString(row.end_date),
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
  };
}

function mapEducation(row: resumeDao.EducationRow): Education {
  return {
    id: row.id,
    school: row.school,
    degree: row.degree,
    major: row.major,
    location: row.location,
    startDate: toDateString(row.start_date),
    endDate: toDateString(row.end_date),
    description: row.description,
    sortOrder: row.sort_order,
  };
}

function mapCertification(row: resumeDao.CertificationRow): Certification {
  return {
    id: row.id,
    title: row.title,
    issuer: row.issuer,
    issuedOn: toDateString(row.issued_on),
    credentialUrl: row.credential_url,
    sortOrder: row.sort_order,
  };
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  return [];
}

function toDateString(value: unknown): Nullable<string> {
  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  return String(value);
}
