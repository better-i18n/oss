# @better-i18n/core

Framework-agnostic core utilities for fetching translations from Better i18n CDN.

## Features

- **Framework Agnostic** - Works with any JavaScript runtime
- **Edge-Ready** - Optimized for edge environments (Cloudflare, Vercel, etc.)
- **Type-Safe** - Full TypeScript support
- **Cached** - Built-in manifest caching with configurable TTL
- **Offline Fallback** - 3-tier fallback chain: CDN → persistent storage → static data
- **Resilient** - Configurable fetch timeout and retry with exponential backoff

## Installation

```bash
npm install @better-i18n/core
# or
bun add @better-i18n/core
```

## Usage

```typescript
import { createI18nCore } from "@better-i18n/core";

const i18n = createI18nCore({
  project: "your-org/your-project",
  defaultLocale: "en",
});

// Fetch messages for a locale
const messages = await i18n.getMessages("en");

// Get available locales
const locales = await i18n.getLocales();
// ["en", "tr", "de", ...]

// Get language options with metadata (for UI)
const languages = await i18n.getLanguages();
// [{ code: "en", name: "English", nativeName: "English", flagUrl: "..." }, ...]

// Get manifest
const manifest = await i18n.getManifest();
```

## Configuration

```typescript
interface I18nCoreConfig {
  // Required
  project: string;        // "org/project" format
  defaultLocale: string;  // e.g., "en"

  // Optional
  cdnBaseUrl?: string;           // default: "https://cdn.better-i18n.com"
  manifestCacheTtlMs?: number;   // default: 300000 (5 minutes)
  debug?: boolean;               // default: false
  logLevel?: LogLevel;           // default: "warn"
  fetch?: typeof fetch;          // custom fetch function

  // Fallback & Resilience
  storage?: TranslationStorage;  // persistent cache (localStorage, AsyncStorage, etc.)
  staticData?: Record<string, Messages> | (() => Promise<Record<string, Messages>>);
  fetchTimeout?: number;         // default: 10000 (10s) — abort if CDN doesn't respond
  retryCount?: number;           // default: 1 — retry attempts on CDN failure
}
```

## Offline Fallback

When CDN is unavailable, translations are resolved through a 3-tier fallback chain:

```
CDN (primary) → Storage (persistent cache) → Static Data (bundled) → throw
```

### Storage Adapter

Persist translations locally so they survive CDN outages and app restarts:

```typescript
import { createI18nCore, createLocalStorage } from "@better-i18n/core";

const i18n = createI18nCore({
  project: "your-org/your-project",
  defaultLocale: "en",
  storage: createLocalStorage(), // browser localStorage
});
```

Built-in adapters:

| Adapter | Environment | Import |
| --- | --- | --- |
| `createLocalStorage()` | Browser | `@better-i18n/core` |
| `createMemoryStorage()` | Any (non-persistent) | `@better-i18n/core` |
| `createAutoStorage()` | Auto-detect (localStorage or memory) | `@better-i18n/core` |

You can also provide any object implementing `{ get, set, remove? }` for custom stores (e.g., AsyncStorage, MMKV).

### Static Data

Bundle translations as a last-resort fallback:

```typescript
const i18n = createI18nCore({
  project: "your-org/your-project",
  defaultLocale: "en",
  // Static import
  staticData: {
    en: { common: { hello: "Hello" } },
    tr: { common: { hello: "Merhaba" } },
  },
  // Or lazy import (code-split)
  // staticData: () => import('./fallback-translations.json'),
});
```

## Framework Integrations

This package is the foundation for all Better i18n SDKs:

| Package | Framework | Built On |
| --- | --- | --- |
| [`@better-i18n/next`](https://www.npmjs.com/package/@better-i18n/next) | Next.js | `next-intl` |
| [`@better-i18n/use-intl`](https://www.npmjs.com/package/@better-i18n/use-intl) | React, Vite, TanStack Start | `use-intl` |
| [`@better-i18n/expo`](https://www.npmjs.com/package/@better-i18n/expo) | Expo / React Native | `i18next` |

If you're using one of these frameworks, install the framework SDK instead — `@better-i18n/core` is included automatically as a dependency.

## Documentation

Full documentation available at [docs.better-i18n.com/core](https://docs.better-i18n.com/core)

## License

MIT © [Better i18n](https://better-i18n.com)
