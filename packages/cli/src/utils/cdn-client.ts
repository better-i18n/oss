/**
 * CDN client utilities
 *
 * Functions for fetching translation data from Better i18n CDN.
 * Extracted from sync.ts for reuse in doctor and sync commands.
 */

import type { CdnManifest } from "../analyzer/types.js";
import type { RemoteTranslations } from "./json-keys.js";

/**
 * Fetch project manifest from CDN.
 *
 * The manifest contains language metadata, file URLs, and last-modified timestamps.
 * Used as the entry point for all CDN operations.
 */
export async function fetchManifest(
  cdnBaseUrl: string,
  workspaceId: string,
  projectSlug: string,
): Promise<CdnManifest> {
  const url = `${cdnBaseUrl}/${workspaceId}/${projectSlug}/manifest.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Manifest fetch failed (${response.status})`);
  }

  // CDN returns 200 with an empty body for projects that were never published.
  // Validate the shape so callers get a clear error instead of a TypeError.
  const data = (await response.json()) as CdnManifest;
  if (!data || !Array.isArray(data.languages)) {
    throw new Error(
      "Project has no published translations yet. Publish once from the dashboard (or `better-i18n publish`) and retry.",
    );
  }

  return data;
}

/**
 * Fetch remote translation keys for a specific locale.
 *
 * Uses manifest URL if available (preferred, as it may include CDN cache-busting),
 * otherwise constructs a fallback URL from convention.
 */
export async function fetchRemoteKeys(
  cdnBaseUrl: string,
  workspaceId: string,
  projectSlug: string,
  locale: string,
  manifest: CdnManifest | null,
): Promise<RemoteTranslations> {
  let url: string;
  if (manifest?.files?.[locale]?.url) {
    url = manifest.files[locale].url;
  } else {
    url = `${cdnBaseUrl}/${workspaceId}/${projectSlug}/translations/${locale}.json`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`CDN fetch failed (${response.status})`);
  }

  return response.json() as Promise<RemoteTranslations>;
}

/**
 * Fetch a single locale file from CDN.
 *
 * Convenience wrapper that combines manifest lookup + locale fetch.
 * Returns null if the locale is not available.
 */
export async function fetchLocaleFile(
  cdnBaseUrl: string,
  workspaceId: string,
  projectSlug: string,
  locale: string,
): Promise<RemoteTranslations | null> {
  try {
    const manifest = await fetchManifest(cdnBaseUrl, workspaceId, projectSlug);

    if (!manifest.files?.[locale]) {
      return null;
    }

    return await fetchRemoteKeys(
      cdnBaseUrl,
      workspaceId,
      projectSlug,
      locale,
      manifest,
    );
  } catch {
    return null;
  }
}
