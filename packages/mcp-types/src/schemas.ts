/**
 * MCP API Schemas
 *
 * Zod validation schemas for MCP router endpoints.
 * This is the SINGLE SOURCE OF TRUTH - both the platform API
 * and the MCP client package use these schemas.
 *
 * Uses COMPACT format (n, ns, v, t) for createKeys and id-based format for updateKeys.
 */

import { z } from "zod";

// ============================================================================
// Helpers
// ============================================================================

/**
 * Coerce a JSON-stringified array back to an actual array.
 * Some AI agents serialize array/object parameters as strings.
 * e.g. '[{"id":"..."}]' → [{id:"..."}]
 *
 * If already an array, passes through unchanged.
 * If a non-array string, wraps in single-element array.
 */
function coerceJsonArray(val: unknown): unknown {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // not valid JSON — fall through to Zod validation
    }
  }
  return val; // let Zod handle the error
}

/**
 * Coerce a stringified number to an actual number.
 * Some AI agents send limit/page as "100" instead of 100.
 */
function coerceNumber(val: unknown): unknown {
  if (typeof val === "number") return val;
  if (typeof val === "string" && val.trim() !== "") {
    const n = Number(val);
    if (!isNaN(n)) return n;
  }
  return val;
}

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
      "Search keys by name (partial match). Single string or array for multi-term search.",
    ),
  /** Filter by namespaces */
  namespaces: z
    .preprocess(coerceJsonArray, z.array(z.string()))
    .optional()
    .describe("Only return keys from these namespaces"),
  /** Find keys missing translation for this language code (e.g., 'tr', 'de') */
  missingLanguage: z
    .string()
    .optional()
    .transform(v => v?.toLowerCase())
    .describe("Filter to keys MISSING translation for this language"),
  /**
   * Fields to include in response.
   * Default omits translation text (saves tokens) — add "translations" only when text is needed.
   */
  fields: z
    .preprocess(coerceJsonArray, z.array(z.enum(["id", "sourceText", "translations", "translatedLanguages", "translatedLanguageCount"])))
    .optional()
    .default(["id", "sourceText"])
    .describe(
      "Fields per key. Add 'translatedLanguages' for full list of translated lang codes, 'translatedLanguageCount' for just the count (fewer tokens). Default: id, sourceText.",
    ),
  /** Page number (1-indexed) */
  page: z.preprocess(coerceNumber, z.number().int().min(1)).default(1),
  /** Number of results per page (max 250) */
  limit: z.preprocess(coerceNumber, z.number().int().min(1).max(250)).default(20),
});
/** Output type (after defaults applied - server side) */
export type ListKeysOutput = z.infer<typeof listKeysInput>;
/** Input type (before defaults - client side) */
export type ListKeysInput = z.input<typeof listKeysInput>;

/**
 * Input schema for getTranslations endpoint (renamed from getAllTranslations).
 * Returns translations with efficient limit for AI/MCP usage.
 *
 * SEARCH + FILTER:
 * - search: Text to search for (in source text or specified languages)
 * - languages: Which languages to search in AND return translations for
 * - limit: Max keys to return (default: 100, safety cap: 200)
 *
 * EXAMPLES:
 * - Find "login" in source: { search: "login", limit: 50 }
 * - Find "Giriş" in Turkish: { search: "Giriş", languages: ["tr"], limit: 20 }
 * - Get all Turkish translations: { languages: ["tr"], limit: 100 }
 * - Get specific keys: { keys: ["auth.login.title", "auth.login.button"] }
 */
export const getTranslationsInput = projectIdentifierSchema.extend({
  /** Optional: filter by namespaces */
  namespaces: z
    .preprocess(coerceJsonArray, z.array(z.string()))
    .optional()
    .describe("Only return keys from these namespaces"),
  /** Optional: specific key names to fetch */
  keys: z
    .preprocess(coerceJsonArray, z.array(z.string()))
    .optional()
    .describe("Fetch specific keys by name (exact match)"),
  /** Optional: search text in source or translations (string or array) */
  search: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe(
      "Text to search for in key names, source text, or translations (case-insensitive). Single string or array for multi-term search.",
    ),
  /** Optional: languages to search in AND return translations for */
  languages: z
    .preprocess(coerceJsonArray, z.array(z.string().transform(v => v.toLowerCase())))
    .optional()
    .describe(
      "Language codes to search in and return (e.g., ['tr', 'de']). If omitted with search, searches source text. If omitted without search, returns all languages.",
    ),
  /** Optional: filter by translation status (default: all) */
  status: z
    .enum(["missing", "draft", "published", "all"])
    .default("all")
    .describe(
      "Filter by status: 'missing' (no translation), 'draft', 'published', 'all'",
    ),
  /** Max keys to return (1–200, default 100) */
  limit: z
    .preprocess(coerceNumber, z.number().min(1).max(200))
    .default(100)
    .describe(
      "Max keys to return (1–200, default 100). Response includes: 'returned' (keys in this response after all filters), 'total' (DB count before in-memory status filter), 'hasMore' (true when total > limit). Use narrower filters (namespace, search, status, keys[]) to retrieve specific subsets of large projects.",
    ),
  /** When true, returns minimal keys: id, k, ns, tc (translation count). Omits src and tr. ~75% token reduction. */
  compact: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      "When true, omits src and tr fields. Returns only id, k, ns, and tc (translation count). ~75% token reduction.",
    ),
});
/** Output type (after defaults applied - server side) */
export type GetTranslationsOutput = z.infer<typeof getTranslationsInput>;
/** Input type (before defaults - client side) */
export type GetTranslationsInput = z.input<typeof getTranslationsInput>;

