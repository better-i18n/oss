// Main API
export { createI18nCore, clearManifestCache, clearMessagesCache } from "./cdn.js";

// Storage adapters
export { createAutoStorage, createLocalStorage, createMemoryStorage } from "./storage/index.js";

// Configuration utilities
export { normalizeConfig, parseProject, getProjectBaseUrl } from "./config.js";

// Manifest utilities
export { extractLanguages } from "./manifest.js";

// Logger
export { createLogger } from "./logger.js";

// Middleware logic
export { detectLocale } from "./i18n/detection.js";

// Cache utilities
export { TtlCache, buildCacheKey } from "./cache.js";

// Locale utilities
export {
  normalizeLocale,
  extractLocale,
  getLocaleFromPath,
  hasLocalePrefix,
  removeLocalePrefix,
  addLocalePrefix,
  replaceLocaleInPath,
  createLocalePath,
  type LocaleConfig,
} from "./utils/locale.js";

// Types
export type {
  // Core config
  I18nCoreConfig,
  NormalizedConfig,
  ParsedProject,

  // Manifest
  ManifestResponse,
  ManifestLanguage,
  ManifestFile,
  LanguageOption,

  // Messages
  Messages,
  Locale,

  // Instance
  I18nCore,

  // Storage
  TranslationStorage,

  // Utilities
  Logger,
  LogLevel,
  CacheEntry,
} from "./types.js";

export type {
  I18nMiddlewareConfig,
  LocaleDetectionOptions,
  LocaleDetectionResult,
  LocalePrefix,
} from "./i18n/types.js";
