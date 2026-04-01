/**
 * MCP API Compact Types
 *
 * Compact field name versions of MCP API response types for optimal AI token efficiency.
 * These types use abbreviated field names to reduce token usage by 40-60%.
 *
 * Field Naming Convention:
 * - 2-3 character abbreviations for common fields
 * - Preserve semantic meaning where possible
 * - Consistent across all endpoints
 *
 * @example
 * // Verbose format (3200 tokens)
 * { project: "acme/main", sourceLanguage: "en", totalKeys: 150 }
 *
 * // Compact format (1600 tokens - 50% reduction)
 * { prj: "acme/main", sl: "en", tk: 150 }
 */

import type { SyncJobType, SyncJobStatus } from "./types";

// ============================================================================
// Compact CDN Types
// ============================================================================

/**
 * Compact CDN delivery metadata.
 *
 * Field Mappings:
 * - base: baseUrl
 * - mfst: manifestUrl
 * - pat: pattern
 * - ex: exampleUrls
 */
export interface CompactCdnInfo {
  /** CDN base URL */
  base: string;
  /** Full manifest URL */
  mfst: string;
  /** URL pattern with {locale}/{namespace} placeholders */
  pat: string;
  /** Real example URLs */
  ex: string[];
}

// ============================================================================
// Compact Project Types
// ============================================================================

/**
 * Compact namespace metadata.
 *
 * Field Mappings:
 * - nm: name
 * - kc: keyCount
 * - desc: description
 * - ctx: context
 */
export interface CompactNamespaceInfo {
  /** Namespace name ("default" for root keys) */
  nm: string;
  /** Number of keys in this namespace */
  kc: number;
  /** Human-readable description */
  desc: string | null;
  /** Structured context (team, domain, aiPrompt, tags) */
  ctx: {
    /** Team name */
    t?: string;
    /** Domain */
    d?: string;
    /** AI prompt */
    ap?: string;
    /** Tags */
    tg?: string[];
  } | null;
}

/**
 * Compact coverage info per language.
 *
 * Field Mappings:
 * - tr: translated
 * - pct: percentage
 */
export interface CompactLanguageCoverage {
  /** Number of translated keys */
  tr: number;
  /** Percentage of keys translated (0-100) */
  pct: number;
}

/**
 * Compact response from getProject endpoint.
 *
 * Field Mappings:
 * - prj: project
 * - sl: sourceLanguage
 * - nss: namespaces
 * - lng: languages
 * - tk: totalKeys
 * - cov: coverage
 * - msg: message
 */
export interface CompactGetProjectResponse {
  /** Project identifier in 'org/project' format */
  prj: string;
  /** Source language code */
  sl: string;
  /** Available namespaces with metadata */
  nss: CompactNamespaceInfo[];
  /** Available target languages */
  lng: string[];
  /** Total number of translation keys */
  tk: number;
  /** Coverage per language */
  cov: Record<string, CompactLanguageCoverage>;
  /** CDN delivery metadata */
  cdn?: CompactCdnInfo;
  /** Optional message (e.g., when no repository linked) */
  msg?: string;
}

// ============================================================================
// Compact GetAllTranslations Types
// ============================================================================

/**
 * Compact translation key item from getAllTranslations endpoint.
 *
 * Field Mappings:
 * - id: id (unchanged - used for tool calls)
 * - k: key
 * - ns: namespace (omitted when "default")
 * - src: sourceText
 * - tr: translations map { langCode: { id, t, st } } (omitted when empty)
 */
export interface CompactGetAllTranslationsKey {
  /** Key UUID */
  id: string;
  /** Key name */
  k: string;
  /** Namespace (omitted when "default") */
  ns?: string;
  /** Source text */
  src: string | null;
  /** Translations by language code (omitted when empty) */
  tr?: Record<string, {
    /** Translation record ID */
    id: string;
    /** Translated text */
    t: string;
    /** Status */
    st: string;
  }>;
}

/**
 * Compact namespace detail for getAllTranslations response.
 *
 * Field Mappings:
 * - kc: keyCount
 * - desc: description (max 80 chars)
 * - ap: aiPrompt (max 100 chars)
 */
export interface CompactGetAllTranslationsNsd {
  /** Key count */
  kc: number;
  /** Description (truncated) */
  desc?: string;
  /** AI prompt (truncated) */
  ap?: string;
}

/**
 * Compact response from getAllTranslations endpoint.
 *
 * Token Reduction: ~50-60% vs verbose format
 *
 * Field Mappings:
 * - prj: project
 * - sl: sourceLanguage
 * - ret: returned
 * - tot: total
 * - has_more: hasMore
 * - srch: search (omitted when null)
 * - lng: languages (omitted when null)
 * - st: status (omitted when "all")
 * - keys: keys array
 * - nsd: namespaceDetails (omitted when empty)
 */
