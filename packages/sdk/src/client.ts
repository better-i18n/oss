import type { ClientConfig, ContentClient } from "./types.js";
import { createHttpClient } from "./http.js";
import { ContentQueryBuilder } from "./query-builder.js";

const DEFAULT_API_BASE = "https://content.better-i18n.com";

/**
 * Creates a Better i18n content client.
 *
 * Supports both a **Supabase-style chainable API** (`from()`) and the
 * legacy method-based API (`getEntries`, `getEntry`, `getModels`).
 *
 * @example
 * ```typescript
 * const client = createClient({
 *   project: "acme/web-app",
 *   apiKey: "bi18n_...",
 * });
 *
 * // Chainable API (recommended)
 * const { data, error } = await client
 *   .from("blog-posts")
 *   .eq("status", "published")
 *   .order("publishedAt", { ascending: false })
 *   .limit(10);
 *
 * // Single entry
 * const { data: post } = await client
 *   .from("blog-posts")
 *   .language("fr")
 *   .single("hello-world");
 *
 * // Legacy API (still works)
 * const models = await client.getModels();
 * const posts = await client.getEntries("blog-posts", { language: "fr" });
 * ```
 */
export function createClient(config: ClientConfig): ContentClient {
  const apiBase = (config.apiBase || DEFAULT_API_BASE).replace(/\/$/, "");

  // Resolve canonical `projectId` with legacy `project` alias for backward
  // compatibility. `projectId` is the preferred name in new code; `project`
  // continues to work for integrations that shipped before 0.4.x.
  const projectSlug = config.projectId ?? config.project;
  if (!projectSlug) {
    throw new Error(
      'projectId is required.\n' +
        "Set it in your client config:\n\n" +
        '  createClient({ projectId: "acme/web-app", apiKey: "bi18n_..." })',
    );
  }

  const parts = projectSlug.split("/");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error(
      `Invalid projectId format "${projectSlug}". Expected "org/project" (e.g., "acme/web-app").`,
    );
  }
  const [org, project] = parts;

  if (!config.apiKey) {
    throw new Error(
      "API key is required for content API access.\n" +
        "Set apiKey in your client config:\n\n" +
        '  createClient({ projectId: "acme/web-app", apiKey: "bi18n_..." })',
    );
  }

  const http = createHttpClient(apiBase, org, project, config.apiKey, config.debug);

  return {
    from<CF extends Record<string, string | null> = Record<string, string | null>>(modelSlug: string) {
      return ContentQueryBuilder.create<CF>(http, modelSlug);
    },
    getModels: () => http.getModels(),
    getEntries: (model, opts) => http.getEntries(model, opts),
    getEntry: (model, slug, opts) => http.getEntry(model, slug, opts),
  };
}
