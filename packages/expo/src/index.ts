// Main API
export { initBetterI18n } from "./helpers";
export type { InitBetterI18nOptions, BetterI18nResult } from "./helpers";

// Storage
export { createMemoryStorage } from "./storage";

// Locale detection
export { getDeviceLocale, getDeviceLocales } from "./locale";

// Legacy backend plugin (prefer initBetterI18n for new projects)
export { BetterI18nBackend } from "./backend";

// Re-export core types customers interact with via BetterI18nResult
export type {
  LanguageOption,
  ManifestResponse,
  I18nCore,
} from "@better-i18n/core";

// Types
export type {
  BetterI18nBackendOptions,
  TranslationStorage,
} from "./types";
