/**
 * MCP Client Types
 *
 * Type definitions for the Better i18n MCP API client.
 * These types provide type safety for API calls without requiring
 * the actual tRPC router implementation.
 */

import type {
  GetProjectInput,
  GetAllTranslationsInput,
  ListKeysInput,
  CreateKeysInput,
  UpdateKeysInput,
  DeleteKeysInput,
  AddLanguagesInput,
  UpdateLanguagesInput,
  DeleteLanguagesInput,
  GetSyncsInput,
  GetSyncInput,
  GetPendingChangesInput,
  PublishInput,
} from "./schemas";

import type {
  ListContentModelsInput,
  GetContentModelInput,
  ListContentEntriesInput,
  GetContentEntryInput,
  CreateContentEntryInput,
  UpdateContentEntryInput,
  PublishContentEntryInput,
  DeleteContentEntryInput,
  CreateContentModelInput,
  UpdateContentModelInput,
  DeleteContentModelInput,
  AddFieldInput,
  UpdateFieldInput,
  RemoveFieldInput,
  ReorderFieldsInput,
  BulkPublishEntriesInput,
  BulkCreateEntriesInput,
  BulkUpdateEntriesInput,
  DuplicateContentEntryInput,
} from "./content-schemas";

import type {
  ListProjectsResponse,
  GetAllTranslationsResponse,
  AddLanguagesResponse,
  UpdateLanguagesResponse,
  DeleteLanguagesResponse,
  PublishResponse,
} from "./types";

import type {
  CompactGetProjectResponse,
  CompactGetPendingChangesResponse,
  CompactGetSyncsResponse,
  CompactGetSyncResponse,
  CompactCreateKeysResponse,
  CompactUpdateKeysResponse,
  CompactDeleteKeysResponse,
  CompactListKeysResponse,
  CompactGetTranslationsCompactResponse,
} from "./compact-types";

import type {
  CompactListContentModelsResponse,
  CompactGetContentModelResponse,
  CompactListContentEntriesResponse,
  CompactContentEntryDetail,
  CompactCreateContentEntryResponse,
  CompactUpdateContentEntryResponse,
  CompactPublishContentEntryResponse,
  CompactDeleteContentEntryResponse,
  CompactContentModelField,
  CompactDeleteContentModelResponse,
  CompactRemoveFieldResponse,
  CompactReorderFieldsResponse,
  CompactBulkPublishEntriesResponse,
  CompactBulkCreateEntriesResponse,
  CompactBulkUpdateEntriesResponse,
  CompactListContentEntriesCompactResponse,
  CompactContentEntryDetailMin,
} from "./content-compact-types";

/**
 * MCP API client interface.
 *
 * Defines the shape of the MCP API for type-safe client usage.
 * Used by the MCP package to wrap the tRPC client.
 */
/**
 * MCP API client interface.
 *
 * ⚠️ BREAKING CHANGE: Read endpoints now return compact format for AI token efficiency.
 *
 * Defines the shape of the MCP API for type-safe client usage.
 * Used by the MCP package to wrap the tRPC client.
 *
 * **Compact Endpoints (40-60% token reduction):**
 * - getProject - Returns CompactGetProjectResponse
 * - getPendingChanges - Returns CompactGetPendingChangesResponse
 * - getSyncs - Returns CompactGetSyncsResponse
 * - getSync - Returns CompactGetSyncResponse
 *
 * **Verbose Endpoints (unchanged):**
 * - listProjects, getAllTranslations, publishTranslations
 */
