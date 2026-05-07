import { getSql } from "@/lib/db";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

type Nullable<T> = T | null;
type Issues = Record<string, string>;

type ResumeRow = {
  id: string;
  slug: string;
  locale: string;
  title: string;
  owner_name: string;
  headline: Nullable<string>;
  summary: Nullable<string>;
  avatar_url: Nullable<string>;
  location: Nullable<string>;
  email: Nullable<string>;
  phone: Nullable<string>;
  website_url: Nullable<string>;
  github_url: Nullable<string>;
  linkedin_url: Nullable<string>;
  created_at: unknown;
  updated_at: unknown;
};

type LinkRow = {
  id: string;
  label: string;
  url: string;
  icon: Nullable<string>;
  sort_order: number;
};

type SkillGroupRow = {
  id: string;
  name: string;
  description: Nullable<string>;
  sort_order: number;
};

type SkillItemRow = {
  id: string;
  group_id: string;
  name: string;
  level: Nullable<"familiar" | "proficient" | "expert">;
  keywords: unknown;
  sort_order: number;
};

type WorkExperienceRow = {
  id: string;
  company: string;
  role: string;
  location: Nullable<string>;
  employment_type: Nullable<string>;
  start_date: unknown;
  end_date: unknown;
  is_current: boolean;
  summary: Nullable<string>;
  highlights: unknown;
  sort_order: number;
};

type ProjectRow = {
  id: string;
  slug: string;
  name: string;
  role: Nullable<string>;
  description: Nullable<string>;
  tech_stack: unknown;
  highlights: unknown;
  project_url: Nullable<string>;
  source_url: Nullable<string>;
  start_date: unknown;
  end_date: unknown;
  is_featured: boolean;
  sort_order: number;
};

type EducationRow = {
  id: string;
  school: string;
  degree: Nullable<string>;
  major: Nullable<string>;
  location: Nullable<string>;
  start_date: unknown;
  end_date: unknown;
  description: Nullable<string>;
  sort_order: number;
};

type CertificationRow = {
  id: string;
  title: string;
  issuer: Nullable<string>;
  issued_on: unknown;
  credential_url: Nullable<string>;
  sort_order: number;
};

type HealthRow = {
  database_name: string;
  database_user: string;
  server_time: string;
};

type InsertedMessageRow = {
  id: string;
  created_at: unknown;
};

type PublishedResumeIdRow = {
  id: string;
};

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

export class InputValidationError extends Error {
  issues: Issues;

  constructor(issues: Issues) {
    super("Invalid input");
    this.name = "InputValidationError";
    this.issues = issues;
  }
}

export function isInputValidationError(
  error: unknown,
): error is InputValidationError {
  return error instanceof InputValidationError;
}

export function isValidResumeSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

export async function checkDatabaseHealth() {
  const rows = await queryRows<HealthRow>(
    `SELECT
      current_database() AS database_name,
      current_user AS database_user,
      NOW()::text AS server_time`,
  );
  const row = rows[0];

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
  const profile = await getPublishedResumeProfile(slug);

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
    queryRows<LinkRow>(
      `SELECT id, label, url, icon, sort_order
       FROM resume_links
       WHERE resume_id = $1 AND is_visible = true
       ORDER BY sort_order ASC, created_at ASC`,
      [resumeId],
    ),
    queryRows<SkillGroupRow>(
      `SELECT id, name, description, sort_order
       FROM skill_groups
       WHERE resume_id = $1 AND is_visible = true
       ORDER BY sort_order ASC, created_at ASC`,
      [resumeId],
    ),
    queryRows<SkillItemRow>(
      `SELECT i.id, i.group_id, i.name, i.level, i.keywords, i.sort_order
       FROM skill_items i
       INNER JOIN skill_groups g ON g.id = i.group_id
       WHERE g.resume_id = $1 AND g.is_visible = true AND i.is_visible = true
       ORDER BY g.sort_order ASC, i.sort_order ASC, i.created_at ASC`,
      [resumeId],
    ),
    queryRows<WorkExperienceRow>(
      `SELECT
         id,
         company,
         role,
         location,
         employment_type,
         start_date,
         end_date,
         is_current,
         summary,
         highlights,
         sort_order
       FROM work_experiences
       WHERE resume_id = $1 AND is_visible = true
       ORDER BY sort_order ASC, start_date DESC NULLS LAST, created_at ASC`,
      [resumeId],
    ),
    queryProjectsByResumeId(resumeId),
    queryRows<EducationRow>(
      `SELECT
         id,
         school,
         degree,
         major,
         location,
         start_date,
         end_date,
         description,
         sort_order
       FROM education
       WHERE resume_id = $1 AND is_visible = true
       ORDER BY sort_order ASC, start_date DESC NULLS LAST, created_at ASC`,
      [resumeId],
    ),
    queryRows<CertificationRow>(
      `SELECT id, title, issuer, issued_on, credential_url, sort_order
       FROM certifications
       WHERE resume_id = $1 AND is_visible = true
       ORDER BY sort_order ASC, issued_on DESC NULLS LAST, created_at ASC`,
      [resumeId],
    ),
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
  const profile = await getPublishedResumeProfile(resumeSlug);

  if (!profile) {
    return [];
  }

  const rows = await queryProjectsByResumeId(profile.id);

  return rows.map(mapProject);
}

