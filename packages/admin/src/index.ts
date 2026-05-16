import { createAPIClient, parseProjectId, type AdminClientConfig } from "./client.js";
import { createProjectsNamespace } from "./projects/index.js";
import { createKeysNamespace } from "./keys/index.js";
import { createTranslationsNamespace } from "./translations/index.js";
import { createSyncNamespace } from "./sync/index.js";
import { createLanguagesNamespace } from "./languages/index.js";
import { createContentNamespace } from "./content/index.js";
import { createAnalyticsNamespace } from "./analytics/index.js";

export interface BetterAdminClient {
  projects: ReturnType<typeof createProjectsNamespace>;
  keys: ReturnType<typeof createKeysNamespace>;
  translations: ReturnType<typeof createTranslationsNamespace>;
  sync: ReturnType<typeof createSyncNamespace>;
  languages: ReturnType<typeof createLanguagesNamespace>;
  content: ReturnType<typeof createContentNamespace>;
  analytics: ReturnType<typeof createAnalyticsNamespace>;
}

export function createAdminClient(config: AdminClientConfig): BetterAdminClient {
  const scope = parseProjectId(config.projectId);
  const trpcClient = createAPIClient(config);

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

export { type AdminClientConfig } from "./client.js";
export * from "./types.js";
