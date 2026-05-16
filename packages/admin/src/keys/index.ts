import type { APIClient } from "@better-i18n/mcp-types";
import type {
  ListKeysInput,
  CreateKeysInput,
  UpdateKeysInput,
  DeleteKeysInput,
} from "@better-i18n/mcp-types";
import type { ProjectScope } from "../client.js";

type WithoutScope<T> = Omit<T, "orgSlug" | "projectSlug">;

export function createKeysNamespace(client: APIClient, scope: ProjectScope) {
  return {
    async list(input?: WithoutScope<ListKeysInput>) {
      return client.mcp.listKeys.query({ ...scope, ...input });
    },

    async create(input: WithoutScope<CreateKeysInput>) {
      return client.mcp.createKeys.mutate({ ...scope, ...input });
    },

    async update(input: WithoutScope<UpdateKeysInput>) {
      return client.mcp.updateKeys.mutate({ ...scope, ...input });
    },

    async delete(input: WithoutScope<DeleteKeysInput>) {
      return client.mcp.deleteKeys.mutate({ ...scope, ...input });
    },
  };
}

export type KeysNamespace = ReturnType<typeof createKeysNamespace>;
