# @better-i18n/remix

CDN-powered i18n for [Remix](https://remix.run) and [Shopify Hydrogen](https://hydrogen.shopify.dev).

[![npm](https://img.shields.io/npm/v/@better-i18n/remix)](https://www.npmjs.com/package/@better-i18n/remix)

## Features

- **CDN-First** — Translations fetched from Better i18n CDN with in-memory TTL caching
- **Locale Detection** — Parses Accept-Language header, matches against available locales
- **Singleton Pattern** — Create once at module scope, reuse across all requests
- **Framework-Agnostic Messages** — Returns raw JSON, compatible with i18next, react-intl, or custom solutions
- **Offline Fallback** — Supports `storage` and `staticData` for resilience (via `@better-i18n/core`)

## Installation

```bash
npm install @better-i18n/remix
# or
bun add @better-i18n/remix
```

## Quick Start

### 1. Create i18n instance (singleton)

```ts
// app/i18n.server.ts
import { createRemixI18n } from "@better-i18n/remix";

export const i18n = createRemixI18n({
  project: "acme/hydrogen-store",
  defaultLocale: "en",
});
```

### 2. Use in loaders

```ts
// app/root.tsx
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { i18n } from "./i18n.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await i18n.detectLocale(request);
  const locales = await i18n.getLocales();
  const messages = await i18n.getMessages(locale);

  return json({ locale, locales, messages });
}
```

### 3. With remix-i18next (recommended)

```ts
// app/i18next.server.ts
import { RemixI18Next } from "remix-i18next/server";
import { i18n } from "./i18n.server";

export const remixI18next = new RemixI18Next({
  detection: {
    supportedLanguages: await i18n.getLocales(),
    fallbackLanguage: "en",
  },
  i18next: {
    resources: {}, // loaded dynamically via Better i18n CDN
  },
});
```

### 4. Standalone (without i18next)

```ts
// Any loader
import { i18n } from "./i18n.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await i18n.detectLocale(request);
  const messages = await i18n.getMessages(locale);
  // messages = { "common": { "hello": "Hello" }, "account": { ... } }

  return json({ locale, messages });
}
```

## API

### `createRemixI18n(config)`

Creates a singleton i18n instance with CDN-backed caching.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `project` | `string` | — | Project identifier (`"org/project"`) |
| `defaultLocale` | `string` | — | Fallback locale |
| `cdnBaseUrl` | `string` | `"https://cdn.better-i18n.com"` | CDN base URL |
| `debug` | `boolean` | `false` | Enable debug logging |
| `storage` | `TranslationStorage` | — | Persistent cache for offline support |
| `staticData` | `Record<string, Messages>` | — | Bundled translations as last-resort fallback |

### Instance Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `detectLocale(request)` | `Promise<string>` | Detect locale from Accept-Language header |
| `getMessages(locale)` | `Promise<Messages>` | Get all namespaced messages for a locale |
| `getLocales()` | `Promise<string[]>` | Get available locale codes |
| `getLanguages()` | `Promise<LanguageOption[]>` | Get languages with metadata |

## Offline Fallback

For resilience in environments with unreliable network, provide `storage` and/or `staticData`:

```ts
export const i18n = createRemixI18n({
  project: "acme/store",
  defaultLocale: "en",
  // Persist translations to survive CDN outages
  storage: {
    get: (key) => cache.get(key),
    set: (key, value) => cache.set(key, value),
  },
  // Bundled translations as absolute last resort
  staticData: {
    en: { common: { hello: "Hello" } },
    tr: { common: { hello: "Merhaba" } },
  },
});
```

See [`@better-i18n/core`](https://www.npmjs.com/package/@better-i18n/core) for the full 5-layer fallback chain.

## How It Works

1. **CDN-first** — Translations are fetched from Better i18n CDN with in-memory TTL caching
2. **Locale detection** — Parses `Accept-Language` header, matches against available locales
3. **Singleton pattern** — Create once at module scope, reuse across all requests
4. **Framework-agnostic messages** — Returns raw JSON messages — compatible with i18next, react-intl, or custom solutions

## Documentation

Full documentation at [docs.better-i18n.com/frameworks/remix](https://docs.better-i18n.com/frameworks/remix)

## License

MIT © [Better i18n](https://better-i18n.com)
