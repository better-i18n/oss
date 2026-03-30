/**
 * MCP Content API Schemas
 *
 * Zod validation schemas for content MCP router endpoints.
 * These schemas use the projectIdentifierSchema base and add
 * content-specific fields with .describe() for MCP tool descriptions.
 */

import { z } from "zod";
import { projectIdentifierSchema } from "./schemas";

// ============================================================================
// Read Schemas
// ============================================================================

/**
 * Input schema for listContentModels endpoint.
 * Lists all content models for a project with entry counts.
 */
export const listContentModelsInput = projectIdentifierSchema;
export type ListContentModelsInput = z.input<typeof listContentModelsInput>;

/**
 * Input schema for getContentModel endpoint.
 * Gets a single content model by slug with its field definitions.
 */
export const getContentModelInput = projectIdentifierSchema.extend({
  /** Content model slug (e.g., "blog-posts", "changelog") */
  modelSlug: z.string().describe("Content model slug"),
});
export type GetContentModelInput = z.input<typeof getContentModelInput>;

/**
 * Input schema for listContentEntries endpoint.
 *
 * ## Quick reference
 *
 * | Field           | Type                  | Purpose                                          |
 * |-----------------|-----------------------|--------------------------------------------------|
 * | models          | string \| string[]    | Filter by one or more content model slugs        |
 * | slugs           | string \| string[]    | Fetch specific entries by exact entry slug(s)    |
 * | status          | enum                  | draft / published / archived                     |
 * | language        | string \| string[]    | Entries that HAVE translations in these locales  |
 * | missingLanguage | string \| string[]    | Entries MISSING translations in these locales    |
 * | search          | string \| string[]    | Full-text search (title, slug, text fields)      |
 * | where           | Record<string,string> | Exact custom-field value filter                  |
 * | compact         | boolean               | true = minimal response (~65% fewer tokens)      |
 * | expand          | string[]              | Expand relation fields (skipped when compact)    |
 * | page / limit    | number                | Pagination                                       |
 *
 * ## Common patterns
 *
 * ```
 * // All published integrations
 * { models: "integrations", status: "published" }
 *
 * // Specific entries across multiple models
 * { models: ["integrations", "frameworks"], slugs: ["github", "nextjs"] }
 *
 * // Entries missing French across all models
 * { missingLanguage: "fr" }
 *
 * // Entries available in both EN and TR
 * { language: ["en", "tr"] }
 * ```
 */
