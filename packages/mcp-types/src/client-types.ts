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
  AddLanguageInput,
  GetSyncsInput,
  GetSyncInput,
} from "./schemas";

import type {
  ListProjectsResponse,
  GetProjectResponse,
  GetAllTranslationsResponse,
  ListKeysResponse,
  CreateKeysResponse,
  UpdateKeysResponse,
  DeleteKeysResponse,
  AddLanguageResponse,
  GetSyncsResponse,
  GetSyncResponse,
} from "./types";

/**
 * MCP API client interface.
 *
 * This interface defines the shape of the MCP API for type-safe client usage.
 * Use this to wrap an untyped tRPC client for full type safety.
 *
 * @example
 * ```typescript
 * import { createTRPCClient } from "@trpc/client";
 * import type { MCPClient } from "@better-i18n/mcp-types";
 *
 * // Create untyped client
 * const rawClient = createTRPCClient<any>({ ... });
 *
 * // Use as typed client
 * const client = rawClient as unknown as { mcp: MCPClient };
 * const projects = await client.mcp.listProjects.query();
 * ```
 */
export interface MCPClient {
  listProjects: {
    query: () => Promise<ListProjectsResponse>;
  };
  getProject: {
    query: (input: GetProjectInput) => Promise<GetProjectResponse>;
  };
  getAllTranslations: {
    query: (
      input: GetAllTranslationsInput
    ) => Promise<GetAllTranslationsResponse>;
  };
  listKeys: {
    query: (input: ListKeysInput) => Promise<ListKeysResponse>;
  };
  createKeys: {
    mutate: (input: CreateKeysInput) => Promise<CreateKeysResponse>;
  };
  updateKeys: {
    mutate: (input: UpdateKeysInput) => Promise<UpdateKeysResponse>;
  };
  deleteKeys: {
    mutate: (input: DeleteKeysInput) => Promise<DeleteKeysResponse>;
  };
  addLanguage: {
    mutate: (input: AddLanguageInput) => Promise<AddLanguageResponse>;
  };
  getSyncs: {
    query: (input: GetSyncsInput) => Promise<GetSyncsResponse>;
  };
  getSync: {
    query: (input: GetSyncInput) => Promise<GetSyncResponse>;
  };
}

/**
 * Full API client interface with mcp namespace.
 */
export interface APIClient {
  mcp: MCPClient;
}
