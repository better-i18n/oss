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
  // Destructure Next.js-specific fields, pass the rest to core as-is.
  // This way, when core adds new fields, this file doesn't need updating.
  const {
    localePrefix,
    cookieName,
    manifestRevalidateSeconds,
    messagesRevalidateSeconds,
    timeZone,
    ...coreFields
  } = config;

  const coreConfig = coreNormalizeConfig(coreFields);

  return {
    ...coreConfig,
    localePrefix: localePrefix ?? "as-needed",
    cookieName: cookieName ?? "locale",
    manifestRevalidateSeconds: manifestRevalidateSeconds ?? 3600,
    messagesRevalidateSeconds: messagesRevalidateSeconds ?? 30,
    timeZone,
  };
};

/**
 * Get the project base URL on CDN
 */
export const getProjectBaseUrl = (config: NormalizedConfig): string =>
  coreGetProjectBaseUrl(config);
