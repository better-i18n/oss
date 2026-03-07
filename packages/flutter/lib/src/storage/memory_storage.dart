import '../core/types.dart';

/// In-memory [TranslationStorage] backed by a simple [Map].
///
/// Useful for testing and debug scenarios where persistence is not needed.
class MemoryStorage implements TranslationStorage {
  final Map<String, String> _store = {};

  @override
  Future<String?> get(String key) async => _store[key];

  @override
  Future<void> set(String key, String value) async => _store[key] = value;

  @override
  Future<void> remove(String key) async => _store.remove(key);

  /// Clear all stored data.
  void clear() => _store.clear();

  /// Get the number of stored entries.
  int get length => _store.length;
}
