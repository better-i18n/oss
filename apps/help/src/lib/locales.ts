import { getLocales } from "@better-i18n/use-intl/server";
import { i18nConfig } from "../i18n.config";

let _cachedLocales: string[] | null = null;

/**
 * Fetch available locales from CDN manifest and cache them.
 * Client-side reads from SSR-injected script tag to avoid CDN round-trip.
 */
export async function fetchLocales(): Promise<string[]> {
  if (_cachedLocales) return _cachedLocales;

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

  try {
    _cachedLocales = await getLocales({ project: i18nConfig.project });
  } catch {
    _cachedLocales = [i18nConfig.defaultLocale];
  }
  return _cachedLocales;
}

export function getCachedLocales(): string[] {
  return _cachedLocales || [i18nConfig.defaultLocale];
}
