import { getLocales } from "@better-i18n/use-intl/server";
import { i18nConfig } from "../i18n.config";

let _cachedLocales: string[] | null = null;

/**
 * Fetch available locales from CDN manifest and cache them.
 * Call this once during app initialization (e.g., in root beforeLoad).
 */
export async function fetchLocales(): Promise<string[]> {
  if (_cachedLocales) return _cachedLocales;
  _cachedLocales = await getLocales({ project: i18nConfig.project });
  return _cachedLocales;
}

/**
 * Get cached locales synchronously.
 * Returns cached locales if available, or falls back to defaultLocale.
 * Safe to call in sync contexts (e.g., head() functions) after fetchLocales() has been called.
 */
export function getCachedLocales(): string[] {
  return _cachedLocales || [i18nConfig.defaultLocale];
}
