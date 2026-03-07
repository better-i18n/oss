# better_i18n

Flutter SDK for [better-i18n](https://better-i18n.com) — runtime translation loading from CDN with offline fallback.

## Features

- Runtime translations from CDN (no compile-time ARB/JSON files needed)
- 3-tier fallback: Memory Cache → CDN → Persistent Storage → Static Data
- `context.t('namespace.key')` — Flutter-idiomatic translation API
- Runtime locale switching with `context.setI18nLocale('tr')`
- Zero external state management dependency (works with Bloc, Riverpod, etc.)
- Pluggable storage interface for offline support

## Quick Start

```dart
import 'package:better_i18n/better_i18n.dart';

// Wrap your app
MaterialApp(
  home: BetterI18nProvider(
    project: 'your-org/your-project',
    defaultLocale: 'en',
    locale: 'en',
    storage: SharedPrefsStorage(),
    loadingBuilder: (_) => const CircularProgressIndicator(),
    child: const MyApp(),
  ),
);

// Use translations anywhere
Text(context.t('common.hello'))
Text(context.t('common.greeting', args: {'name': 'Osman'}))

// Switch locale
await context.setI18nLocale('tr');

// Access available languages
final languages = context.i18nLanguages;
```

## How It Works

Translations are fetched from the better-i18n CDN at runtime. The SDK uses a 3-tier fallback chain:

1. **Memory cache** (TtlCache) — instant, no network
2. **CDN fetch** — with timeout + exponential backoff retry
3. **Persistent storage** (SharedPreferences) — offline fallback
4. **Static data** — bundled translations as last resort

## Integration with State Management

`BetterI18nProvider` accepts an external `locale` prop, making it easy to integrate with Bloc, Riverpod, or any state management:

```dart
BlocBuilder<LocaleCubit, String>(
  builder: (context, locale) => BetterI18nProvider(
    project: 'your-org/your-project',
    defaultLocale: 'en',
    locale: locale,
    child: const MyApp(),
  ),
);
```

## License

MIT