export interface CompactGetAllTranslationsResponse {
  /** Project identifier in 'org/project' format */
  prj: string;
  /** Source language code */
  sl: string;
  /** Keys returned in this response */
  ret: number;
  /** Total matching keys in DB */
  tot: number;
  /** Whether more keys exist — use narrower filters to access them */
  has_more: boolean;
  /** Search term(s) if provided */
  srch?: string | string[] | null;
  /** Languages filter if provided */
  lng?: string[] | null;
  /** Status filter (omitted when "all") */
  st?: string;
  /** Translation keys */
  keys: CompactGetAllTranslationsKey[];
  /** Namespace metadata (omitted when empty) */
  nsd?: Record<string, CompactGetAllTranslationsNsd>;
  /** Hint when a filter was silently ignored */
  hint?: string;
}

// ============================================================================
// Compact ListKeys Types
// ============================================================================

/**
 * Compact key item from listKeys endpoint.
 *
 * Field Mappings:
 * - k: key
 * - ns: namespace index into CompactListKeysResponse.nss (deduplicates repeated namespace strings)
 * - id: id (optional, included when "id" in fields)
 * - src: sourceText (optional, included when "sourceText" in fields)
 * - tl: translatedLanguages (optional, included when "translatedLanguages" in fields)
 * - tlc: translatedLanguageCount (optional, included when "translatedLanguageCount" in fields)
 * - tr: translations (optional, included when "translations" in fields)
 */
export interface CompactListKeysKey {
  /** Key name */
  k: string;
  /** Namespace index — look up in CompactListKeysResponse.nss */
  ns: number;
  /** Key UUID (when "id" field requested) */
  id?: string;
  /** Source text (when "sourceText" field requested) */
  src?: string | null;
  /** Language codes with translations (when "translatedLanguages" field requested) */
  tl?: string[];
  /** Translated language count (when "translatedLanguageCount" field requested) */
  tlc?: number;
  /** Translation texts by language code (when "translations" field requested) */
  tr?: Record<string, string>;
}

/**
 * Compact response from listKeys endpoint.
 *
 * Namespace deduplication: `nss` is the lookup table — each key's `ns` is an index into it.
 * e.g. nss=["auth","common"] and ns=0 means the key belongs to "auth".
 *
 * Field Mappings:
 * - tot: total matching keys (before pagination)
 * - ret: returned (keys in this page)
 * - pg: page
 * - lim: limit
 * - has_more: whether more pages exist — use page+1 to fetch next
 * - nss: namespace lookup table (deduplicated)
 * - k: keys
 * - note: optional warning (e.g. large project hint)
 */
export interface CompactListKeysResponse {
  /** Total matching keys (before pagination) */
  tot: number;
  /** Keys returned in this page */
  ret: number;
  /** Current page (1-indexed) */
  pg: number;
  /** Page size */
  lim: number;
  /** Whether more pages exist — increment page to fetch next batch */
  has_more: boolean;
  /** Namespace lookup table — use key.ns as index */
  nss: string[];
  /** Key items */
  k: CompactListKeysKey[];
  /** Optional hint (e.g., large project warning) */
  note?: string;
}

// ============================================================================
// Compact Publish Types
// ============================================================================

/**
 * Compact preview item for pending translation.
 *
 * Field Mappings:
 * - kid: keyId
 * - k: key
 * - ns: namespace
 * - t: text
 * - st: status
 */
export interface CompactPendingTranslationPreview {
  /** Key UUID */
  kid: string;
  /** Key name */
  k: string;
  /** Namespace */
  ns: string | null;
  /** Translation text */
  t: string;
  /** Translation status */
  st: string;
}

/**
 * Compact pending changes by language.
 *
 * Field Mappings:
 * - cnt: count
 * - prv: preview
 */
export interface CompactPendingChangesByLanguage {
  /** Number of pending translations */
  cnt: number;
  /** Preview of first few translations */
  prv: CompactPendingTranslationPreview[];
}

/**
 * Compact deleted key info.
 *
 * Field Mappings:
 * - kid: keyId
 * - k: key
 * - ns: namespace
 * - src: sourceText
 */
export interface CompactPendingDeletedKey {
  /** Key UUID */
  kid: string;
  /** Key name */
  k: string;
  /** Namespace */
  ns: string | null;
  /** Source text */
  src: string | null;
}

/**
 * Compact response from getPendingChanges endpoint.
 *
 * Field Mappings:
 * - prj: project
 * - has_chg: hasPendingChanges
 * - sum: summary
 * - by_lng: byLanguage
 * - del_k: deletedKeys
 * - pub_dst: publishDestination
 * - no_pub_rsn: cannotPublishReason
 */
