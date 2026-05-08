import { getSql } from "@/lib/db";
import type { Nullable } from "@/lib/resume/types";

export type ResumeRow = {
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

export type LinkRow = {
  id: string;
  label: string;
  url: string;
  icon: Nullable<string>;
  sort_order: number;
};

export type SkillGroupRow = {
  id: string;
  name: string;
  description: Nullable<string>;
  sort_order: number;
};

export type SkillItemRow = {
  id: string;
  group_id: string;
  name: string;
  level: Nullable<"familiar" | "proficient" | "expert">;
  keywords: unknown;
  sort_order: number;
};

export type WorkExperienceRow = {
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

export type ProjectRow = {
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

export type EducationRow = {
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

export type CertificationRow = {
  id: string;
  title: string;
  issuer: Nullable<string>;
  issued_on: unknown;
  credential_url: Nullable<string>;
  sort_order: number;
};

export type HealthRow = {
  database_name: string;
  database_user: string;
  server_time: string;
};

export type InsertedMessageRow = {
  id: string;
  created_at: unknown;
};

export type PublishedResumeIdRow = {
  id: string;
};

export type ContactMessageInsert = {
  resumeId: Nullable<string>;
  senderName: string;
  senderEmail: string;
  senderCompany: Nullable<string>;
  subject: Nullable<string>;
  message: string;
  source: string;
  userAgent: Nullable<string>;
};

export async function queryHealth(): Promise<Nullable<HealthRow>> {
  const rows = await queryRows<HealthRow>(
    `SELECT
      current_database() AS database_name,
      current_user AS database_user,
      NOW()::text AS server_time`,
  );

  return rows[0] ?? null;
}

export async function findPublishedResumeProfile(
  slug?: string,
): Promise<Nullable<ResumeRow>> {
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

  return rows[0] ?? null;
}

export async function findPublishedResumeId(
  slug?: string,
): Promise<Nullable<PublishedResumeIdRow>> {
  const rows = slug
    ? await queryRows<PublishedResumeIdRow>(
        `SELECT id
         FROM resumes
         WHERE slug = $1 AND is_published = true
         LIMIT 1`,
        [slug],
      )
    : await queryRows<PublishedResumeIdRow>(
        `SELECT id
         FROM resumes
         WHERE is_published = true
         ORDER BY created_at DESC
         LIMIT 1`,
      );

  return rows[0] ?? null;
}

export function listVisibleLinks(resumeId: string): Promise<LinkRow[]> {
  return queryRows<LinkRow>(
    `SELECT id, label, url, icon, sort_order
     FROM resume_links
     WHERE resume_id = $1 AND is_visible = true
     ORDER BY sort_order ASC, created_at ASC`,
    [resumeId],
  );
}

export function listVisibleSkillGroups(
  resumeId: string,
): Promise<SkillGroupRow[]> {
  return queryRows<SkillGroupRow>(
    `SELECT id, name, description, sort_order
     FROM skill_groups
     WHERE resume_id = $1 AND is_visible = true
     ORDER BY sort_order ASC, created_at ASC`,
    [resumeId],
  );
}

export function listVisibleSkillItems(
  resumeId: string,
): Promise<SkillItemRow[]> {
  return queryRows<SkillItemRow>(
    `SELECT i.id, i.group_id, i.name, i.level, i.keywords, i.sort_order
     FROM skill_items i
     INNER JOIN skill_groups g ON g.id = i.group_id
     WHERE g.resume_id = $1 AND g.is_visible = true AND i.is_visible = true
     ORDER BY g.sort_order ASC, i.sort_order ASC, i.created_at ASC`,
    [resumeId],
  );
}

export function listVisibleWorkExperiences(
  resumeId: string,
): Promise<WorkExperienceRow[]> {
  return queryRows<WorkExperienceRow>(
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
  );
}

export function listVisibleProjectsByResumeId(
  resumeId: string,
): Promise<ProjectRow[]> {
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

export function findVisibleProjectBySlug(
  resumeId: string,
  slug: string,
): Promise<ProjectRow[]> {
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
     WHERE resume_id = $1 AND slug = $2 AND is_visible = true
     LIMIT 1`,
    [resumeId, slug],
  );
}

export function listVisibleEducation(resumeId: string): Promise<EducationRow[]> {
  return queryRows<EducationRow>(
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
  );
}

export function listVisibleCertifications(
  resumeId: string,
): Promise<CertificationRow[]> {
  return queryRows<CertificationRow>(
    `SELECT id, title, issuer, issued_on, credential_url, sort_order
     FROM certifications
     WHERE resume_id = $1 AND is_visible = true
     ORDER BY sort_order ASC, issued_on DESC NULLS LAST, created_at ASC`,
    [resumeId],
  );
}

export async function insertContactMessage(
  input: ContactMessageInsert,
): Promise<Nullable<InsertedMessageRow>> {
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
      input.resumeId,
      input.senderName,
      input.senderEmail,
      input.senderCompany,
      input.subject,
      input.message,
      input.source,
      input.userAgent,
    ],
  );

  return rows[0] ?? null;
}

async function queryRows<T>(query: string, params?: unknown[]): Promise<T[]> {
  const sql = getSql();
  const rows = await sql.query(query, params);

  return rows as T[];
}