export const listContentEntriesInput = projectIdentifierSchema.extend({
  /**
   * Filter by content model slug(s).
   * Single string or array — fetches across all listed models in one request.
   * Omit to search across all models in the project.
   */
  models: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe('Filter by model slug(s). Single or array: "blog-posts" or ["integrations","changelog"].'),

  /**
   * Fetch specific entries by exact entry slug(s).
   * Use when you already know which entries you need — more precise than search.
   */
  slugs: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe('Exact entry slug(s). Single or array: "github" or ["github","nextjs"]. Prefer over search when slugs are known.'),

  /**
   * Filter by entry status. Single value or array.
   * Example: "published" or ["draft","published"]
   */
  status: z
    .union([
      z.enum(["draft", "published", "archived"]),
      z.array(z.enum(["draft", "published", "archived"])),
    ])
    .optional()
    .describe('Filter by status. Single or array: "published" or ["draft","published"].'),

  /**
   * Entries that HAVE a translation in these locale(s).
   * Single string or array.
   * Behavior controlled by languageMode (default: "any" = OR logic).
   *
   * ⚠️ Use missingLanguage (not language) when looking for untranslated content.
   */
  language: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe('Entries that HAVE a translation in these locale(s). Combine with languageMode to control OR vs AND. NOT for finding untranslated content — use missingLanguage.'),

  /**
   * Controls how the language filter is applied when multiple locales are given.
   * "any" (default) = OR logic — entry has at least one of the locales.
   * "all" = AND logic — entry has ALL listed locales.
   * Example: language: ["en","tr"], languageMode: "all" → fully translated into both.
   */
  languageMode: z
    .enum(["any", "all"])
    .optional()
    .default("any")
    .describe('"any" (default) = OR — entry has at least one locale. "all" = AND — entry has every listed locale. Example: language:["en","tr"] + languageMode:"all" → translated in both.'),

  /**
   * Entries MISSING a translation in these locale(s).
   * Single string or array — AND logic (entry must be missing ALL listed locales).
   * Use this for batch-translate workflows: listContentEntries({ missingLanguage: "fr" }) → bulkUpdateEntries.
   */
  missingLanguage: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe('Entries MISSING translations in these locale(s). AND logic: ["fr","de"] = missing both FR and DE. Use for batch-translate workflows.'),

  /**
   * Full-text search across entry title, slug, and text custom fields.
   * Single string or array (OR logic — any match returns the entry).
   */
  search: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe('Text search across title, slug, and text fields. Array = OR logic: any match returns entry.'),

  /**
   * Exact custom-field value filter.
   * Key = field name as defined in the model, value = exact match string.
   * Example: { category: "frameworks", status: "guide" }
   */
  where: z
    .record(z.string(), z.string())
    .optional()
    .describe('Exact custom-field filter. Example: { category: "frameworks", badge_label: "SDK" }. All conditions are AND-combined.'),

  /** Relation field names to expand with referenced entry data. Ignored when compact=true. */
  expand: z
    .array(z.string())
    .optional()
    .describe('Expand relation fields with referenced entry data. Example: ["author","category"]. Ignored when compact=true.'),

  /**
   * When true, returns minimal fields: id, slug, status, title, languages only.
   * Drops dates, model ref, and custom fields. ~65% token reduction.
   * Use for browsing / listing. Fetch full entry with getContentEntry when needed.
   */
  compact: z
    .boolean()
    .optional()
    .default(false)
    .describe("true = minimal response (id, slug, status, title, languages only). ~65% token reduction. Use for browsing."),

  /**
   * Field to sort results by. Default: updatedAt.
   * Use publishedAt desc to get "most recently published" entries.
   */
  sort: z
    .enum(["publishedAt", "createdAt", "updatedAt", "title"])
    .optional()
    .describe('Sort field: publishedAt | createdAt | updatedAt | title. Default: updatedAt. Example: sort:"publishedAt", order:"desc" → latest published first.'),

  /** Sort direction. Default: desc. */
  order: z
    .enum(["asc", "desc"])
    .optional()
    .describe('Sort direction: asc | desc. Default: desc.'),

  /** Page number (1-indexed, default: 1) */
  page: z.number().min(1).default(1).describe("Page number (1-indexed)"),
  /** Results per page (max 50, default: 20) */
  limit: z.number().min(1).max(50).default(20).describe("Results per page (max 50)"),
});
export type ListContentEntriesInput = z.input<typeof listContentEntriesInput>;
export type ListContentEntriesOutput = z.infer<typeof listContentEntriesInput>;

/**
 * Input schema for getContentEntry endpoint.
 * Gets a single content entry with all translations and field values.
 */
export const getContentEntryInput = projectIdentifierSchema.extend({
  /** Content entry UUID */
  entryId: z.string().uuid().describe("Content entry UUID"),
  /** Relation field names to expand with referenced entry data */
  expand: z
    .array(z.string())
    .optional()
    .describe('Relation field names to expand (e.g., ["author", "category"]). Note: ignored when compact=true.'),
  /** When true, omits tr (translations) and vers (version history). Returns metadata + langs. expand is ignored when compact=true. ~70% token reduction. */
  compact: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      "When true, omits tr (translations) and vers (version history). Returns metadata + langs. expand is ignored when compact=true. ~70% token reduction.",
    ),
});
export type GetContentEntryInput = z.input<typeof getContentEntryInput>;

// ============================================================================
// Write Schemas
// ============================================================================

