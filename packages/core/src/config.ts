import type { I18nCoreConfig, NormalizedConfig, ParsedProject } from "./types";

const DEFAULT_CDN_BASE_URL = "https://cdn.better-i18n.com";
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const DEFAULT_FETCH_TIMEOUT_MS = 10_000; // 10 seconds
const DEFAULT_RETRY_COUNT = 1;

/**
 * Parse project string "org/slug" into workspaceId and projectSlug
 */
export const parseProject = (project: string): ParsedProject => {
  const parts = project.split("/");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error(
      `[better-i18n] Invalid project format "${project}". Expected "org/project" (e.g., "acme/dashboard")`
    );
  }
  return {
    workspaceId: parts[0],
    projectSlug: parts[1],
  };
};

/**
 * Normalize config with defaults
 */
export const normalizeConfig = (config: I18nCoreConfig): NormalizedConfig => {
  if (!config.project?.trim()) {
    throw new Error("[better-i18n] project is required");
  }
  if (!config.defaultLocale?.trim()) {
    throw new Error("[better-i18n] defaultLocale is required");
  }

  const { workspaceId, projectSlug } = parseProject(config.project);

  return {
    ...config,
    workspaceId,
    projectSlug,
    cdnBaseUrl: config.cdnBaseUrl?.replace(/\/$/, "") || DEFAULT_CDN_BASE_URL,
    manifestCacheTtlMs: config.manifestCacheTtlMs ?? DEFAULT_CACHE_TTL_MS,
    fetchTimeout: config.fetchTimeout ?? DEFAULT_FETCH_TIMEOUT_MS,
    retryCount: config.retryCount ?? DEFAULT_RETRY_COUNT,
  };
};

/**
 * Build the project base URL on CDN
 */
export const getProjectBaseUrl = (config: NormalizedConfig): string =>
  `${config.cdnBaseUrl}/${config.workspaceId}/${config.projectSlug}`;
