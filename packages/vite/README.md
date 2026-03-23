# @better-i18n/vite

Vite plugin for [Better i18n](https://better-i18n.com) — server-side translation injection with zero FOUC.

[![npm](https://img.shields.io/npm/v/@better-i18n/vite)](https://www.npmjs.com/package/@better-i18n/vite)

## Features

- **Zero FOUC** — Translations are injected server-side into `<script>` tags, read synchronously before first paint
- **Automatic Locale Detection** — URL path → cookie → Accept-Language → default (priority order)
- **Zero Config Provider** — `<BetterI18nProvider>` reads project, locale, messages, and languages from the injected data — no props needed
- **Cookie Persistence** — Locale preference is persisted in a configurable cookie
- **CDN-Cached** — Singleton `@better-i18n/core` instance with shared TtlCache across requests

## Installation

```bash
npm install @better-i18n/vite @better-i18n/use-intl use-intl
# or
bun add @better-i18n/vite @better-i18n/use-intl use-intl
```

## Quick Start

### 1. Add the plugin to `vite.config.ts`

```ts
import { betterI18n } from "@better-i18n/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    betterI18n({
      project: "acme/dashboard",
      localeCookie: "locale",
    }),
    react(),
  ],
});
```

### 2. Wrap your app with the provider — no props needed

```tsx
import { BetterI18nProvider, useTranslations, LocaleDropdown } from "@better-i18n/use-intl";

function App() {
  return (
    <BetterI18nProvider>
      <LocaleDropdown />
      <HomePage />
    </BetterI18nProvider>
  );
}

function HomePage() {
  const t = useTranslations("home");
  return <h1>{t("title")}</h1>;
}
```

That's it. The plugin injects everything the provider needs — project, locale, messages, languages, and cookie config — so you don't pass any props.

## How It Works

1. **Dev server middleware** detects the locale from each incoming request
2. **`transformIndexHtml`** fetches translations from CDN and injects them as `<script id="__better_i18n__" type="application/json">`
3. **`BetterI18nProvider`** reads this data synchronously on mount (via `useState` lazy initializer) — before first paint, zero FOUC
4. On locale switch, the provider persists the cookie and updates the URL prefix automatically

### Injected Payload

The plugin injects the following data into the HTML head:

```json
{
  "project": "acme/dashboard",
  "locale": "tr",
  "messages": { "home": { "title": "Ana Sayfa" } },
  "languages": [{ "code": "en", "name": "English", "isDefault": true }, { "code": "tr", "name": "Turkish" }],
  "localeCookie": "locale",
  "supportedLocales": ["en", "tr"]
}
```

## Locale Detection Priority

The plugin detects locale server-side in this order:

| Priority | Source | Example |
|----------|--------|---------|
| 1 | URL path segment | `/tr/about` → `tr` |
| 2 | Cookie | `locale=tr` |
| 3 | Accept-Language header | `tr-TR,tr;q=0.9` → `tr` |
| 4 | `defaultLocale` option | `"en"` |

If the detected locale is not in the project's supported locales (from CDN manifest), it falls back to `defaultLocale`.

## Configuration

```ts
betterI18n({
  // Required
  project: "acme/dashboard",     // "org/project" format

  // Optional
  defaultLocale: "en",           // Default: "en"
  localeCookie: "locale",        // Default: "locale" — cookie name for persistence
  cdnBaseUrl: "https://...",     // Default: "https://cdn.better-i18n.com"
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `project` | `string` | — | Project identifier in `"org/project"` format |
| `defaultLocale` | `string` | `"en"` | Fallback locale when none detected |
| `localeCookie` | `string` | `"locale"` | Cookie name for persisting locale preference |
| `cdnBaseUrl` | `string` | `"https://cdn.better-i18n.com"` | CDN base URL override |

## Using with Routers

### No Router (Plain Vite SPA)

Works out of the box. On locale switch, the provider calls `history.replaceState` to update the URL prefix (e.g., `/about` → `/tr/about`).

### React Router (`react-router-dom`)

The provider's `history.replaceState` doesn't notify React Router. Add a `LocaleSync` component to bridge locale state with the router:

```tsx
import { useEffect } from "react";
import { BrowserRouter, useNavigate, useLocation } from "react-router-dom";
import { BetterI18nProvider, useLocale } from "@better-i18n/use-intl";

function LocaleSync() {
  const { locale } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    const first = segments[0];
    if (first && /^[a-z]{2}$/i.test(first) && first !== locale) {
      segments[0] = locale;
      navigate("/" + segments.join("/"), { replace: true });
    }
  }, [locale, location.pathname, navigate]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <BetterI18nProvider>
        <LocaleSync />
        {/* your routes */}
      </BetterI18nProvider>
    </BrowserRouter>
  );
}
```

### TanStack Router

Detected automatically. `useLocaleRouter()` uses TanStack Router's `router.navigate()` for SPA navigation — no extra setup needed.

## Peer Dependencies

| Package | Version |
|---------|---------|
| `vite` | `>=5.0.0` |

## Documentation

Full documentation at [docs.better-i18n.com/frameworks/vite](https://docs.better-i18n.com/frameworks/vite)

## License

MIT © [Better i18n](https://better-i18n.com)