export async function getPublishedProjectBySlug(
  slug: string,
  resumeSlug?: string,
): Promise<Nullable<ResumeProject>> {
  if (!isValidResumeSlug(slug)) {
    throw new InputValidationError({ slug: "项目 slug 格式不正确" });
  }

  const profile = await getPublishedResumeProfile(resumeSlug);

  if (!profile) {
    return null;
  }

  const rows = await queryRows<ProjectRow>(
    `SELECT
       id,
       slug,
       name,
       role,
       description,
       tech_stack,
       highlights,
       project_url,
       source_url,
       start_date,
       end_date,
       is_featured,
       sort_order
     FROM projects
     WHERE resume_id = $1 AND slug = $2 AND is_visible = true
     LIMIT 1`,
    [profile.id, slug],
  );

  return rows[0] ? mapProject(rows[0]) : null;
}

export async function createContactMessage(
  rawInput: ContactMessageInput,
): Promise<ContactMessageResult> {
  const input = normalizeContactMessageInput(rawInput);
  const resumeId = await resolvePublishedResumeId(input.resumeSlug);
  const rows = await queryRows<InsertedMessageRow>(
    `INSERT INTO contact_messages (
       resume_id,
       sender_name,
       sender_email,
       sender_company,
       subject,
       message,
       source,
       user_agent
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, created_at`,
    [
      resumeId,
      input.senderName,
      input.senderEmail,
      input.senderCompany,
      input.subject,
      input.message,
      input.source,
      input.userAgent,
    ],
  );
  const row = rows[0];

  if (!row) {
    throw new Error("Contact message insert returned no rows");
  }

  return {
    id: row.id,
    createdAt: toDateString(row.created_at) ?? "",
  };
}

export function contactInputFromFormData(
  formData: FormData,
): ContactMessageInput {
  return {
    senderName: formData.get("senderName") ?? formData.get("name"),
    senderEmail: formData.get("senderEmail") ?? formData.get("email"),
    senderCompany: formData.get("senderCompany") ?? formData.get("company"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    resumeSlug: formData.get("resumeSlug"),
    source: "resume_site",
  };
}

function normalizeContactMessageInput(rawInput: ContactMessageInput) {
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

async function getPublishedResumeProfile(
  slug?: string,
): Promise<Nullable<ResumeProfile>> {
  if (slug && !isValidResumeSlug(slug)) {
    throw new InputValidationError({ slug: "简历 slug 格式不正确" });
  }

  const rows = slug
    ? await queryRows<ResumeRow>(
        `SELECT
           id,
           slug,
           locale,
           title,
           owner_name,
           headline,
           summary,
           avatar_url,
           location,
           email,
           phone,
           website_url,
           github_url,
           linkedin_url,
           created_at,
           updated_at
         FROM resumes
         WHERE slug = $1 AND is_published = true
         LIMIT 1`,
        [slug],
      )
    : await queryRows<ResumeRow>(
        `SELECT
           id,
           slug,
           locale,
           title,
           owner_name,
           headline,
           summary,
           avatar_url,
           location,
           email,
           phone,
           website_url,
           github_url,
           linkedin_url,
           created_at,
           updated_at
         FROM resumes
         WHERE is_published = true
         ORDER BY created_at DESC
         LIMIT 1`,
      );

  return rows[0] ? mapProfile(rows[0]) : null;
}

async function resolvePublishedResumeId(
  resumeSlug: Nullable<string>,
): Promise<Nullable<string>> {
  const rows = resumeSlug
    ? await queryRows<PublishedResumeIdRow>(
        `SELECT id
         FROM resumes
         WHERE slug = $1 AND is_published = true
         LIMIT 1`,
        [resumeSlug],
      )
    : await queryRows<PublishedResumeIdRow>(
        `SELECT id
         FROM resumes
         WHERE is_published = true
         ORDER BY created_at DESC
         LIMIT 1`,
      );

  if (resumeSlug && !rows[0]) {
    throw new InputValidationError({ resumeSlug: "没有找到已发布简历" });
  }

  return rows[0]?.id ?? null;
}

function queryProjectsByResumeId(resumeId: string): Promise<ProjectRow[]> {
  return queryRows<ProjectRow>(
    `SELECT
       id,
       slug,
       name,
       role,
       description,
       tech_stack,
       highlights,
       project_url,
       source_url,
       start_date,
       end_date,
       is_featured,
       sort_order
     FROM projects
     WHERE resume_id = $1 AND is_visible = true
     ORDER BY is_featured DESC, sort_order ASC, start_date DESC NULLS LAST, created_at ASC`,
    [resumeId],
  );
}

async function queryRows<T>(query: string, params?: unknown[]): Promise<T[]> {
  const sql = getSql();
  const rows = await sql.query(query, params);

  return rows as T[];
}

function mapProfile(row: ResumeRow): ResumeProfile {
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

function mapLink(row: LinkRow): ResumeLink {
  return {
    id: row.id,
    label: row.label,
    url: row.url,
    icon: row.icon,
    sortOrder: row.sort_order,
  };
}

function mapSkillGroups(
  groupRows: SkillGroupRow[],
  itemRows: SkillItemRow[],
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

function mapWorkExperience(row: WorkExperienceRow): WorkExperience {
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

function mapProject(row: ProjectRow): ResumeProject {
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

function mapEducation(row: EducationRow): Education {
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

function mapCertification(row: CertificationRow): Certification {
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
