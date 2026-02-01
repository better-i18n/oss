import { getRequestConfig } from "next-intl/server";
import { createI18nCore } from "@better-i18n/core";
import type { I18nCore, Messages } from "@better-i18n/core";

import { normalizeConfig, getProjectBaseUrl } from "./config";
import type { I18nConfig, NextFetchRequestInit } from "./types";

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
  });

  // Messages use separate ISR fetch with shorter revalidation (default 30s)
  const messagesFetch = createIsrFetch(normalized.messagesRevalidateSeconds);

  return {
    ...i18nCore,
    getMessages: async (locale: string): Promise<Messages> => {
      const url = `${getProjectBaseUrl(normalized)}/${locale}/translations.json`;
      const response = await messagesFetch(url);
      if (!response.ok) {
        throw new Error(`[better-i18n] Messages fetch failed for locale "${locale}" (${response.status})`);
      }
      return response.json();
    },
  };
};

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
    let locale = await requestLocale;

    if (!locale || !locales.includes(locale)) {
      locale = normalized.defaultLocale;
    }

    return {
      locale,
      messages: await i18n.getMessages(locale),
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
