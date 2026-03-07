import 'package:flutter/widgets.dart';

import 'better_i18n_controller.dart';

/// An [InheritedNotifier] that provides [BetterI18nController] to the widget tree.
///
/// Automatically rebuilds dependants when the controller calls `notifyListeners()`.
class BetterI18nScope extends InheritedNotifier<BetterI18nController> {
  const BetterI18nScope({
    super.key,
    required BetterI18nController controller,
    required super.child,
  }) : super(notifier: controller);

  /// Get the controller from the nearest ancestor [BetterI18nScope].
  ///
  /// Throws if no scope is found in the widget tree.
  static BetterI18nController of(BuildContext context) {
    final scope =
        context.dependOnInheritedWidgetOfExactType<BetterI18nScope>();
    assert(
      scope != null,
      'BetterI18nScope.of() called without a BetterI18nScope ancestor. '
      'Wrap your app with BetterI18nProvider.',
    );
    return scope!.notifier!;
  }

  /// Get the controller, or null if no scope is found.
  static BetterI18nController? maybeOf(BuildContext context) {
    final scope =
        context.dependOnInheritedWidgetOfExactType<BetterI18nScope>();
    return scope?.notifier;
  }
}
