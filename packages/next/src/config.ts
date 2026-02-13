import {
  parseProject,
  getProjectBaseUrl as coreGetProjectBaseUrl,
  normalizeConfig as coreNormalizeConfig,
} from "@better-i18n/core";
import type { I18nConfig, NormalizedConfig } from "./types.js";

// Re-export parseProject from core
export { parseProject };

/**
 * Normalize Next.js i18n config with defaults
 */
export const normalizeConfig = (config: I18nConfig): NormalizedConfig => {
  // Use core normalization for base config
  const coreConfig = coreNormalizeConfig({
    project: config.project,
    defaultLocale: config.defaultLocale,
    cdnBaseUrl: config.cdnBaseUrl,
    manifestCacheTtlMs: config.manifestCacheTtlMs,
    debug: config.debug,
    logLevel: config.logLevel,
    fetch: config.fetch,
  });

  // Add Next.js-specific defaults
  return {
    ...coreConfig,
    localePrefix: config.localePrefix ?? "as-needed",
    cookieName: config.cookieName ?? "locale",
    manifestRevalidateSeconds: config.manifestRevalidateSeconds ?? 3600,
    messagesRevalidateSeconds: config.messagesRevalidateSeconds ?? 30,
  };
};

/**
 * Get the project base URL on CDN
 */
export const getProjectBaseUrl = (config: NormalizedConfig): string =>
  coreGetProjectBaseUrl(config);
