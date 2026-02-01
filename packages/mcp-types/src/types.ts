/**
 * MCP API Types
 *
 * TypeScript interfaces for MCP router responses.
 * These types define the contract between the API and MCP clients.
 */

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
 * Response from getProject endpoint.
 */
export interface GetProjectResponse {
  /** Project identifier in 'org/project' format */
  project: string;
  /** Source language code */
  sourceLanguage: string;
  /** Available namespaces */
  namespaces: string[];
  /** Available target languages */
  languages: string[];
  /** Total number of translation keys */
  totalKeys: number;
  /** Coverage per language */
  coverage: Record<string, LanguageCoverage>;
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
 * Response from getAllTranslations endpoint.
 */
export interface GetAllTranslationsResponse {
  /** Project identifier */
  project: string;
  /** Source language code */
  sourceLanguage: string;
  /** Total number of keys returned */
  total: number;
  /** Search term if provided */
  search: string | string[] | null;
  /** Languages filter if provided */
  languages: string[] | null;
  /** Status filter */
  status?: string;
  /** Translation keys with their translations */
  keys: KeyWithFullTranslations[];
}

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
  /** Total number of matching keys */
  total: number;
  /** Current page number */
  page: number;
  /** Results per page */
  limit: number;
  /** Translation keys */
  keys: KeyWithTranslations[];
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
  /** Number of keys created */
  keysCreated: number;
  /** Created key details */
  keys: CreateKeyResultItem[];
  /** Skipped keys (duplicates) */
  skipped?: Array<{ key: string; reason: string }>;
}

/**
 * Result for a single updated key.
 */
export interface UpdateKeyResultItem {
  /** Key name */
  key: string;
  /** Languages that were updated */
  updatedLanguages: string[];
  /** Whether source text was updated */
  sourceUpdated: boolean;
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
}

/**
 * Response from addLanguage endpoint.
 */
export interface AddLanguageResponse {
  /** Operation success */
  success: boolean;
  /** Result message */
  message: string;
  /** Whether language already existed */
  alreadyExists: boolean;
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
  | "publish_batch";

/**
 * Sync job status.
 */
export type SyncJobStatus = "pending" | "in_progress" | "completed" | "failed";

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
  /** Activity logs */
  logs: string[];
  /** Affected keys */
  affectedKeys: AffectedKey[];
}