/** Coercible field value — accepts string, number, or boolean and coerces to string */
const coercibleFieldValue = z.union([
  z.string(),
  z.number().transform(String),
  z.boolean().transform(String),
]).nullable();

/** Reusable translation value for multi-language support */
const translationValue = z.object({
  title: z.string().optional().describe("Translated title"),
  bodyMarkdown: z.string().optional().describe("Translated body in Markdown"),
  customFields: z
    .record(z.string(), coercibleFieldValue)
    .optional()
    .describe("Translated custom field values (localized fields only)"),
});

/**
 * Input schema for createContentEntry endpoint.
 * Creates a new content entry with source translation.
 *
 * Top-level title/bodyMarkdown are for the source language.
 * Use `translations` to add target language translations in the same request.
 *
 * Example with translations:
 * ```json
 * {
 *   "title": "Hello World",
 *   "bodyMarkdown": "# Hello\nContent here",
 *   "translations": {
 *     "tr": { "title": "Merhaba Dünya", "bodyMarkdown": "# Merhaba\nİçerik" },
 *     "de": { "title": "Hallo Welt" }
 *   }
 * }
 * ```
 */
export const createContentEntryInput = projectIdentifierSchema.extend({
  /** Content model slug to create entry in */
  modelSlug: z.string().describe("Content model slug"),
  /** Entry title (source language) */
  title: z.string().describe("Entry title"),
  /** URL slug for the entry */
  slug: z.string().describe("URL slug"),
  /** Source language code — the language of the top-level title/bodyMarkdown. Defaults to project's source language if omitted. */
  sourceLanguageCode: z.string().optional().describe("Source language code (defaults to project source language)"),
  /** Content body in Markdown format (supports GFM: tables, strikethrough, task lists) */
  bodyMarkdown: z.string().optional().describe("Content body in Markdown format (supports GFM: tables, strikethrough, task lists)"),
  /** Initial status */
  status: z.enum(["draft", "published"]).default("draft").describe("Initial entry status"),
  /** Custom field values (field_name → value). Accepts string, number, or boolean — non-string values are coerced to string. */
  customFields: z
    .record(z.string(), coercibleFieldValue)
    .optional()
    .default({})
    .describe("Custom field values as { fieldName: value }. Number and boolean values are auto-converted to strings."),
  /** Target language translations — { langCode: { title, bodyMarkdown, ... } } */
  translations: z
    .record(z.string(), translationValue)
    .optional()
    .describe("Target language translations keyed by language code"),
});
export type CreateContentEntryInput = z.input<typeof createContentEntryInput>;

/**
 * Input schema for updateContentEntry endpoint.
 * Updates a content entry's translation and/or metadata.
 *
 * Two modes:
 * 1. Single language: provide `languageCode` + top-level fields (title, bodyMarkdown, etc.)
 * 2. Multi-language: provide `translations` map — { langCode: { title, bodyMarkdown, ... } }
 *
 * Both modes can be combined. Metadata fields (slug, status) apply once.
 */
export const updateContentEntryInput = projectIdentifierSchema.extend({
  /** Content entry UUID */
  entryId: z.string().uuid().describe("Content entry UUID"),
  /** Language to update translation for (single-language mode) */
  languageCode: z.string().optional().describe("Language to update translation for"),
  /** Updated title */
  title: z.string().optional().describe("Updated title"),
  /** Updated slug */
  slug: z.string().optional().describe("Updated URL slug"),
  /** Updated content body in Markdown format */
  bodyMarkdown: z.string().optional().describe("Updated content body in Markdown format"),
  /** Updated status */
  status: z
    .enum(["draft", "published", "archived"])
    .optional()
    .describe("Updated entry status"),
  /** Updated custom field values. Accepts string, number, or boolean — non-string values are coerced to string. */
  customFields: z
    .record(z.string(), coercibleFieldValue)
    .optional()
    .describe("Updated custom field values. Number and boolean values are auto-converted to strings."),
  /** Multi-language translations — { langCode: { title, bodyMarkdown, ... } } */
  translations: z
    .record(z.string(), translationValue)
    .optional()
    .describe("Multiple language translations keyed by language code"),
});
export type UpdateContentEntryInput = z.input<typeof updateContentEntryInput>;

