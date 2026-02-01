import { z } from 'zod';

/**
 * Schema for listing translation keys.
 */
export const listTranslationKeysSchema = z.object({
  projectId: z.string().uuid(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(5000).default(30),
  search: z.string().optional(),
  languageCodes: z.array(z.string()).optional(),
  namespaces: z.array(z.string()).optional(),
});

/**
 * Schema for getting a specific translation key.
 */
export const getTranslationKeySchema = z.object({
  keyId: z.string().uuid(),
});

/**
 * Schema for creating a translation key.
 */
export const createTranslationKeySchema = z.object({
  projectId: z.string().uuid(),
  key: z.string().min(1),
  sourceValue: z.string().optional(),
  description: z.string().optional(),
  context: z.string().optional(),
  maxLength: z.number().positive().optional(),
});

/**
 * Schema for updating a translation key.
 */
export const updateTranslationKeySchema = z.object({
  keyId: z.string().uuid(),
  key: z.string().min(1).optional(),
  description: z.string().optional(),
  context: z.string().optional(),
  maxLength: z.number().positive().optional(),
});

/**
 * Schema for deleting a translation key.
 */
export const deleteTranslationKeySchema = z.object({
  keyId: z.string().uuid(),
});

/**
 * Schema for updating a translation.
 * Supports both target language translations and source language edits.
 *
 * Status options:
 * - draft: Translation exists but not yet approved
 * - approved: Ready to publish
 * Note: "published" status is set by sync-worker after successful publish, not via user API
 */
export const updateTranslationSchema = z.object({
  keyId: z.string().uuid(),
  languageCode: z.string().min(1),
  value: z.string(),
  status: z.enum(["draft", "approved"]).default("draft"),
  // Source language editing fields
  isSourceLanguage: z.boolean().optional().default(false),
  reason: z.string().optional(), // For audit trail: why source was edited
});

/**
 * Schema for bulk updating translations.
 * Allows updating multiple translations in a single request.
 *
 * Status options:
 * - draft: Translation exists but not yet approved
 * - approved: Ready to publish
 * Note: "published" status is set by sync-worker after successful publish, not via user API
 */
export const bulkUpdateTranslationsSchema = z.object({
  projectId: z.string().uuid(),
  translations: z
    .array(
      z.object({
        keyId: z.string().uuid(),
        languageCode: z.string().min(1),
        value: z.string(),
        status: z.enum(["draft", "approved"]).default("draft"),
        // Source language editing: when true, updates translationKey.sourceText instead of translation table
        isSourceLanguage: z.boolean().optional().default(false),
      }),
    )
    .min(1),
});

/**
 * Types for translation operations.
 */
export type ListTranslationKeysInput = z.infer<
  typeof listTranslationKeysSchema
>;
export type GetTranslationKeyInput = z.infer<typeof getTranslationKeySchema>;
export type CreateTranslationKeyInput = z.infer<
  typeof createTranslationKeySchema
>;
export type UpdateTranslationKeyInput = z.infer<
  typeof updateTranslationKeySchema
>;
export type DeleteTranslationKeyInput = z.infer<
  typeof deleteTranslationKeySchema
>;
export type UpdateTranslationInput = z.infer<typeof updateTranslationSchema>;
export type BulkUpdateTranslationsInput = z.infer<
  typeof bulkUpdateTranslationsSchema
>;

/**
 * Schema for generating AI translation suggestion.
 */
export const generateSuggestionSchema = z.object({
  keyId: z.string().uuid(),
  languageCode: z.string().min(1),
  model: z
    .enum([
      "gemini-2.5-pro",
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
      "gemini-2.5-flash-lite-preview-06-17",
      "gemini-2.0-flash",
    ])
    .default("gemini-2.5-flash"),
});

/**
 * Schema for AI suggestion (simplified, uses project system prompt).
 */
export const aiSuggestSchema = z.object({
  keyId: z.string().uuid(),
  sourceText: z.string(),
  targetLanguage: z.string().min(1),
  projectId: z.string().uuid(),
});

/**
 * Schema for publishing translations (changing status from draft to approved).
 * Note: translations array can be empty when publishing only language changes or deleted keys.
 */
export const publishTranslationsSchema = z.object({
  projectId: z.string().uuid(),
  translations: z.array(
    z.object({
      keyId: z.string().uuid(),
      languageCode: z.string().min(1),
    }),
  ),
});

/**
 * Schema for batch sync of translations.
 */
export const batchSyncTranslationsSchema = z.object({
  projectId: z.string().uuid(),
  translations: z
    .array(
      z.object({
        keyId: z.string().uuid(),
        languageCode: z.string().min(1),
        value: z.string(),
        baselineValue: z.string(), // Original value when loaded
        status: z
          .enum(["pending", "reviewed", "approved", "conflict", "synced"])
          .default("pending"),
        lastModified: z.string().datetime(), // ISO string
      }),
    )
    .min(1),
  createBaseline: z.boolean().default(true), // Whether to create new baseline after sync
});

/**
 * Schema for conflict detection.
 */
export const detectConflictsSchema = z.object({
  projectId: z.string().uuid(),
  translations: z
    .array(
      z.object({
        keyId: z.string().uuid(),
        languageCode: z.string().min(1),
        value: z.string(),
        baselineValue: z.string(),
        lastModified: z.string().datetime(),
      }),
    )
    .optional(), // Optional - if not provided, will fetch from server
});

/**
 * Schema for resolving conflicts.
 */
export const resolveConflictsSchema = z.object({
  projectId: z.string().uuid(),
  resolutions: z.array(
    z.object({
      keyId: z.string().uuid(),
      languageCode: z.string().min(1),
      resolution: z.enum(["local", "server", "merged"]),
      mergedValue: z.string().optional(), // Required if resolution is "merged"
    }),
  ),
});

/**
 * Schema for getting translation health statistics.
 */
export const getHealthStatsSchema = z.object({
  projectId: z.string().uuid(),
  repositoryId: z.string().uuid().optional(),
});

export type GenerateSuggestionInput = z.infer<typeof generateSuggestionSchema>;
export type AiSuggestInput = z.infer<typeof aiSuggestSchema>;
export type PublishTranslationsInput = z.infer<
  typeof publishTranslationsSchema
>;
export type BatchSyncTranslationsInput = z.infer<
  typeof batchSyncTranslationsSchema
>;
export type DetectConflictsInput = z.infer<typeof detectConflictsSchema>;
export type ResolveConflictsInput = z.infer<typeof resolveConflictsSchema>;
export type GetHealthStatsInput = z.infer<typeof getHealthStatsSchema>;
