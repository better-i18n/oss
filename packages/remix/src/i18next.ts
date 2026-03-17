import type { RemixI18n } from "./types.js";

/** i18next resource format: `{ locale: { namespace: { key: value } } }` */
type I18nextResources = Record<string, Record<string, Record<string, unknown>>>;

interface BuildI18nextConfigOptions {
  i18n: RemixI18n;
  /** Additional i18next init options (merged with defaults) */
  i18nextOptions?: Record<string, unknown>;
}

/**
 * Creates i18next-compatible resources from CDN translations.
 *
 * Converts Better i18n CDN format:  `{ "namespace": { "key": "value" } }`
 * To i18next resources format:      `{ "en": { "namespace": { "key": "value" } } }`
 *
 * @param i18n - RemixI18n instance from `createRemixI18n()`
 * @param locales - Optional locale list (defaults to all locales from CDN manifest)
 */
export async function loadResources(
  i18n: RemixI18n,
  locales?: string[],
): Promise<I18nextResources> {
  const availableLocales = locales ?? (await i18n.getLocales());
  const resources: I18nextResources = {};

  const entries = await Promise.all(
    availableLocales.map(async (locale) => {
      const messages = await i18n.getMessages(locale);
      return [locale, messages] as const;
    }),
  );

  for (const [locale, messages] of entries) {
    resources[locale] = {};
    for (const [ns, data] of Object.entries(messages)) {
      if (typeof data === "object" && data !== null) {
        resources[locale][ns] = data as Record<string, unknown>;
      }
    }
    // Merged "translation" namespace for t('ns.key') dot-notation access
    resources[locale]["translation"] = messages;
  }

  return resources;
}

/**
 * Builds the config object to pass into `createI18nextMiddleware()`.
 * Fetches CDN translations + manifest, returns i18next-ready config.
 *
 * @example
 * ```ts
 * import { createRemixI18n } from "@better-i18n/remix";
 * import { buildI18nextConfig } from "@better-i18n/remix/i18next";
 * import { createI18nextMiddleware } from "remix-i18next/middleware";
 *
 * const i18n = createRemixI18n({ project: "acme/store", defaultLocale: "en" });
 * const config = await buildI18nextConfig({ i18n });
 *
 * export const [i18nextMiddleware, getLocale, getInstance] =
 *   createI18nextMiddleware({
 *     detection: {
 *       supportedLanguages: config.supportedLanguages,
 *       fallbackLanguage: config.fallbackLanguage,
 *     },
 *     i18next: {
 *       resources: config.resources,
 *       ...config.i18nextOptions,
 *     },
 *   });
 * ```
 */
export async function buildI18nextConfig(options: BuildI18nextConfigOptions) {
  const { i18n, i18nextOptions = {} } = options;

  const [locales, languages] = await Promise.all([
    i18n.getLocales(),
    i18n.getLanguages(),
  ]);

  const resources = await loadResources(i18n, locales);

  return {
    resources,
    supportedLanguages: locales,
    fallbackLanguage: i18n.config.defaultLocale,
    languages,
    i18nextOptions: {
      lowerCaseLng: true,
      defaultNS: "translation",
      fallbackNS: "translation",
      interpolation: { escapeValue: false },
      ...i18nextOptions,
    },
  };
}
