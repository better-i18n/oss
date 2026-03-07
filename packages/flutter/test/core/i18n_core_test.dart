import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart' as http_testing;
import 'package:better_i18n/src/core/config.dart';
import 'package:better_i18n/src/core/i18n_core.dart';
import 'package:better_i18n/src/core/types.dart';
import 'package:better_i18n/src/storage/memory_storage.dart';

/// Create an HTTP response with proper UTF-8 encoding.
http.Response _utf8Response(String body, int statusCode) {
  return http.Response.bytes(
    Uint8List.fromList(utf8.encode(body)),
    statusCode,
    headers: {'content-type': 'application/json; charset=utf-8'},
  );
}

const _mockManifest = {
  'languages': [
    {'code': 'en', 'name': 'English', 'isSource': true},
    {'code': 'tr', 'name': 'Turkish'},
  ],
};

const _mockMessages = {
  'common': {
    'hello': 'Hello',
    'greeting': 'Hello {name}!',
  },
  'auth': {
    'login': 'Log in',
  },
};

const _mockMessagesTr = {
  'common': {
    'hello': 'Merhaba',
    'greeting': 'Merhaba {name}!',
  },
  'auth': {
    'login': 'Giriş yap',
  },
};

http_testing.MockClient _createMockClient({
  bool manifestFails = false,
  bool messagesFails = false,
}) {
  return http_testing.MockClient((request) async {
    final path = request.url.path;

    if (path.endsWith('/manifest.json')) {
      if (manifestFails) {
        return _utf8Response('Not found', 500);
      }
      return _utf8Response(jsonEncode(_mockManifest), 200);
    }

    if (path.contains('/translations.json')) {
      if (messagesFails) {
        return _utf8Response('Not found', 500);
      }
      final locale = path.split('/').reversed.elementAt(1);
      if (locale == 'tr') {
        return _utf8Response(jsonEncode(_mockMessagesTr), 200);
      }
      return _utf8Response(jsonEncode(_mockMessages), 200);
    }

    return _utf8Response('Not found', 404);
  });
}

void main() {
  setUp(() {
    I18nCore.clearAllCaches();
  });

  group('I18nCore', () {
    test('fetches manifest from CDN', () async {
      final core = I18nCore(
        config: normalizeConfig(const I18nConfig(
          project: 'acme/app',
          defaultLocale: 'en',
        )),
        httpClient: _createMockClient(),
      );

      final manifest = await core.getManifest();
      expect(manifest.languages, hasLength(2));
      expect(manifest.languages[0].code, equals('en'));
      expect(manifest.languages[1].code, equals('tr'));
    });

    test('fetches messages from CDN', () async {
      final core = I18nCore(
        config: normalizeConfig(const I18nConfig(
          project: 'acme/app',
          defaultLocale: 'en',
        )),
        httpClient: _createMockClient(),
      );

      final messages = await core.getMessages('en');
      expect(messages['common']!['hello'], equals('Hello'));
      expect(messages['auth']!['login'], equals('Log in'));
    });

    test('fetches messages for different locales', () async {
      final core = I18nCore(
        config: normalizeConfig(const I18nConfig(
          project: 'acme/app',
          defaultLocale: 'en',
        )),
        httpClient: _createMockClient(),
      );

      final messages = await core.getMessages('tr');
      expect(messages['common']!['hello'], equals('Merhaba'));
    });

    test('caches manifest in memory', () async {
      var fetchCount = 0;
      final client = http_testing.MockClient((request) async {
        if (request.url.path.endsWith('/manifest.json')) {
          fetchCount++;
          return _utf8Response(jsonEncode(_mockManifest), 200);
        }
        return _utf8Response('Not found', 404);
      });

      final core = I18nCore(
        config: normalizeConfig(const I18nConfig(
          project: 'acme/app',
          defaultLocale: 'en',
        )),
        httpClient: client,
      );

      await core.getManifest();
      await core.getManifest();
      expect(fetchCount, equals(1));
    });

    test('falls back to storage when CDN fails', () async {
      final storage = MemoryStorage();
      await storage.set(
        '@better-i18n:messages:acme/app:en',
        jsonEncode(_mockMessages),
      );

      final core = I18nCore(
        config: normalizeConfig(I18nConfig(
          project: 'acme/app',
          defaultLocale: 'en',
          storage: storage,
        )),
        httpClient: _createMockClient(messagesFails: true),
      );

      final messages = await core.getMessages('en');
      expect(messages['common']!['hello'], equals('Hello'));
    });

    test('falls back to staticData when CDN and storage fail', () async {
      final core = I18nCore(
        config: normalizeConfig(const I18nConfig(
          project: 'acme/app',
          defaultLocale: 'en',
          staticData: {'en': _mockMessages},
        )),
        httpClient: _createMockClient(messagesFails: true),
      );

      final messages = await core.getMessages('en');
      expect(messages['common']!['hello'], equals('Hello'));
    });

    test('getLanguages returns language options', () async {
      final core = I18nCore(
        config: normalizeConfig(const I18nConfig(
          project: 'acme/app',
          defaultLocale: 'en',
        )),
        httpClient: _createMockClient(),
      );

      final languages = await core.getLanguages();
      expect(languages, hasLength(2));
      expect(languages[0].code, equals('en'));
      expect(languages[0].isDefault, isTrue);
      expect(languages[1].code, equals('tr'));
    });

    test('getLocales returns locale codes', () async {
      final core = I18nCore(
        config: normalizeConfig(const I18nConfig(
          project: 'acme/app',
          defaultLocale: 'en',
        )),
        httpClient: _createMockClient(),
      );

      final locales = await core.getLocales();
      expect(locales, equals(['en', 'tr']));
    });

    test('writes through to storage on CDN success', () async {
      final storage = MemoryStorage();

      final core = I18nCore(
        config: normalizeConfig(I18nConfig(
          project: 'acme/app',
          defaultLocale: 'en',
          storage: storage,
        )),
        httpClient: _createMockClient(),
      );

      await core.getMessages('en');

      // Give fire-and-forget write a moment
      await Future<void>.delayed(const Duration(milliseconds: 50));

      final stored = await storage.get('@better-i18n:messages:acme/app:en');
      expect(stored, isNotNull);
      final parsed = jsonDecode(stored!) as Map<String, dynamic>;
      expect(parsed['common']['hello'], equals('Hello'));
    });
  });
}
