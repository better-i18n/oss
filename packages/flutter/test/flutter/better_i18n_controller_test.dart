import 'package:better_i18n/src/core/types.dart';
import 'package:better_i18n/src/flutter/better_i18n_controller.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('BetterI18nController.translate', () {
    late BetterI18nController controller;

    setUp(() {
      controller = BetterI18nController(
        config: const I18nConfig(project: 'acme/app', defaultLocale: 'en'),
      );
    });

    tearDown(() => controller.dispose());

    test('returns the key itself when no messages are loaded', () {
      expect(controller.translate('auth.welcome.title'), 'auth.welcome.title');
    });

    test('resolves a deep (3-segment) nested key — CDN nested format', () {
      controller.debugSetMessages(<String, Map<String, dynamic>>{
        'auth': <String, dynamic>{
          'welcome': <String, dynamic>{'title': 'Flof.'},
        },
      });

      expect(controller.translate('auth.welcome.title'), 'Flof.');
    });

    test('resolves a two-segment key (backward compatible)', () {
      controller.debugSetMessages(<String, Map<String, dynamic>>{
        'onboarding': <String, dynamic>{'next': 'Continue'},
      });

      expect(controller.translate('onboarding.next'), 'Continue');
    });

    test('interpolates named args (single and double brace)', () {
      controller.debugSetMessages(<String, Map<String, dynamic>>{
        'auth': <String, dynamic>{
          'verify': <String, dynamic>{
            'subtitle': 'Sent to {email}.',
            'greeting': 'Hi {{name}}',
          },
        },
      });

      expect(
        controller.translate('auth.verify.subtitle', args: {'email': 'a@b.co'}),
        'Sent to a@b.co.',
      );
      expect(
        controller.translate('auth.verify.greeting', args: {'name': 'Osman'}),
        'Hi Osman',
      );
    });

    test('returns the key when the path resolves to a branch, not a leaf', () {
      controller.debugSetMessages(<String, Map<String, dynamic>>{
        'auth': <String, dynamic>{
          'welcome': <String, dynamic>{'title': 'Flof.'},
        },
      });

      // 'auth.welcome' points at an object, not a string.
      expect(controller.translate('auth.welcome'), 'auth.welcome');
    });

    test('returns the key for an unknown path', () {
      controller.debugSetMessages(<String, Map<String, dynamic>>{
        'auth': <String, dynamic>{'welcome': <String, dynamic>{'title': 'x'}},
      });

      expect(controller.translate('nope.gone'), 'nope.gone');
    });

    test('legacy flat-in-namespace payload still resolves', () {
      controller.debugSetMessages(<String, Map<String, dynamic>>{
        'auth': <String, dynamic>{'welcome.title': 'Legacy.'},
      });

      expect(controller.translate('auth.welcome.title'), 'Legacy.');
    });
  });
}