export interface MCPClient {
  listProjects: {
    query: () => Promise<ListProjectsResponse>;
  };
  getProject: {
    query: (input: GetProjectInput) => Promise<CompactGetProjectResponse>;
  };
  getAllTranslations: {
    query: (
      input: GetAllTranslationsInput,
    ) => Promise<GetAllTranslationsResponse | CompactGetTranslationsCompactResponse>;
  };
  listKeys: {
    query: (input: ListKeysInput) => Promise<CompactListKeysResponse>;
  };
  createKeys: {
    mutate: (input: CreateKeysInput) => Promise<CompactCreateKeysResponse>;
  };
  updateKeys: {
    mutate: (input: UpdateKeysInput) => Promise<CompactUpdateKeysResponse>;
  };
  deleteKeys: {
    mutate: (input: DeleteKeysInput) => Promise<CompactDeleteKeysResponse>;
  };
  addLanguages: {
    mutate: (input: AddLanguagesInput) => Promise<AddLanguagesResponse>;
  };
  updateLanguages: {
    mutate: (input: UpdateLanguagesInput) => Promise<UpdateLanguagesResponse>;
  };
  deleteLanguages: {
    mutate: (input: DeleteLanguagesInput) => Promise<DeleteLanguagesResponse>;
  };
  getSyncs: {
    query: (input: GetSyncsInput) => Promise<CompactGetSyncsResponse>;
  };
  getSync: {
    query: (input: GetSyncInput) => Promise<CompactGetSyncResponse>;
  };
  getPendingChanges: {
    query: (
      input: GetPendingChangesInput,
    ) => Promise<CompactGetPendingChangesResponse>;
  };
  publishTranslations: {
    mutate: (input: PublishInput) => Promise<PublishResponse>;
  };
}

/**
 * MCP Content API client interface.
 *
 * Provides type-safe access to content MCP endpoints.
 * All responses use compact format for AI token efficiency.
 */
export interface MCPContentClient {
  // Read
  listContentModels: {
    query: (
      input: ListContentModelsInput,
    ) => Promise<CompactListContentModelsResponse>;
  };
  getContentModel: {
    query: (
      input: GetContentModelInput,
    ) => Promise<CompactGetContentModelResponse>;
  };
  listContentEntries: {
    query: (
      input: ListContentEntriesInput,
    ) => Promise<CompactListContentEntriesResponse | CompactListContentEntriesCompactResponse>;
  };
  getContentEntry: {
    query: (
      input: GetContentEntryInput,
    ) => Promise<CompactContentEntryDetail | CompactContentEntryDetailMin>;
  };
  // Entry write
  createContentEntry: {
    mutate: (
      input: CreateContentEntryInput,
    ) => Promise<CompactCreateContentEntryResponse>;
  };
  updateContentEntry: {
    mutate: (
      input: UpdateContentEntryInput,
    ) => Promise<CompactUpdateContentEntryResponse>;
  };
  publishContentEntry: {
    mutate: (
      input: PublishContentEntryInput,
    ) => Promise<CompactPublishContentEntryResponse>;
  };
  deleteContentEntry: {
    mutate: (
      input: DeleteContentEntryInput,
    ) => Promise<CompactDeleteContentEntryResponse>;
  };
  duplicateContentEntry: {
    mutate: (
      input: DuplicateContentEntryInput,
    ) => Promise<CompactCreateContentEntryResponse>;
  };
  bulkPublishEntries: {
    mutate: (
      input: BulkPublishEntriesInput,
    ) => Promise<CompactBulkPublishEntriesResponse>;
  };
  bulkCreateEntries: {
    mutate: (
      input: BulkCreateEntriesInput,
    ) => Promise<CompactBulkCreateEntriesResponse>;
  };
  bulkUpdateEntries: {
    mutate: (
      input: BulkUpdateEntriesInput,
    ) => Promise<CompactBulkUpdateEntriesResponse>;
  };
  // Model management
  createContentModel: {
    mutate: (
      input: CreateContentModelInput,
    ) => Promise<CompactGetContentModelResponse>;
  };
  updateContentModel: {
    mutate: (
      input: UpdateContentModelInput,
    ) => Promise<CompactGetContentModelResponse>;
  };
  deleteContentModel: {
    mutate: (
      input: DeleteContentModelInput,
    ) => Promise<CompactDeleteContentModelResponse>;
  };
  // Field management
  addField: {
    mutate: (
      input: AddFieldInput,
    ) => Promise<CompactContentModelField>;
  };
  updateField: {
    mutate: (
      input: UpdateFieldInput,
    ) => Promise<CompactContentModelField>;
  };
  removeField: {
    mutate: (
      input: RemoveFieldInput,
    ) => Promise<CompactRemoveFieldResponse>;
  };
  reorderFields: {
    mutate: (
      input: ReorderFieldsInput,
    ) => Promise<CompactReorderFieldsResponse>;
  };
}

/**
 * Full API client interface with mcp and mcpContent namespaces.
 */
export interface APIClient {
  mcp: MCPClient;
  mcpContent: MCPContentClient;
}
