/**
 * MCP API Types
 *
 * TypeScript interfaces for MCP router responses.
 * These types define the contract between the API and MCP clients.
 */

// ============================================================================
// CDN Types
// ============================================================================

/**
 * CDN delivery metadata for a project.
 * Used by AI models to construct correct CDN URLs.
 *
 * CDN URL pattern: https://cdn.better-i18n.com/{orgSlug}/{projectSlug}/{locale}/{namespace}.json
 * Manifest: https://cdn.better-i18n.com/{orgSlug}/{projectSlug}/manifest.json
 *
 * IMPORTANT: "default" namespace is mapped to "translations" in CDN paths.
 */
export interface CdnInfo {
  /** CDN base URL (e.g., "https://cdn.better-i18n.com") */
  baseUrl: string;
  /** Full manifest URL (e.g., ".../acme/myapp/manifest.json") */
  manifestUrl: string;
  /** URL pattern with placeholders (e.g., ".../acme/myapp/{locale}/{namespace}.json") */
  pattern: string;
  /** 1-2 real example URLs constructed from project data */
  exampleUrls: string[];
}

// ============================================================================
// Project Types
// ============================================================================

/**
 * Project info from listProjects endpoint.
 */
export interface ProjectInfo {
  /** Project identifier in 'org/project' format */
  slug: string;
  /** Project display name */
  name: string;
  /** Organization display name */
  organizationName: string;
  /** Source language code (e.g., "en") */
  sourceLanguage: string;
  /** Target language codes */
  targetLanguages: string[];
  /** CDN URL pattern for this project (e.g., "https://cdn.better-i18n.com/acme/myapp/{locale}/{namespace}.json") */
  cdnFormat: string;
}

/**
 * Response from listProjects endpoint.
 */
export interface ListProjectsResponse {
  projects: ProjectInfo[];
}

/**
 * Coverage info per language.
 */
export interface LanguageCoverage {
  /** Number of translated keys */
  translated: number;
  /** Percentage of keys translated (0-100) */
  percentage: number;
}

/**
 * Namespace metadata returned from read endpoints.
 */
export interface NamespaceInfo {
  /** Namespace name ("default" for root keys) */
  name: string;
  /** Number of keys in this namespace */
  keyCount: number;
  /** Human-readable description */
  description: string | null;
  /** Structured context (team, domain, aiPrompt, tags) */
  context: {
    team?: string;
    domain?: string;
    aiPrompt?: string;
    tags?: string[];
  } | null;
}

/**
 * Response from getProject endpoint.
 */
export interface GetProjectResponse {
  /** Project identifier in 'org/project' format */
  project: string;
  /** Source language code */
  sourceLanguage: string;
  /** Available namespaces with metadata */
  namespaces: NamespaceInfo[];
  /** Available target languages */
  languages: string[];
  /** Total number of translation keys */
  totalKeys: number;
  /** Coverage per language */
  coverage: Record<string, LanguageCoverage>;
  /** CDN delivery metadata (URLs, pattern, examples) */
  cdn?: CdnInfo;
  /** Optional message (e.g., when no repository linked) */
  message?: string;
}

// ============================================================================
// Translation Key Types
// ============================================================================

/**
 * Translation info within a key.
 */
export interface TranslationInfo {
  /** Translation record ID */
  id: string;
  /** Translated text */
  text: string;
  /** Translation status */
  status: string;
}

/**
 * Key with full translations from getAllTranslations endpoint.
 */
export interface KeyWithFullTranslations {
  /** Key UUID */
  id: string;
  /** Key name */
  key: string;
  /** Namespace */
  namespace: string;
  /** Source text (source language) */
  sourceText: string | null;
  /** Translations by language code */
  translations: Record<string, TranslationInfo>;
}

/**
 * Response from getTranslations endpoint (renamed from getAllTranslations).
 */
