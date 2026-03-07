import 'package:flutter/foundation.dart';

import '../core/config.dart';
import '../core/i18n_core.dart';
import '../core/interpolation.dart';
import '../core/locale_utils.dart';
import '../core/types.dart';

/// Controller that manages i18n state — locale, messages, and languages.
///
/// Extends [ChangeNotifier] so that widgets rebuild when state changes.
/// This is the Flutter-side counterpart to the React provider's state management.
class BetterI18nController extends ChangeNotifier {
  final I18nCore _core;

  String _locale;
  Messages? _messages;
  List<LanguageOption> _languages = [];
  bool _isLoading = true;
  bool _isReady = false;
  Object? _error;

  BetterI18nController({
    required I18nConfig config,
    String? initialLocale,
  })  : _locale = normalizeLocale(initialLocale ?? config.defaultLocale),
        _core = I18nCore(config: normalizeConfig(config));

  // ─── Getters ──────────────────────────────────────────────────

  /// Current active locale.
  String get locale => _locale;

  /// Loaded translation messages (null until ready).
  Messages? get messages => _messages;

  /// Available languages from CDN manifest.
  List<LanguageOption> get languages => _languages;

  /// Whether translations are currently loading.
  bool get isLoading => _isLoading;

  /// Whether the controller is initialized and ready.
  bool get isReady => _isReady;

  /// Last error that occurred during loading, if any.
  Object? get error => _error;

  // ─── Initialization ───────────────────────────────────────────

  /// Initialize the controller — load manifest and messages in parallel.
  ///
  /// Call this once after construction (typically in the provider's initState).
  Future<void> initialize() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Load manifest + messages in parallel
      final results = await Future.wait([
        _core.getLanguages(),
        _core.getMessages(_locale),
      ]);

      _languages = results[0] as List<LanguageOption>;
      _messages = results[1] as Messages;
      _isReady = true;
      _error = null;
    } catch (e) {
      _error = e;
      _isReady = false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // ─── Locale switching ─────────────────────────────────────────

  /// Switch to a new locale and reload messages.
  Future<void> setLocale(String newLocale) async {
    final normalized = normalizeLocale(newLocale);
    if (normalized == _locale && _messages != null) return;

    _locale = normalized;
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _messages = await _core.getMessages(normalized);
      _error = null;
    } catch (e) {
      _error = e;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // ─── Translation ──────────────────────────────────────────────

  /// Translate a key with optional interpolation arguments.
  ///
  /// Key format: `"namespace.key"` (e.g., `"common.hello"`)
  ///
  /// Returns the key itself if translation is not found.
  String translate(String key, {Map<String, dynamic>? args}) {
    if (_messages == null) return key;

    final dotIndex = key.indexOf('.');
    if (dotIndex == -1) return key;

    final namespace = key.substring(0, dotIndex);
    final messageKey = key.substring(dotIndex + 1);

    final namespaceMap = _messages![namespace];
    if (namespaceMap == null) return key;

    final value = namespaceMap[messageKey];
    if (value == null) return key;

    final str = value.toString();
    return interpolate(str, args);
  }
}
