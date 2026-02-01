/**
 * MCP API Schemas
 *
 * Zod validation schemas for MCP router endpoints.
 * These schemas define the contract between the API and MCP clients.
 *
 * Uses COMPACT format (k, n, ns, t, v) for efficient AI communication.
 */

import { z } from "zod";

// ============================================================================
// Base Schemas
// ============================================================================

/**
 * Base schema for identifying a project.
 * All MCP operations require org and project slugs from i18n.config.ts.
 */
export const projectIdentifierSchema = z.object({
  /** Organization slug (e.g., "my-company") - from i18n.config.ts */
  orgSlug: z.string().describe("Organization slug from i18n.config.ts"),
  /** Project slug (e.g., "my-app") - from i18n.config.ts */
  projectSlug: z.string().describe("Project slug from i18n.config.ts"),
});

export type ProjectIdentifier = z.infer<typeof projectIdentifierSchema>;

// ============================================================================
// Read Endpoint Schemas
// ============================================================================

/**
 * Input schema for getProject endpoint.
 */
export const getProjectInput = projectIdentifierSchema;
export type GetProjectInput = z.infer<typeof getProjectInput>;

/**
 * Input schema for listKeys endpoint.
 */
export const listKeysInput = projectIdentifierSchema.extend({
  /** Search by key name (partial match) — string or array for multi-term search */
  search: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe(
      "Search keys by name (partial match). Single string or array for multi-term search."
    ),
  /** Filter by namespaces */
  namespaces: z
    .array(z.string())
    .optional()
    .describe("Only return keys from these namespaces"),
  /** Find keys missing translation for this language code (e.g., 'tr', 'de') */
  missingLanguage: z
    .string()
    .optional()
    .describe("Filter to keys MISSING translation for this language"),
  /** Page number (1-indexed, default: 1) */
  page: z.number().min(1).optional(),
  /** Number of results per page (max 100, default: 50) */
  limit: z.number().min(1).max(100).optional(),
});
export type ListKeysInput = z.infer<typeof listKeysInput>;

/**
 * Input schema for getAllTranslations endpoint.
 * Returns ALL keys without pagination - designed for AI/MCP usage.
 *
 * SEARCH + FILTER:
 * - search: Text to search for (in source text or specified languages)
 * - languages: Which languages to search in AND return translations for
 *
 * EXAMPLES:
 * - Find "login" in source: { search: "login" }
 * - Find "Giriş" in Turkish: { search: "Giriş", languages: ["tr"] }
 * - Get all Turkish translations: { languages: ["tr"] }
 * - Get specific keys: { keys: ["auth.login.title", "auth.login.button"] }
 */
export const getAllTranslationsInput = projectIdentifierSchema.extend({
  /** Optional: filter by namespaces */
  namespaces: z
    .array(z.string())
    .optional()
    .describe("Only return keys from these namespaces"),
  /** Optional: specific key names to fetch */
  keys: z
    .array(z.string())
    .optional()
    .describe("Fetch specific keys by name (exact match)"),
  /** Optional: search text in source or translations (string or array) */
  search: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe(
      "Text to search for in source text or translations (case-insensitive). Single string or array for multi-term search."
    ),
  /** Optional: languages to search in AND return translations for */
  languages: z
    .array(z.string())
    .optional()
    .describe(
      "Language codes to search in and return (e.g., ['tr', 'de']). If omitted with search, searches source text. If omitted without search, returns all languages."
    ),
  /** Optional: filter by translation status (default: all) */
  status: z
    .enum(["missing", "draft", "approved", "all"])
    .optional()
    .describe(
      "Filter by status: 'missing' (no translation), 'draft', 'approved', 'all' (default: 'all')"
    ),
});
export type GetAllTranslationsInput = z.infer<typeof getAllTranslationsInput>;

// ============================================================================
// Write Endpoint Schemas - COMPACT FORMAT
// ============================================================================

/**
 * Compact key item for createKeys endpoint.
 *
 * COMPACT FORMAT:
 * - n: key name (e.g., "submit_button", "nav.home")
 * - ns: namespace (default: "default")
 * - v: source value (source language text)
 * - t: translations object { langCode: text }
 */
