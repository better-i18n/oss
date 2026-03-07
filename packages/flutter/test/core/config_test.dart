import 'package:flutter_test/flutter_test.dart';
import 'package:better_i18n/src/core/config.dart';
import 'package:better_i18n/src/core/types.dart';

void main() {
  group('parseProject', () {
    test('parses valid project string', () {
      final parsed = parseProject('acme/dashboard');
      expect(parsed.workspaceId, equals('acme'));
      expect(parsed.projectSlug, equals('dashboard'));
    });

    test('throws on missing slash', () {
      expect(() => parseProject('acmedashboard'), throwsArgumentError);
    });

    test('throws on empty org', () {
      expect(() => parseProject('/dashboard'), throwsArgumentError);
    });

    test('throws on empty slug', () {
      expect(() => parseProject('acme/'), throwsArgumentError);
    });

    test('throws on too many parts', () {
      expect(() => parseProject('a/b/c'), throwsArgumentError);
    });
  });

  group('normalizeConfig', () {
    test('applies default values', () {
      final config = normalizeConfig(const I18nConfig(
        project: 'acme/dashboard',
        defaultLocale: 'en',
      ));

      expect(config.cdnBaseUrl, equals('https://cdn.better-i18n.com'));
      expect(config.manifestCacheTtlMs, equals(300000));
      expect(config.fetchTimeout, equals(10000));
      expect(config.retryCount, equals(1));
      expect(config.workspaceId, equals('acme'));
      expect(config.projectSlug, equals('dashboard'));
    });

    test('respects custom values', () {
      final config = normalizeConfig(const I18nConfig(
        project: 'org/app',
        defaultLocale: 'tr',
        cdnBaseUrl: 'https://custom.cdn.com/',
        ttl: 60000,
        timeout: 5000,
        retry: 3,
      ));

      expect(config.cdnBaseUrl, equals('https://custom.cdn.com'));
      expect(config.manifestCacheTtlMs, equals(60000));
      expect(config.fetchTimeout, equals(5000));
      expect(config.retryCount, equals(3));
    });

    test('strips trailing slash from CDN URL', () {
      final config = normalizeConfig(const I18nConfig(
        project: 'acme/app',
        defaultLocale: 'en',
        cdnBaseUrl: 'https://cdn.example.com/',
      ));

      expect(config.cdnBaseUrl, equals('https://cdn.example.com'));
    });

    test('builds correct projectBaseUrl', () {
      final config = normalizeConfig(const I18nConfig(
        project: 'acme/dashboard',
        defaultLocale: 'en',
      ));

      expect(
        config.projectBaseUrl,
        equals('https://cdn.better-i18n.com/acme/dashboard'),
      );
    });

    test('throws on empty project', () {
      expect(
        () => normalizeConfig(const I18nConfig(
          project: '',
          defaultLocale: 'en',
        )),
        throwsArgumentError,
      );
    });

    test('throws on empty defaultLocale', () {
      expect(
        () => normalizeConfig(const I18nConfig(
          project: 'acme/app',
          defaultLocale: '',
        )),
        throwsArgumentError,
      );
    });
  });
}
