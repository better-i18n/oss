import 'dart:ui' as ui;

/// Normalize a BCP 47 locale code for CDN compatibility.
/// - Lowercases the entire code
/// - Converts underscore separators to hyphens
///
/// ```dart
/// normalizeLocale('pt-BR')      // 'pt-br'
/// normalizeLocale('zh_TW')      // 'zh-tw'
/// normalizeLocale('EN')         // 'en'
/// ```
String normalizeLocale(String locale) =>
    locale.toLowerCase().replaceAll('_', '-');

/// Detect the best locale from available options.
///
/// Priority: [storedLocale] > [deviceLocales] > [defaultLocale]
///
/// Matches exact first, then base language (e.g., "en" matches "en-us").
String detectLocale({
  required List<String> availableLocales,
  required String defaultLocale,
  String? storedLocale,
  List<ui.Locale>? deviceLocales,
}) {
  final normalized =
      availableLocales.map((l) => normalizeLocale(l)).toList();

  // 1. Stored preference (exact match)
  if (storedLocale != null) {
    final match = _findLocale(storedLocale, normalized, availableLocales);
    if (match != null) return match;
  }

  // 2. Device locales (exact + base language)
  if (deviceLocales != null) {
    for (final deviceLocale in deviceLocales) {
      final code = deviceLocale.toLanguageTag();
      final match = _findLocale(code, normalized, availableLocales);
      if (match != null) return match;
    }
    // Try base language match for device locales
    for (final deviceLocale in deviceLocales) {
      final base = deviceLocale.languageCode;
      final match = _findLocale(base, normalized, availableLocales);
      if (match != null) return match;
    }
  }

  // 3. Default locale
  return defaultLocale;
}

/// Find a locale in available list by exact or base-language match.
String? _findLocale(
  String code,
  List<String> normalizedAvailable,
  List<String> originalAvailable,
) {
  final normalizedCode = normalizeLocale(code);

  // Exact match
  final exactIndex = normalizedAvailable.indexOf(normalizedCode);
  if (exactIndex != -1) return originalAvailable[exactIndex];

  // Base language match (e.g., "en" matches "en-us")
  final base = normalizedCode.split('-').first;
  final baseIndex = normalizedAvailable.indexWhere(
    (a) => a.split('-').first == base,
  );
  if (baseIndex != -1) return originalAvailable[baseIndex];

  return null;
}
