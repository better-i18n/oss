import type { I18nCoreConfig, NormalizedConfig, ParsedProject } from "./types.js";

const DEFAULT_CDN_BASE_URL = "https://cdn.better-i18n.com";
const DEFAULT_CACHE_TTL_MS_PROD = 5 * 60 * 1000; // 5 minutes
const DEFAULT_CACHE_TTL_MS_DEV = 0; // no cache in dev — always fetch fresh translations
const DEFAULT_MANIFEST_CACHE_TTL_MS_DEV = 30 * 1000; // 30s in dev — manifest rarely changes
const DEFAULT_FETCH_TIMEOUT_MS = 10_000; // 10 seconds
const DEFAULT_RETRY_COUNT = 1;

/**
 * Detect development mode from NODE_ENV.
 * Safe to call in CF Workers (process may not exist).
 */
const isDevMode = (): boolean => {
  try {
    return (
      typeof process !== "undefined" &&
      process.env?.NODE_ENV === "development"
    );
  } catch {
    return false;
  }
};

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

  const devMode = isDevMode();

  return {
    ...config,
    workspaceId,
    projectSlug,
    cdnBaseUrl: config.cdnBaseUrl?.replace(/\/$/, "") || DEFAULT_CDN_BASE_URL,
    // Manifest: 30s in dev (rarely changes), 5min in prod
    manifestCacheTtlMs:
      config.manifestCacheTtlMs ??
      (devMode ? DEFAULT_MANIFEST_CACHE_TTL_MS_DEV : DEFAULT_CACHE_TTL_MS_PROD),
    // Messages: 0 in dev (always fresh translations), 5min in prod
    messagesCacheTtlMs: devMode ? DEFAULT_CACHE_TTL_MS_DEV : DEFAULT_CACHE_TTL_MS_PROD,
    fetchTimeout: config.fetchTimeout ?? DEFAULT_FETCH_TIMEOUT_MS,
    retryCount: config.retryCount ?? DEFAULT_RETRY_COUNT,
  };
};

/**
 * Build the project base URL on CDN
 */
export const getProjectBaseUrl = (config: NormalizedConfig): string =>
  `${config.cdnBaseUrl}/${config.workspaceId}/${config.projectSlug}`;
