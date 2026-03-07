import 'package:flutter/widgets.dart';

import '../core/types.dart';
import 'better_i18n_controller.dart';
import 'better_i18n_scope.dart';

/// BuildContext extensions for easy access to i18n functionality.
///
/// ```dart
/// // Translate a key
/// Text(context.t('common.hello', args: {'name': 'Osman'}))
///
/// // Get current locale
/// final locale = context.i18nLocale;
///
/// // Switch locale
/// context.setI18nLocale('tr');
///
/// // Available languages
/// final languages = context.i18nLanguages;
/// ```
extension BetterI18nExtensions on BuildContext {
  /// Get the [BetterI18nController] from the nearest ancestor scope.
  BetterI18nController get i18n => BetterI18nScope.of(this);

  /// Translate a key with optional interpolation arguments.
  ///
  /// Key format: `"namespace.key"` (e.g., `"common.hello"`)
  String t(String key, {Map<String, dynamic>? args}) =>
      BetterI18nScope.of(this).translate(key, args: args);

  /// Get the current active locale.
  String get i18nLocale => BetterI18nScope.of(this).locale;

  /// Get the list of available languages from the CDN manifest.
  List<LanguageOption> get i18nLanguages => BetterI18nScope.of(this).languages;

  /// Switch to a new locale.
  ///
  /// This reloads messages from CDN and triggers a rebuild.
  Future<void> setI18nLocale(String locale) =>
      BetterI18nScope.of(this).setLocale(locale);
}
