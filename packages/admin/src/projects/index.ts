import type { APIClient } from "@better-i18n/mcp-types";
import type { ProjectScope } from "../client.js";

export function createProjectsNamespace(client: APIClient, scope: ProjectScope) {
  return {
    async get() {
      return client.mcp.getProject.query(scope);
    },

    async list() {
      return client.mcp.listProjects.query();
    },
  };
}

export type ProjectsNamespace = ReturnType<typeof createProjectsNamespace>;
