import { createI18nCore } from "@better-i18n/core";
import { parseAcceptLanguage, matchLocale } from "./utils.js";
import type { RemixI18n, RemixI18nConfig } from "./types.js";

/**
 * Create a Remix/Hydrogen i18n instance.
 *
 * Intended to be instantiated once at module scope (singleton pattern) so that
 * the underlying TtlCache is shared across all requests — avoiding redundant CDN
 * fetches on every request.
 *
 * @example
 * ```ts
 * // app/i18n.server.ts (module scope — singleton)
 * import { createRemixI18n } from "@better-i18n/remix";
 *
 * export const i18n = createRemixI18n({
 *   project: "acme/hydrogen-store",
 *   defaultLocale: "en",
 * });
 *
 * // app/root.tsx (loader)
 * export async function loader({ request }: LoaderFunctionArgs) {
 *   const locale = await i18n.detectLocale(request);
 *   const messages = await i18n.getMessages(locale);
 *   return json({ locale, messages });
 * }
 * ```
 */
export function createRemixI18n(config: RemixI18nConfig): RemixI18n {
  const core = createI18nCore(config);

  async function detectLocale(request: Request): Promise<string> {
    const availableLocales = await core.getLocales();
    const acceptLanguage = request.headers.get("accept-language");
    const parsed = parseAcceptLanguage(acceptLanguage);
    const matched = matchLocale(parsed, availableLocales);
    return matched ?? config.defaultLocale;
  }

  return {
    config: core.config,
    detectLocale,
    getMessages: core.getMessages.bind(core),
    getLocales: core.getLocales.bind(core),
    getLanguages: core.getLanguages.bind(core),
  };
}
