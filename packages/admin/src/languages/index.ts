import type { APIClient } from "@better-i18n/mcp-types";
import type {
  AddLanguagesInput,
  UpdateLanguagesInput,
  DeleteLanguagesInput,
} from "@better-i18n/mcp-types";
import type { ProjectScope } from "../client.js";

type WithoutScope<T> = Omit<T, "orgSlug" | "projectSlug">;

export function createLanguagesNamespace(client: APIClient, scope: ProjectScope) {
  return {
    async add(input: WithoutScope<AddLanguagesInput>) {
      return client.mcp.addLanguages.mutate({ ...scope, ...input });
    },

    async update(input: WithoutScope<UpdateLanguagesInput>) {
      return client.mcp.updateLanguages.mutate({ ...scope, ...input });
    },

    async delete(input: WithoutScope<DeleteLanguagesInput>) {
      return client.mcp.deleteLanguages.mutate({ ...scope, ...input });
    },
  };
}

export type LanguagesNamespace = ReturnType<typeof createLanguagesNamespace>;
