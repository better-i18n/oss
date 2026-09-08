/**
 * Versioned (immutable) CDN URLs — platform #115.
 *
 * Each publish writes an immutable snapshot under
 * `{org}/{project}/v/{version}/{locale}/{namespace}.json` and stamps
 * `manifest.files[locale].version`. The CDN serves those paths with
 * `Cache-Control: public, max-age=31536000, immutable`, so browser, edge and
 * any intermediary key on the same URL and never revalidate; the manifest
 * (short TTL) is the only mutable document. A manifest without the field —
 * every project until it is published again — resolves to the legacy path,
 * byte for byte what this SDK requested before.
 *
 * Mirror of `packages/internal/src/cdn/versioned-paths.ts` in the platform
 * repo; the two must produce the same string for the same input.
 */
import type { ManifestResponse } from "./types.js";

/** Path segment that introduces a snapshot: `{base}/v/{version}/…`. */
export const VERSIONED_PATH_SEGMENT = "v";

/**
 * Shape of a version id (lowercase base36 timestamp, dash, short suffix).
 * Anchored so a malformed value can never smuggle a path into the URL; a
 * value that does not match is treated as "no version".
 */
export const VERSION_PATTERN = /^[a-z0-9]{6,12}-[a-z0-9]{4,12}$/;

export interface ResolvedTranslationUrl {
  url: string;
  /** `true` when the URL is an immutable snapshot URL; `false` on the legacy path. */
  versioned: boolean;
}

/** The snapshot version advertised for `locale`, or null. */
export const localeSnapshotVersion = (
  manifest: Pick<ManifestResponse, "files"> | null | undefined,
  locale: string,
): string | null => {
  const version = manifest?.files?.[locale]?.version;
  return typeof version === "string" && VERSION_PATTERN.test(version)
    ? version
    : null;
};

/**
 * Resolve the URL to fetch for `{locale}/{namespace}.json`: the immutable
 * snapshot when the manifest advertises a valid version for the locale,
 * otherwise the legacy unversioned path.
 */
export const resolveTranslationUrl = (
  baseUrl: string,
  manifest: Pick<ManifestResponse, "files"> | null | undefined,
  locale: string,
  namespace: string,
): ResolvedTranslationUrl => {
  const version = localeSnapshotVersion(manifest, locale);
  if (version) {
    return {
      url: `${baseUrl}/${VERSIONED_PATH_SEGMENT}/${version}/${locale}/${namespace}.json`,
      versioned: true,
    };
  }
  return { url: `${baseUrl}/${locale}/${namespace}.json`, versioned: false };
};
