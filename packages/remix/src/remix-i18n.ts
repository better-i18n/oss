import { createI18nCore } from "@better-i18n/core";
import { parseAcceptLanguage, matchLocale } from "./utils.js";
import type { RemixI18n, RemixI18nConfig, NormalizedRemixConfig } from "./types.js";

/** BCP 47 locale segment — used when CDN language list is unavailable (cold start / miss) */
const LOCALE_SEGMENT = /^[a-z]{2}(-[a-z]{2})?$/;

function normalizeConfig(config: RemixI18nConfig): NormalizedRemixConfig {
  return {
    ...config,
    localePrefix: config.localePrefix ?? "as-needed",
    cookieName: config.cookieName ?? "locale",
  };
}

/**
 * Create a Remix/Hydrogen i18n instance.
 *
 * Intended to be instantiated once at module scope (singleton pattern) so that
 * the underlying TtlCache is shared across all requests — avoiding redundant CDN
 * fetches on every request.
 *
 * @example
 * ```ts
 * // app/i18n.server.ts
 * import { createRemixI18n } from "@better-i18n/remix";
 *
 * export const i18n = createRemixI18n({
 *   project: "acme/hydrogen-store",
 *   defaultLocale: "en",
 *   localePrefix: "as-needed", // default — /tr/about (Turkish), /about (English)
 * });
 *
 * // server.ts — use getLocaleFromRequest, not a custom helper
 * const locale = await i18n.getLocaleFromRequest(request);
 * const messages = await i18n.getMessages(locale);
 * ```
 */
export function createRemixI18n(config: RemixI18nConfig): RemixI18n {
  const normalized = normalizeConfig(config);
  const core = createI18nCore(normalized);

  // ─── getLocaleFromRequest ───────────────────────────────────────────────────

  async function getLocaleFromRequest(request: Request): Promise<string> {
    const { localePrefix, defaultLocale, cookieName } = normalized;

    // "never": no URL prefix — detect from cookie → Accept-Language → default
    if (localePrefix === "never") {
      const cookieHeader = request.headers.get("cookie") ?? "";
      const cookieLocale = parseCookie(cookieHeader, cookieName);
      if (cookieLocale) {
        const locales = await core.getLocales().catch(() => [] as string[]);
        const match =
          locales.length > 0
            ? locales.find((l) => l === cookieLocale) ?? null
            : LOCALE_SEGMENT.test(cookieLocale) ? cookieLocale : null;
        if (match) return match;
      }
      return detectFromHeader(request);
    }

    // "as-needed" / "always": extract locale from first URL path segment
    const url = new URL(request.url);
    const firstSegment = url.pathname.split("/").filter(Boolean)[0]?.toLowerCase();

    if (firstSegment && firstSegment !== defaultLocale) {
      const locales = await core.getLocales().catch(() => [] as string[]);
      const inList =
        locales.length > 0
          ? locales.includes(firstSegment)
          : LOCALE_SEGMENT.test(firstSegment); // BCP 47 fallback on CDN miss

      if (inList) return firstSegment;
    }

    return defaultLocale;
  }

  // ─── buildLocalePath ────────────────────────────────────────────────────────

  function buildLocalePath(path: string, locale: string): string {
    const { localePrefix, defaultLocale } = normalized;
    if (localePrefix === "never") return path;
    if (localePrefix !== "always" && locale === defaultLocale) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `/${locale}${cleanPath}`;
  }

  // ─── replaceLocaleInPath ────────────────────────────────────────────────────

  function replaceLocaleInPath(path: string, newLocale: string): string {
    // Strip any existing BCP 47 locale prefix
    const stripped =
      path.replace(/^\/([a-z]{2}(-[a-z]{2})?)(?=\/|$)/, "") || "/";
    return buildLocalePath(stripped, newLocale);
  }

  // ─── detectLocale (legacy — Accept-Language only) ──────────────────────────

  async function detectLocale(request: Request): Promise<string> {
    return detectFromHeader(request);
  }

  async function detectFromHeader(request: Request): Promise<string> {
    const locales = await core.getLocales().catch(() => [] as string[]);
    const acceptLanguage = request.headers.get("accept-language");
    const parsed = parseAcceptLanguage(acceptLanguage);
    const matched = matchLocale(parsed, locales);
    return matched ?? normalized.defaultLocale;
  }

  // ─── getLocaleCookieHeader ──────────────────────────────────────────────────

  /**
   * Returns a `Set-Cookie` header value that persists the given locale.
   * Append this to any Response so returning visitors get their chosen language
   * without relying on geo-IP detection.
   *
   * Reads the current cookie from the request to avoid setting the same value
   * on every request (returns `null` when the cookie already matches).
   *
   * @example
   * ```ts
   * // server.ts (Hydrogen)
   * const locale = await i18n.getLocaleFromRequest(request);
   * const response = await handleRequest(request);
   * const cookie = i18n.getLocaleCookieHeader(locale, request);
   * if (cookie) response.headers.append("Set-Cookie", cookie);
   * return response;
   * ```
   */
  function getLocaleCookieHeader(locale: string, request?: Request): string | null {
    const { cookieName } = normalized;

    // Skip if cookie already matches — avoid unnecessary Set-Cookie on every response
    if (request) {
      const cookieHeader = request.headers.get("cookie") ?? "";
      const existing = parseCookie(cookieHeader, cookieName);
      if (existing === locale) return null;
    }

    return `${cookieName}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  }

  return {
    config: normalized,
    getLocaleFromRequest,
    buildLocalePath,
    replaceLocaleInPath,
    detectLocale,
    getLocaleCookieHeader,
    getMessages: core.getMessages.bind(core),
    getLocales: core.getLocales.bind(core),
    getLanguages: core.getLanguages.bind(core),
  };
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function parseCookie(cookieHeader: string, name: string): string | null {
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${name}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1] ?? "") : null;
}
