/**
 * MCP Content API Compact Types
 *
 * Compact field name versions of content MCP API response types
 * for optimal AI token efficiency. 40-60% token reduction.
 *
 * Field Naming Convention:
 * - dn: displayName
 * - sl: slug
 * - ec: entryCount
 * - slang: sourceLanguage
 * - langs: availableLanguages
 * - cfv: customFieldValues
 * - tr: translations
 * - mdl: contentModel
 * - pub_at: publishedAt
 * - c_at: createdAt
 * - u_at: updatedAt
 * - desc: description
 */

// ============================================================================
// Compact Content Model Types
// ============================================================================

/**
 * Compact field definition.
 *
 * Field Mappings:
 * - id: id (unchanged)
 * - nm: name
 * - dn: displayName
 * - tp: type
 * - loc: localized
 * - req: required
 * - ph: placeholder
 * - ht: helpText
 * - pos: position
 * - fc: fieldConfig
 */
export interface CompactContentModelField {
  id: string;
  nm: string;
  dn: string;
  tp: string;
  loc: boolean;
  req: boolean;
  ph: string | null;
  ht: string | null;
  pos: number;
  /** Field options (e.g., { ev: [{ l: "Published", v: "published" }] } for enum values, sit = showInTable) */
  opts?: { ev?: Array<{ l: string; v: string }>; sit?: boolean } | null;
  /** Type-specific config (e.g., { tm: "categories" } for relation → targetModel) */
  fc?: { tm?: string } | null;
}

/**
 * Compact content model summary.
 *
 * Field Mappings:
 * - id: id (unchanged)
 * - sl: slug
 * - dn: displayName
 * - desc: description
 * - kind: kind (unchanged - already short)
 * - ico: icon
 * - ec: entryCount
 * - flds: fields
 */
export interface CompactContentModelSummary {
  id: string;
  sl: string;
  dn: string;
  desc: string | null;
  kind: string;
  ico: string | null;
  ec: number;
  /** Whether this model includes a body/rich-text field */
  ib: boolean;
  flds: CompactContentModelField[];
}

/**
 * Compact response from listContentModels.
 */
export interface CompactListContentModelsResponse {
  mdls: CompactContentModelSummary[];
}

/**
 * Compact response from getContentModel.
 *
 * Field Mappings:
 * - id: id
 * - sl: slug
 * - dn: displayName
 * - desc: description
 * - kind: kind
 * - ico: icon
 * - vh: enableVersionHistory
 * - flds: fields
 */
export interface CompactGetContentModelResponse {
  id: string;
  sl: string;
  dn: string;
  desc: string | null;
  kind: string;
  ico: string | null;
  vh: boolean;
  /** Whether this model includes a body/rich-text field */
  ib: boolean;
  flds: CompactContentModelField[];
}

// ============================================================================
// Compact Content Entry Types
// ============================================================================

/**
 * Compact resolved relation value (returned when expand is used).
 *
 * Field Mappings:
 * - id: id
 * - sl: slug
 * - t: title
 * - ms: modelSlug
 * - [key]: additional custom field values
 */
export interface CompactRelationValue {
  id: string;
  sl: string;
  t: string;
  ms: string;
  [key: string]: string | null;
}

/**
 * Compact author info.
 *
 * Field Mappings:
 * - id: id
 * - nm: name
 * - img: image
 */
export interface CompactContentAuthor {
  id: string;
  nm: string | null;
  img: string | null;
}

/**
 * Compact content model reference.
 *
 * Field Mappings:
 * - sl: slug
 * - dn: displayName
 * - kind: kind
 */
export interface CompactContentModelRef {
  sl: string;
  dn: string;
  kind: string;
}

/**
 * Compact content entry summary from listContentEntries.
 *
 * Field Mappings:
 * - id: id
 * - sl: slug
 * - st: status
 * - pub_at: publishedAt
 * - c_at: createdAt
 * - u_at: updatedAt
 * - mdl: contentModel
 * - slang: sourceLanguage
 * - t: title (source)
 * - langs: availableLanguages
 * - auth: author
 * - cfv: customFieldValues
 */
export interface CompactContentEntrySummary {
  id: string;
  sl: string;
  st: string;
  pub_at: string | null;
  c_at: string;
  u_at: string;
  mdl: CompactContentModelRef;
  slang: string;
  t: string;
  langs: string[];
  cfv: Record<string, string | null>;
  /** Expanded relation data (only present when expand is used) */
  rels?: Record<string, CompactRelationValue | null>;
}

/**
 * Compact response from listContentEntries.
 *
 * Field Mappings:
 * - items: items (unchanged - standard pagination)
 * - tot: total
 * - more: hasMore
 */
export interface CompactListContentEntriesResponse {
  items: CompactContentEntrySummary[];
  tot: number;
  more: boolean;
}

/**
 * Compact full translation for a single language.
 *
 * Field Mappings:
 * - id: id
 * - lc: languageCode
 * - t: title
 * - body: body (unchanged - content payload)
 * - st: status
 */
export interface CompactContentEntryTranslation {
  id: string;
  lc: string;
  t: string;
  body: unknown;
  st: string;
  /** Per-language custom field values */
  cfv?: Record<string, string | null>;
}

/**
 * Compact version history entry.
 *
 * Field Mappings:
 * - id: id
 * - v: version
 * - lc: languageCode
 * - chg: changeDescription
 * - c_at: createdAt
 * - by: createdBy
 */
