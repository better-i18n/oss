/**
 * MCP Content API Types (Verbose)
 *
 * TypeScript interfaces for content MCP router responses.
 * These types define the contract between the API and MCP clients.
 */

// ============================================================================
// Content Model Types
// ============================================================================

/**
 * Field definition within a content model.
 */
/** Type-specific field configuration */
export interface ContentModelFieldConfig {
  /** Target content model slug for relation fields */
  targetModel?: string;
}

/** Single enum option */
export interface ContentModelEnumValue {
  /** Display label shown to users */
  label: string;
  /** Machine-readable value stored in DB */
  value: string;
}

/** Field-level options */
export interface ContentModelFieldOptions {
  /** Allowed values for enum fields */
  enumValues?: ContentModelEnumValue[];
  /** Unsplash integration for media fields */
  unsplash?: { enabled: boolean };
  /** AI generation settings for media fields */
  aiGeneration?: { enabled: boolean; prompt?: string; model?: string };
  /** Whether this field appears as a column in the content list table */
  showInTable?: boolean;
}

export interface ContentModelField {
  /** Field UUID */
  id: string;
  /** Field name (snake_case identifier) */
  name: string;
  /** Display name */
  displayName: string;
  /** Field type */
  type: string;
  /** Whether field is localized per language */
  localized: boolean;
  /** Whether field is required */
  required: boolean;
  /** Placeholder text */
  placeholder: string | null;
  /** Help text */
  helpText: string | null;
  /** Sort position */
  position: number;
  /** Field-level options (enumValues for enum, unsplash/aiGeneration for media) */
  options?: ContentModelFieldOptions | null;
  /** Type-specific configuration (e.g., targetModel for relation fields) */
  fieldConfig?: ContentModelFieldConfig | null;
}

/**
 * Content model summary from listContentModels endpoint.
 */
export interface ContentModelSummary {
  /** Model UUID */
  id: string;
  /** URL slug */
  slug: string;
  /** Display name */
  displayName: string;
  /** Description */
  description: string | null;
  /** Model kind (collection or single) */
  kind: string;
  /** Icon identifier */
  icon: string | null;
  /** Number of entries in this model */
  entryCount: number;
  /** Whether this model includes a body/rich-text field */
  includeBody: boolean;
  /** Field definitions */
  fields: ContentModelField[];
}

/**
 * Response from listContentModels endpoint.
 */
export interface ListContentModelsResponse {
  /** Content models */
  models: ContentModelSummary[];
}

/**
 * Response from getContentModel endpoint.
 */
export interface GetContentModelResponse {
  /** Model UUID */
  id: string;
  /** URL slug */
  slug: string;
  /** Display name */
  displayName: string;
  /** Description */
  description: string | null;
  /** Model kind */
  kind: string;
  /** Icon identifier */
  icon: string | null;
  /** Whether version history is enabled */
  enableVersionHistory: boolean;
  /** Whether this model includes a body/rich-text field */
  includeBody: boolean;
  /** Field definitions */
  fields: ContentModelField[];
}

// ============================================================================
// Content Entry Types
// ============================================================================

/**
 * Resolved relation value (returned when expand is used).
 * Custom fields from the related entry are spread directly.
 */
export interface RelationValue {
  /** Related entry UUID */
  id: string;
  /** Related entry slug */
  slug: string;
  /** Related entry title */
  title: string;
  /** Related entry's model slug */
  modelSlug: string;
  /** Additional custom field values spread from the related entry */
  [key: string]: string | null;
}

/**
 * Author info.
 */
export interface ContentAuthor {
  /** User UUID */
  id: string;
  /** Display name */
  name: string | null;
  /** Avatar URL */
  image: string | null;
}

/**
 * Content model reference within an entry.
 */
export interface ContentModelRef {
  /** Model slug */
  slug: string;
  /** Model display name */
  displayName: string;
  /** Model kind */
  kind: string;
}

/**
 * Content entry summary from listContentEntries endpoint.
 */
export interface ContentEntrySummary {
  /** Entry UUID */
  id: string;
  /** URL slug */
  slug: string;
  /** Entry status */
  status: string;
  /** Published timestamp (ISO) or null */
  publishedAt: string | null;
  /** Created timestamp (ISO) */
  createdAt: string;
  /** Updated timestamp (ISO) */
  updatedAt: string;
  /** Content model reference */
  contentModel: ContentModelRef;
  /** Source language code */
  sourceLanguage: string;
  /** Source title */
  title: string;
  /** Languages with translations */
  availableLanguages: string[];
  /** Custom field values (field_name → value) */
  customFieldValues: Record<string, string | null>;
  /** Expanded relation data (only present when expand is used) */
  relations?: Record<string, RelationValue | null>;
}

