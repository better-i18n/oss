# Better i18n React SDK - Research & Implementation Plan

> **Status:** Research Complete | **Date:** January 2026

## Executive Summary

Bu doküman, Better i18n'in React ekosistemi (Vite, TanStack Start, CRA, etc.) için SDK desteği sağlaması için yapılan kapsamlı araştırma ve uygulama planını içerir.

**Hedef:** CDN-first yapımızı koruyarak, popüler React i18n kütüphaneleri ile entegre çalışan SDK'lar oluşturmak.

---

## 1. Araştırma Bulguları

### 1.1 React i18n Ekosistemi Analizi

| Kütüphane | Haftalık İndirme | SSR | Bundle Size | Özellikler |
|-----------|-----------------|-----|-------------|------------|
| **react-i18next** | ~4M | ✅ | ~12KB | Backend plugins, namespaces, suspense |
| **react-intl (FormatJS)** | ~1M | ✅ | ~25KB | ICU message format, CLDR |
| **use-intl** | ~100K | ✅ | ~2KB | next-intl API, lightweight |
| **LinguiJS** | ~50K | ✅ | ~5KB | Compile-time, macros |

**Seçim Kriteri:**
- `react-i18next` → En geniş kullanıcı tabanı, mevcut projelere kolay entegrasyon
- `use-intl` → TanStack Start için ideal, next-intl ile aynı API

### 1.2 Mevcut @better-i18n/next Analizi

```
packages/next/src/
├── types.ts      ✅ %100 yeniden kullanılabilir
├── config.ts     ✅ %100 yeniden kullanılabilir
├── manifest.ts   ✅ %100 yeniden kullanılabilir
├── logger.ts     ✅ %100 yeniden kullanılabilir
├── core.ts       ⚠️ %95 (Next.js revalidate header'ları çıkarılmalı)
├── client.ts     ✅ %100 yeniden kullanılabilir (React hook)
├── server.ts     ❌ Next.js specific (next-intl wrapper)
└── middleware.ts ❌ Next.js specific
```

**Anahtar Çıkarım:** Core CDN fetching logic tamamen framework-agnostic!

### 1.3 Framework-Specific Patterns

#### Vite + React (CSR)
```typescript
// Standart pattern: react-i18next + http-backend
import i18n from 'i18next'
import Backend from 'i18next-http-backend'

i18n.use(Backend).init({
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json'
  }
})
```

#### TanStack Start (SSR)
```typescript
// Middleware-based locale detection
const localeTzMiddleware = createMiddleware().server(async ({ next }) => {
  const locale = getCookie('locale') || getRequestHeader('accept-language')
  return next({ context: { locale } })
})

// URL rewriting for locale prefixes
// /es/about → router sees /about
// <Link to="/about"> → renders as /es/about
```

#### i18next Backend Plugin Interface
```typescript
interface BackendModule {
  type: 'backend'
  init(services: Services, options: BackendOptions, i18nextOptions: InitOptions): void
  read(language: string, namespace: string, callback: ReadCallback): void
  // Optional:
  readMulti?(languages: string[], namespaces: string[], callback: ReadCallback): void
  create?(languages: string[], namespace: string, key: string, fallbackValue: string): void
}
```

---

## 2. Proposed Architecture

### 2.1 Package Structure

```
packages/
├── i18n-core/                    # NEW - Framework-agnostic core
│   ├── src/
│   │   ├── types.ts              # Shared types (from @better-i18n/next)
│   │   ├── config.ts             # Config normalization
│   │   ├── cdn.ts                # CDN fetch utilities
│   │   ├── cache.ts              # TTL caching strategies
│   │   ├── manifest.ts           # Manifest parsing
│   │   └── logger.ts             # Logging utility
│   └── package.json
│
├── react/                        # NEW - React-specific utilities
│   ├── src/
│   │   ├── provider.tsx          # BetterI18nProvider context
│   │   ├── hooks.ts              # useMessages, useLocale, useLocales
│   │   ├── language-switcher.tsx # Pre-built component
│   │   └── index.ts
│   └── package.json
│
├── i18next-backend/              # NEW - i18next backend plugin
│   ├── src/
│   │   ├── backend.ts            # BetterI18nBackend class
│   │   ├── types.ts              # BackendOptions interface
│   │   └── index.ts
│   └── package.json
│
├── use-intl/                     # NEW - use-intl adapter
│   ├── src/
│   │   ├── provider.tsx          # IntlProvider wrapper
│   │   ├── hooks.ts              # Enhanced hooks
│   │   └── index.ts
│   └── package.json
│
└── next/                         # EXISTING - Refactor to use i18n-core
    └── src/
        ├── server.ts             # next-intl specific
        ├── middleware.ts         # next-intl specific
        └── index.ts              # Re-exports from i18n-core
```

