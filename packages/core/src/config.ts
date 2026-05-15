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
 * Canonical UUID v4 format (case-insensitive). Customers can pass a project
 * UUID instead of `"org/project"` slug to get a CDN URL that's immune to
 * slug renames — `cdn.../{uuid}/...` instead of `cdn.../{org}/{project}/...`.
 * The CDN worker resolves UUID → current slug pair internally; R2 storage
 * stays slug-keyed.
 */
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Parse a project identifier into URL-buildable pieces. Accepts either:
 *
 *   - `"org/project"` slug (e.g., `"acme/dashboard"`) — populates
 *     `workspaceId` + `projectSlug` from the split.
 *   - Canonical UUID (e.g., `"01234567-89ab-4cde-9012-3456789abcde"`) —
 *     `workspaceId` + `projectSlug` are empty; `pathSegment` is the
 *     lowercase UUID.
 *
 * Use `pathSegment` for CDN URLs (`${cdnBaseUrl}/${pathSegment}/...`) so
 * both shapes route correctly.
 */
export const parseProject = (project: string): ParsedProject => {
  const trimmed = project.trim();

  if (UUID_PATTERN.test(trimmed)) {
    const lower = trimmed.toLowerCase();
    return {
      workspaceId: "",
      projectSlug: "",
      pathSegment: lower,
      isUuid: true,
    };
  }

  const parts = trimmed.split("/");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error(
      `[better-i18n] Invalid project identifier "${project}". Expected "org/project" slug (e.g., "acme/dashboard") or a canonical UUID.`
    );
  }
  return {
    workspaceId: parts[0],
    projectSlug: parts[1],
    pathSegment: `${parts[0]}/${parts[1]}`,
    isUuid: false,
  };
};

/**
 * Normalize config with defaults
 */
export const normalizeConfig = (config: I18nCoreConfig): NormalizedConfig => {
  // Resolve canonical projectId with legacy `project` alias. The internal
  // `.project` field on NormalizedConfig is preserved so downstream packages
  // reading `normalized.project` keep working with no changes.
  const projectSlug = config.projectId ?? config.project;
  if (!projectSlug?.trim()) {
    throw new Error(
      "[better-i18n] projectId is required (in `org/project` format)",
    );
  }
  if (!config.defaultLocale?.trim()) {
    throw new Error("[better-i18n] defaultLocale is required");
  }

  const parsed = parseProject(projectSlug);

  const devMode = isDevMode();

  return {
    ...config,
    project: projectSlug,
    workspaceId: parsed.workspaceId,
    projectSlug: parsed.projectSlug,
    pathSegment: parsed.pathSegment,
    isUuid: parsed.isUuid,
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
 * Build the project base URL on CDN.
 *
 * For slug-mode configs, this produces `${cdnBaseUrl}/org/project`. For
 * UUID-mode configs (customer passed a UUID as `projectId`), it produces
 * `${cdnBaseUrl}/{uuid}` — a single-segment URL that the CDN worker resolves
 * to the same R2 file, surviving slug renames.
 */
export const getProjectBaseUrl = (config: NormalizedConfig): string =>
  `${config.cdnBaseUrl}/${config.pathSegment}`;