/**
 * Input schema for publishContentEntry endpoint.
 * Sets entry status to published and approves source translation.
 */
export const publishContentEntryInput = projectIdentifierSchema.extend({
  /** Content entry UUID */
  entryId: z.string().uuid().describe("Content entry UUID"),
});
export type PublishContentEntryInput = z.input<typeof publishContentEntryInput>;

/**
 * Input schema for deleteContentEntry endpoint.
 * Hard-deletes a content entry and all its translations.
 */
export const deleteContentEntryInput = projectIdentifierSchema.extend({
  /** Content entry UUID */
  entryId: z.string().uuid().describe("Content entry UUID"),
});
export type DeleteContentEntryInput = z.input<typeof deleteContentEntryInput>;

// ============================================================================
// Content Model Management Schemas
// ============================================================================

/** Field type enum (self-contained, matches @better-i18n/schemas) */
const mcpFieldTypeEnum = z.enum([
  "text",
  "textarea",
  "richtext",
  "number",
  "boolean",
  "date",
  "datetime",
  "enum",
  "media",
  "relation",
]);

/** Single enum option (label displayed to users, value stored in DB) */
const mcpEnumValueItemSchema = z.object({
  label: z.string().min(1).max(200).describe("Display label shown to users"),
  value: z.string().min(1).max(200).describe("Machine-readable value stored in DB"),
});

/** Field-level options (enum values, Unsplash, AI generation, etc.) */
const mcpFieldOptionsSchema = z.object({
  enumValues: z.array(mcpEnumValueItemSchema).max(200).optional()
    .describe("Allowed values for enum fields — array of { label, value }"),
  unsplash: z.object({ enabled: z.boolean() }).optional()
    .describe("Unsplash integration for media fields"),
  aiGeneration: z.object({
    enabled: z.boolean(),
    prompt: z.string().max(2000).optional(),
    model: z.string().max(100).optional(),
  }).optional().describe("AI generation settings for media fields"),
  showInTable: z.boolean().optional()
    .describe("Whether this field appears as a column in the content list table"),
}).optional();

/** Type-specific field configuration (e.g., targetModel for relation fields) */
const mcpFieldConfigSchema = z.object({
  targetModel: z.string().optional().describe("Target content model slug for relation fields"),
}).optional();

/** Field definition for creating content models */
const mcpFieldDefinition = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z_][a-z0-9_]*$/)
    .describe("Field name (snake_case)"),
  displayName: z.string().min(1).max(200).describe("Display name"),
  type: mcpFieldTypeEnum.default("text").describe("Field type"),
  localized: z.boolean().default(false).describe("Whether field is localized per language"),
  required: z.boolean().default(false).describe("Whether field is required"),
  placeholder: z.string().max(500).optional().describe("Placeholder text"),
  helpText: z.string().max(500).optional().describe("Help text"),
  position: z.number().int().min(0).optional().describe("Sort position (auto-calculated if omitted)"),
  options: mcpFieldOptionsSchema.describe("Field-level options (enumValues for enum fields, unsplash/aiGeneration for media)"),
  fieldConfig: mcpFieldConfigSchema.describe("Type-specific configuration (e.g., targetModel for relation)"),
});

/**
 * Create a new content model with optional field definitions.
 */
export const createContentModelInput = projectIdentifierSchema.extend({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/)
    .describe("Model slug (lowercase, hyphens)"),
  displayName: z.string().min(1).max(200).describe("Human-readable model name"),
  description: z.string().max(1000).optional().describe("Model description"),
  kind: z.enum(["collection", "single"]).default("collection").describe("Model kind"),
  icon: z.string().max(50).optional().describe("Icon identifier"),
  enableVersionHistory: z.boolean().default(true).describe("Enable version history tracking"),
  includeBody: z.boolean().default(true).describe("Set false for models that don't need a body/rich-text field (e.g. structured data models with only custom fields)"),
  fields: z.array(mcpFieldDefinition).default([]).describe("Initial field definitions"),
});
export type CreateContentModelInput = z.input<typeof createContentModelInput>;

