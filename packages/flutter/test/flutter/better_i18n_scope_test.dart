import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:better_i18n/src/core/types.dart';
import 'package:better_i18n/src/flutter/better_i18n_controller.dart';
import 'package:better_i18n/src/flutter/better_i18n_scope.dart';

void main() {
  group('BetterI18nScope', () {
    testWidgets('of() returns the controller from ancestor scope',
        (tester) async {
      final controller = BetterI18nController(
        config: const I18nConfig(
          project: 'acme/app',
          defaultLocale: 'en',
        ),
      );

      BetterI18nController? captured;

      await tester.pumpWidget(
        Directionality(
          textDirection: TextDirection.ltr,
          child: BetterI18nScope(
            controller: controller,
            child: Builder(
              builder: (context) {
                captured = BetterI18nScope.of(context);
                return const SizedBox();
              },
            ),
          ),
        ),
      );

      expect(captured, equals(controller));
      controller.dispose();
    });

    testWidgets('maybeOf() returns null when no scope exists',
        (tester) async {
      BetterI18nController? captured;

      await tester.pumpWidget(
        Directionality(
          textDirection: TextDirection.ltr,
          child: Builder(
            builder: (context) {
              captured = BetterI18nScope.maybeOf(context);
              return const SizedBox();
            },
          ),
        ),
      );

      expect(captured, isNull);
    });
  });
}
