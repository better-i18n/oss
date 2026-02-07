import type {
  TranslationsClient,
  TranslationManifest,
  GetTranslationsOptions,
} from "./types";

/**
 * Creates a translations client that fetches from the CDN.
 *
 * Translation files are pre-built JSON served from Cloudflare R2.
 * No authentication required.
 *
 * URL patterns:
 * - Namespace: `{cdnBase}/{org}/{project}/{lang}/{namespace}.json`
 * - Manifest: `{cdnBase}/{org}/{project}/manifest.json`
 */
export function createTranslationsCDNClient(
  cdnBase: string,
  org: string,
  project: string,
): TranslationsClient {
  const base = `${cdnBase}/${org}/${project}`;

  return {
    async get(
      namespace: string,
      options?: GetTranslationsOptions,
    ): Promise<Record<string, string>> {
      const lang = options?.language || "en";
      const ns = namespace || "default";
      const res = await fetch(`${base}/${lang}/${ns}.json`);
      if (!res.ok) {
        if (res.status === 404) return {};
        throw new Error(
          `Failed to fetch translations for ${ns} (${lang}): ${res.status}`,
        );
      }
      return res.json();
    },

    async getManifest(): Promise<TranslationManifest> {
      const res = await fetch(`${base}/manifest.json`);
      if (!res.ok) {
        throw new Error(
          `Failed to fetch translation manifest: ${res.status}`,
        );
      }
      return res.json();
    },
  };
}