// Deprecated: Use getTranslationsInput instead
/** @deprecated Use getTranslationsInput instead */
export const getAllTranslationsInput = getTranslationsInput;
/** @deprecated Use GetTranslationsOutput instead */
export type GetAllTranslationsOutput = GetTranslationsOutput;
/** @deprecated Use GetTranslationsInput instead */
export type GetAllTranslationsInput = GetTranslationsInput;

// ============================================================================
// Write Endpoint Schemas - COMPACT FORMAT
// ============================================================================

/**
 * Namespace context object for enriching namespace metadata.
 * Provide this on any key to set context on its namespace.
 * If multiple keys share a namespace, the last context wins.
 */
const namespaceContextSchema = z.object({
  /** Human-readable description of the namespace */
  description: z
    .string()
    .optional()
    .describe("What this namespace contains (e.g., 'Authentication flow strings')"),
  /** Owning team */
  team: z
    .string()
    .optional()
    .describe("Team responsible (e.g., 'auth-team')"),
  /** Business domain */
  domain: z
    .string()
    .optional()
    .describe("Business domain (e.g., 'authentication', 'payments')"),
  /** AI translation guidance specific to this namespace */
  aiPrompt: z
    .string()
    .optional()
    .describe("Extra AI translation instructions for this namespace"),
  /** Organizational tags */
  tags: z
    .array(z.string())
    .optional()
    .describe("Tags for categorization (e.g., ['critical', 'user-facing'])"),
});

/**
 * Compact key item for createKeys endpoint.
 *
 * COMPACT FORMAT:
 * - n: key name (e.g., "submit_button", "nav.home")
 * - ns: namespace (default: "default")
 * - v: source value (source language text)
 * - t: translations object { langCode: text }
 * - nc: namespace context (optional, enriches the namespace)
 */
const compactCreateKeyItem = z.object({
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
  /** Namespace context - enriches the namespace with metadata */
  nc: namespaceContextSchema
    .optional()
    .describe(
      "Namespace context: description, team, domain, aiPrompt, tags. Sets metadata on the namespace.",
    ),
});

/**
 * Input schema for createKeys endpoint.
 * Creates one or more translation keys with optional translations.
 *
 * COMPACT FORMAT - uses k array with { n, ns, v, t }
 */
export const createKeysInput = projectIdentifierSchema.extend({
  /** Array of keys to create */
  k: z.preprocess(coerceJsonArray, z.array(compactCreateKeyItem).min(1)).describe("Array of keys to create"),
  /** Force creation even if path collisions are detected (leaf↔object conflicts) */
  force: z.boolean().optional().default(false).describe("Force creation despite path collisions. Without this, keys that would cause leaf↔object conflicts in JSON output are rejected."),
});
export type CreateKeysOutput = z.infer<typeof createKeysInput>;
export type CreateKeysInput = z.input<typeof createKeysInput>;

/**
 * Compact translation update item for updateKeys endpoint.
 *
 * COMPACT FORMAT:
 * - id: translation key UUID (required — from listKeys or getTranslations)
 * - l: language code
 * - t: translation text
 * - s: is source language (boolean)
 * - st: status (optional)
 *
 * NOTE: k/n/ns/nc fields have been removed. Use id (UUID) exclusively.
 */
const compactUpdateItem = z.object({
  /** Translation key UUID — from listKeys or getTranslations id field */
  id: z
    .string()
    .describe(
      "Translation key UUID (required). Get from listKeys or getTranslations id field. k/n/ns format has been removed.",
    ),
  /** Language code */
  l: z.string().transform(v => v.toLowerCase()).describe("Language code"),
  /** Translation text */
  t: z.string().describe("Translation text"),
  /** Is source language */
  s: z.boolean().optional().describe("Is source language"),
  /** Status */
  st: z.string().optional().describe("Translation status"),
});

/**
 * Input schema for updateKeys endpoint.
 * Updates translations for one or more keys.
 *
 * COMPACT FORMAT - uses t array with { id, l, t, s, st }
 * - id: key UUID (REQUIRED — get from listKeys or getAllTranslations)
 * - k/n/ns fields have been REMOVED — UUID-only since v0.8
 */