export interface GetTranslationsResponse {
  /** Project identifier */
  project: string;
  /** Source language code */
  sourceLanguage: string;
  /** Keys actually included in this response (after all filters including status) */
  returned: number;
  /** Total keys in DB matching namespace/search/key filters (before in-memory status filter) */
  total: number;
  /** True when total > limit — use narrower filters instead of increasing limit */
  hasMore: boolean;
  /** Search term if provided */
  search: string | string[] | null;
  /** Languages filter if provided */
  languages: string[] | null;
  /** Status filter */
  status?: string;
  /** Translation keys with their translations */
  keys: KeyWithFullTranslations[];
  /** Namespace metadata for namespaces present in results */
  namespaceDetails?: Record<string, NamespaceInfo>;
  /** Hint when a filter was silently ignored (e.g., status without languages) */
  hint?: string;
}

/** @deprecated Use GetTranslationsResponse instead */
export type GetAllTranslationsResponse = GetTranslationsResponse;

/**
 * Key with translations from listKeys endpoint.
 */
export interface KeyWithTranslations {
  /** Key UUID */
  id: string;
  /** Key name */
  key: string;
  /** Namespace */
  namespace: string;
  /** Source text (source language) */
  sourceText: string | null;
  /** Translations by language code (text only) */
  translations: Record<string, string>;
  /** List of languages with translations */
  translatedLanguages: string[];
}

/**
 * Response from listKeys endpoint.
 */
export interface ListKeysResponse {
  total: number;
  page: number;
  limit: number;
  keys: KeyWithTranslations[];
  /** Namespace metadata for namespaces present in results */
  namespaceDetails?: Record<string, NamespaceInfo>;
}

// ============================================================================
// Create/Update/Delete Types
// ============================================================================

/**
 * Result for a single created key.
 */
export interface CreateKeyResultItem {
  /** Key name */
  key: string;
  /** Created key UUID */
  keyId: string;
  /** Number of translations added */
  translationsAdded: number;
}

/**
 * Response from createKeys endpoint.
 */
export interface CreateKeysResponse {
  /** Operation success */
  success: boolean;
  /** Total keys created */
  keysCreated: number;
  /** Number of new keys inserted */
  created: number;
  /** Number of soft-deleted keys renamed to free up key names */
  renamed: number;
  /** Number of duplicate keys skipped */
  duplicates: number;
  /** Created key details */
  keys: CreateKeyResultItem[];
  /** Skipped keys (duplicates) */
  skipped?: Array<{ key: string; reason: string }>;
  /** Cross-namespace warnings: key name exists in other namespaces */
  warnings?: Array<{
    key: string;
    namespace: string;
    existsIn: string[];
  }>;
  /** Pending publish hint - reminds AI to call publish */
  pendingPublish?: PendingPublishHint;
  /** Contextual hint for AI when result is ambiguous */
  hint?: string;
}

/**
 * Result for a single updated key.
 */
export interface UpdateKeyResultItem {
  /** Key UUID */
  keyId: string;
  /** Key name */
  key: string;
  /** Languages that were updated */
  updatedLanguages: string[];
  /** Whether source text was updated */
  sourceUpdated: boolean;
}

/**
 * A key that could not be found during updateKeys.
 */
export interface UpdateKeyNotFoundItem {
  /** Key UUID (set when id-based lookup was used) */
  id?: string;
  /** Key name (set when name-based lookup was used) */
  keyName?: string;
  /** Namespace (set when name-based lookup was used) */
  namespace?: string;
  /** Languages that were requested for this key */
  languages: string[];
}

/**
 * Response from updateKeys endpoint.
 */
export interface UpdateKeysResponse {
  /** Operation success */
  success: boolean;
  /** Number of keys updated */
  keysUpdated: number;
  /** Updated key details */
  updates: UpdateKeyResultItem[];
  /** Keys that were not found (partial-fail reporting) */
  notFound?: UpdateKeyNotFoundItem[];
  /** Pending publish hint - reminds AI to call publish */
  pendingPublish?: PendingPublishHint;
  /** Contextual hint for AI when result is ambiguous */
  hint?: string;
}

