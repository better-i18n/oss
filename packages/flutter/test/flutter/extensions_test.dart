import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:better_i18n/src/core/types.dart';
import 'package:better_i18n/src/flutter/better_i18n_controller.dart';
import 'package:better_i18n/src/flutter/better_i18n_scope.dart';
import 'package:better_i18n/src/flutter/extensions.dart';

void main() {
  group('BetterI18nExtensions', () {
    late BetterI18nController controller;

    setUp(() {
      controller = BetterI18nController(
        config: const I18nConfig(
          project: 'acme/app',
          defaultLocale: 'en',
        ),
      );
    });

    tearDown(() {
      controller.dispose();
    });

    Widget buildTestWidget(Widget Function(BuildContext) builder) {
      return Directionality(
        textDirection: TextDirection.ltr,
        child: BetterI18nScope(
          controller: controller,
          child: Builder(builder: builder),
        ),
      );
    }

    testWidgets('context.t() translates a key', (tester) async {
      // Manually set messages on controller for testing
      // We use the translate method which reads from _messages
      // Since controller._messages is private, we test through the widget

      String? result;

      await tester.pumpWidget(buildTestWidget((context) {
        // Will return the key itself since no messages are loaded
        result = context.t('common.hello');
        return const SizedBox();
      }));

      // No messages loaded, so should return the key
      expect(result, equals('common.hello'));
    });

    testWidgets('context.i18nLocale returns the current locale',
        (tester) async {
      String? locale;

      await tester.pumpWidget(buildTestWidget((context) {
        locale = context.i18nLocale;
        return const SizedBox();
      }));

      expect(locale, equals('en'));
    });

    testWidgets('context.i18nLanguages returns empty list initially',
        (tester) async {
      List<LanguageOption>? languages;

      await tester.pumpWidget(buildTestWidget((context) {
        languages = context.i18nLanguages;
        return const SizedBox();
      }));

      expect(languages, isEmpty);
    });

    testWidgets('context.i18n returns the controller', (tester) async {
      BetterI18nController? captured;

      await tester.pumpWidget(buildTestWidget((context) {
        captured = context.i18n;
        return const SizedBox();
      }));

      expect(captured, equals(controller));
    });
  });
}