export const updateKeysInput = projectIdentifierSchema.extend({
  /** Array of translation updates */
  t: z.preprocess(coerceJsonArray, z.array(compactUpdateItem).min(1)).describe("Array of translation updates"),
});
export type UpdateKeysOutput = z.infer<typeof updateKeysInput>;
export type UpdateKeysInput = z.input<typeof updateKeysInput>;

/**
 * Input schema for deleteKeys endpoint.
 * Soft-deletes translation keys by UUID.
 */
export const deleteKeysInput = projectIdentifierSchema.extend({
  /** Array of key IDs (UUIDs) to delete */
  keyIds: z.preprocess(coerceJsonArray, z.array(z.string().uuid()).min(1).max(100)),
});
export type DeleteKeysInput = z.input<typeof deleteKeysInput>;

// ============================================================================
// Language Endpoint Schemas
// ============================================================================

const languageEntrySchema = z.object({
  languageCode: z.string().min(2).max(10).transform(v => v.toLowerCase()),
  status: z.enum(["active", "draft"]).default("active").optional(),
});

/**
 * Input schema for addLanguages endpoint.
 * Batch add new target languages to a project.
 */
export const addLanguagesInput = projectIdentifierSchema.extend({
  languages: z
    .preprocess(coerceJsonArray, z.array(languageEntrySchema).min(1).max(50))
    .describe("Languages to add — ISO 639-1 or BCP 47 locale codes (e.g. 'fr', 'zh-Hans', 'pt-BR'). Code must exist in language table."),
});
export type AddLanguagesInput = z.input<typeof addLanguagesInput>;

/**
 * Input schema for updateLanguages endpoint.
 * Batch update status of existing target languages.
 */
export const updateLanguagesInput = projectIdentifierSchema.extend({
  updates: z
    .preprocess(coerceJsonArray, z.array(
      z.object({
        languageCode: z.string().min(2).max(10).transform(v => v.toLowerCase()),
        status: z
          .enum(["active", "draft", "archived"])
          .describe(
            "New status: active=published to CDN, draft=visible but not deployed, archived=hidden from editor and CDN",
          ),
      }),
    ).min(1).max(50)),
});
export type UpdateLanguagesInput = z.input<typeof updateLanguagesInput>;

/**
 * Input schema for deleteLanguages endpoint.
 * Batch archive target languages (status → archived). Translations are preserved.
 */
export const deleteLanguagesInput = projectIdentifierSchema.extend({
  languageCodes: z
    .preprocess(coerceJsonArray, z.array(z.string().min(2).max(10).transform(v => v.toLowerCase())).min(1).max(50))
    .describe(
      "Language codes to archive (status → archived). Translations are preserved.",
    ),
});
export type DeleteLanguagesInput = z.input<typeof deleteLanguagesInput>;

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
    .default(10)
    .describe("Number of sync jobs to return"),
  /** Filter by sync status */
  status: z
    .enum(["pending", "in_progress", "completed", "failed"])
    .optional()
    .describe("Filter syncs by status"),
  /** Filter by job type */
  type: z
    .enum(["initial_import", "source_sync", "cdn_upload", "batch_publish"])
    .optional()
    .describe("Filter syncs by job type"),
});
export type GetSyncsOutput = z.infer<typeof getSyncsInput>;
export type GetSyncsInput = z.input<typeof getSyncsInput>;

/**
 * Input schema for getSync endpoint.
 * Get detailed information about a specific sync operation.
 */
export const getSyncInput = z.object({
  /** Sync job ID */
  syncId: z.string().describe("The sync job ID to retrieve details for"),
});
export type GetSyncInput = z.input<typeof getSyncInput>;

// ============================================================================
// Publish Endpoint Schemas
// ============================================================================

/**
 * Input schema for getPendingChanges endpoint.
 * Returns what's ready to be published (translations, deleted keys, language changes).
 */
export const getPendingChangesInput = projectIdentifierSchema;
export type GetPendingChangesInput = z.input<typeof getPendingChangesInput>;

/**
 * Input schema for publish endpoint.
 * Publishes pending changes to CDN or GitHub.
 *
 * If translations array is omitted, ALL pending changes are published.
 * If translations array is provided, only those specific translations are published.
 */
export const publishInput = projectIdentifierSchema.extend({
  /**
   * Optional: specific translations to publish.
   * If omitted, all pending changes (translations + deleted keys + language changes) are published.
   */
  translations: z
    .array(
      z.object({
        keyId: z.string().uuid(),
        languageCode: z.string().transform(v => v.toLowerCase()),
      }),
    )
    .optional()
    .describe(
      "Specific translations to publish. If omitted, all pending changes are published.",
    ),
});
export type PublishOutput = z.infer<typeof publishInput>;
export type PublishInput = z.input<typeof publishInput>;
