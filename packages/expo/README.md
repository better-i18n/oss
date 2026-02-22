# @better-i18n/expo

Better i18n integration for [Expo](https://expo.dev) and React Native. Fetches translations from the CDN with **offline caching** and **auto-detected device locale**.

## Features

- **CDN-Powered** — Translations served from the edge via Better i18n CDN
- **Offline-First** — Network-first strategy with automatic persistent cache fallback
- **Auto Storage Detection** — Uses MMKV, AsyncStorage, or in-memory (zero config)
- **Device Locale** — Detect device language via `expo-localization`
- **i18next Compatible** — Works as a backend plugin or one-call init helper
- **Namespace Auto-Discovery** — Automatically registers all namespaces from CDN data
- **Lightweight** — Built on `@better-i18n/core` (~2KB)

## Installation

```bash
npm install @better-i18n/expo i18next react-i18next
# or
bun add @better-i18n/expo i18next react-i18next
```

### Optional Peer Dependencies

| Package | Purpose |
| --- | --- |
| `expo-localization` | Auto-detect device locale |
| `react-native-mmkv` | Fastest persistent storage |
| `@react-native-async-storage/async-storage` | Common persistent storage |

If none of the storage packages are installed, translations are cached in-memory only (no persistence across restarts).

## Quick Start

### Recommended: `initBetterI18n`

One-call setup that fetches translations and initializes i18next with all namespaces pre-loaded:

```ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { initBetterI18n } from "@better-i18n/expo";

i18n.use(initReactI18next);

const { core, languages } = await initBetterI18n({
  project: "acme/my-app",
  i18n,
  useDeviceLocale: true, // auto-detect device language
});

// `languages` contains available languages with metadata
// [{ code: "en", name: "English", ... }, { code: "tr", name: "Turkish", ... }]
```

Then use translations in any component:

```tsx
import { useTranslation } from "react-i18next";

function HomeScreen() {
  // Colon-notation (namespace explicit):
  const { t } = useTranslation("common");
  return <Text>{t("welcome")}</Text>;

  // Dot-notation (default namespace):
  // const { t } = useTranslation();
  // return <Text>{t("common.welcome")}</Text>;
}
```

## Translation Patterns

`initBetterI18n` supports both i18next usage styles — choose one and use it consistently:

### Colon-notation — `t('namespace:key')`

```tsx
// Scoped to a namespace via hook argument
const { t } = useTranslation("auth");
t("login")        // ✓
t("auth:login")   // ✓ (namespace explicit)
```

### Dot-notation — `t('section.key')`

```tsx
// Default namespace, dot-separated path
const { t } = useTranslation();
t("auth.login")      // ✓
t("common.welcome")  // ✓
```

Both patterns work simultaneously with no extra configuration — all CDN namespaces are merged into the `"translation"` default namespace in addition to being registered individually.
```

### Alternative: Backend Plugin

For more control, use `BetterI18nBackend` as an i18next backend plugin:

```ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { BetterI18nBackend } from "@better-i18n/expo";

i18n
  .use(BetterI18nBackend)
  .use(initReactI18next)
  .init({
    backend: {
      project: "acme/my-app",
      defaultLocale: "en",
    },
    lng: "en",
    fallbackLng: "en",
    ns: ["common", "auth"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
  });
```

## API

### `initBetterI18n(options)`

One-call setup that fetches translations from CDN and initializes i18next.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `project` | `string` | Required | Project identifier in `org/project` format |
| `i18n` | `i18n` | Required | i18next instance to configure |
| `defaultLocale` | `string` | `"en"` | Fallback locale |
| `storage` | `TranslationStorage` | Auto-detected | Custom storage adapter |
| `staticData` | `Record \| () => Promise` | `undefined` | Bundled translations for offline-first (e.g., first launch in airplane mode) |
| `fetchTimeout` | `number` | `10000` | CDN fetch timeout in ms |
| `retryCount` | `number` | `1` | Retry attempts on CDN failure |
| `useDeviceLocale` | `boolean` | `false` | Auto-detect device locale via `expo-localization` |
| `debug` | `boolean` | `false` | Enable debug logging |
| `i18nextOptions` | `Partial<InitOptions>` | `{}` | Additional i18next init options (SDK always sets `defaultNS` and `fallbackNS` to `"translation"`) |

**Returns** `Promise<BetterI18nResult>`:

| Property | Type | Description |
| --- | --- | --- |
| `core` | `I18nCore` | Core instance for accessing manifest, languages, etc. |
| `languages` | `LanguageOption[]` | Available languages from the CDN manifest |

### `BetterI18nBackend`

i18next backend plugin class. Pass options via `backend` in `i18n.init()`:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `project` | `string` | Required | Project identifier |
| `defaultLocale` | `string` | `"en"` | Fallback locale |
| `cdnBaseUrl` | `string` | `"https://cdn.better-i18n.com"` | Custom CDN URL |
| `cacheExpiration` | `number` | `86400000` (24h) | In-memory cache TTL in ms |
| `storage` | `TranslationStorage` | Auto-detected | Custom storage adapter |
| `staticData` | `Record \| () => Promise` | `undefined` | Bundled translations for offline-first |
| `fetchTimeout` | `number` | `10000` | CDN fetch timeout in ms |
| `retryCount` | `number` | `1` | Retry attempts on CDN failure |
| `debug` | `boolean` | `false` | Enable debug logging |

### `getDeviceLocale(options?)`

Get the device's primary locale using `expo-localization`.

```ts
import { getDeviceLocale } from "@better-i18n/expo";

const locale = getDeviceLocale({ fallback: "en" });
// "tr" on a Turkish device, "en" if detection fails
```

### `getDeviceLocales()`

Get all device locales as language codes.

```ts
import { getDeviceLocales } from "@better-i18n/expo";

const locales = getDeviceLocales();
// ["tr", "en", "de"]
```

### `createMemoryStorage()`

Create an in-memory storage adapter (no persistence). Useful for testing.

```ts
import { createMemoryStorage } from "@better-i18n/expo";

const storage = createMemoryStorage();
```

## Caching Strategy

The SDK uses a **network-first** strategy with automatic fallback:

```
1. Check in-memory cache (TtlCache) → avoids redundant fetches within a session
2. Fetch from CDN (with timeout + retry) → always get fresh translations
3. On CDN failure → try staticData (bundled translations)
4. On staticData miss → fall back to persistent storage (MMKV/AsyncStorage)
5. No cache, no CDN, no static data → throw error
```

### Offline-First with Static Data

For apps that must work on first launch without network (e.g., airplane mode):

```ts
import en from "./locales/en.json"; // { auth: {...}, common: {...} }
import tr from "./locales/tr.json";

const { core, languages } = await initBetterI18n({
  project: "acme/my-app",
  i18n,
  // Pass locale messages directly — same format as CDN response
  staticData: { en, tr },
  // Or lazy-load to keep bundle small:
  // staticData: () => import('./locales/fallback.json'),
  fetchTimeout: 5000, // fail fast on slow networks
  retryCount: 2,      // retry twice before falling back
});
```

### Storage Priority (auto-detected)

1. **User-provided** — Custom `TranslationStorage` adapter
2. **MMKV** — Fastest, sync I/O (`react-native-mmkv`)
3. **AsyncStorage** — Most common (`@react-native-async-storage/async-storage`)
4. **In-Memory** — No persistence, works everywhere

## Language Switching

When using `initBetterI18n`, language switching is handled automatically. New translations are fetched from CDN on demand:

```tsx
import { useTranslation } from "react-i18next";

function LanguagePicker({ languages }) {
  const { i18n } = useTranslation();

  return (
    <FlatList
      data={languages}
      renderItem={({ item }) => (
        <Pressable onPress={() => i18n.changeLanguage(item.code)}>
          <Text>{item.nativeName}</Text>
        </Pressable>
      )}
    />
  );
}
```

## Custom Storage Adapter

Implement the `TranslationStorage` interface to use any key-value store:

```ts
import type { TranslationStorage } from "@better-i18n/expo";

const myStorage: TranslationStorage = {
  getItem: async (key) => { /* ... */ },
  setItem: async (key, value) => { /* ... */ },
  removeItem: async (key) => { /* ... */ },
};

await initBetterI18n({
  project: "acme/my-app",
  i18n,
  storage: myStorage,
});
```

## Part of Better i18n

This package is part of the [Better i18n](https://better-i18n.com) ecosystem:

| Package | Description |
| --- | --- |
| [`@better-i18n/core`](https://www.npmjs.com/package/@better-i18n/core) | Framework-agnostic core (CDN client, caching, locale utilities) |
| [`@better-i18n/use-intl`](https://www.npmjs.com/package/@better-i18n/use-intl) | React/TanStack Start integration via `use-intl` |
| [`@better-i18n/next`](https://www.npmjs.com/package/@better-i18n/next) | Next.js integration via `next-intl` |
| [`@better-i18n/expo`](https://www.npmjs.com/package/@better-i18n/expo) | Expo/React Native integration via `i18next` |
| [`@better-i18n/cli`](https://www.npmjs.com/package/@better-i18n/cli) | CLI for detecting hardcoded strings |
| [`@better-i18n/mcp`](https://www.npmjs.com/package/@better-i18n/mcp) | MCP server for AI-powered translation management |

## Documentation

Full documentation at [docs.better-i18n.com/frameworks/expo](https://docs.better-i18n.com/frameworks/expo)

## License

MIT © [Better i18n](https://better-i18n.com)
