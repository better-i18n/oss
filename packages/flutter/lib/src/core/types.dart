/// Translation messages keyed by namespace.
/// Matches the CDN response format: `{ "common": { "key": "value" }, "auth": { ... } }`
typedef Messages = Map<String, Map<String, dynamic>>;

/// Language information from CDN manifest.
class ManifestLanguage {
  final String code;
  final String? name;
  final String? nativeName;
  final String? flagUrl;
  final bool isSource;

  const ManifestLanguage({
    required this.code,
    this.name,
    this.nativeName,
    this.flagUrl,
    this.isSource = false,
  });

  factory ManifestLanguage.fromJson(Map<String, dynamic> json) {
    return ManifestLanguage(
      code: json['code'] as String,
      name: json['name'] as String?,
      nativeName: json['nativeName'] as String?,
      flagUrl: json['flagUrl'] as String?,
      isSource: json['isSource'] as bool? ?? false,
    );
  }
}

/// CDN manifest response.
class ManifestResponse {
  final List<ManifestLanguage> languages;
  final String? projectSlug;
  final String? sourceLanguage;
  final String? updatedAt;

  const ManifestResponse({
    required this.languages,
    this.projectSlug,
    this.sourceLanguage,
    this.updatedAt,
  });

  factory ManifestResponse.fromJson(Map<String, dynamic> json) {
    final languagesList = json['languages'] as List<dynamic>?;
    if (languagesList == null) {
      throw const FormatException('Manifest payload missing languages array');
    }
    return ManifestResponse(
      languages: languagesList
          .map((l) => ManifestLanguage.fromJson(l as Map<String, dynamic>))
          .toList(),
      projectSlug: json['projectSlug'] as String?,
      sourceLanguage: json['sourceLanguage'] as String?,
      updatedAt: json['updatedAt'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'languages': languages.map((l) => _languageToJson(l)).toList(),
      if (projectSlug != null) 'projectSlug': projectSlug,
      if (sourceLanguage != null) 'sourceLanguage': sourceLanguage,
      if (updatedAt != null) 'updatedAt': updatedAt,
    };
  }

  static Map<String, dynamic> _languageToJson(ManifestLanguage l) {
    final map = <String, dynamic>{'code': l.code};
    if (l.name != null) map['name'] = l.name;
    if (l.nativeName != null) map['nativeName'] = l.nativeName;
    if (l.flagUrl != null) map['flagUrl'] = l.flagUrl;
    if (l.isSource) map['isSource'] = l.isSource;
    return map;
  }
}

/// Simplified language option for UI components (e.g., language picker).
class LanguageOption {
  final String code;
  final String? name;
  final String? nativeName;
  final String? flagUrl;
  final bool isDefault;

  const LanguageOption({
    required this.code,
    this.name,
    this.nativeName,
    this.flagUrl,
    this.isDefault = false,
  });
}

/// Parsed project identifier from "org/slug" format.
class ParsedProject {
  final String workspaceId;
  final String projectSlug;

  const ParsedProject({
    required this.workspaceId,
    required this.projectSlug,
  });
}

/// Core i18n configuration.
class I18nConfig {
  /// Project identifier in format "org/project" (e.g., "acme/dashboard")
  final String project;

  /// Default locale to use when no locale is specified
  final String defaultLocale;

  /// CDN base URL. Defaults to "https://cdn.better-i18n.com"
  final String? cdnBaseUrl;

  /// Cache TTL in milliseconds for manifest. Defaults to 300000 (5 minutes)
  final int? ttl;

  /// CDN fetch timeout in milliseconds. Defaults to 10000
  final int? timeout;

  /// Number of retry attempts on CDN fetch failure. Defaults to 1
  final int? retry;

  /// Persistent storage adapter for offline fallback
  final TranslationStorage? storage;

  /// Bundled/static translations as last-resort fallback
  final Map<String, Messages>? staticData;

  const I18nConfig({
    required this.project,
    required this.defaultLocale,
    this.cdnBaseUrl,
    this.ttl,
    this.timeout,
    this.retry,
    this.storage,
    this.staticData,
  });
}

/// Pluggable storage interface for persistent translation caching.
abstract class TranslationStorage {
  Future<String?> get(String key);
  Future<void> set(String key, String value);
  Future<void> remove(String key);
}
