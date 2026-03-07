import 'dart:convert';

import 'package:http/http.dart' as http;

import 'cdn_client.dart';
import 'config.dart';
import 'locale_utils.dart';
import 'ttl_cache.dart';
import 'types.dart';

const _storagePrefix = '@better-i18n';

/// Core i18n engine — pure Dart, no Flutter dependency.
///
/// Implements the same 3-tier fallback chain as TS `@better-i18n/core`:
/// 1. Memory cache (TtlCache)
/// 2. CDN fetch (with timeout + retry)
/// 3. Persistent storage
/// 4. staticData (messages only)
class I18nCore {
  final NormalizedConfig config;
  final CdnClient _cdnClient;

  // Class-level static caches (shared across instances like TS module-level caches)
  static final TtlCache<ManifestResponse> _manifestCache = TtlCache();
  static final TtlCache<Messages> _messagesCache = TtlCache();

  I18nCore({required this.config, http.Client? httpClient})
      : _cdnClient = CdnClient(config: config, httpClient: httpClient);

  // ─── Storage helpers ────────────────────────────────────────────

  String _manifestStorageKey() =>
      '$_storagePrefix:manifest:${config.project}';

  String _messagesStorageKey(String locale) =>
      '$_storagePrefix:messages:${config.project}:$locale';

  String _manifestCacheKey() =>
      buildCacheKey(config.cdnBaseUrl, config.project);

  String _messagesCacheKey(String locale) =>
      '${buildCacheKey(config.cdnBaseUrl, config.project)}|$locale';

  Future<T?> _readFromStorage<T>(String key, T Function(Map<String, dynamic>) fromJson) async {
    if (config.storage == null) return null;
    try {
      final raw = await config.storage!.get(key);
      if (raw == null) return null;
      return fromJson(jsonDecode(raw) as Map<String, dynamic>);
    } catch (_) {
      return null;
    }
  }

  Future<void> _writeToStorage(String key, Object data) async {
    if (config.storage == null) return;
    try {
      await config.storage!.set(key, jsonEncode(data));
    } catch (_) {
      // Storage full or unavailable — silently fail
    }
  }

  // ─── Manifest ─────────────────────────────────────────────────

  /// Get manifest with full fallback chain.
  Future<ManifestResponse> getManifest({bool forceRefresh = false}) async {
    final cacheKey = _manifestCacheKey();
    final storageKey = _manifestStorageKey();

    // 1. Memory cache
    if (!forceRefresh) {
      final cached = _manifestCache.get(cacheKey);
      if (cached != null) return cached;
    }

    // 2. CDN fetch
    try {
      final manifest = await _cdnClient.fetchManifest();
      _manifestCache.set(cacheKey, manifest, config.manifestCacheTtlMs);

      // Write-through to storage (fire-and-forget)
      _writeToStorage(storageKey, manifest.toJson());

      return manifest;
    } catch (cdnError) {
      // 3. Persistent storage
      final stored = await _readFromStorage<ManifestResponse>(
        storageKey,
        ManifestResponse.fromJson,
      );
      if (stored != null) {
        _manifestCache.set(cacheKey, stored, config.manifestCacheTtlMs);
        return stored;
      }

      // 4. No fallback available
      rethrow;
    }
  }

  // ─── Messages ─────────────────────────────────────────────────

  /// Get messages for a locale with full fallback chain.
  Future<Messages> getMessages(String locale) async {
    final safeLng = normalizeLocale(locale);
    final cacheKey = _messagesCacheKey(safeLng);
    final storageKey = _messagesStorageKey(safeLng);

    // 1. Memory cache
    final memoryCached = _messagesCache.get(cacheKey);
    if (memoryCached != null) return memoryCached;

    // 2. CDN fetch
    try {
      final messages = await _cdnClient.fetchMessages(safeLng);
      _messagesCache.set(cacheKey, messages, config.manifestCacheTtlMs);

      // Write-through to storage (fire-and-forget)
      _writeToStorage(storageKey, messages);

      return messages;
    } catch (cdnError) {
      // 3. Persistent storage
      final stored = await _readFromStorage<Messages>(
        storageKey,
        _parseStoredMessages,
      );
      if (stored != null) {
        _messagesCache.set(cacheKey, stored, config.manifestCacheTtlMs);
        return stored;
      }

      // 4. staticData
      if (config.staticData != null && config.staticData!.containsKey(safeLng)) {
        return config.staticData![safeLng]!;
      }

      // 5. No fallback available
      rethrow;
    }
  }

  // ─── Languages ────────────────────────────────────────────────

  /// Get available languages as [LanguageOption] list.
  Future<List<LanguageOption>> getLanguages() async {
    final manifest = await getManifest();
    return manifest.languages.map((lang) {
      return LanguageOption(
        code: lang.code,
        name: lang.name,
        nativeName: lang.nativeName,
        flagUrl: lang.flagUrl,
        isDefault: lang.isSource,
      );
    }).toList();
  }

  /// Get available locale codes.
  Future<List<String>> getLocales() async {
    final manifest = await getManifest();
    return manifest.languages.map((l) => l.code).toList();
  }

  // ─── Cache control ────────────────────────────────────────────

  /// Clear all caches (useful for testing).
  static void clearAllCaches() {
    _manifestCache.clear();
    _messagesCache.clear();
  }

  static void clearManifestCache() => _manifestCache.clear();
  static void clearMessagesCache() => _messagesCache.clear();

  // ─── Helpers ──────────────────────────────────────────────────

  static Messages _parseStoredMessages(Map<String, dynamic> raw) {
    final messages = <String, Map<String, dynamic>>{};
    for (final entry in raw.entries) {
      if (entry.value is Map) {
        messages[entry.key] = Map<String, dynamic>.from(entry.value as Map);
      }
    }
    return messages;
  }
}
