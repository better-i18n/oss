# @better-i18n/use-intl

Better i18n integration for [use-intl](https://github.com/amannn/next-intl/tree/main/packages/use-intl) - perfect for React, TanStack Start, and any JavaScript framework.

## Features

- 🚀 **CDN-powered** - Fetch translations from Better i18n CDN
- ⚡ **SSR Ready** - Full server-side rendering support for TanStack Start
- 🔄 **Dynamic Loading** - Load messages on-demand per locale
- 🎯 **Type Safe** - Full TypeScript support
- 🪶 **Lightweight** - Built on use-intl (~2KB)

## Installation

```bash
npm install @better-i18n/use-intl use-intl
# or
bun add @better-i18n/use-intl use-intl
```

## Quick Start

### Vite App (Recommended — Zero Config)

Pair with [`@better-i18n/vite`](https://www.npmjs.com/package/@better-i18n/vite) for the best experience — zero FOUC, automatic locale detection, no props needed:

```bash
npm install @better-i18n/vite @better-i18n/use-intl use-intl
```

```ts
// vite.config.ts
import { betterI18n } from "@better-i18n/vite";

export default defineConfig({
  plugins: [
    betterI18n({ project: "acme/dashboard", localeCookie: "locale" }),
    react(),
  ],
});
```

```tsx
// App.tsx — no project/locale/messages props needed
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

The Vite plugin injects project, locale, messages, languages, and cookie config into the HTML — the provider reads it all automatically.

### Client-Side (Manual Config)

Without the Vite plugin, pass `project` and `locale` as props:

```tsx
import { BetterI18nProvider, useTranslations } from '@better-i18n/use-intl'

function App() {
  return (
    <BetterI18nProvider
      project="your-org/your-project"
      locale="en"
    >
      <HomePage />
    </BetterI18nProvider>
  )
}

function HomePage() {
  const t = useTranslations('home')
  return <h1>{t('title')}</h1>
}
```

### Server-Side (TanStack Start)

```tsx
// routes/__root.tsx
import { createRootRoute } from '@tanstack/react-router'
import { BetterI18nProvider } from '@better-i18n/use-intl'
import { getMessages } from '@better-i18n/use-intl/server'

export const Route = createRootRoute({
  loader: async ({ context }) => {
    const messages = await getMessages({
      project: 'your-org/your-project',
      locale: context.locale,
    })
    return { messages }
  },
  component: RootComponent,
})

function RootComponent() {
  const { messages } = Route.useLoaderData()
  const { locale } = Route.useRouteContext()

  return (
    <BetterI18nProvider
      project="your-org/your-project"
      locale={locale}
      messages={messages}
    >
      <Outlet />
    </BetterI18nProvider>
  )
}
```

## API Reference

### Components

#### `<BetterI18nProvider>`

Main provider that combines Better i18n CDN with use-intl.

```tsx
<BetterI18nProvider
  project="org/project"    // Required: Better i18n project
  locale="en"              // Required: Current locale
  messages={messages}      // Optional: Pre-loaded messages (SSR)
  timeZone="Europe/Berlin" // Optional: Timezone for formatting
  now={new Date()}         // Optional: Current time (SSR)
  onLocaleChange={(l) => {}} // Optional: Locale change callback
  // Fallback & Resilience
  storage={storageAdapter}   // Optional: Persistent cache (localStorage, etc.)
  staticData={bundledData}   // Optional: Bundled translations as last-resort
  fetchTimeout={10000}       // Optional: CDN timeout in ms (default: 10s)
  retryCount={1}             // Optional: CDN retry attempts (default: 1)
>
  {children}
</BetterI18nProvider>
```

See [`@better-i18n/core`](https://www.npmjs.com/package/@better-i18n/core) for storage adapters and fallback chain details.

### Hooks

#### `useTranslations(namespace?)`

Access translations (re-exported from use-intl).

```tsx
const t = useTranslations('common')
t('greeting', { name: 'World' }) // "Hello, World!"
```

#### `useLocale()`

Get and set the current locale.

```tsx
const { locale, setLocale, isLoading } = useLocale()
```

#### `useLanguages()`

Get available languages with metadata.

```tsx
const { languages, isLoading } = useLanguages()
// [{ code: 'en', name: 'English', nativeName: 'English', flagUrl: '...' }]
```

#### `useBetterI18n()`

Access the full Better i18n context.

```tsx
const { locale, setLocale, languages, isLoadingMessages, project } = useBetterI18n()
```

#### `useFormatter()`

Format dates, numbers, and lists (re-exported from use-intl).

```tsx
const format = useFormatter()
format.dateTime(new Date(), { dateStyle: 'full' })
format.number(1000, { style: 'currency', currency: 'USD' })
```

### Server Utilities

Import from `@better-i18n/use-intl/server`:

#### `getMessages(config)`

Fetch messages for SSR.

```ts
const messages = await getMessages({
  project: 'org/project',
  locale: 'en',
})
```

#### `getLocales(config)`

Get available locale codes.

```ts
const locales = await getLocales({ project: 'org/project' })
// ['en', 'tr', 'de']
```

#### `getLanguages(config)`

Get languages with metadata.

```ts
const languages = await getLanguages({ project: 'org/project' })
```

#### `createServerTranslator(config)`

Create translator for non-React contexts (metadata, emails).

```ts
const t = createServerTranslator({ locale: 'en', messages })
const title = t('page.title')
```

## Language Switcher Example

```tsx
import { useLocale, useLanguages } from '@better-i18n/use-intl'

function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  const { languages, isLoading } = useLanguages()

  if (isLoading) return <span>Loading...</span>

  return (
    <select value={locale} onChange={(e) => setLocale(e.target.value)}>
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.nativeName}
        </option>
      ))}
    </select>
  )
}
```

## Router Integration

### TanStack Router

Detected automatically. `useLocaleRouter()` uses TanStack Router's `router.navigate()` for SPA navigation — no extra setup needed.

See our [TanStack Start guide](https://docs.better-i18n.com/frameworks/tanstack-start) for a complete example with locale middleware, URL-based locale detection, SEO-friendly routing, and hydration without mismatches.

### React Router (`react-router-dom`)

The provider's built-in URL update uses `history.replaceState`, which doesn't notify React Router. Add a `LocaleSync` component to bridge locale state with the router:

```tsx
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { BetterI18nProvider, useLocale } from "@better-i18n/use-intl";