export interface CompactContentEntryVersionInfo {
  id: string;
  v: number;
  lc: string | null;
  chg: string | null;
  c_at: string;
  by: CompactContentAuthor | null;
}

/**
 * Compact full content entry detail from getContentEntry.
 *
 * Field Mappings:
 * - id: id
 * - sl: slug
 * - st: status
 * - pub_at: publishedAt
 * - c_at: createdAt
 * - u_at: updatedAt
 * - slang: sourceLanguage
 * - langs: availableLanguages
 * - mdl: contentModel
 * - auth: author
 * - cfv: customFieldValues
 * - tr: translations
 * - vers: versions
 */
export interface CompactContentEntryDetail {
  id: string;
  sl: string;
  st: string;
  pub_at: string | null;
  c_at: string;
  u_at: string;
  slang: string;
  langs: string[];
  mdl: CompactContentModelSummary;
  cfv: Record<string, string | null>;
  /** Expanded relation data (only present when expand is used) */
  rels?: Record<string, CompactRelationValue | null>;
  tr: Record<string, CompactContentEntryTranslation>;
  vers: CompactContentEntryVersionInfo[];
}

/**
 * Compact response from createContentEntry / updateContentEntry / publishContentEntry.
 * Uses minimal format (no translations/versions) to reduce token usage ~70%.
 */
export type CompactCreateContentEntryResponse = CompactContentEntryDetailMin;
export type CompactUpdateContentEntryResponse = CompactContentEntryDetailMin;
export type CompactPublishContentEntryResponse = CompactContentEntryDetailMin;

/**
 * Compact response from deleteContentEntry.
 */
export interface CompactDeleteContentEntryResponse {
  ok: true;
}

// ============================================================================
// Compact Content Model Management Response Types
// ============================================================================

/** Compact response from createContentModel / updateContentModel. */
export type CompactCreateContentModelResponse = CompactGetContentModelResponse;
export type CompactUpdateContentModelResponse = CompactGetContentModelResponse;

/** Compact response from deleteContentModel. */
export interface CompactDeleteContentModelResponse {
  ok: true;
}

// ============================================================================
// Compact Field Management Response Types
// ============================================================================

/** Compact response from addField / updateField. */
export type CompactAddFieldResponse = CompactContentModelField;
export type CompactUpdateFieldResponse = CompactContentModelField;

/** Compact response from removeField. */
export interface CompactRemoveFieldResponse {
  ok: true;
}

/** Compact response from reorderFields. */
export interface CompactReorderFieldsResponse {
  ok: true;
}

// ============================================================================
// Compact Bulk Operations Response Types
// ============================================================================

/**
 * Compact response from bulkPublishEntries.
 *
 * Field Mappings:
 * - pub: published count
 * - fail: failed entries
 */
export interface CompactBulkPublishEntriesResponse {
  pub: number;
  fail: Array<{ id: string; err: string }>;
}

/** Compact response from duplicateContentEntry. */
export type CompactDuplicateContentEntryResponse = CompactContentEntryDetail;

/**
 * Compact response from bulkCreateEntries.
 *
 * Field Mappings:
 * - created: successful count
 * - entries: minimal entry info (id, slug, status)
 * - failed: entries that failed with index, slug, and error
 */
export interface CompactBulkCreateEntriesResponse {
  created: number;
  entries: Array<{ id: string; sl: string; st: string }>;
  failed: Array<{ idx: number; sl: string; err: string }>;
}

/**
 * Compact response from bulkUpdateEntries.
 *
 * Field Mappings:
 * - updated: successful count
 * - entries: minimal entry info (id, status)
 * - failed: entries that failed with index, entryId, and error
 */
export interface CompactBulkUpdateEntriesResponse {
  updated: number;
  entries: Array<{ id: string; st: string }>;
  failed: Array<{ idx: number; id: string; err: string }>;
}

// ============================================================================
// Compact Content Entry Types (compact=true)
// ============================================================================

/**
 * Minimal content entry summary from listContentEntries when compact=true.
 * Drops dates, model ref, custom fields — only identification + status + languages.
 *
 * ~65% token reduction vs full CompactContentEntrySummary.
 *
 * Field Mappings:
 * - id: entry UUID
 * - sl: slug
 * - st: status
 * - t: title (source language)
 * - langs: available language codes
 */
export interface CompactContentEntrySummaryMin {
  id: string;
  sl: string;
  st: string;
  t: string;
  langs: string[];
}

/**
 * Compact response from listContentEntries when compact=true.
 */
export interface CompactListContentEntriesCompactResponse {
  items: CompactContentEntrySummaryMin[];
  tot: number;
  more: boolean;
}

/**
 * Minimal content entry detail from getContentEntry when compact=true.
 * Omits translations (tr) and version history (vers).
 * expand is ignored when compact=true.
 *
 * ~70% token reduction vs full CompactContentEntryDetail.
 *
 * Field Mappings:
 * - id: entry UUID
 * - sl: slug
 * - st: status
 * - pub_at: publishedAt
 * - c_at: createdAt
 * - u_at: updatedAt
 * - slang: sourceLanguage
 * - langs: available language codes
 * - mdl: content model reference (compact)
 * - cfv: custom field values
 */
export interface CompactContentEntryDetailMin {
  id: string;
  sl: string;
  st: string;
  pub_at: string | null;
  c_at: string;
  u_at: string;
  slang: string;
  langs: string[];
  mdl: CompactContentModelRef;
  cfv: Record<string, string | null>;
}

