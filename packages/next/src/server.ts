import { cache } from "react";
import { getRequestConfig } from "next-intl/server";
import { createI18nCore } from "@better-i18n/core";
import type { I18nCore, Messages } from "@better-i18n/core";

import { normalizeConfig } from "./config.js";
import type { I18nConfig, NextFetchRequestInit } from "./types.js";

/**
 * Per-request locale cache using React's `cache()`.
 * The first getRequestConfig call resolves requestLocale (e.g. "tr" from middleware).
 * The second call in the same request may receive undefined — this cache bridges them.
 */
const getRequestLocaleCache = cache(() => ({ locale: undefined as string | undefined }));

/**
 * Next.js i18n core instance with ISR support
 */
export interface NextI18nCore extends I18nCore {
  /**
   * Get messages for a locale with Next.js ISR revalidation
   */
  getMessages: (locale: string) => Promise<Messages>;
}

/**
 * Create a fetch function with Next.js ISR revalidation
 */
const createIsrFetch = (revalidateSeconds: number): typeof fetch => {
  return (input: RequestInfo | URL, init?: RequestInit) => {
    const nextInit: NextFetchRequestInit = {
      ...init,
      next: { revalidate: revalidateSeconds },
    };
    return fetch(input, nextInit);
  };
};

/**
 * Create a Next.js i18n core instance with ISR support
 *
 * This wraps the framework-agnostic `createI18nCore` from `@better-i18n/core`
 * and adds Next.js-specific ISR revalidation for optimal caching.
 *
 * @example
 * ```ts
 * const i18n = createNextI18nCore({
 *   project: 'acme/dashboard',
 *   defaultLocale: 'en',
 * })
 *
 * // Manifest cached for 1 hour (ISR)
 * const locales = await i18n.getLocales()
 *
 * // Messages revalidated every 30s (ISR)
 * const messages = await i18n.getMessages('en')
 * ```
 */
export const createNextI18nCore = (config: I18nConfig): NextI18nCore => {
  const normalized = normalizeConfig(config);

  // Core instance uses ISR fetch for manifest (default 3600s)
  const manifestFetch = createIsrFetch(normalized.manifestRevalidateSeconds);
  const i18nCore = createI18nCore({
    project: normalized.project,
    defaultLocale: normalized.defaultLocale,
    cdnBaseUrl: normalized.cdnBaseUrl,
    manifestCacheTtlMs: normalized.manifestCacheTtlMs,
    debug: normalized.debug,
    logLevel: normalized.logLevel,
    fetch: manifestFetch,
    storage: normalized.storage,
    staticData: normalized.staticData,
    fetchTimeout: normalized.fetchTimeout,
    retryCount: normalized.retryCount,
  });

  // Messages use separate ISR fetch with shorter revalidation (default 30s)
  const messagesFetch = createIsrFetch(normalized.messagesRevalidateSeconds);

  // Build a core instance with ISR messages fetch for fallback support
  const messagesCore = createI18nCore({
    project: normalized.project,
    defaultLocale: normalized.defaultLocale,
    cdnBaseUrl: normalized.cdnBaseUrl,
    manifestCacheTtlMs: normalized.manifestCacheTtlMs,
    debug: normalized.debug,
    logLevel: normalized.logLevel,
    fetch: messagesFetch,
    storage: normalized.storage,
    staticData: normalized.staticData,
    fetchTimeout: normalized.fetchTimeout,
    retryCount: normalized.retryCount,
  });

  return {
    ...i18nCore,
    getMessages: (locale: string): Promise<Messages> =>
      messagesCore.getMessages(locale),
  };
};

/**
 * Resolve the active locale from request context.
 *
 * Pure helper — no Next.js runtime deps, easy to unit-test.
 *
 * Cookie fallback is ONLY used in "never" mode where cookie is the source of
 * truth. In URL-based modes ("always" / "as-needed") requestLocale undefined
 * (ISR revalidation, build-time static generation) must NOT fall back to cookie
 * — otherwise a stale cookie overrides the URL locale.
 */
