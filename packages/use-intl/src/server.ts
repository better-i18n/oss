import { createI18nCore } from "@better-i18n/core";
import type { I18nCoreConfig, LanguageOption } from "@better-i18n/core";
import { createFormatter, createTranslator } from "use-intl/core";
import type { Messages } from "./types.js";

export interface GetMessagesConfig extends Omit<
  I18nCoreConfig,
  "defaultLocale"
> {
  /**
   * Locale to fetch messages for
   */
  locale: string;
}

/**
 * Fetch messages for a locale (server-side)
 */
export async function getMessages(
  config: GetMessagesConfig,
): Promise<Messages> {
  const i18n = createI18nCore({
    project: config.project,
    defaultLocale: config.locale,
    cdnBaseUrl: config.cdnBaseUrl,
    debug: config.debug,
    logLevel: config.logLevel,
    fetch: config.fetch,
    storage: config.storage,
    staticData: config.staticData,
    fetchTimeout: config.fetchTimeout,
    retryCount: config.retryCount,
  });

  const messages = (await i18n.getMessages(config.locale)) as Messages;

  // better-i18n convention: JSON matches exact namespace structure.
  // if CDN returns { "hero": { "title": "..." } }, use-intl expects exactly that
  // if it's deeply nested, use-intl also handles nested objects.

  return messages as Messages;
}

/**
 * Fetch available locales (server-side)
 */
export async function getLocales(
  config: Omit<I18nCoreConfig, "defaultLocale"> & { defaultLocale?: string },
): Promise<string[]> {
  const i18n = createI18nCore({
    project: config.project,
    defaultLocale: config.defaultLocale || "en",
    cdnBaseUrl: config.cdnBaseUrl,
    debug: config.debug,
    logLevel: config.logLevel,
    fetch: config.fetch,
    storage: config.storage,
    staticData: config.staticData,
    fetchTimeout: config.fetchTimeout,
    retryCount: config.retryCount,
  });

  return i18n.getLocales();
}

/**
 * Fetch available languages with metadata (server-side)
 */
export async function getLanguages(
  config: Omit<I18nCoreConfig, "defaultLocale"> & { defaultLocale?: string },
): Promise<LanguageOption[]> {
  const i18n = createI18nCore({
    project: config.project,
    defaultLocale: config.defaultLocale || "en",
    cdnBaseUrl: config.cdnBaseUrl,
    debug: config.debug,
    logLevel: config.logLevel,
    fetch: config.fetch,
    storage: config.storage,
    staticData: config.staticData,
    fetchTimeout: config.fetchTimeout,
    retryCount: config.retryCount,
  });

  return i18n.getLanguages();
}

/**
 * Create a translator function for use outside React (server-side)
 */
export function createServerTranslator(config: {
  locale: string;
  messages: Messages;
  namespace?: string;
}) {
  return createTranslator({
    locale: config.locale,
    messages: config.messages as Parameters<
      typeof createTranslator
    >[0]["messages"],
    namespace: config.namespace,
  });
}

/**
 * Create a formatter for use outside React (server-side)
 */
export function createServerFormatter(config: {
  locale: string;
  timeZone?: string;
  now?: Date;
}): ReturnType<typeof createFormatter> {
  return createFormatter({
    locale: config.locale,
    timeZone: config.timeZone,
    now: config.now,
  });
}

export { createTranslator, createFormatter } from "use-intl/core";

/**
 * Parse an RFC 5646 Accept-Language header value into a prioritized list of language tags.
 *
 * @example
 * parseAcceptLanguage("tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7")
 * // → ["tr-TR", "tr", "en-US", "en"]
 */
export function parseAcceptLanguage(header: string | null | undefined): string[] {
  if (!header) return [];

  return (
    header
      .split(",")
      .map((entry) => {
        const [tag, qPart] = entry.trim().split(";");
        const language = tag?.trim();
        if (!language || language === "*") return null;

        const q = qPart ? parseFloat(qPart.trim().replace("q=", "")) : 1.0;
        const quality = Number.isNaN(q) ? 1.0 : q;

        return { language, quality };
      })
      .filter((item): item is { language: string; quality: number } => item !== null)
      .sort((a, b) => b.quality - a.quality)
      .map((item) => item.language)
  );
}

/**
 * Find the best matching locale from a parsed language list against available locales.
 * Matching strategy (in order):
 * 1. Exact match: "tr-TR" → "tr-TR"
 * 2. Base language match: "tr-TR" → "tr"
 * 3. Region expansion: "tr" matches "tr-TR" (first available variant)
 *
 * Returns null if no match found.
 */
export function matchLocale(
  languages: string[],
  availableLocales: string[],
): string | null {
  for (const lang of languages) {
    if (availableLocales.includes(lang)) return lang;

    const base = lang.split("-")[0];
    if (base && availableLocales.includes(base)) return base;

    const expanded = availableLocales.find(
      (l) => l === base || l.startsWith(`${base}-`),
    );
    if (expanded) return expanded;
  }

  return null;
}

/**
 * Detect best locale from Accept-Language header (server) or navigator.languages (client).
 *
 * - Server (Web Request): reads `request.headers.get('accept-language')`
 * - Server (Express/Hono/etc.): pass `acceptLanguage` header string directly
 * - Client: reads `navigator.languages` / `navigator.language`
 *
 * Falls back to `defaultLocale` if no match is found.
 */
export function detectLocale(options: {
  request?: Request | null;
  /** Directly pass an Accept-Language header string (e.g. from Express/Hono req.headers) */
  acceptLanguage?: string | null;
  availableLocales: string[];
  defaultLocale: string;
}): string {
  const languages: string[] = [];

  if (options.request) {
    languages.push(...parseAcceptLanguage(options.request.headers.get("accept-language")));
  } else if (options.acceptLanguage !== undefined) {
    languages.push(...parseAcceptLanguage(options.acceptLanguage));
  } else if (typeof navigator !== "undefined") {
    const navLangs = Array.isArray(navigator.languages)
      ? [...navigator.languages]
      : navigator.language
        ? [navigator.language]
        : [];
    languages.push(...navLangs);
  }

  return matchLocale(languages, options.availableLocales) ?? options.defaultLocale;
}
