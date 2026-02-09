import type { I18nConfig } from "./types";
import { normalizeConfig } from "./config";
import {
  createNextI18nCore,
  createNextIntlRequestConfig,
} from "./server";
import {
  createI18nMiddleware,
  createI18nProxy,
  createBetterI18nMiddleware,
  composeMiddleware,
  type MiddlewareCallback,
} from "./middleware";

/**
 * Create a complete i18n setup for Next.js
 *
 * @example
 * ```ts
 * // i18n/config.ts
 * import { createI18n } from '@better-i18n/next'
 *
 * export const i18n = createI18n({
 *   project: 'acme/dashboard',
 *   defaultLocale: 'en',
 *   localePrefix: 'always',
 * })
 *
 * // i18n/request.ts
 * export default i18n.requestConfig
 *
 * // middleware.ts (simple)
 * export default i18n.middleware
 *
 * // middleware.ts (with auth - Clerk-style)
 * export default i18n.betterMiddleware(async (request, { locale }) => {
 *   if (needsLogin) {
 *     return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
 *   }
 * });
 * ```
 */
export const createI18n = (config: I18nConfig) => {
  const normalized = normalizeConfig(config);
  const i18n = createNextI18nCore(normalized);

  return {
    config: normalized,
    requestConfig: createNextIntlRequestConfig(normalized),
    /** @deprecated Use betterMiddleware() for Clerk-style callback support */
    middleware: createI18nMiddleware(normalized),
    proxy: createI18nProxy(normalized),
    getManifest: i18n.getManifest,
    getLocales: i18n.getLocales,
    getMessages: i18n.getMessages,

    /**
     * Create middleware with optional Clerk-style callback for auth integration
     *
     * @example Simple usage
     * ```ts
     * export default i18n.betterMiddleware();
     * ```
     *
     * @example With auth callback
     * ```ts
     * export default i18n.betterMiddleware(async (request, { locale, response }) => {
     *   if (needsLogin) {
     *     return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
     *   }
     *   // Return nothing = i18n response is used (headers preserved!)
     * });
     * ```
     */
    betterMiddleware: (callback?: MiddlewareCallback) => {
      return createBetterI18nMiddleware(
        {
          project: normalized.project,
          defaultLocale: normalized.defaultLocale,
          localePrefix: normalized.localePrefix,
          detection: {
            cookie: true,
            browserLanguage: true,
            cookieName: normalized.cookieName,
          },
        },
        callback
      );
    },
  };
};

// Modern standalone middleware exports
export { createBetterI18nMiddleware, composeMiddleware };
export type { MiddlewareContext, MiddlewareCallback } from "./middleware";

// Core instance factory
export { createNextI18nCore } from "./server";

// Client hooks & provider
export { BetterI18nProvider, useManifestLanguages, useSetLocale } from "./client";
export type { BetterI18nProviderProps } from "./client";

// Re-export types
export type {
  I18nConfig,
  LanguageOption,
  Locale,
  LocalePrefix,
  LogLevel,
  ManifestLanguage,
  ManifestResponse,
  Messages,
} from "./types";

export type { I18nMiddlewareConfig } from "@better-i18n/core";
