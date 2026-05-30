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

  /// Test-only: inject a resolved [Messages] tree so [translate] can be
  /// exercised without a live CDN, mirroring the post-load ready state.
  @visibleForTesting
  void debugSetMessages(Messages messages) {
    _messages = messages;
    _isReady = true;
    _isLoading = false;
    notifyListeners();
  }

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
  /// Key format: dot-notation `"namespace.key"` or any depth
  /// (`"auth.welcome.title"`). Resolution walks the loaded messages
  /// segment-by-segment through nested objects — matching the CDN's
  /// nested key format (`keyFormat: "nested"`) where a key like
  /// `auth.welcome.title` is served as `{"auth": {"welcome": {"title": …}}}`.
  ///
  /// Returns the key itself if no translation is found.
  String translate(String key, {Map<String, dynamic>? args}) {
    if (_messages == null) return key;

    final value = _resolve(key);
    if (value == null) return key;

    return interpolate(value, args);
  }

  /// Resolve [key] against the loaded [Messages] tree.
  ///
  /// 1. Deep traversal: split on every `.` and walk nested maps
  ///    (`auth.welcome.title` → `messages['auth']['welcome']['title']`).
  ///    This is the shape the CDN serves for nested-key projects and is
  ///    the only one that resolves keys deeper than two segments.
  /// 2. Legacy fallback: first segment as namespace, the remainder kept
  ///    as a single flat key (`messages['auth']['welcome.title']`), so
  ///    flat-in-namespace payloads keep working unchanged.
  ///
  /// Returns `null` when neither strategy yields a leaf value.
  String? _resolve(String key) {
    final messages = _messages!;

    // 1. Deep traversal through nested maps.
    dynamic node = messages;
    for (final segment in key.split('.')) {
      if (node is Map) {
        node = node[segment];
      } else {
        node = null;
        break;
      }
    }
    if (node is String) return node;
    if (node != null && node is! Map && node is! List) return node.toString();

    // 2. Legacy fallback: namespace + flat remainder.
    final dotIndex = key.indexOf('.');
    if (dotIndex != -1) {
      final namespaceMap = messages[key.substring(0, dotIndex)];
      final value = namespaceMap?[key.substring(dotIndex + 1)];
      if (value != null && value is! Map && value is! List) {
        return value.toString();
      }
    }

    return null;
  }
}
