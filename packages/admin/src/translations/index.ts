import type { APIClient } from "@better-i18n/mcp-types";
import type {
  GetTranslationsInput,
  SetTranslationsInput,
  PublishInput,
  GetTranslationContextInput,
  GetPendingChangesInput,
} from "@better-i18n/mcp-types";
import type { ProjectScope } from "../client.js";

type WithoutScope<T> = Omit<T, "orgSlug" | "projectSlug">;

export function createTranslationsNamespace(client: APIClient, scope: ProjectScope) {
  return {
    async get(input?: WithoutScope<GetTranslationsInput>) {
      return client.mcp.getAllTranslations.query({ ...scope, ...input });
    },

    async set(input: WithoutScope<SetTranslationsInput>) {
      return client.mcp.setTranslations.mutate({ ...scope, ...input });
    },

    async publish(input?: WithoutScope<PublishInput>) {
      return client.mcp.publishTranslations.mutate({ ...scope, ...input });
    },

    async context(input?: WithoutScope<GetTranslationContextInput>) {
      return client.mcp.getTranslationContext.query({ ...scope, ...input });
    },

    async pendingChanges() {
      return client.mcp.getPendingChanges.query(scope);
    },
  };
}

export type TranslationsNamespace = ReturnType<typeof createTranslationsNamespace>;