### 2.2 Dependency Graph

```
                    ┌─────────────────┐
                    │  @better-i18n/  │
                    │    i18n-core    │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ @better-i18n/   │ │ @better-i18n/   │ │ @better-i18n/   │
│     react       │ │ i18next-backend │ │    use-intl     │
└────────┬────────┘ └─────────────────┘ └─────────────────┘
         │                   │                   │
         │                   ▼                   │
         │          ┌─────────────────┐          │
         └─────────►│ @better-i18n/   │◄─────────┘
                    │      next       │
                    └─────────────────┘
```

---

## 3. Package Specifications

### 3.1 @better-i18n/i18n-core

**Purpose:** Framework-agnostic CDN utilities

```typescript
// API Surface
export const createI18nCore = (config: I18nConfig) => ({
  getManifest: () => Promise<ManifestResponse>,
  getMessages: (locale: string) => Promise<Messages>,
  getLocales: () => Promise<string[]>,
  getLanguages: () => Promise<LanguageOption[]>,
  config: NormalizedConfig,
})

// Types
export interface I18nConfig {
  project: string              // "org/project"
  defaultLocale: string        // "en"
  cdnBaseUrl?: string          // default: "https://cdn.better-i18n.com"
  cacheTtlMs?: number          // default: 5 * 60 * 1000
  fetch?: typeof fetch         // custom fetch for testing
  debug?: boolean
}
```

**Dependencies:** None (zero runtime dependencies)

### 3.2 @better-i18n/react

**Purpose:** React hooks and components

```typescript
// Provider
<BetterI18nProvider
  project="org/project"
  defaultLocale="en"
  initialMessages={messages}  // Optional: SSR hydration
>
  <App />
</BetterI18nProvider>

// Hooks
const { messages, locale, setLocale, isLoading } = useI18n()
const { languages, isLoading } = useLanguages()
const t = useTranslation()  // Simple t() function

// Components
<LanguageSwitcher />  // Pre-built dropdown
```

**Dependencies:**
- `@better-i18n/i18n-core`
- `react` (peer)

### 3.3 @better-i18n/i18next-backend

**Purpose:** i18next backend plugin for loading from Better i18n CDN

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import BetterI18nBackend from '@better-i18n/i18next-backend'

i18n
  .use(BetterI18nBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    backend: {
      project: 'your-org/your-project',
      // Optional overrides
      cdnBaseUrl: 'https://cdn.better-i18n.com',
      // Namespace mapping (if using namespaces)
      namespaceMapping: {
        common: 'common',
        errors: 'errors',
      }
    }
  })
```

**Backend Implementation:**
```typescript
class BetterI18nBackend implements BackendModule {
  type = 'backend' as const

  private config: BackendOptions
  private core: ReturnType<typeof createI18nCore>

  init(services: Services, options: BackendOptions) {
    this.config = options
    this.core = createI18nCore({
      project: options.project,
      defaultLocale: options.fallbackLng || 'en',
      cdnBaseUrl: options.cdnBaseUrl,
    })
  }

  async read(language: string, namespace: string, callback: ReadCallback) {
    try {
      const messages = await this.core.getMessages(language)
      // Extract namespace if nested
      const nsMessages = namespace === 'translation'
        ? messages
        : messages[namespace] || {}
      callback(null, nsMessages)
    } catch (error) {
      callback(error as Error, null)
    }
  }
}
```

**Dependencies:**
- `@better-i18n/i18n-core`
- `i18next` (peer)

### 3.4 @better-i18n/use-intl

**Purpose:** use-intl/next-intl compatible adapter for TanStack Start

```typescript
import { BetterIntlProvider, useTranslations } from '@better-i18n/use-intl'