export interface CompactGetPendingChangesResponse {
  /** Project identifier */
  prj: string;
  /** Whether there are any pending changes */
  has_chg: boolean;
  /** Summary counts */
  sum: {
    /** Total pending translations */
    tr: number;
    /** Keys marked for deletion */
    del_k: number;
    /** Language status changes */
    lng_chg: number;
    /** Total changes */
    tot: number;
  };
  /** Breakdown by language code */
  by_lng: Record<string, CompactPendingChangesByLanguage>;
  /** Deleted keys awaiting publish */
  del_k: CompactPendingDeletedKey[];
  /** Publish destination */
  pub_dst: "github" | "cdn" | "none";
  /** Reason if cannot publish */
  no_pub_rsn?: string;
  /** Recent sync/publish activity (last 3 jobs) */
  recent?: CompactRecentActivityItem[];
  /** Contextual hint for AI */
  hint?: string;
}

/**
 * Compact recent activity item.
 *
 * Field Mappings:
 * - tp: type
 * - st: status
 * - at: completedAt
 * - nk: stats.newKeys
 * - uk: stats.updatedKeys
 * - tf: stats.totalFiles
 */
export interface CompactRecentActivityItem {
  /** Sync job ID — use with getSync for details */
  id: string;
  /** Job type: publish | sync | import */
  tp: string;
  /** Job status */
  st: string;
  /** Completed at (ISO) */
  at: string | null;
  /** New keys */
  nk: number;
  /** Updated keys */
  uk: number;
  /** Total files */
  tf: number;
}

// ============================================================================
// Compact Sync Types
// ============================================================================

/**
 * Compact user who triggered the sync job.
 *
 * Field Mappings:
 * - nm: name
 * - img: image
 */
export interface CompactTriggeredByUser {
  /** User's display name */
  nm: string;
  /** User's avatar URL */
  img: string | null;
}

/**
 * Compact sync job summary from getSyncs endpoint.
 *
 * Field Mappings:
 * - id: id (unchanged - already short)
 * - tp: type
 * - st: status
 * - st_at: startedAt
 * - cp_at: completedAt
 * - err_msg: errorMessage
 * - trig_by: triggeredBy
 * - meta: metadata
 */
export interface CompactSyncJob {
  /** Sync job ID */
  id: string;
  /** Job type */
  tp: SyncJobType;
  /** Job status */
  st: SyncJobStatus;
  /** Start time (ISO string) */
  st_at: string;
  /** Completion time (ISO string) */
  cp_at?: string;
  /** Error message if failed */
  err_msg?: string | null;
  /** User who triggered the sync (null for system/webhook triggers) */
  trig_by?: CompactTriggeredByUser | null;
  /** Job metadata */
  meta: {
    /** Keys processed count */
    kp: number;
    /** Total files count */
    tf?: number | null;
    /** Processed files count */
    pf?: number | null;
  };
}

/**
 * Compact response from getSyncs endpoint.
 *
 * Field Mappings:
 * - prj: project
 * - tot: total
 * - sy: syncs
 * - msg: message
 */
export interface CompactGetSyncsResponse {
  /** Project identifier */
  prj: string;
  /** Total syncs returned */
  tot: number;
  /** Sync job summaries */
  sy: CompactSyncJob[];
  /** Optional message */
  msg?: string;
}

/**
 * Compact affected key from sync operation.
 *
 * Field Mappings:
 * - k: key
 * - act: action
 */
export interface CompactAffectedKey {
  /** Key name */
  k: string;
  /** Action performed */
  act: string;
}

/**
 * Compact response from getSync endpoint.
 *
 * Field Mappings:
 * - id: id (unchanged - already short)
 * - tp: type
 * - st: status
 * - st_at: startedAt
 * - cp_at: completedAt
 * - err_msg: errorMessage
 * - trig_by: triggeredBy
 * - log: logs
 * - aff_k: affectedKeys
 */
export interface CompactGetSyncResponse {
  /** Sync job ID */
  id: string;
  /** Job type */
  tp: SyncJobType;
  /** Job status */
  st: SyncJobStatus;
  /** Start time (ISO string) */
  st_at: string;
  /** Completion time (ISO string) */
  cp_at?: string;
  /** Error message if failed */
  err_msg?: string | null;
  /** User who triggered the sync (null for system/webhook triggers) */
  trig_by?: CompactTriggeredByUser | null;
  /** Activity logs */
  log: string[];
  /** Affected keys */
  aff_k: CompactAffectedKey[];
  /** Contextual hint for AI */
  hint?: string;
}

// ============================================================================
// Compact Write Response Types (createKeys, updateKeys, deleteKeys)
// ============================================================================

/**
 * Compact pending publish hint.
 *
 * Field Mappings:
 * - has: hasChanges
 * - cnt: count
 * - hint: hint (unchanged - already useful)
 */
export interface CompactPendingPublishHint {
  /** Whether there are unpublished changes */
  has: boolean;
  /** Number of pending changes */
  cnt: number;
  /** Hint message for AI */
  hint: string;
}

