import type { ClientConfig, BetterI18nClient } from "./types";
import { createContentAPIClient } from "./content-api";
import { createTranslationsCDNClient } from "./translations-cdn";

const DEFAULT_CDN_BASE = "https://cdn.better-i18n.com";
const DEFAULT_API_BASE = "https://api.better-i18n.com";

/**
 * Creates a Better i18n client with content and translation sub-clients.
 *
 * Content is always fetched from the REST API and requires an API key.
 * Translations are served from the CDN for performance (no API key needed).
 *
 * @example
 * ```typescript
 * const client = createClient({
 *   org: "acme",
 *   project: "web-app",
 *   apiKey: "bi18n_...",
 * });
 *
 * // Content (API mode, requires apiKey)
 * const posts = await client.content.getEntries("blog-posts", { language: "fr" });
 * const post = await client.content.getEntry("blog-posts", "hello-world");
 * const models = await client.content.getModels();
 *
 * // Translations (CDN mode, no API key needed)
 * const strings = await client.translations.get("common", { language: "fr" });
 * ```
 */
export function createClient(config: ClientConfig): BetterI18nClient {
  const { org, project } = config;
  const cdnBase = (config.cdnBase || DEFAULT_CDN_BASE).replace(/\/$/, "");
  const apiBase = (config.apiBase || DEFAULT_API_BASE).replace(/\/$/, "");

  if (!config.apiKey) {
    throw new Error(
      "API key is required. Content is served via the REST API.\n" +
        "Set apiKey in your client config:\n\n" +
        '  createClient({ org: "...", project: "...", apiKey: "bi18n_..." })',
    );
  }

  return {
    content: createContentAPIClient(apiBase, org, project, config.apiKey),
    // Translations always served from CDN for performance
    translations: createTranslationsCDNClient(cdnBase, org, project),
  };
}
