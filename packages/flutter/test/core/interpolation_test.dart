import 'package:flutter_test/flutter_test.dart';
import 'package:better_i18n/src/core/interpolation.dart';

void main() {
  group('interpolate', () {
    test('replaces {name} placeholder', () {
      expect(
        interpolate('Hello {name}!', {'name': 'Osman'}),
        equals('Hello Osman!'),
      );
    });

    test('replaces {{name}} placeholder (i18next compat)', () {
      expect(
        interpolate('Hello {{name}}!', {'name': 'Osman'}),
        equals('Hello Osman!'),
      );
    });

    test('replaces multiple placeholders', () {
      expect(
        interpolate('{greeting}, {name}!', {'greeting': 'Hi', 'name': 'Ali'}),
        equals('Hi, Ali!'),
      );
    });

    test('handles mixed {{}} and {} placeholders', () {
      expect(
        interpolate('{{greeting}}, {name}!', {'greeting': 'Hi', 'name': 'Ali'}),
        equals('Hi, Ali!'),
      );
    });

    test('returns template when args is null', () {
      expect(interpolate('Hello {name}!', null), equals('Hello {name}!'));
    });

    test('returns template when args is empty', () {
      expect(interpolate('Hello {name}!', {}), equals('Hello {name}!'));
    });

    test('handles numeric values', () {
      expect(
        interpolate('{count} items', {'count': 42}),
        equals('42 items'),
      );
    });

    test('handles no placeholders in template', () {
      expect(
        interpolate('No placeholders here', {'key': 'value'}),
        equals('No placeholders here'),
      );
    });
  });
}
