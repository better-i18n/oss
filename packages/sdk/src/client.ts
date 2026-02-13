import type { ClientConfig, ContentClient } from "./types.js";
import { createContentAPIClient } from "./content-api.js";

const DEFAULT_API_BASE = "https://content.better-i18n.com";

/**
 * Creates a Better i18n content client.
 *
 * Fetches content models and entries from the REST API.
 * Requires an API key for authentication.
 *
 * @example
 * ```typescript
 * const client = createClient({
 *   project: "acme/web-app",
 *   apiKey: "bi18n_...",
 * });
 *
 * const models = await client.getModels();
 * const posts = await client.getEntries("blog-posts", { language: "fr" });
 * const post = await client.getEntry("blog-posts", "hello-world");
 * ```
 */
export function createClient(config: ClientConfig): ContentClient {
  const apiBase = (config.apiBase || DEFAULT_API_BASE).replace(/\/$/, "");

  const parts = config.project.split("/");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error(
      `Invalid project format "${config.project}". Expected "org/project" (e.g., "acme/web-app").`,
    );
  }
  const [org, project] = parts;

  if (!config.apiKey) {
    throw new Error(
      "API key is required for content API access.\n" +
        "Set apiKey in your client config:\n\n" +
        '  createClient({ project: "acme/web-app", apiKey: "bi18n_..." })',
    );
  }

  return createContentAPIClient(apiBase, org, project, config.apiKey, config.debug);
}
