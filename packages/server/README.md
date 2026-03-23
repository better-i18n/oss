# @better-i18n/server

Framework-agnostic server-side i18n for [Better i18n](https://better-i18n.com). Built-in support for Hono, Express, Fastify, and any Node.js HTTP server.

[![npm](https://img.shields.io/npm/v/@better-i18n/server)](https://www.npmjs.com/package/@better-i18n/server)

## Features

- **Framework Agnostic** — Core API uses Web Standards `Headers`, works everywhere
- **Hono Middleware** — First-class middleware with typed context variables
- **Express/Fastify Middleware** — Node.js adapter with `req.locale` and `req.t`
- **Accept-Language Detection** — RFC 5646 compliant locale matching
- **CDN-Cached** — Singleton pattern with shared TtlCache across all requests
- **Type-Safe Translations** — Built on `use-intl/core` for consistent formatting

## Installation

```bash
npm install @better-i18n/server
# or
bun add @better-i18n/server
```

## Quick Start

### 1. Create a singleton instance

```ts
// i18n.ts (module scope — shared across all requests)
import { createServerI18n } from "@better-i18n/server";

export const i18n = createServerI18n({
  project: "acme/api",
  defaultLocale: "en",
});
```

### 2. Use with your framework

#### Hono

```ts
import { Hono } from "hono";
import { betterI18n } from "@better-i18n/server/hono";
import type { Translator } from "@better-i18n/server";
import { i18n } from "./i18n";

const app = new Hono<{
  Variables: {
    locale: string;
    t: Translator;
  };
}>();

app.use("*", betterI18n(i18n));

app.get("/users/:id", (c) => {
  const t = c.get("t");
  const locale = c.get("locale");
  return c.json({ message: t("users.welcome"), locale });
});
```

#### Express

```ts
import express from "express";
import { betterI18nMiddleware } from "@better-i18n/server/node";
import { i18n } from "./i18n";

const app = express();
app.use(betterI18nMiddleware(i18n));

app.get("/users/:id", (req, res) => {
  res.json({ message: req.t("users.welcome"), locale: req.locale });
});
```

TypeScript augmentation (add to a `.d.ts` file):

```ts
import type { Translator } from "@better-i18n/server";

declare global {
  namespace Express {
    interface Request {
      locale: string;
      t: Translator;
    }
  }
}
```

#### Fastify / Koa / Custom

Use `fromNodeHeaders` to convert Node.js headers to Web Standards `Headers`:

```ts
import { fromNodeHeaders } from "@better-i18n/server/node";
import { i18n } from "./i18n";

// In any request handler
const headers = fromNodeHeaders(req.headers);
const locale = await i18n.detectLocaleFromHeaders(headers);
const t = await i18n.getTranslator(locale);

t("errors.notFound"); // → "Bulunamadı"
```

#### Direct API (no middleware)

```ts
import { i18n } from "./i18n";

// Translate with any locale
const t = await i18n.getTranslator("tr");
t("errors.notFound"); // → "Bulunamadı"

// With namespace
const tAuth = await i18n.getTranslator("tr", "auth");
tAuth("loginRequired"); // → "Giriş yapmanız gerekiyor"

// Get available locales
const locales = await i18n.getLocales();
// ["en", "tr", "de"]
```

## API

### `createServerI18n(config)`

Creates a singleton i18n instance. Call once at module scope.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `project` | `string` | — | Project identifier (`"org/project"`) |
| `defaultLocale` | `string` | — | Fallback locale |
| `cdnBaseUrl` | `string` | CDN default | CDN base URL override |
| `debug` | `boolean` | `false` | Enable debug logging |

### Instance Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getTranslator(locale, namespace?)` | `Promise<Translator>` | Get a translator function for a locale |
| `detectLocaleFromHeaders(headers)` | `Promise<string>` | Detect locale from Web Standards `Headers` |
| `getLocales()` | `Promise<string[]>` | Get available locale codes |
| `getLanguages()` | `Promise<LanguageOption[]>` | Get languages with metadata |

### Entry Points

| Import | Use Case |
|--------|----------|
| `@better-i18n/server` | Core `createServerI18n`, types |
| `@better-i18n/server/hono` | `betterI18n()` Hono middleware |
| `@better-i18n/server/node` | `betterI18nMiddleware()` for Express, `fromNodeHeaders()` for Fastify/Koa |

## How It Works

1. **Singleton pattern** — `createServerI18n` creates one `@better-i18n/core` instance with shared TtlCache
2. **Locale detection** — `detectLocaleFromHeaders` parses Accept-Language, matches against CDN manifest locales
3. **Translation** — `getTranslator` fetches messages from CDN (cached), creates a `use-intl/core` translator
4. **Match strategy** — Exact match (`tr-TR`) → base language (`tr`) → region expansion (`tr` → `tr-TR`)

## Peer Dependencies

| Package | Required | Version |
|---------|----------|---------|
| `hono` | Optional | `>=4.0.0` |

## Documentation

Full documentation at [docs.better-i18n.com/frameworks/server-sdk](https://docs.better-i18n.com/frameworks/server-sdk)

## License

MIT © [Better i18n](https://better-i18n.com)