export const compactCreateKeyItem = z.object({
  /** Key name (e.g., "submit_button", "nav.home") */
  n: z.string().describe("Key name identifier"),
  /** Namespace (default: "default" = root level) */
  ns: z.string().default("default").describe("Namespace for grouping"),
  /** Source value (source language text) */
  v: z.string().optional().describe("Source language text"),
  /** Target translations: { 'tr': 'Turkish text', 'de': 'German text' } */
  t: z
    .record(z.string(), z.string())
    .optional()
    .describe("Target translations object"),
});
export type CompactCreateKeyItem = z.infer<typeof compactCreateKeyItem>;

/**
 * Input schema for createKeys endpoint.
 * Creates one or more translation keys with optional translations.
 *
 * COMPACT FORMAT - uses k array with { n, ns, v, t }
 */
export const createKeysInput = projectIdentifierSchema.extend({
  /** Array of keys to create */
  k: z.array(compactCreateKeyItem).min(1).describe("Array of keys to create"),
});
export type CreateKeysInput = z.infer<typeof createKeysInput>;

/**
 * Compact translation update item for updateKeys endpoint.
 *
 * COMPACT FORMAT:
 * - k: key identifier (keyId or key name)
 * - n: key name (optional, for lookup)
 * - ns: namespace
 * - l: language code
 * - t: translation text
 * - s: is source language (boolean)
 * - st: status (optional)
 */
export const compactUpdateItem = z.object({
  /** Key identifier (keyId or key name) */
  k: z.string().describe("Key identifier"),
  /** Key name (optional) */
  n: z.string().optional().describe("Key name"),
  /** Namespace */
  ns: z.string().optional().describe("Namespace"),
  /** Language code */
  l: z.string().describe("Language code"),
  /** Translation text */
  t: z.string().describe("Translation text"),
  /** Is source language */
  s: z.boolean().optional().describe("Is source language"),
  /** Status */
  st: z.string().optional().describe("Translation status"),
});
export type CompactUpdateItem = z.infer<typeof compactUpdateItem>;

/**
 * Input schema for updateKeys endpoint.
 * Updates translations for one or more keys.
 *
 * COMPACT FORMAT - uses t array with { k, n, ns, l, t, s, st }
 */
export const updateKeysInput = projectIdentifierSchema.extend({
  /** Array of translation updates */
  t: z
    .array(compactUpdateItem)
    .min(1)
    .describe("Array of translation updates"),
});
export type UpdateKeysInput = z.infer<typeof updateKeysInput>;

/**
 * Input schema for deleteKeys endpoint.
 * Soft-deletes translation keys by UUID.
 */
export const deleteKeysInput = projectIdentifierSchema.extend({
  /** Array of key IDs (UUIDs) to delete */
  keyIds: z.array(z.string().uuid()).min(1).max(100),
});
export type DeleteKeysInput = z.infer<typeof deleteKeysInput>;

/**
 * Input schema for addLanguage endpoint.
 */
export const addLanguageInput = projectIdentifierSchema.extend({
  /** ISO 639-1 language code (e.g., "fr", "ja", "de") */
  languageCode: z.string().min(2).max(5),
});
export type AddLanguageInput = z.infer<typeof addLanguageInput>;

// ============================================================================
// Sync Endpoint Schemas
// ============================================================================

/**
 * Input schema for getSyncs endpoint.
 * Lists recent sync operations for a project.
 */
export const getSyncsInput = projectIdentifierSchema.extend({
  /** Maximum number of sync jobs to return (default: 10, max: 50) */
  limit: z
    .number()
    .min(1)
    .max(50)
    .optional()
    .describe("Number of sync jobs to return (default: 10)"),
  /** Filter by sync status */
  status: z
    .enum(["pending", "in_progress", "completed", "failed"])
    .optional()
    .describe("Filter syncs by status"),
  /** Filter by job type */
  type: z
    .enum(["initial_import", "source_sync", "cdn_upload", "publish_batch"])
    .optional()
    .describe("Filter syncs by job type"),
});
export type GetSyncsInput = z.infer<typeof getSyncsInput>;

/**
 * Input schema for getSync endpoint.
 * Get detailed information about a specific sync operation.
 */
export const getSyncInput = z.object({
  /** Sync job ID */
  syncId: z.string().describe("The sync job ID to retrieve details for"),
});
export type GetSyncInput = z.infer<typeof getSyncInput>;
