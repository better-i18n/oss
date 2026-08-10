import { getLanguages, getLocales } from "@better-i18n/use-intl/server";
import type { LanguageOption } from "@better-i18n/core";
import { i18nConfig } from "../i18n.config";

let _cachedLocales: string[] | null = null;
let _cachedLanguages: LanguageOption[] | null = null;

/**
 * Fetch available locales from CDN manifest and cache them.
 * Call this once during app initialization (e.g., in root beforeLoad).
 */
export async function fetchLocales(): Promise<string[]> {
  if (_cachedLocales) return _cachedLocales;

  // Client-side: read from SSR-injected script tag to avoid a CDN round-trip
  if (typeof document !== "undefined") {
    const el = document.getElementById("__i18n_locales__");
    if (el?.textContent) {
      try {
        const parsed = JSON.parse(el.textContent);
        if (Array.isArray(parsed) && parsed.length > 0) {
          _cachedLocales = parsed;
          return _cachedLocales;
        }
      } catch {
        // parse failed → fall through to CDN fetch
      }
    }
  }

  _cachedLocales = await getLocales({ project: i18nConfig.project });
  return _cachedLocales;
}

/**
 * Fetch the full language list (code + name + flag), the shape
 * `BetterI18nProvider` wants for `initialLanguages`.
 *
 * Without this the provider calls `getLanguages()` from the browser on every
 * mount, which reads the manifest over the network on each new document — a
 * request on the critical path for data the server already had. On the server
 * this is served from the SDK's manifest cache, so it costs nothing per
 * request; in the browser it reads the SSR-injected tag.
 */
export async function fetchLanguages(): Promise<LanguageOption[]> {
  if (_cachedLanguages) return _cachedLanguages;

  if (typeof document !== "undefined") {
    const el = document.getElementById("__i18n_languages__");
    if (el?.textContent) {
      try {
        const parsed = JSON.parse(el.textContent);
        if (Array.isArray(parsed) && parsed.length > 0) {
          _cachedLanguages = parsed as LanguageOption[];
          return _cachedLanguages;
        }
      } catch {
        // parse failed → fall through to CDN fetch
      }
    }
  }

  _cachedLanguages = await getLanguages({ project: i18nConfig.project });
  return _cachedLanguages;
}

/** Cached language list, or an empty array before the first fetch resolves. */
export function getCachedLanguages(): LanguageOption[] {
  return _cachedLanguages ?? [];
}

/**
 * Get cached locales synchronously.
 * Returns cached locales if available, or falls back to defaultLocale.
 * Safe to call in sync contexts (e.g., head() functions) after fetchLocales() has been called.
 */
export function getCachedLocales(): string[] {
  return _cachedLocales || [i18nConfig.defaultLocale];
}
