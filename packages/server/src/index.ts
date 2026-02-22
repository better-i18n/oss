import { createI18nCore } from "@better-i18n/core";
import { createTranslator } from "use-intl/core";
import { parseAcceptLanguage, matchLocale } from "./utils/accept-language.js";
import type { ServerI18n, ServerI18nConfig } from "./types.js";

export type { ServerI18n, ServerI18nConfig, Translator } from "./types.js";

/**
 * Create a server-side i18n instance.
 *
 * Intended to be instantiated once at module scope (singleton pattern) so that
 * the underlying TtlCache is shared across all requests — avoiding redundant CDN
 * fetches on every request.
 *
 * @example
 * ```ts
 * // server.ts (module scope — singleton)
 * import { createServerI18n } from "@better-i18n/server";
 *
 * export const i18n = createServerI18n({
 *   project: "acme/api",
 *   defaultLocale: "en",
 * });
 *
 * // route handler
 * const t = await i18n.getTranslator("tr");
 * t("errors.notFound"); // → "Bulunamadı"
 * ```
 */
export function createServerI18n(config: ServerI18nConfig): ServerI18n {
  const core = createI18nCore(config);

  async function getTranslator(locale: string, namespace?: string) {
    const messages = await core.getMessages(locale);
    return createTranslator({
      locale,
      messages: messages as Parameters<typeof createTranslator>[0]["messages"],
      namespace,
    });
  }

  async function detectLocaleFromHeaders(headers: Headers): Promise<string> {
    const availableLocales = await core.getLocales();
    const acceptLanguage = headers.get("accept-language");
    const parsed = parseAcceptLanguage(acceptLanguage);
    const matched = matchLocale(parsed, availableLocales);
    return matched ?? config.defaultLocale;
  }

  return {
    config: core.config,
    getTranslator,
    detectLocaleFromHeaders,
    getLocales: core.getLocales.bind(core),
    getLanguages: core.getLanguages.bind(core),
  };
}
