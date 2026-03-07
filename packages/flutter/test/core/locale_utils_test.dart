import 'dart:ui' as ui;
import 'package:flutter_test/flutter_test.dart';
import 'package:better_i18n/src/core/locale_utils.dart';

void main() {
  group('normalizeLocale', () {
    test('lowercases locale', () {
      expect(normalizeLocale('EN'), equals('en'));
      expect(normalizeLocale('En-US'), equals('en-us'));
    });

    test('converts underscores to hyphens', () {
      expect(normalizeLocale('zh_TW'), equals('zh-tw'));
      expect(normalizeLocale('pt_BR'), equals('pt-br'));
    });

    test('already normalized locale passes through', () {
      expect(normalizeLocale('en'), equals('en'));
      expect(normalizeLocale('tr'), equals('tr'));
    });
  });

  group('detectLocale', () {
    const availableLocales = ['en', 'tr', 'de', 'pt-br'];

    test('returns stored locale when it matches', () {
      final result = detectLocale(
        availableLocales: availableLocales,
        defaultLocale: 'en',
        storedLocale: 'tr',
      );
      expect(result, equals('tr'));
    });

    test('ignores stored locale when it does not match', () {
      final result = detectLocale(
        availableLocales: availableLocales,
        defaultLocale: 'en',
        storedLocale: 'fr',
      );
      expect(result, equals('en'));
    });

    test('detects from device locales', () {
      final result = detectLocale(
        availableLocales: availableLocales,
        defaultLocale: 'en',
        deviceLocales: [const ui.Locale('de')],
      );
      expect(result, equals('de'));
    });

    test('stored locale takes priority over device locales', () {
      final result = detectLocale(
        availableLocales: availableLocales,
        defaultLocale: 'en',
        storedLocale: 'tr',
        deviceLocales: [const ui.Locale('de')],
      );
      expect(result, equals('tr'));
    });

    test('falls back to default locale', () {
      final result = detectLocale(
        availableLocales: availableLocales,
        defaultLocale: 'en',
      );
      expect(result, equals('en'));
    });

    test('matches base language from device locales', () {
      final result = detectLocale(
        availableLocales: availableLocales,
        defaultLocale: 'en',
        deviceLocales: [const ui.Locale('pt', 'PT')],
      );
      // Should match 'pt-br' via base language 'pt'
      expect(result, equals('pt-br'));
    });
  });
}