// In your root layout
function App({ locale }: { locale: string }) {
  return (
    <BetterIntlProvider
      project="org/project"
      locale={locale}
    >
      <Router />
    </BetterIntlProvider>
  )
}

// In components - same API as next-intl!
function MyComponent() {
  const t = useTranslations('common')
  return <h1>{t('welcome')}</h1>
}
```

**SSR Support:**
```typescript
// Server-side message fetching
import { getMessages } from '@better-i18n/use-intl/server'

// In TanStack Start loader
export async function loader({ params }) {
  const locale = params.locale || 'en'
  const messages = await getMessages({
    project: 'org/project',
    locale,
  })
  return { locale, messages }
}
```

**Dependencies:**
- `@better-i18n/i18n-core`
- `use-intl` (peer)
- `react` (peer)

---

## 4. Usage Examples

### 4.1 Vite + React + react-i18next (CSR)

```typescript
// src/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import BetterI18nBackend from '@better-i18n/i18next-backend'

i18n
  .use(BetterI18nBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      project: 'acme/dashboard',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n

// src/main.tsx
import './i18n'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'

function App() {
  const { t, i18n } = useTranslation()

  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <button onClick={() => i18n.changeLanguage('tr')}>
        Türkçe
      </button>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Suspense fallback="Loading...">
    <App />
  </Suspense>
)
```

### 4.2 TanStack Start + use-intl (SSR)

```typescript
// app/i18n.config.ts
export const i18nConfig = {
  project: 'acme/marketing',
  defaultLocale: 'en',
  locales: ['en', 'tr', 'de', 'es'],
}

// app/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { BetterIntlProvider } from '@better-i18n/use-intl'

export const Route = createRootRoute({
  component: RootComponent,
  loader: async ({ context }) => {
    const { getMessages } = await import('@better-i18n/use-intl/server')
    const messages = await getMessages({
      project: i18nConfig.project,
      locale: context.locale,
    })
    return { messages }
  },
})

function RootComponent() {
  const { messages } = Route.useLoaderData()
  const { locale } = Route.useRouteContext()

  return (
    <BetterIntlProvider locale={locale} messages={messages}>
      <Outlet />
    </BetterIntlProvider>
  )
}

// app/routes/index.tsx
import { useTranslations } from '@better-i18n/use-intl'

export function HomePage() {
  const t = useTranslations('home')

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.description')}</p>
    </div>
  )
}

// app/middleware.ts (locale detection)
import { createMiddleware } from '@tanstack/react-start'
import { getCookie, getRequestHeader } from '@tanstack/react-start/server'
import { i18nConfig } from './i18n.config'

export const localeMiddleware = createMiddleware().server(async ({ next }) => {
  const cookieLocale = getCookie('locale')
  const headerLocale = getRequestHeader('accept-language')?.split(',')[0]

  let locale = cookieLocale || headerLocale || i18nConfig.defaultLocale

  // Validate locale
  if (!i18nConfig.locales.includes(locale)) {
    locale = i18nConfig.defaultLocale
  }

  return next({ context: { locale } })
})
```

### 4.3 Vanilla React (Simple)

```typescript
// App.tsx
import { BetterI18nProvider, useI18n, useTranslation } from '@better-i18n/react'

function App() {
  return (
    <BetterI18nProvider
      project="acme/landing"
      defaultLocale="en"
    >
      <HomePage />
    </BetterI18nProvider>
  )
}

