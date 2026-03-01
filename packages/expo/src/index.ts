// Primary API
export { initBetterI18n, getLanguages } from "./helpers.js";
export type { InitBetterI18nOptions, BetterI18nResult } from "./helpers.js";

// Locale detection
export { getDeviceLocale, getDeviceLocales } from "./locale.js";

// Storage
export { createMemoryStorage, storageAdapter } from "./storage.js";
export type { MMKVLike, AsyncStorageLike } from "./types.js";

// Re-exported core types
export type { LanguageOption, ManifestResponse, I18nCore } from "@better-i18n/core";

/** @deprecated Use `initBetterI18n` instead */
export { BetterI18nBackend } from "./backend.js";

// Types
export type { BetterI18nBackendOptions, TranslationStorage, LocaleAwareTranslationStorage, StorageAdapterOptions } from "./types.js";
