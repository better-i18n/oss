export { createRemixI18n } from "./remix-i18n.js";
export { parseAcceptLanguage, matchLocale, msg } from "./utils.js";

export type { RemixI18n, RemixI18nConfig, NormalizedRemixConfig, LocalePrefix } from "./types.js";
export type {
  I18nCoreConfig,
  LanguageOption,
  Messages,
  Locale,
  LogLevel,
  ManifestLanguage,
  ManifestResponse,
} from "@better-i18n/core";
