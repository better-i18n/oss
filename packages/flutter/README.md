# better_i18n

Flutter SDK for [Better i18n](https://better-i18n.com) — runtime translation loading from CDN with offline fallback.

[![pub](https://img.shields.io/pub/v/better_i18n)](https://pub.dev/packages/better_i18n)

## Features

- **Runtime Translations** — Fetched from CDN at runtime, no compile-time ARB/JSON files needed
- **Offline Fallback** — 4-tier fallback: Memory Cache → CDN → Persistent Storage → Static Data
- **Flutter-Idiomatic** — `context.t('namespace.key')` API with named argument interpolation
- **Runtime Locale Switching** — `context.setI18nLocale('tr')` — no restart required
- **Zero External State Dependency** — Works with Bloc, Riverpod, Provider, or standalone
- **Pluggable Storage** — SharedPreferences built-in, custom adapters supported

## Installation

Add to your `pubspec.yaml`:

```yaml
dependencies:
  better_i18n: ^0.1.0
```

Or install via CLI:

```bash
flutter pub add better_i18n
```

## Quick Start

### 1. Wrap your app

```dart
import 'package:better_i18n/better_i18n.dart';

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
```

### 2. Use translations

```dart
// Simple key
Text(context.t('common.hello'))

// With named arguments
Text(context.t('common.greeting', args: {'name': 'Osman'}))
```

### 3. Switch locale

```dart
await context.setI18nLocale('tr');
```

### 4. Access available languages

```dart
final languages = context.i18nLanguages;
for (final lang in languages) {
  print('${lang.code}: ${lang.nativeName}');
}
```

## API Reference

### `BetterI18nProvider`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project` | `String` | Yes | Project ID in `"org/project"` format |
| `defaultLocale` | `String` | Yes | Fallback locale |
| `locale` | `String` | Yes | Initial locale |
| `storage` | `TranslationStorage?` | No | Persistent storage adapter |
| `loadingBuilder` | `Widget Function(BuildContext)?` | No | Widget shown while loading |
| `child` | `Widget` | Yes | Child widget tree |

### Extension Methods on `BuildContext`

| Method | Returns | Description |
|--------|---------|-------------|
| `context.t(key, {args})` | `String` | Get translated string with optional named arguments |
| `context.setI18nLocale(locale)` | `Future<void>` | Switch locale at runtime |
| `context.i18nLocale` | `String` | Current locale |
| `context.i18nLanguages` | `List<LanguageOption>` | Available languages with metadata |

## How It Works

Translations are fetched from the Better i18n CDN at runtime. The SDK uses a 4-tier fallback chain:

1. **Memory cache** (TtlCache) — instant, no network
2. **CDN fetch** — with timeout + exponential backoff retry
3. **Persistent storage** (SharedPreferences) — offline fallback
4. **Static data** — bundled translations as last resort

## Offline Support

For apps that must work offline, provide a storage adapter and optional static data:

```dart
BetterI18nProvider(
  project: 'your-org/your-project',
  defaultLocale: 'en',
  locale: 'en',
  storage: SharedPrefsStorage(), // persists translations locally
  staticData: {
    'en': {'common': {'hello': 'Hello'}},
    'tr': {'common': {'hello': 'Merhaba'}},
  },
  child: const MyApp(),
);
```

### Custom Storage Adapter

Implement the `TranslationStorage` interface for custom storage (e.g., Hive, MMKV):

```dart
class HiveStorage implements TranslationStorage {
  final Box box;
  HiveStorage(this.box);

  @override
  Future<String?> get(String key) async => box.get(key);

  @override
  Future<void> set(String key, String value) async => box.put(key, value);

  @override
  Future<void> remove(String key) async => box.delete(key);
}
```

## Integration with State Management

`BetterI18nProvider` accepts an external `locale` prop, making it easy to integrate with Bloc, Riverpod, or any state management:

```dart
// With Bloc
BlocBuilder<LocaleCubit, String>(
  builder: (context, locale) => BetterI18nProvider(
    project: 'your-org/your-project',
    defaultLocale: 'en',
    locale: locale,
    child: const MyApp(),
  ),
);

// With Riverpod
Consumer(
  builder: (context, ref, child) {
    final locale = ref.watch(localeProvider);
    return BetterI18nProvider(
      project: 'your-org/your-project',
      defaultLocale: 'en',
      locale: locale,
      child: const MyApp(),
    );
  },
);
```

## Requirements

- Dart SDK: `>=3.2.0 <4.0.0`
- Flutter: `>=3.16.0`

## Documentation

Full documentation at [docs.better-i18n.com/frameworks/flutter](https://docs.better-i18n.com/frameworks/flutter)

## License

MIT © [Better i18n](https://better-i18n.com)