/**
 * Marked key info from deleteKeys endpoint.
 */
export interface MarkedKeyInfo {
  /** Key UUID */
  keyId: string;
  /** Key name */
  key: string;
  /** Namespace */
  namespace: string | null;
}

/**
 * Response from deleteKeys endpoint.
 */
export interface DeleteKeysResponse {
  /** Operation success */
  success: boolean;
  /** Number of keys marked for deletion */
  markedCount: number;
  /** Marked key details */
  marked: MarkedKeyInfo[];
  /** Key IDs that were not found */
  skipped?: string[];
  /** Pending publish hint */
  pendingPublish?: PendingPublishHint;
  /** Contextual hint for AI */
  hint?: string;
}

/**
 * Result for a single language add operation.
 */
export interface LanguageAddResult {
  languageCode: string;
  status: "active" | "draft";
  added: boolean; // false = already existed, skipped
}

/**
 * Response from addLanguages endpoint.
 */
export interface AddLanguagesResponse {
  success: boolean;
  results: LanguageAddResult[];
  added: number;
  skipped: number; // already existed
  pendingPublish?: PendingPublishHint;
  /** Contextual hint for AI */
  hint?: string;
}

/**
 * Result for a single language update operation.
 */
export interface LanguageUpdateResult {
  languageCode: string;
  previousStatus: "active" | "draft" | "archived";
  newStatus: "active" | "draft" | "archived";
  changed: boolean; // false = same status, no-op
}

/**
 * Response from updateLanguages endpoint.
 */
export interface UpdateLanguagesResponse {
  success: boolean;
  results: LanguageUpdateResult[];
  notFound: string[];
  pendingPublish?: PendingPublishHint;
  /** Contextual hint for AI */
  hint?: string;
}

/**
 * Response from deleteLanguages endpoint.
 */
export interface DeleteLanguagesResponse {
  success: boolean;
  archived: string[]; // successfully archived
  alreadyArchived: string[]; // were already archived
  notFound: string[]; // not in project
  pendingPublish?: PendingPublishHint;
}

// ============================================================================
// Sync Types
// ============================================================================

/**
 * Sync job type.
 */
export type SyncJobType =
  | "initial_import"
  | "source_sync"
  | "cdn_upload"
  | "batch_publish";

/**
 * Sync job status.
 */
export type SyncJobStatus = "pending" | "in_progress" | "completed" | "failed";

/**
 * User who triggered the sync job.
 */
export interface TriggeredByUser {
  /** User's display name */
  name: string;
  /** User's avatar URL */
  image: string | null;
}

/**
 * Sync job summary from getSyncs endpoint.
 */
export interface SyncJobSummary {
  /** Sync job ID */
  id: string;
  /** Job type */
  type: SyncJobType;
  /** Job status */
  status: SyncJobStatus;
  /** Start time (ISO string) */
  startedAt: string;
  /** Completion time (ISO string) */
  completedAt?: string;
  /** Error message if failed */
  errorMessage?: string | null;
  /** User who triggered the sync (null for system/webhook triggers) */
  triggeredBy?: TriggeredByUser | null;
  /** Job metadata */
  metadata: {
    keysProcessed: number;
    totalFiles?: number | null;
    processedFiles?: number | null;
  };
}

/**
 * Response from getSyncs endpoint.
 */
export interface GetSyncsResponse {
  /** Project identifier */
  project: string;
  /** Total syncs returned */
  total: number;
  /** Sync job summaries */
  syncs: SyncJobSummary[];
  /** Optional message */
  message?: string;
}

/**
 * Affected key from sync operation.
 */
export interface AffectedKey {
  /** Key name */
  key: string;
  /** Action performed */
  action: string;
}

