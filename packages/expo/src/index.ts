// Primary API
export { initBetterI18n, getLanguages } from "./helpers";
export type { InitBetterI18nOptions, BetterI18nResult } from "./helpers";

// Locale detection
export { getDeviceLocale, getDeviceLocales } from "./locale";

// Storage
export { createMemoryStorage, storageAdapter } from "./storage";
export type { MMKVLike, AsyncStorageLike } from "./types";

// Re-exported core types
export type { LanguageOption, ManifestResponse, I18nCore } from "@better-i18n/core";

/** @deprecated Use `initBetterI18n` instead */
export { BetterI18nBackend } from "./backend";

// Types
export type { BetterI18nBackendOptions, TranslationStorage, LocaleAwareTranslationStorage, StorageAdapterOptions } from "./types";