/**
 * Update content model metadata.
 */
export const updateContentModelInput = projectIdentifierSchema.extend({
  modelSlug: z.string().describe("Content model slug to update"),
  displayName: z.string().min(1).max(200).optional().describe("Updated display name"),
  description: z.string().max(1000).optional().describe("Updated description"),
  kind: z.enum(["collection", "single"]).optional().describe("Updated model kind"),
  icon: z.string().max(50).optional().describe("Updated icon identifier"),
  enableVersionHistory: z.boolean().optional().describe("Updated version history setting"),
  includeBody: z.boolean().optional().describe("Set false to remove the body/rich-text field, true to add it back. Useful for structured data models with only custom fields"),
});
export type UpdateContentModelInput = z.input<typeof updateContentModelInput>;

/**
 * Delete a content model.
 * WARNING: Cascades to ALL fields, entries, translations, and versions.
 */
export const deleteContentModelInput = projectIdentifierSchema.extend({
  modelSlug: z.string().describe("Content model slug to delete"),
});
export type DeleteContentModelInput = z.input<typeof deleteContentModelInput>;

// ============================================================================
// Field Management Schemas
// ============================================================================

/**
 * Add a custom field to a content model.
 */
export const addFieldInput = projectIdentifierSchema.extend({
  modelSlug: z.string().describe("Parent content model slug"),
  name: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z_][a-z0-9_]*$/)
    .describe("Field name (snake_case)"),
  displayName: z.string().min(1).max(200).describe("Display name"),
  type: mcpFieldTypeEnum.default("text").describe("Field type"),
  localized: z.boolean().default(false).describe("Whether field is localized per language"),
  required: z.boolean().default(false).describe("Whether field is required"),
  placeholder: z.string().max(500).optional().describe("Placeholder text"),
  helpText: z.string().max(500).optional().describe("Help text"),
  position: z.number().int().min(0).optional().describe("Sort position (auto-calculated if omitted)"),
  options: mcpFieldOptionsSchema.describe("Field-level options (enumValues for enum fields, unsplash/aiGeneration for media)"),
  fieldConfig: mcpFieldConfigSchema.describe("Type-specific configuration (e.g., targetModel for relation)"),
});
export type AddFieldInput = z.input<typeof addFieldInput>;

/**
 * Update a custom field's properties.
 */
export const updateFieldInput = projectIdentifierSchema.extend({
  modelSlug: z.string().describe("Parent content model slug"),
  fieldName: z.string().describe("Field name to update"),
  displayName: z.string().min(1).max(200).optional().describe("Updated display name"),
  type: mcpFieldTypeEnum.optional().describe("Updated field type"),
  localized: z.boolean().optional().describe("Updated localization setting"),
  required: z.boolean().optional().describe("Updated required setting"),
  placeholder: z.string().max(500).optional().describe("Updated placeholder text"),
  helpText: z.string().max(500).optional().describe("Updated help text"),
  options: mcpFieldOptionsSchema.describe("Field-level options (enumValues for enum fields, unsplash/aiGeneration for media)"),
  fieldConfig: mcpFieldConfigSchema.describe("Type-specific configuration (e.g., targetModel for relation)"),
});
export type UpdateFieldInput = z.input<typeof updateFieldInput>;

/**
 * Remove a custom field from a content model.
 * WARNING: Deletes all field values for this field across ALL entries.
 */
export const removeFieldInput = projectIdentifierSchema.extend({
  modelSlug: z.string().describe("Parent content model slug"),
  fieldName: z.string().describe("Field name to remove"),
});
export type RemoveFieldInput = z.input<typeof removeFieldInput>;