/**
 * Response from getSync endpoint.
 */
export interface GetSyncResponse {
  /** Sync job ID */
  id: string;
  /** Job type */
  type: SyncJobType;
  /** Job status */
  status: SyncJobStatus;
  /** Start time (ISO string) */
  startedAt: string;
  /** Completion time (ISO string) */
  completedAt?: string;
  /** Error message if failed */
  errorMessage?: string | null;
  /** User who triggered the sync (null for system/webhook triggers) */
  triggeredBy?: TriggeredByUser | null;
  /** Activity logs */
  logs: string[];
  /** Affected keys */
  affectedKeys: AffectedKey[];
  /** Contextual hint for AI (e.g., failure recovery, polling guidance) */
  hint?: string;
}

// ============================================================================
// Publish Types
// ============================================================================

/**
 * Preview item for pending translation.
 */
export interface PendingTranslationPreview {
  /** Key UUID */
  keyId: string;
  /** Key name */
  key: string;
  /** Namespace */
  namespace: string | null;
  /** Translation text */
  text: string;
  /** Translation status */
  status: string;
}

/**
 * Pending changes by language.
 */
export interface PendingChangesByLanguage {
  /** Number of pending translations */
  count: number;
  /** Preview of first few translations */
  preview: PendingTranslationPreview[];
}

/**
 * Deleted key info.
 */
export interface PendingDeletedKey {
  /** Key UUID */
  keyId: string;
  /** Key name */
  key: string;
  /** Namespace */
  namespace: string | null;
  /** Source text */
  sourceText: string | null;
}

/**
 * Response from getPendingChanges endpoint.
 */
export interface GetPendingChangesResponse {
  /** Project identifier */
  project: string;
  /** Whether there are any pending changes */
  hasPendingChanges: boolean;
  /** Summary counts */
  summary: {
    /** Total pending translations */
    translations: number;
    /** Keys marked for deletion */
    deletedKeys: number;
    /** Language status changes */
    languageChanges: number;
    /** Total changes */
    total: number;
  };
  /** Breakdown by language code */
  byLanguage: Record<string, PendingChangesByLanguage>;
  /** Deleted keys awaiting publish */
  deletedKeys: PendingDeletedKey[];
  /** Publish destination */
  publishDestination: "github" | "cdn" | "none";
  /** Reason if cannot publish */
  cannotPublishReason?: string;
  /** Recent sync/publish activity for context (last 3 jobs) */
  recentActivity?: RecentActivityItem[];
  /** Contextual hint for AI */
  hint?: string;
}

/**
 * A recent sync or publish job for contextual information.
 */
export interface RecentActivityItem {
  /** Sync job ID — use with getSync for full details */
  id: string;
  /** Job type */
  type: "publish" | "sync" | "import";
  /** Job status */
  status: string;
  /** When the job completed */
  completedAt: string | null;
  /** Job stats */
  stats: {
    /** New keys imported */
    newKeys: number;
    /** Updated keys */
    updatedKeys: number;
    /** Total files processed */
    totalFiles: number;
  };
}

/**
 * Response from publish endpoint.
 */
export interface PublishResponse {
  /** Operation success */
  success: boolean;
  /** Number of translations published */
  published: number;
  /** Number of repositories updated */
  repositories: number;
  /** Created sync job IDs */
  syncJobIds: string[];
  /** Number of deleted keys processed */
  deletedKeysProcessed?: number;
  /** Number of language changes processed */
  languageChangesProcessed?: number;
  /** Human-readable message */
  message: string;
  /** Contextual hint for AI (next steps, polling guidance) */
  hint?: string;
}


/**
 * Pending publish hint included in write operation responses.
 * Helps AI model know when to call publish.
 */
export interface PendingPublishHint {
  /** Whether there are unpublished changes */
  hasChanges: boolean;
  /** Number of pending changes from this operation */
  count: number;
  /** Hint message for AI */
  hint: string;
}
