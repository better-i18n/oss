// Main API
export { createI18nCore, clearManifestCache, clearMessagesCache } from "./cdn";

// Storage adapters
export { createAutoStorage, createLocalStorage, createMemoryStorage } from "./storage";

// Configuration utilities
export { normalizeConfig, parseProject, getProjectBaseUrl } from "./config";

// Manifest utilities
export { extractLanguages } from "./manifest";

// Logger
export { createLogger } from "./logger";

// Middleware logic
export { detectLocale } from "./i18n/detection";

// Cache utilities
export { TtlCache, buildCacheKey } from "./cache";

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
} from "./utils/locale";

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
} from "./types";

export type {
  I18nMiddlewareConfig,
  LocaleDetectionOptions,
  LocaleDetectionResult,
  LocalePrefix,
} from "./i18n/types";
