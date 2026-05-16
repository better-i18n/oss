import { createAPIClient, parseProjectId, type AdminClientConfig, type ProjectScope } from "./client.js";
import { createProjectsNamespace } from "./projects/index.js";
import { createKeysNamespace } from "./keys/index.js";
import { createTranslationsNamespace } from "./translations/index.js";
import { createSyncNamespace } from "./sync/index.js";
import { createLanguagesNamespace } from "./languages/index.js";
import { createContentNamespace } from "./content/index.js";
import { createAnalyticsNamespace } from "./analytics/index.js";
import type { APIClient } from "@better-i18n/mcp-types";

export interface BetterAdminClient {
  projects: ReturnType<typeof createProjectsNamespace>;
  keys: ReturnType<typeof createKeysNamespace>;
  translations: ReturnType<typeof createTranslationsNamespace>;
  sync: ReturnType<typeof createSyncNamespace>;
  languages: ReturnType<typeof createLanguagesNamespace>;
  content: ReturnType<typeof createContentNamespace>;
  analytics: ReturnType<typeof createAnalyticsNamespace>;
}

async function resolveScope(
  trpcClient: APIClient,
  projectId: string,
): Promise<ProjectScope> {
  const parsed = parseProjectId(projectId);
  if (parsed) return parsed;

  const result = await trpcClient.mcp.listProjects.query();
  const match = (result as { projects: Array<{ id: string; slug: string }> })
    .projects.find((p) => p.id === projectId);

  if (!match) {
    throw new Error(`Project with UUID "${projectId}" not found. Check your projectId.`);
  }

  const parts = match.slug.split("/");
  return { orgSlug: parts[0], projectSlug: parts[1] };
}

export function createAdminClient(config: AdminClientConfig): BetterAdminClient {
  const trpcClient = createAPIClient(config);
  const parsed = parseProjectId(config.projectId);

  if (parsed) {
    return buildClient(trpcClient, parsed, config);
  }

  let resolvedScope: ProjectScope | null = null;
  const scopePromise = resolveScope(trpcClient, config.projectId).then((s) => {
    resolvedScope = s;
    return s;
  });

  async function getScope(): Promise<ProjectScope> {
    if (resolvedScope) return resolvedScope;
    return scopePromise;
  }

  return buildLazyClient(trpcClient, getScope, config);
}

function buildClient(
  trpcClient: APIClient,
  scope: ProjectScope,
  config: AdminClientConfig,
): BetterAdminClient {
  return {
    projects: createProjectsNamespace(trpcClient, scope),
    keys: createKeysNamespace(trpcClient, scope),
    translations: createTranslationsNamespace(trpcClient, scope),
    sync: createSyncNamespace(trpcClient, scope),
    languages: createLanguagesNamespace(trpcClient, scope),
    content: createContentNamespace(trpcClient, scope),
    analytics: createAnalyticsNamespace({ apiKey: config.apiKey }, scope),
  };
}

function buildLazyClient(
  trpcClient: APIClient,
  getScope: () => Promise<ProjectScope>,
  config: AdminClientConfig,
): BetterAdminClient {
  type AnyFnRecord = Record<string, (...a: unknown[]) => unknown>;

  // Wraps a flat namespace (all properties are async functions).
  function lazyFlat<T extends object>(factory: (scope: ProjectScope) => T): T {
    return new Proxy({} as T, {
      get(_, prop: string) {
        return async (...args: unknown[]) => {
          const scope = await getScope();
          const ns = factory(scope) as unknown as AnyFnRecord;
          const fn = ns[prop];
          if (typeof fn === "function") return fn(...args);
          return fn;
        };
      },
    });
  }

  // Wraps a nested namespace (top-level properties are sub-objects of async functions).
  function lazyNested<T extends object>(factory: (scope: ProjectScope) => T): T {
    return new Proxy({} as T, {
      get(_, group: string) {
        return new Proxy({} as object, {
          get(__, method: string) {
            return async (...args: unknown[]) => {
              const scope = await getScope();
              const ns = (factory(scope) as unknown as Record<string, AnyFnRecord>)[group];
              const fn = ns[method];
              if (typeof fn === "function") return fn(...args);
              return fn;
            };
          },
        });
      },
    });
  }

  return {
    projects: lazyFlat((s) => createProjectsNamespace(trpcClient, s)),
    keys: lazyFlat((s) => createKeysNamespace(trpcClient, s)),
    translations: lazyFlat((s) => createTranslationsNamespace(trpcClient, s)),
    sync: lazyFlat((s) => createSyncNamespace(trpcClient, s)),
    languages: lazyFlat((s) => createLanguagesNamespace(trpcClient, s)),
    content: lazyNested((s) => createContentNamespace(trpcClient, s)),
    analytics: lazyFlat((s) => createAnalyticsNamespace({ apiKey: config.apiKey }, s)),
  };
}

export { type AdminClientConfig, type ProjectScope } from "./client.js";
export * from "./types.js";