export function resolveLocaleFromRequest(
  requestLocale: string | undefined,
  cookieLocale: string | null | undefined,
  cachedLocale: string | null | undefined,
  locales: string[],
  defaultLocale: string,
  localePrefix: "always" | "as-needed" | "never",
): string {
  let locale: string | undefined = requestLocale;

  if (!locale) {
    if (localePrefix === "never") {
      // "never" mode: cookie is source of truth
      if (cookieLocale && locales.includes(cookieLocale)) {
        locale = cookieLocale;
      }
    } else {
      // URL-based modes ("always" / "as-needed"): use per-request cached locale
      // from the first getRequestConfig call. This covers cases where requestLocale
      // is undefined (secondary render passes) without falling back to cookie
      // — which could differ from the URL locale.
      if (cachedLocale && locales.includes(cachedLocale)) {
        locale = cachedLocale;
      }
    }
  }

  // Final fallback to defaultLocale
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }

  return locale;
}

/**
 * Create next-intl request config for App Router
 *
 * @example
 * ```ts
 * // i18n/request.ts
 * import { createNextIntlRequestConfig } from '@better-i18n/next/server'
 *
 * export default createNextIntlRequestConfig({
 *   project: 'acme/dashboard',
 *   defaultLocale: 'en',
 * })
 * ```
 */
export const createNextIntlRequestConfig = (config: I18nConfig) =>
  getRequestConfig(async ({ requestLocale }) => {
    const i18n = createNextI18nCore(config);
    const normalized = normalizeConfig(config);
    const locales = await i18n.getLocales();

    const resolvedRequestLocale = await requestLocale;

    // Per-request cache: the first getRequestConfig call receives requestLocale
    // from middleware (e.g. "tr"). The second call in the same request may
    // receive undefined. Cache bridges them so both resolve to the same locale.
    const localeCache = getRequestLocaleCache();
    if (resolvedRequestLocale && locales.includes(resolvedRequestLocale)) {
      localeCache.locale = resolvedRequestLocale;
    }
    const cachedLocale = localeCache.locale;

    let cookieLocale: string | null = null;

    if (normalized.localePrefix === "never") {
      // "never" mode: cookie is the source of truth
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        cookieLocale = cookieStore.get(normalized.cookieName)?.value ?? null;
      } catch {
        // cookies() throws in non-request contexts (e.g. build time)
      }
    }

    const locale = resolveLocaleFromRequest(
      resolvedRequestLocale,
      cookieLocale,
      cachedLocale,
      locales,
      normalized.defaultLocale,
      normalized.localePrefix,
    );

    // Resolve timeZone: explicit config > runtime auto-detection.
    // Setting this explicitly avoids next-intl's ENVIRONMENT_FALLBACK warning
    // and prevents server/client hydration mismatches for date/time formatting.
    const timeZone =
      normalized.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

    return {
      locale,
      messages: await i18n.getMessages(locale),
      timeZone,
    };
  });

// Convenience exports for backwards compatibility

/**
 * Fetch manifest from CDN
 */
export const fetchManifest = (config: I18nConfig) =>
  createNextI18nCore(config).getManifest();

/**
 * Get manifest with caching
 */
export const getManifest = (config: I18nConfig, options?: { forceRefresh?: boolean }) =>
  createNextI18nCore(config).getManifest(options);

/**
 * Get available locale codes
 */
export const getLocales = (config: I18nConfig) =>
  createNextI18nCore(config).getLocales();

/**
 * Get messages for a locale
 */
export const getMessages = (config: I18nConfig, locale: string) =>
  createNextI18nCore(config).getMessages(locale);

/**
 * Get language options with metadata
 */
export const getManifestLanguages = (config: I18nConfig) =>
  createNextI18nCore(config).getLanguages();

// Re-export types from core
export type { LanguageOption, ManifestLanguage, ManifestResponse, Messages } from "@better-i18n/core";
