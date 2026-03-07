import 'package:flutter/widgets.dart';

import '../core/types.dart';
import 'better_i18n_controller.dart';
import 'better_i18n_scope.dart';

/// Public API widget that sets up better-i18n for the widget subtree.
///
/// Manages the [BetterI18nController] lifecycle and provides it
/// via [BetterI18nScope] to all descendant widgets.
///
/// ```dart
/// BetterI18nProvider(
///   project: 'acme/dashboard',
///   defaultLocale: 'en',
///   locale: 'tr',
///   loadingBuilder: (_) => CircularProgressIndicator(),
///   child: MyApp(),
/// )
/// ```
class BetterI18nProvider extends StatefulWidget {
  /// Project identifier in "org/project" format.
  final String project;

  /// Default locale (fallback).
  final String defaultLocale;

  /// Current locale — can be controlled externally (e.g., from a Cubit).
  final String? locale;

  /// CDN base URL override.
  final String? cdnBaseUrl;

  /// Cache TTL in milliseconds.
  final int? ttl;

  /// Fetch timeout in milliseconds.
  final int? timeout;

  /// Retry count for CDN fetches.
  final int? retry;

  /// Persistent storage adapter.
  final TranslationStorage? storage;

  /// Static fallback translations.
  final Map<String, Messages>? staticData;

  /// Widget shown while translations are loading.
  final WidgetBuilder? loadingBuilder;

  /// Widget shown when a fatal error occurs.
  final Widget Function(BuildContext context, Object error)? errorBuilder;

  /// The widget subtree that will have access to translations.
  final Widget child;

  const BetterI18nProvider({
    super.key,
    required this.project,
    required this.defaultLocale,
    required this.child,
    this.locale,
    this.cdnBaseUrl,
    this.ttl,
    this.timeout,
    this.retry,
    this.storage,
    this.staticData,
    this.loadingBuilder,
    this.errorBuilder,
  });

  @override
  State<BetterI18nProvider> createState() => _BetterI18nProviderState();
}

class _BetterI18nProviderState extends State<BetterI18nProvider> {
  late BetterI18nController _controller;

  @override
  void initState() {
    super.initState();
    _controller = _createController();
    _controller.initialize();
  }

  @override
  void didUpdateWidget(BetterI18nProvider oldWidget) {
    super.didUpdateWidget(oldWidget);

    // Recreate controller if config changed
    if (oldWidget.project != widget.project ||
        oldWidget.defaultLocale != widget.defaultLocale ||
        oldWidget.cdnBaseUrl != widget.cdnBaseUrl) {
      _controller.dispose();
      _controller = _createController();
      _controller.initialize();
      return;
    }

    // Track external locale changes (e.g., from a Cubit)
    if (widget.locale != null && widget.locale != oldWidget.locale) {
      _controller.setLocale(widget.locale!);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  BetterI18nController _createController() {
    return BetterI18nController(
      config: I18nConfig(
        project: widget.project,
        defaultLocale: widget.defaultLocale,
        cdnBaseUrl: widget.cdnBaseUrl,
        ttl: widget.ttl,
        timeout: widget.timeout,
        retry: widget.retry,
        storage: widget.storage,
        staticData: widget.staticData,
      ),
      initialLocale: widget.locale,
    );
  }

  @override
  Widget build(BuildContext context) {
    return BetterI18nScope(
      controller: _controller,
      child: _BetterI18nConsumer(
        controller: _controller,
        loadingBuilder: widget.loadingBuilder,
        errorBuilder: widget.errorBuilder,
        child: widget.child,
      ),
    );
  }
}

/// Internal widget that listens to the controller and handles loading/error states.
class _BetterI18nConsumer extends StatefulWidget {
  final BetterI18nController controller;
  final WidgetBuilder? loadingBuilder;
  final Widget Function(BuildContext context, Object error)? errorBuilder;
  final Widget child;

  const _BetterI18nConsumer({
    required this.controller,
    required this.child,
    this.loadingBuilder,
    this.errorBuilder,
  });

  @override
  State<_BetterI18nConsumer> createState() => _BetterI18nConsumerState();
}

class _BetterI18nConsumerState extends State<_BetterI18nConsumer> {
  @override
  void initState() {
    super.initState();
    widget.controller.addListener(_onControllerChanged);
  }

  @override
  void didUpdateWidget(_BetterI18nConsumer oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      oldWidget.controller.removeListener(_onControllerChanged);
      widget.controller.addListener(_onControllerChanged);
    }
  }

  @override
  void dispose() {
    widget.controller.removeListener(_onControllerChanged);
    super.dispose();
  }

  void _onControllerChanged() {
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final controller = widget.controller;

    // Error state
    if (controller.error != null && !controller.isReady) {
      if (widget.errorBuilder != null) {
        return widget.errorBuilder!(context, controller.error!);
      }
      return const SizedBox.shrink();
    }

    // Loading state (initial load only)
    if (!controller.isReady) {
      if (widget.loadingBuilder != null) {
        return widget.loadingBuilder!(context);
      }
      return const SizedBox.shrink();
    }

    return widget.child;
  }
}