/**
 * Response from listContentEntries endpoint.
 */
export interface ListContentEntriesResponse {
  /** Content entries */
  items: ContentEntrySummary[];
  /** Total matching entries */
  total: number;
  /** Whether more pages exist */
  hasMore: boolean;
}

/**
 * Full translation for a single language within an entry.
 */
export interface ContentEntryTranslation {
  /** Translation UUID */
  id: string;
  /** Language code */
  languageCode: string;
  /** Title */
  title: string;
  /** Plate editor JSON body */
  body: unknown;
  /** Translation status */
  status: string;
  /** Per-language custom field values (non-localized + this language's localized values) */
  customFieldValues?: Record<string, string | null>;
}

/**
 * Version history entry.
 */
export interface ContentEntryVersionInfo {
  /** Version UUID */
  id: string;
  /** Version number */
  version: number;
  /** Language code (null if applies to all languages) */
  languageCode: string | null;
  /** Change description */
  changeDescription: string | null;
  /** Created timestamp (ISO) */
  createdAt: string;
  /** Creator info */
  createdBy: ContentAuthor | null;
}

/**
 * Full content entry detail from getContentEntry endpoint.
 */
export interface ContentEntryDetail {
  /** Entry UUID */
  id: string;
  /** URL slug */
  slug: string;
  /** Entry status */
  status: string;
  /** Published timestamp (ISO) or null */
  publishedAt: string | null;
  /** Created timestamp (ISO) */
  createdAt: string;
  /** Updated timestamp (ISO) */
  updatedAt: string;
  /** Source language code */
  sourceLanguage: string;
  /** Languages with translations */
  availableLanguages: string[];
  /** Content model with fields */
  contentModel: ContentModelSummary;
  /** Custom field values */
  customFieldValues: Record<string, string | null>;
  /** Expanded relation data (only present when expand is used) */
  relations?: Record<string, RelationValue | null>;
  /** Translations by language code */
  translations: Record<string, ContentEntryTranslation>;
  /** Version history */
  versions: ContentEntryVersionInfo[];
}

// ============================================================================
// Write Response Types
// ============================================================================

/**
 * Response from createContentEntry endpoint.
 * Returns the full entry detail.
 */
export type CreateContentEntryResponse = ContentEntryDetail;

/**
 * Response from updateContentEntry endpoint.
 * Returns the full entry detail.
 */
export type UpdateContentEntryResponse = ContentEntryDetail;

/**
 * Response from publishContentEntry endpoint.
 * Returns the full entry detail.
 */
export type PublishContentEntryResponse = ContentEntryDetail;

/**
 * Response from deleteContentEntry endpoint.
 */
export interface DeleteContentEntryResponse {
  /** Operation success */
  success: true;
}

// ============================================================================
// Content Model Management Response Types
// ============================================================================

/** Response from createContentModel — returns full model detail. */
export type CreateContentModelResponse = GetContentModelResponse;

/** Response from updateContentModel — returns full model detail. */
export type UpdateContentModelResponse = GetContentModelResponse;

/** Response from deleteContentModel. */
export interface DeleteContentModelResponse {
  success: true;
}

// ============================================================================
// Field Management Response Types
// ============================================================================

/** Response from addField — returns the created field. */
export type AddFieldResponse = ContentModelField;

/** Response from updateField — returns the updated field. */
export type UpdateFieldResponse = ContentModelField;

/** Response from removeField. */
export interface RemoveFieldResponse {
  success: true;
}

/** Response from reorderFields. */
export interface ReorderFieldsResponse {
  success: true;
}

// ============================================================================
// Bulk Operations Response Types
// ============================================================================

/** Response from bulkPublishEntries. */
export interface BulkPublishEntriesResponse {
  /** Number of entries published successfully */
  published: number;
  /** Entries that failed to publish */
  failed: Array<{ id: string; error: string }>;
}

/** Response from duplicateContentEntry — returns full entry detail. */
export type DuplicateContentEntryResponse = ContentEntryDetail;