/**
 * Reorder fields within a content model.
 */
export const reorderFieldsInput = projectIdentifierSchema.extend({
  modelSlug: z.string().describe("Parent content model slug"),
  fieldNames: z
    .array(z.string())
    .min(1)
    .describe("Ordered list of field names (first = position 0)"),
});
export type ReorderFieldsInput = z.input<typeof reorderFieldsInput>;

// ============================================================================
// Bulk Operations Schemas
// ============================================================================

/**
 * Publish multiple content entries at once.
 * Partial success possible — response reports published count and failures.
 */
export const bulkPublishEntriesInput = projectIdentifierSchema.extend({
  entryIds: z
    .array(z.string().uuid())
    .min(1)
    .max(50)
    .describe("Entry UUIDs to publish (max 50)"),
});
export type BulkPublishEntriesInput = z.input<typeof bulkPublishEntriesInput>;

/**
 * Bulk update content entries.
 * Updates multiple entries in a single call. Partial success possible.
 *
 * Workflow: listContentEntries({ missingLanguage: "tr" }) → bulkUpdateEntries
 * Each entry supports: languageCode (single-language), translations (multi-language), or metadata-only.
 */
export const bulkUpdateEntriesInput = projectIdentifierSchema.extend({
  entries: z
    .array(
      z.object({
        entryId: z.string().uuid().describe("Content entry UUID"),
        languageCode: z.string().optional().describe("Single-language mode: language to update"),
        title: z.string().optional().describe("Updated title"),
        slug: z.string().optional().describe("Updated URL slug"),
        bodyMarkdown: z.string().optional().describe("Updated content body in Markdown format"),
        customFields: z
          .record(z.string(), coercibleFieldValue)
          .optional()
          .describe("Updated custom field values"),
        translations: z
          .record(z.string(), translationValue)
          .optional()
          .describe("Multi-language translations — { langCode: { title, bodyMarkdown, customFields } }"),
        status: z
          .enum(["draft", "published", "archived"])
          .optional()
          .describe("Updated entry status. Default: published when translationStatus not set."),
      }),
    )
    .min(1)
    .max(20)
    .describe("Entries to update (max 20). Use listContentEntries({ missingLanguage: 'X' }) to find entries needing translation."),
});
export type BulkUpdateEntriesInput = z.input<typeof bulkUpdateEntriesInput>;

/**
 * Bulk create content entries.
 * Creates multiple entries in a single model. Partial success possible.
 */
export const bulkCreateEntriesInput = projectIdentifierSchema.extend({
  modelSlug: z.string().describe("Content model slug to create entries in"),
  entries: z
    .array(
      z.object({
        title: z.string().describe("Entry title"),
        slug: z.string().describe("URL slug"),
        bodyMarkdown: z.string().optional().describe("Content body in Markdown"),
        status: z.enum(["draft", "published"]).default("draft").describe("Initial status"),
        customFields: z.record(z.string(), coercibleFieldValue).optional().default({}).describe("Custom field values"),
        translations: z.record(z.string(), translationValue).optional().describe("Target language translations"),
        sourceLanguageCode: z.string().optional().describe("Source language code (defaults to project source language)"),
      }),
    )
    .min(1)
    .max(20)
    .describe("Entries to create (max 20)"),
});
export type BulkCreateEntriesInput = z.input<typeof bulkCreateEntriesInput>;

/**
 * Duplicate a content entry with all its translations and field values.
 * The copy is always created as "draft".
 */
export const duplicateContentEntryInput = projectIdentifierSchema.extend({
  entryId: z.string().uuid().describe("Source entry UUID to duplicate"),
  newSlug: z
    .string()
    .max(200)
    .regex(/^[a-z0-9-]+$/)
    .optional()
    .describe("Slug for the copy (defaults to original-slug-copy)"),
})
export type DuplicateContentEntryInput = z.input<typeof duplicateContentEntryInput>;

