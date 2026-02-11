// Backend plugin (main API)
export { BetterI18nBackend } from "./backend";

// Storage
export { createMemoryStorage, resolveStorage } from "./storage";

// Locale detection
export { getDeviceLocale, getDeviceLocales } from "./locale";

// Convenience helper
export { initBetterI18n } from "./helpers";

// Re-export core utilities for manifest/language fetching
export { createI18nCore } from "@better-i18n/core";
export type { LanguageOption, ManifestResponse } from "@better-i18n/core";

// Types
export type {
  BetterI18nBackendOptions,
  TranslationStorage,
  CacheMeta,
} from "./types";
export type { InitBetterI18nOptions } from "./helpers";