/**
 * Compact response from createKeys endpoint.
 *
 * Field Mappings:
 * - ok: success
 * - cnt: keysCreated
 * - new: created
 * - ren: renamed
 * - dup: duplicates
 * - k: keys array [{ k, id, tr }]
 * - skip: skipped
 * - pub: pendingPublish
 */
export interface CompactCreateKeysResponse {
  /** Operation success */
  ok: boolean;
  /** Total keys created */
  cnt: number;
  /** New keys inserted */
  new: number;
  /** Soft-deleted keys renamed */
  ren: number;
  /** Duplicate keys skipped */
  dup: number;
  /** Created keys */
  k: Array<{
    /** Key name */
    k: string;
    /** Key UUID */
    id: string;
    /** Translations added count */
    tr: number;
  }>;
  /** Skipped keys */
  skip?: Array<{ k: string; reason: string }>;
  /** Cross-namespace name collision warnings */
  warn?: Array<{
    /** Key name */
    k: string;
    /** Namespace it was created in */
    ns: string;
    /** Other namespaces where same key name exists */
    other: string[];
  }>;
  /** Pending publish hint */
  pub?: CompactPendingPublishHint;
  /** Contextual hint for AI */
  hint?: string;
}

/**
 * Compact response from updateKeys endpoint.
 *
 * Field Mappings:
 * - ok: success
 * - cnt: keysUpdated
 * - upd: updates array [{ id, k, lng, src }]
 * - errors: not-found items (partial-fail)
 * - pub: pendingPublish
 */
export interface CompactUpdateKeysResponse {
  /** Operation success */
  ok: boolean;
  /** Number of keys updated */
  cnt: number;
  /** Updated key details */
  upd: Array<{
    /** Key UUID (set when id-based lookup was used) */
    id?: string;
    /** Key name */
    k: string;
    /** Languages updated */
    lng: string[];
    /** Source text updated */
    src: boolean;
  }>;
  /** Keys that could not be found — partial-fail reporting */
  errors?: Array<{
    /** Key UUID (when id-based lookup was used) */
    id?: string;
    /** Key name (when name-based lookup was used) */
    k?: string;
    /** Namespace */
    ns?: string;
    /** Languages that were requested */
    l: string[];
    /** Error code */
    code: "not_found";
    /** Human-readable message */
    msg: string;
  }>;
  /** Pending publish hint */
  pub?: CompactPendingPublishHint;
  /** Contextual hint for AI */
  hint?: string;
}

/**
 * Compact response from deleteKeys endpoint.
 *
 * Field Mappings:
 * - ok: success
 * - cnt: markedCount
 * - mk: marked keys [{ id, k, ns }]
 * - skip: skipped key IDs
 */
export interface CompactDeleteKeysResponse {
  /** Operation success */
  ok: boolean;
  /** Number of keys marked for deletion */
  cnt: number;
  /** Marked keys */
  mk: Array<{
    /** Key UUID */
    id: string;
    /** Key name */
    k: string;
    /** Namespace */
    ns: string | null;
  }>;
  /** Skipped key IDs (not found) */
  skip?: string[];
  /** Pending publish hint */
  pub?: CompactPendingPublishHint;
  /** Contextual hint for AI */
  hint?: string;
}

// ============================================================================
// Compact GetTranslations (compact=true) Types
// ============================================================================

/**
 * Compact key from getTranslations when compact=true.
 * Omits src (source text) and tr (translations) — only identification + count.
 *
 * Field Mappings:
 * - id: key UUID
 * - k: key name
 * - ns: namespace (omitted when "default")
 * - tc: translation count (number of languages with a translation)
 */
export interface CompactGetTranslationsCompactKey {
  /** Key UUID */
  id: string;
  /** Key name */
  k: string;
  /** Namespace (omitted when "default") */
  ns?: string;
  /** Translation count — how many languages have a translation for this key */
  tc: number;
}

/**
 * Compact response from getTranslations when compact=true.
 * ~75% token reduction vs full response.
 *
 * Preserves envelope (pagination, filters) but strips per-key translation data.
 */
export interface CompactGetTranslationsCompactResponse {
  /** Project identifier in 'org/project' format */
  prj: string;
  /** Source language code */
  sl: string;
  /** Keys returned in this response */
  ret: number;
  /** Total matching keys in DB */
  tot: number;
  /** Whether more keys exist */
  has_more: boolean;
  /** Search term(s) if provided */
  srch?: string | string[] | null;
  /** Languages filter if provided */
  lng?: string[] | null;
  /** Status filter (omitted when "all") */
  st?: string;
  /** Translation keys (compact — no src/tr) */
  keys: CompactGetTranslationsCompactKey[];
  /** Hint when a filter was silently ignored */
  hint?: string;
}
