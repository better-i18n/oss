import 'package:shared_preferences/shared_preferences.dart';

import '../core/types.dart';

/// [TranslationStorage] backed by [SharedPreferences].
///
/// Uses lazy initialization — SharedPreferences instance is obtained
/// on first access and reused thereafter.
class SharedPrefsStorage implements TranslationStorage {
  SharedPreferences? _prefs;

  Future<SharedPreferences> _getPrefs() async {
    _prefs ??= await SharedPreferences.getInstance();
    return _prefs!;
  }

  @override
  Future<String?> get(String key) async {
    try {
      final prefs = await _getPrefs();
      return prefs.getString(key);
    } catch (_) {
      return null;
    }
  }

  @override
  Future<void> set(String key, String value) async {
    try {
      final prefs = await _getPrefs();
      await prefs.setString(key, value);
    } catch (_) {
      // SharedPreferences unavailable — silently fail
    }
  }

  @override
  Future<void> remove(String key) async {
    try {
      final prefs = await _getPrefs();
      await prefs.remove(key);
    } catch (_) {
      // SharedPreferences unavailable — silently fail
    }
  }
}