function HomePage() {
  const { locale, setLocale, languages } = useI18n()
  const t = useTranslation()

  return (
    <div>
      <h1>{t('welcome')}</h1>

      <select value={locale} onChange={(e) => setLocale(e.target.value)}>
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  )
}
```

---

## 5. Implementation Phases

### Phase 1: Core Extraction (1-2 days)
- [ ] Create `@better-i18n/i18n-core` package
- [ ] Extract shared code from `@better-i18n/next`
- [ ] Remove Next.js specific headers (revalidate)
- [ ] Add comprehensive tests
- [ ] Refactor `@better-i18n/next` to use core

### Phase 2: i18next Backend (2-3 days)
- [ ] Create `@better-i18n/i18next-backend` package
- [ ] Implement `BackendModule` interface
- [ ] Add namespace support
- [ ] Add TypeScript types
- [ ] Test with Vite + react-i18next
- [ ] Write documentation

### Phase 3: React Package (2-3 days)
- [ ] Create `@better-i18n/react` package
- [ ] Implement `BetterI18nProvider`
- [ ] Create hooks: `useI18n`, `useTranslation`, `useLanguages`
- [ ] Add `LanguageSwitcher` component
- [ ] Test with Vite
- [ ] Write documentation

### Phase 4: use-intl Adapter (2-3 days)
- [ ] Create `@better-i18n/use-intl` package
- [ ] Implement provider wrapper
- [ ] Add server-side utilities
- [ ] Test with TanStack Start
- [ ] Write documentation

### Phase 5: Documentation (2-3 days)
- [ ] Create `apps/docs/content/react/` section
- [ ] Write Vite + react-i18next guide
- [ ] Write TanStack Start guide
- [ ] Add migration guide from other i18n solutions
- [ ] Create example repositories

---

## 6. Technical Decisions

### 6.1 Why Multiple Packages?

| Approach | Pros | Cons |
|----------|------|------|
| **Single package** | Simple, one install | Large bundle, unused deps |
| **Multiple packages** ✅ | Tree-shaking, minimal deps | More packages to maintain |

**Decision:** Multiple packages for optimal bundle size and clear separation of concerns.

### 6.2 Why i18next Backend vs. Custom Solution?

| Approach | Pros | Cons |
|----------|------|------|
| **Custom hooks only** | Full control | Users must learn new API |
| **i18next backend** ✅ | Existing ecosystem, plugins | Dependency on i18next |

**Decision:** Provide i18next backend for widest adoption, plus standalone hooks for simple cases.

### 6.3 Namespace Strategy

Better i18n uses flat translations by default. For namespace support:

```json
// CDN response: /org/project/en/translations.json
{
  "common.welcome": "Welcome",
  "common.goodbye": "Goodbye",
  "errors.notFound": "Not found"
}

// Transformed for i18next namespaces:
// namespace: "common" → { "welcome": "Welcome", "goodbye": "Goodbye" }
// namespace: "errors" → { "notFound": "Not found" }
```

**Implementation:** Backend plugin will parse dot-notation keys into namespaces.

---

## 7. Open Questions

1. **Namespace delimiter:** Should we use `.` or `:` for namespace separation?
   - i18next default is `:` (e.g., `common:welcome`)
   - Our current format uses `.` (e.g., `common.welcome`)
   - **Recommendation:** Support both, configurable

2. **Plural/ICU support:** Should we handle ICU message format?
   - i18next has built-in plural support
   - **Recommendation:** Pass through to i18next, document ICU support

3. **Offline support:** Should we add localStorage caching?
   - **Recommendation:** Phase 2 feature, use service worker pattern

4. **Type generation:** Should we generate TypeScript types from translations?
   - **Recommendation:** Future CLI feature, out of scope for initial release

---

## 8. Success Metrics

- [ ] i18next backend works with standard Vite + react-i18next setup
- [ ] TanStack Start SSR works without hydration errors
- [ ] Bundle size < 5KB for core package
- [ ] Zero runtime dependencies for core
- [ ] 100% TypeScript coverage
- [ ] Documentation for top 3 use cases

---

## 9. Resources

### Official Documentation
- [i18next Plugins](https://www.i18next.com/misc/creating-own-plugins)
- [react-i18next](https://react.i18next.com/)
- [TanStack Start](https://tanstack.com/start/latest)

### Community Examples
- [TanStack Start i18n Guide](https://nikuscs.com/blog/13-tanstackstart-i18n/)
- [Intlayer TanStack Integration](https://intlayer.org/doc/environment/tanstack-start)
- [Paraglide + TanStack](https://eugeneistrach.com/blog/paraglide-tanstack-start/)

### Similar Implementations
- [i18next-http-backend](https://github.com/i18next/i18next-http-backend)
- [next-intl](https://next-intl-docs.vercel.app/)
- [use-intl](https://www.npmjs.com/package/use-intl)
