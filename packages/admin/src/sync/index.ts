import type { APIClient } from "@better-i18n/mcp-types";
import type {
  GetSyncsInput,
  GetSyncInput,
  CancelSyncInput,
} from "@better-i18n/mcp-types";
import type { ProjectScope, WithoutScope } from "../client.js";

export function createSyncNamespace(client: APIClient, scope: ProjectScope) {
  return {
    async list(input?: WithoutScope<GetSyncsInput>) {
      return client.mcp.getSyncs.query({ ...scope, ...input });
    },

    async get(input: WithoutScope<GetSyncInput>) {
      return client.mcp.getSync.query({ ...scope, ...input });
    },

    async cancel(input: WithoutScope<CancelSyncInput>) {
      return client.mcp.cancelSync.mutate({ ...scope, ...input });
    },
  };
}

export type SyncNamespace = ReturnType<typeof createSyncNamespace>;
