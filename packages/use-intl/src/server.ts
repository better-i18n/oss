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
}) {
  return createFormatter({
    locale: config.locale,
    timeZone: config.timeZone,
    now: config.now,
  });
}

export { createTranslator, createFormatter } from "use-intl/core";