// Syncs locale state → URL using react-router-dom's navigate
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

export default function App() {
  return (
    <BrowserRouter>
      <BetterI18nProvider>
        <LocaleSync />
        <Routes>
          <Route path="/:locale" element={<HomePage />} />
        </Routes>
      </BetterI18nProvider>
    </BrowserRouter>
  );
}
```

### No Router (Plain SPA)

Works out of the box. On locale switch, the provider calls `history.replaceState` to update the URL prefix automatically.

## Locale Prefix Strategy

Control how locale codes appear in URLs via the `localePrefix` prop:

```tsx
<BetterI18nProvider localePrefix="always">
```

| Strategy | Default Locale | Other Locales | Best For |
|----------|---------------|---------------|----------|
| `"as-needed"` (default) | `/about` (no prefix) | `/tr/about` | SEO — default locale has clean URLs |
| `"always"` | `/en/about` | `/tr/about` | Apps with `/:locale` route pattern |

**`"as-needed"`** — Default locale has no URL prefix. Non-default locales get a prefix. Best for SEO because your primary language has clean URLs.

**`"always"`** — Every locale gets a prefix, including the default. Use this when your router has a `/:locale` parameter in every route (e.g., TanStack Router's `$locale/` layout routes or React Router's `/:locale/*` pattern).

## Components

### `<LocaleDropdown />`

Pre-built, styled locale switcher with flags, keyboard navigation, and dark mode support.

```tsx
import { LocaleDropdown } from "@better-i18n/use-intl";

// Zero config — styled mode
<LocaleDropdown />

// Unstyled mode for full custom styling via data attributes
<LocaleDropdown variant="unstyled" className="my-dropdown" />

// Custom placement
<LocaleDropdown placement="top" />
```

Customizable via CSS custom properties:

| Property | Controls |
|----------|----------|
| `--better-locale-text` | Text color |
| `--better-locale-menu-bg` | Menu background |
| `--better-locale-border` | Border color |
| `--better-locale-hover-bg` | Hover state |
| `--better-locale-trigger-bg` | Trigger background |
| `--better-locale-accent` | Checkmark/accent color |

## Documentation

Full documentation at [docs.better-i18n.com/frameworks/vite](https://docs.better-i18n.com/frameworks/vite)

## License

MIT
