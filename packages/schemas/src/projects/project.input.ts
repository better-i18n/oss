
import { z } from 'zod';

/**
 * Schema for creating a new project.
 */
export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100, "Project name must be less than 100 characters"),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .min(1, "Slug is required")
    .max(50, "Slug must be less than 50 characters"),
  sourceLanguage: z.string().length(2, "Invalid language code"),
  organizationId: z.string().uuid("Invalid organization ID"),
});

/**
 * Schema for updating a project.
 */
export const updateProjectSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
  name: z.string().min(1).max(100).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  sourceLanguage: z.string().length(2, "Invalid language code").optional(),
  autoTranslate: z.boolean().optional(),
  aiSystemPrompt: z.string().max(2000, "System prompt must be less than 2000 characters").optional().nullable(),
});

/**
 * Schema for project list query.
 */
export const listProjectsSchema = z.object({
  organizationId: z.string().uuid("Invalid organization ID"),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  search: z.string().optional(),
});

/**
 * Schema for getting a project by ID.
 */
export const getProjectSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
});

/**
 * Schema for getting a project by slug.
 */
export const getProjectBySlugSchema = z.object({
  organizationId: z.string().uuid("Invalid organization ID"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Invalid project slug"),
});

/**
 * Schema for deleting a project.
 */
export const deleteProjectSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
});

/**
 * Schema for adding a target language to a project.
 * Status defaults to "active" for manual adds, but AI adds can specify "draft".
 */
export const addTargetLanguageSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
  languageCode: z.string().length(2, "Invalid language code"),
  status: z.enum(["active", "draft"]).default("active").optional(),
});

/**
 * Schema for removing a target language from a project.
 */
export const removeTargetLanguageSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
  languageCode: z.string().length(2, "Invalid language code"),
});

/**
 * Language status for publish workflow:
 * - "active": Visible in editor AND published to CDN
 * - "draft": Visible in editor BUT excluded from CDN publish
 * - "archived": Hidden from editor AND excluded from publish
 */
export const languageStatusEnum = z.enum(["active", "draft", "archived"]);

/**
 * Schema for updating a target language's status.
 * Replaces the old boolean disabled field with a three-state enum.
 */
export const updateTargetLanguageStatusSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
  languageCode: z.string().length(2, "Invalid language code"),
  status: languageStatusEnum,
});

/**
 * @deprecated Use updateTargetLanguageStatusSchema instead
 * Kept for backward compatibility during migration
 */
export const toggleTargetLanguageSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
  languageCode: z.string().length(2, "Invalid language code"),
  disabled: z.boolean(),
});

/**
 * Schema for checking project slug availability within an organization.
 */
export const checkProjectSlugAvailabilitySchema = z.object({
  organizationId: z.string().uuid("Invalid organization ID"),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, {
    message: "Slug can only contain lowercase letters, numbers, and hyphens",
  }),
});

/**
 * Schema for getting project target languages.
 */
export const getTargetLanguagesSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
});

// Type exports
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ListProjectsInput = z.infer<typeof listProjectsSchema>;
export type GetProjectInput = z.infer<typeof getProjectSchema>;
export type GetProjectBySlugInput = z.infer<typeof getProjectBySlugSchema>;
export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>;
export type AddTargetLanguageInput = z.infer<typeof addTargetLanguageSchema>;
export type RemoveTargetLanguageInput = z.infer<typeof removeTargetLanguageSchema>;
export type ToggleTargetLanguageInput = z.infer<typeof toggleTargetLanguageSchema>;
export type UpdateTargetLanguageStatusInput = z.infer<typeof updateTargetLanguageStatusSchema>;
export type LanguageStatus = z.infer<typeof languageStatusEnum>;
export type GetTargetLanguagesInput = z.infer<typeof getTargetLanguagesSchema>;


