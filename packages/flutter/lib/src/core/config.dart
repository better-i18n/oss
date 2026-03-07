import 'types.dart';

const _defaultCdnBaseUrl = 'https://cdn.better-i18n.com';
const _defaultCacheTtlMs = 5 * 60 * 1000; // 5 minutes
const _defaultFetchTimeoutMs = 10000; // 10 seconds
const _defaultRetryCount = 1;

/// Normalized configuration with all defaults applied.
class NormalizedConfig {
  final String project;
  final String defaultLocale;
  final String cdnBaseUrl;
  final int manifestCacheTtlMs;
  final int fetchTimeout;
  final int retryCount;
  final String workspaceId;
  final String projectSlug;
  final TranslationStorage? storage;
  final Map<String, Messages>? staticData;

  const NormalizedConfig({
    required this.project,
    required this.defaultLocale,
    required this.cdnBaseUrl,
    required this.manifestCacheTtlMs,
    required this.fetchTimeout,
    required this.retryCount,
    required this.workspaceId,
    required this.projectSlug,
    this.storage,
    this.staticData,
  });

  /// Build the project base URL on CDN.
  String get projectBaseUrl => '$cdnBaseUrl/$workspaceId/$projectSlug';
}

/// Parse project string "org/slug" into [ParsedProject].
ParsedProject parseProject(String project) {
  final parts = project.split('/');
  if (parts.length != 2 || parts[0].isEmpty || parts[1].isEmpty) {
    throw ArgumentError(
      '[better-i18n] Invalid project format "$project". '
      'Expected "org/project" (e.g., "acme/dashboard")',
    );
  }
  return ParsedProject(workspaceId: parts[0], projectSlug: parts[1]);
}

/// Normalize [I18nConfig] with defaults applied.
NormalizedConfig normalizeConfig(I18nConfig config) {
  if (config.project.trim().isEmpty) {
    throw ArgumentError('[better-i18n] project is required');
  }
  if (config.defaultLocale.trim().isEmpty) {
    throw ArgumentError('[better-i18n] defaultLocale is required');
  }

  final parsed = parseProject(config.project);

  return NormalizedConfig(
    project: config.project,
    defaultLocale: config.defaultLocale,
    cdnBaseUrl: config.cdnBaseUrl?.replaceAll(RegExp(r'/$'), '') ??
        _defaultCdnBaseUrl,
    manifestCacheTtlMs: config.ttl ?? _defaultCacheTtlMs,
    fetchTimeout: config.timeout ?? _defaultFetchTimeoutMs,
    retryCount: config.retry ?? _defaultRetryCount,
    workspaceId: parsed.workspaceId,
    projectSlug: parsed.projectSlug,
    storage: config.storage,
    staticData: config.staticData,
  );
}
