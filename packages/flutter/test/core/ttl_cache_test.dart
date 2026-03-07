import 'package:flutter_test/flutter_test.dart';
import 'package:better_i18n/src/core/ttl_cache.dart';

void main() {
  group('TtlCache', () {
    late TtlCache<String> cache;

    setUp(() {
      cache = TtlCache<String>();
    });

    test('returns null for missing key', () {
      expect(cache.get('missing'), isNull);
    });

    test('set and get value', () {
      cache.set('key', 'value', 60000);
      expect(cache.get('key'), equals('value'));
    });

    test('has() returns true for existing key', () {
      cache.set('key', 'value', 60000);
      expect(cache.has('key'), isTrue);
    });

    test('has() returns false for missing key', () {
      expect(cache.has('missing'), isFalse);
    });

    test('returns null for expired key', () async {
      cache.set('key', 'value', 1); // 1ms TTL
      await Future<void>.delayed(const Duration(milliseconds: 10));
      expect(cache.get('key'), isNull);
    });

    test('delete removes entry', () {
      cache.set('key', 'value', 60000);
      expect(cache.delete('key'), isTrue);
      expect(cache.get('key'), isNull);
    });

    test('delete returns false for missing key', () {
      expect(cache.delete('missing'), isFalse);
    });

    test('clear removes all entries', () {
      cache.set('a', '1', 60000);
      cache.set('b', '2', 60000);
      cache.clear();
      expect(cache.get('a'), isNull);
      expect(cache.get('b'), isNull);
    });

    test('overwrite existing key', () {
      cache.set('key', 'old', 60000);
      cache.set('key', 'new', 60000);
      expect(cache.get('key'), equals('new'));
    });
  });

  group('buildCacheKey', () {
    test('combines CDN base URL and project', () {
      expect(
        buildCacheKey('https://cdn.example.com', 'org/project'),
        equals('https://cdn.example.com|org/project'),
      );
    });
  });
}
