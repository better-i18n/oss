---
title: Mobile SDKs — Expo, Swift, Flutter
---

# Mobile SDKs

## @better-i18n/expo — React Native / Expo

```bash
npx expo install @better-i18n/expo i18next react-i18next
```

### Setup

```typescript
// i18n.ts — call once before app renders, never inside a component
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { initBetterI18n, storageAdapter } from "@better-i18n/expo";
import * as SecureStore from "expo-secure-store"; // or MMKV

i18n.use(initReactI18next);

export const ready = initBetterI18n({
  project: "acme/mobile",       // "org/project"
  i18n,
  defaultLocale: "en",
  supportedLocales: ["en", "tr", "de"],
  useDeviceLocale: true,        // auto-detect from device settings
  storage: storageAdapter(SecureStore),  // or AsyncStorage
  fallbackLocale: "en",
});
```

```typescript
// App.tsx
import { ready } from "./i18n";
import { Suspense } from "react";

export default function App() {
  return (
    <Suspense fallback={null}>
      <I18nextProvider i18n={i18n}>
        <AppContent />
      </I18nextProvider>
    </Suspense>
  );
}
```

### Usage

```typescript
import { useTranslation } from "react-i18next";

function Screen() {
  const { t } = useTranslation("onboarding");
  return <Text>{t("welcome")}</Text>;
}
```

### Language switching — pre-load before switching

`initBetterI18n` overrides `i18n.changeLanguage()` to **pre-fetch translations before switching**. This prevents the English flash that occurs when switching to a locale whose translations haven't been loaded yet.

```typescript
// Safe — translations are fetched before the switch occurs
await i18n.changeLanguage("tr");
```

### MMKV (recommended for performance)

```typescript
import { MMKV } from "react-native-mmkv";
import { storageAdapter } from "@better-i18n/expo";

const mmkv = new MMKV({ id: "i18n" });

initBetterI18n({
  project: "acme/mobile",
  i18n,
  storage: storageAdapter(mmkv),  // faster than AsyncStorage
});
```

### Offline support

Pass `staticData` for offline fallback:

```typescript
import en from "./locales/en.json";
import tr from "./locales/tr.json";

initBetterI18n({
  project: "acme/mobile",
  i18n,
  staticData: { en, tr },   // shown when CDN unavailable
});
```

---

## Swift SDK — BetterI18n (SPM)

```swift
// Package.swift
.package(url: "https://github.com/better-i18n/swift-sdk", from: "1.0.0")
```

### Setup

```swift
import BetterI18n

// AppDelegate or @main
let i18n = BetterI18n(
    project: "acme/ios",       // "org/project"
    defaultLocale: "en",
    supportedLocales: ["en", "tr", "de"]
)

await i18n.load()   // two-phase: storage-first → CDN refresh in background
```

### Usage

```swift
// SwiftUI View
struct ContentView: View {
    @EnvironmentObject var i18n: BetterI18n

    var body: some View {
        Text(i18n.t("home.title"))
    }
}
```

### Actor-based concurrency

The Swift SDK uses `actor` isolation for thread-safe concurrent access. `TtlCache` and `CDNClient` are actors — all CDN operations are async and safe to call from any task.

### Two-phase loading

1. **Phase 1 (sync)** — Load from local storage immediately (no network wait)
2. **Phase 2 (background)** — Refresh from CDN asynchronously; UI updates when complete

Storage keys follow the same format as the JS SDK: `@better-i18n:messages:{project}:{locale}`

---

## Flutter SDK — better_i18n

```yaml
# pubspec.yaml
dependencies:
  better_i18n: ^1.0.0
```

### Setup

```dart
import 'package:better_i18n/better_i18n.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final i18n = BetterI18n(
    project: 'acme/app',       // "org/project"
    defaultLocale: 'en',
    supportedLocales: const ['en', 'tr', 'de'],
  );

  await i18n.initialize();
  runApp(BetterI18nProvider(i18n: i18n, child: const MyApp()));
}
```

### Usage

```dart
// In widget
final t = BetterI18n.of(context);
Text(t('home.title'))
```

### Locale switching

```dart
await i18n.setLocale('tr');  // pre-fetches then switches
```
