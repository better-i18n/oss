import type { ClientConfig, ContentClient } from "./types";
import { createContentAPIClient } from "./content-api";

const DEFAULT_API_BASE = "https://api.better-i18n.com";

/**
 * Creates a Better i18n content client.
 *
 * Fetches content models and entries from the REST API.
 * Requires an API key for authentication.
 *
 * @example
 * ```typescript
 * const client = createClient({
 *   org: "acme",
 *   project: "web-app",
 *   apiKey: "bi18n_...",
 * });
 *
 * const models = await client.getModels();
 * const posts = await client.getEntries("blog-posts", { language: "fr" });
 * const post = await client.getEntry("blog-posts", "hello-world");
 * ```
 */
export function createClient(config: ClientConfig): ContentClient {
  const { org, project } = config;
  const apiBase = (config.apiBase || DEFAULT_API_BASE).replace(/\/$/, "");

  if (!config.apiKey) {
    throw new Error(
      "API key is required for content API access.\n" +
        "Set apiKey in your client config:\n\n" +
        '  createClient({ org: "...", project: "...", apiKey: "bi18n_..." })',
    );
  }

  return createContentAPIClient(apiBase, org, project, config.apiKey);
}
