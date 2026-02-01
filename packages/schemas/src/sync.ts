import { z } from 'zod';

/**
 * Schema for triggering a sync operation.
 */
export const triggerSyncSchema = z.object({
  repositoryId: z.string().uuid("Invalid repository ID"),
  projectId: z.string().uuid("Invalid project ID"),
  /**
   * Optional: Only sync specific translation keys (incremental sync).
   * When provided, only these keys will be translated instead of full repository sync.
   * This is much faster and more quota-friendly for single key additions.
   */
  newKeyIds: z.array(z.string().uuid()).optional(),
  /**
   * Optional: Type of sync job to create.
   * - source_sync: Sync source keys from GitHub to DB (default)
   * - publish: Generate translation files from DB and push to GitHub (create PR)
   * - initial_import: Fast initial import of source keys only
   * - bulk_translate: Translate existing keys without importing
   */
  jobType: z.enum(["source_sync", "publish", "initial_import", "bulk_translate"]).optional().default("source_sync"),
});

/**
 * Schema for getting sync status.
 */
export const getSyncStatusSchema = z.object({
  jobId: z.string().uuid("Invalid job ID"),
});

/**
 * Schema for listing sync history.
 */
export const listSyncHistorySchema = z.object({
  repositoryId: z.string().uuid("Invalid repository ID").optional(),
  projectId: z.string().uuid("Invalid project ID").optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

/**
 * Schema for triggering bulk translation.
 */
export const triggerBulkTranslationSchema = z.object({
  repositoryId: z.string().uuid("Invalid repository ID"),
  projectId: z.string().uuid("Invalid project ID"),
  /**
   * Optional: Specific key IDs to translate.
   * If not provided, all keys from the repository will be translated.
   */
  keyIds: z.array(z.string().uuid()).optional(),
});

// Type exports
export type TriggerSyncInput = z.infer<typeof triggerSyncSchema>;
export type GetSyncStatusInput = z.infer<typeof getSyncStatusSchema>;
export type ListSyncHistoryInput = z.infer<typeof listSyncHistorySchema>;
export type TriggerBulkTranslationInput = z.infer<
  typeof triggerBulkTranslationSchema
>;

/**
 * Schema for resyncing an existing sync job.
 */
export const resyncJobSchema = z.object({
  jobId: z.string().uuid("Invalid job ID"),
});

export type ResyncJobInput = z.infer<typeof resyncJobSchema>;

/**
 * Schema for cancelling a sync job.
 */
export const cancelJobSchema = z.object({
  jobId: z.string().uuid("Invalid job ID"),
});

export type CancelJobInput = z.infer<typeof cancelJobSchema>;

