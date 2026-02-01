
import { z } from 'zod';

/**
 * Schema for listing GitHub repositories from an installation.
 */
export const listRepositoriesSchema = z.object({
  installationId: z.number(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(30),
  type: z.enum(["all", "public", "private"]).default("all"),
  sort: z
    .enum(["created", "updated", "pushed", "full_name"])
    .default("updated"),
  direction: z.enum(["asc", "desc"]).default("desc"),
});

/**
 * Schema for getting a specific GitHub repository.
 */
export const getRepositorySchema = z.object({
  installationId: z.number(),
  owner: z.string().min(1),
  repo: z.string().min(1),
});

/**
 * Schema for adding a GitHub repository to a project.
 */
export const addRepositorySchema = z.object({
  projectId: z.string().uuid(),
  installationId: z.number(),
  owner: z.string().min(1),
  repo: z.string().min(1),
  path: z.string().default(""),
  pattern: z.string().default(""),
  format: z.enum(["JSON_FLAT", "JSON_NAMESPACED"]).default("JSON_FLAT"),
  branch: z.string().optional(),
  targetBranch: z.string().default("i18n-sync"),
  autoPushToSourceBranch: z.boolean().default(false),
});

/**
 * Schema for updating a GitHub repository.
 */
export const updateRepositorySchema = z.object({
  repositoryId: z.string().uuid(),
  path: z.string().optional(),
  pattern: z.string().optional(),
  format: z.enum(["JSON_FLAT", "JSON_NAMESPACED"]).optional(),
  branch: z.string().optional(),
  targetBranch: z.string().optional(),
  enabled: z.boolean().optional(),
  autoPushToSourceBranch: z.boolean().optional(),
});

/**
 * Schema for removing a GitHub repository from a project.
 */
export const removeRepositorySchema = z.object({
  repositoryId: z.string().uuid(),
});

/**
 * Schema for syncing a GitHub repository.
 */
export const syncRepositorySchema = z.object({
  repositoryId: z.string().uuid(),
});

/**
 * Schema for GitHub OAuth callback.
 */
export const oauthCallbackSchema = z.object({
  code: z.string().min(1),
  state: z.string().optional(),
  installation_id: z.string().optional(), // GitHub App installation ID (as string)
});

/**
 * Schema for listing GitHub repository branches.
 */
export const listBranchesSchema = z.object({
  installationId: z.number(),
  owner: z.string().min(1),
  repo: z.string().min(1),
});

/**
 * Schema for getting GitHub repository tree.
 */
export const getTreeSchema = z.object({
  installationId: z.number(),
  owner: z.string().min(1),
  repo: z.string().min(1),
  branch: z.string().min(1),
  path: z.string().default(""),
});

/**
 * Schema for getting source files from a repository.
 */
export const getSourceFilesSchema = z.object({
  repositoryId: z.string().uuid(),
});

/**
 * Types for GitHub repository operations.
 */
export type ListRepositoriesInput = z.infer<typeof listRepositoriesSchema>;
export type GetRepositoryInput = z.infer<typeof getRepositorySchema>;
export type AddRepositoryInput = z.infer<typeof addRepositorySchema>;
export type UpdateRepositoryInput = z.infer<typeof updateRepositorySchema>;
export type RemoveRepositoryInput = z.infer<typeof removeRepositorySchema>;
export type SyncRepositoryInput = z.infer<typeof syncRepositorySchema>;
export type OAuthCallbackInput = z.infer<typeof oauthCallbackSchema>;
export type ListBranchesInput = z.infer<typeof listBranchesSchema>;
export type GetTreeInput = z.infer<typeof getTreeSchema>;
export type GetSourceFilesInput = z.infer<typeof getSourceFilesSchema>;
