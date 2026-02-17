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

### Client-Side (CSR)

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

## TanStack Start Full Example

See our [TanStack Start guide](/docs/react/tanstack-start) for a complete example with:
- Locale middleware
- URL-based locale detection
- SEO-friendly routing
- Hydration without mismatches

## License

MIT
