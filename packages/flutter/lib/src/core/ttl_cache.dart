/// Simple in-memory TTL cache — direct port of TS `cache.ts`.
class TtlCache<T> {
  final Map<String, _CacheEntry<T>> _cache = {};

  /// Get a value from cache if not expired.
  T? get(String key) {
    final entry = _cache[key];
    if (entry == null) return null;

    if (entry.expiresAt <= DateTime.now().millisecondsSinceEpoch) {
      _cache.remove(key);
      return null;
    }

    return entry.value;
  }

  /// Set a value in cache with TTL in milliseconds.
  void set(String key, T value, int ttlMs) {
    _cache[key] = _CacheEntry(
      value: value,
      expiresAt: DateTime.now().millisecondsSinceEpoch + ttlMs,
    );
  }

  /// Check if a key exists and is not expired.
  bool has(String key) => get(key) != null;

  /// Delete a key from cache.
  bool delete(String key) => _cache.remove(key) != null;

  /// Clear all entries.
  void clear() => _cache.clear();
}

class _CacheEntry<T> {
  final T value;
  final int expiresAt;

  const _CacheEntry({required this.value, required this.expiresAt});
}

/// Build a cache key from CDN base URL and project.
String buildCacheKey(String cdnBaseUrl, String project) =>
    '$cdnBaseUrl|$project';
