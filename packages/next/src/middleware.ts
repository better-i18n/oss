import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { createI18nCore, createLogger, detectLocale } from "@better-i18n/core";
import type { I18nMiddlewareConfig } from "@better-i18n/core";

import { normalizeConfig } from "./config";
import { getLocales } from "./server";
import type { I18nConfig } from "./types";

/**
 * Context passed to the middleware callback (Clerk-style pattern)
 */
export interface MiddlewareContext {
  /** Detected locale from the request */
  locale: string;
  /** The i18n response with headers already set - can be modified */
  response: NextResponse;
}

/**
 * Callback function for Clerk-style middleware composition
 *
 * @param request - The incoming Next.js request
 * @param context - Contains locale and response from i18n middleware
 * @returns NextResponse to short-circuit (e.g., redirect), or void to continue with i18n response
 */
export type MiddlewareCallback = (
  request: NextRequest,
  context: MiddlewareContext
) => Promise<NextResponse | void> | NextResponse | void;

/**
 * Legacy Next-intl based middleware
 */
export const createI18nMiddleware = (config: I18nConfig) => {
  const normalized = normalizeConfig(config);
  const logger = createLogger(normalized, "middleware");

  return async function middleware(request: NextRequest) {
    const locales = await getLocales(normalized);
    logger.debug("locales", locales);

    const handleI18nRouting = createMiddleware({
      locales,
      defaultLocale: normalized.defaultLocale,
      localePrefix: normalized.localePrefix,
    });

    return handleI18nRouting(request);
  };
};

export const createI18nProxy = createI18nMiddleware;

/**
 * Modern composable middleware for Better i18n (Clerk-style pattern)
 *
 * Delegates to next-intl's middleware internally to ensure full compatibility
 * with `getRequestConfig({ requestLocale })` while keeping our compose-friendly
 * API and custom locale detection options.
 *
 * @example Simple usage (no callback)
 * ```ts
 * export default createBetterI18nMiddleware({
 *   project: "acme/dashboard",
 *   defaultLocale: "en",
 *   localePrefix: "always",
 * });
 * ```
 *
 * @example With callback (Clerk-style - recommended for auth)
 * ```ts
 * export default createBetterI18nMiddleware({
 *   project: "acme/dashboard",
 *   defaultLocale: "en",
 *   localePrefix: "always",
 * }, async (request, { locale, response }) => {
 *   // Auth logic here - locale and response are available
 *   if (needsLogin) {
 *     return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
 *   }
 *   // Return nothing = i18n response is used (headers preserved!)
 * });
 * ```
 */
export function createBetterI18nMiddleware(
  config: I18nMiddlewareConfig,
  callback?: MiddlewareCallback
) {
  const { project, defaultLocale, localePrefix = "as-needed", detection = {} } = config;

  const {
    cookie = true,
    browserLanguage = true,
    cookieName = "locale",
    cookieMaxAge = 31536000,
  } = detection;

  // Create i18n core instance for CDN operations
  const i18nCore = createI18nCore({ project, defaultLocale });

  // Cache for next-intl middleware instance (recreate only when locales change)
  let cachedMiddleware: ReturnType<typeof createMiddleware> | null = null;
  let cachedLocalesKey: string | null = null;

  return async (request: NextRequest): Promise<NextResponse> => {
    // 1. Fetch available locales from CDN
    const availableLocales = await i18nCore.getLocales();

    // 2. Create/reuse next-intl middleware (only recreate if locales changed)
    const localesKey = availableLocales.join(",");
    if (!cachedMiddleware || cachedLocalesKey !== localesKey) {
      cachedMiddleware = createMiddleware({
        locales: availableLocales,
        defaultLocale,
        localePrefix,
      });
      cachedLocalesKey = localesKey;
    }

    // 3. Our custom locale detection (for cookie logic)
    const pathLocale = request.nextUrl.pathname.split("/")[1];
    const cookieLocale = cookie ? request.cookies.get(cookieName)?.value : null;
    const headerLocale = browserLanguage
      ? request.headers.get("accept-language")?.split(",")[0]?.split("-")[0]
      : null;

    const result = detectLocale({
      project,
      defaultLocale,
      pathLocale,
      cookieLocale: cookieLocale || null,
      headerLocale,
      availableLocales,
    });

    // 4. Call next-intl middleware (sets x-middleware-request-x-next-intl-locale header)
    const response = cachedMiddleware(request);

    // 5. Get detected locale from next-intl header (more accurate than our detection)
    const detectedLocale =
      response.headers.get("x-middleware-request-x-next-intl-locale") ||
      result.locale;

    // 6. Add x-locale header for backwards compatibility
    response.headers.set("x-locale", detectedLocale);

    // 7. Set our custom cookie if needed
    if (cookie && result.shouldSetCookie) {
      response.cookies.set(cookieName, detectedLocale, {
        path: "/",
        maxAge: cookieMaxAge,
        sameSite: "lax",
      });
    }

    // 8. If callback provided, execute it (Clerk-style)
    if (callback) {
      const callbackResult = await callback(request, {
        locale: detectedLocale,
        response,
      });

      // If callback returns a response (e.g., redirect), use it
      if (callbackResult) {
        return callbackResult;
      }
    }

    // 9. Return the i18n response (with all headers preserved)
    return response;
  };
}

/**
 * Helper to compose multiple Next.js middleware
 *
 * @deprecated Use `createBetterI18nMiddleware` with a callback instead (Clerk-style pattern).
 * The callback approach is more reliable and gives you access to the detected locale.
 *
 * @example Migration
 * ```ts
 * // Before (deprecated):
 * export default composeMiddleware(i18nMiddleware, authMiddleware);
 *
 * // After (recommended):
 * export default createBetterI18nMiddleware(config, async (req, { locale, response }) => {
 *   // Auth logic here
 * });
 * ```
 *
 * @see https://github.com/better-i18n/better-i18n#middleware-composition
 */
export function composeMiddleware(
  ...middlewares: Array<(req: NextRequest) => Promise<NextResponse>>
) {
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "[@better-i18n/next] composeMiddleware is deprecated. " +
        "Use createBetterI18nMiddleware with a callback instead. " +
        "See: https://github.com/better-i18n/better-i18n#middleware-composition"
    );
  }

  return async (request: NextRequest): Promise<NextResponse> => {
    const finalResponse = NextResponse.next();

    for (const middleware of middlewares) {
      const response = await middleware(request);

      // Short-circuit on redirect/rewrite (status >= 300)
      if (response.status >= 300) {
        return response;
      }

      // Merge headers from this middleware into the final response
      response.headers.forEach((value, key) => {
        finalResponse.headers.set(key, value);
      });

      // Merge cookies from this middleware into the final response
      response.cookies.getAll().forEach((cookie) => {
        finalResponse.cookies.set(cookie.name, cookie.value, {
          ...cookie,
        });
      });
    }

    return finalResponse;
  };
}
