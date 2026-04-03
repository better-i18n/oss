---
title: React / Core / Server SDKs
---

> **Core docs:** https://docs.better-i18n.com/core.mdx · [API Reference](https://docs.better-i18n.com/core/api-reference.mdx) · [Locale Utilities](https://docs.better-i18n.com/core/locale-utilities.mdx)
> **use-intl (TanStack Start):** https://docs.better-i18n.com/frameworks/tanstack-start.mdx · [SSR](https://docs.better-i18n.com/frameworks/tanstack-start/ssr.mdx) · [Routing](https://docs.better-i18n.com/frameworks/tanstack-start/routing.mdx)
> **Vite / React:** https://docs.better-i18n.com/frameworks/vite.mdx · **Hono:** https://docs.better-i18n.com/frameworks/server-sdk/hono.mdx · **Remix:** https://docs.better-i18n.com/frameworks/remix.mdx

# React, Core, and Server SDKs

## @better-i18n/core — Headless foundation

All framework adapters wrap this. Use directly for custom integrations.

```bash
npm install @better-i18n/core
```

### Factory (module-level singleton)

```typescript
import { createI18nCore, createAutoStorage, normalizeLocale } from "@better-i18n/core";

export const i18n = createI18nCore({
  project: "acme/dashboard",          // "org/project" — required
  defaultLocale: "en",                // required
  cdnBaseUrl: "https://cdn.better-i18n.com",  // default, override only for self-hosted
  manifestCacheTtlMs: 60_000,         // 60s — how often manifest is refreshed
  fetchTimeout: 10_000,               // 10s per CDN request
  retryCount: 1,
  storage: createAutoStorage(),       // picks localStorage / AsyncStorage / memory
  debug: false,
});
```

### Instance methods

```typescript
const messages = await i18n.getMessages("tr");     // fetch translations for a locale
const manifest = await i18n.getManifest();          // fetch available locales + CDN paths
const locales  = await i18n.getLocales();           // string[] of available locale codes
const langs    = await i18n.getLanguages();         // LanguageOption[] with label, flag, code
```

### 5-layer fallback chain (in order)

1. **TtlCache** — module-level in-memory cache (60s TTL, shared across requests in CF Workers)
2. **CDN fetch** — `https://cdn.better-i18n.com/{org}/{project}/{locale}/translations.json`
3. **Persistent storage** — localStorage / AsyncStorage / MMKV
4. **staticData** — bundled fallback translations (optional, for offline / build-time)
5. **Empty object** — never throws, always returns something

### Cookie utilities

```typescript
import { getPersistedLocale } from "@better-i18n/core";

// Read persisted locale in non-React contexts (auth clients, analytics, fetch wrappers)
const locale = getPersistedLocale("preferred-locale"); // → "tr" | null
```

> **Full locale persistence + auth integration guide:** <references/locale-persistence.md>

### Locale utilities

```typescript
import {
  normalizeLocale,        // "pt-BR" → "pt-br" (CDN convention)
  getLocaleFromPath,      // "/tr/about" → "tr"
  hasLocalePrefix,        // "/tr/about" → true
  removeLocalePrefix,     // "/tr/about" → "/about"
  addLocalePrefix,        // ("/about", "tr") → "/tr/about"
  replaceLocaleInPath,    // ("/en/about", "tr") → "/tr/about"
  getFlagEmoji,           // "tr" → "🇹🇷"
  getLanguageLabel,       // "tr" → "Türkçe"
  getCountryCodeFromLocale, // "pt-br" → "BR"
} from "@better-i18n/core";
```

### Storage adapters

```typescript
import {
  createAutoStorage,   // recommended — picks best available
  createLocalStorage,  // browser localStorage only
  createMemoryStorage, // in-memory only (SSR, tests)
} from "@better-i18n/core";
```

### CDN → SDK fallback chain (connected)

The CDN has a 4-layer infrastructure chain, and the SDK has a 5-layer fetch chain. They connect at layer 2:

```
CDN infrastructure (server-side):        SDK fetch chain (client/server-side):
─────────────────────────────────        ─────────────────────────────────────
1. CF Cache (60s TTL)                    1. TtlCache (in-memory, 60s)
2. R2 Bucket (source of truth)     →     2. CDN fetch ─────────────────────→ CDN response
3. Stale Cache (resilience)              3. Persistent storage (localStorage/MMKV)
4. {} or { fallback: true }             4. staticData (bundled JSON)
                                         5. {} (no throw)
```

When CDN returns `{ fallback: true }` (layer 4 of CDN), the SDK treats it as `{}` and falls through to layers 3-5. **This means `staticData` is the last defense against blank UI.**

If CDN is unreachable AND storage is empty AND no `staticData` is configured → all `t()` calls return `""`.

### `staticData` shape requirement

`staticData` must match **exactly** the structure the CDN returns — top-level keys are namespaces:

```typescript
// CDN returns:
// { "auth": { "login": "Sign in" }, "translations": { "title": "Dashboard" } }

// staticData must mirror this structure exactly:
import { createI18nCore } from "@better-i18n/core";

export const i18n = createI18nCore({
  project: "acme/dashboard",
  defaultLocale: "en",
  staticData: {
    en: {
      auth: { login: "Sign in" },
      translations: { title: "Dashboard" },  // "default" namespace → "translations" in CDN
    },
    tr: {
      auth: { login: "Giriş Yap" },
      translations: { title: "Kontrol Paneli" },
    },
  },
});
```

**Common mistake:** Using flat keys (`{ "auth.login": "Sign in" }`) in `staticData` when CDN uses nested structure. Keys won't match and translations stay empty even with staticData configured.

### Static data (offline / build-time fallback)

```typescript
import en from "./locales/en.json";
import tr from "./locales/tr.json";

export const i18n = createI18nCore({
  project: "acme/dashboard",
  defaultLocale: "en",
  staticData: { en, tr },   // used when CDN unavailable
});
```

---

## @better-i18n/use-intl — React + use-intl adapter

```bash
npm install @better-i18n/use-intl use-intl
```

### Provider setup

```typescript
// app/providers.tsx
import { BetterI18nProvider } from "@better-i18n/use-intl";

export function Providers({
  locale,
  messages,         // pass from SSR loader to skip client CDN fetch
  children,
}: {
  locale: string;
  messages?: Record<string, unknown>;
  children: React.ReactNode;
}) {
  return (
    <BetterI18nProvider
      project="acme/dashboard"
      locale={locale}
      messages={messages}       // optional: pre-loaded on server
      persistLocale             // writes locale to cookie for persistence
    >
      {children}
    </BetterI18nProvider>
  );
}
```

### TanStack Router — SSR loader pattern

```typescript
// routes/__root.tsx
import { createI18nCore } from "@better-i18n/core";

const i18n = createI18nCore({ project: "acme/dashboard", defaultLocale: "en" });

export const Route = createRootRouteWithContext()({
  beforeLoad: async ({ context }) => {
    const locale = detectLocale(context.request);   // your locale detection
    const messages = await i18n.getMessages(locale);
    return { locale, messages };
  },
});

// In layout component:
function RootLayout() {
  const { locale, messages } = Route.useRouteContext();
  return (
    <Providers locale={locale} messages={messages}>
      <Outlet />
    </Providers>
  );
}
```

### Usage

```typescript
import { useTranslations } from "@better-i18n/use-intl";

function Button() {
  const t = useTranslations("common");
  return <button>{t("save")}</button>;
}
```

### TtlCache in CF Workers — cross-request contamination

TtlCache is a **module-level global** shared across all requests in a CF Worker. This is intentional (avoids refetching on every request), but has a side effect:

```
Request A (user locale: tr) → populates TtlCache["acme/dashboard|tr"]
Request B (user locale: de) → TtlCache miss → fetches de → correct
```

This is safe. **However**, if you create a new `createI18nCore()` instance inside a request handler (not at module scope), each request gets a separate TtlCache with no sharing:

```typescript
// WRONG — new TtlCache per request, no caching benefit
app.get("/", (c) => {
  const i18n = createI18nCore({ project: "acme/dashboard", defaultLocale: "en" }); // ← inside handler
  const messages = await i18n.getMessages(locale);
});

// CORRECT — singleton, TtlCache shared
const i18n = createI18nCore({ project: "acme/dashboard", defaultLocale: "en" });
app.get("/", (c) => {
  const messages = await i18n.getMessages(locale);
});
```

### `createAutoStorage()` on SSR environments

`createAutoStorage()` detects the environment and picks the best storage:
- **Browser**: `localStorage`
- **React Native**: `AsyncStorage` (if available)
- **CF Worker / Node.js**: in-memory only (no persistent storage)

On SSR, `createAutoStorage()` is safe to call — it silently falls back to memory. No `localStorage is not defined` errors. However, persistent caching across SSR requests does not occur (each Worker instance has its own memory).

For Next.js App Router with ISR, the ISR cache itself acts as the persistent layer — `storage` configuration is typically not needed.

---

## @better-i18n/server — Hono / Node.js

```bash
npm install @better-i18n/server
```

```typescript
// i18n.ts — singleton at module scope
import { createServerI18n } from "@better-i18n/server";

export const i18n = createServerI18n({
  project: "acme/api",
  defaultLocale: "en",
});
```

```typescript
// app.ts — Hono
import { Hono } from "hono";
import { betterI18n } from "@better-i18n/server";
import { i18n } from "./i18n";

const app = new Hono();
app.use("*", betterI18n(i18n));   // injects c.get("locale") and c.get("t")

app.get("/hello", (c) => {
  const t = c.get("t");
  return c.json({ message: t("greeting") });
});
```

### Better Auth integration

```typescript
import { createBetterAuthProvider } from "@better-i18n/server/providers/better-auth";

export const auth = betterAuth({
  plugins: [
    createBetterAuthProvider(i18n, {
      localeCookie: "preferred-locale",  // reads locale from request cookie
    }),
  ],
});
```

> **Full guide with client + server setup:** <references/locale-persistence.md>

---

## @better-i18n/remix — Remix / Hydrogen

```bash
npm install @better-i18n/remix
```

```typescript
// i18n.ts — singleton
import { createRemixI18n } from "@better-i18n/remix";

export const i18n = createRemixI18n({
  project: "acme/store",
  defaultLocale: "en",
  locales: ["en", "tr", "de"],
  supportedLocales: ["en", "tr", "de"],
});
```

```typescript
// root.tsx loader
import { i18n } from "~/i18n";

export async function loader({ request }: LoaderArgs) {
  const locale = await i18n.getLocale(request);
  const messages = await i18n.getMessages(locale);
  return json({ locale, messages });
}
```

---

## Vite + standalone React (no SSR)

> **Docs:** https://docs.better-i18n.com/frameworks/vite.mdx · [React Router](https://docs.better-i18n.com/frameworks/vite/react-router.mdx) · [TypeScript](https://docs.better-i18n.com/frameworks/vite/typescript.mdx)

```bash
npm install @better-i18n/use-intl use-intl
```

Client-side only — locale stored in URL path (`/tr/...`) or `localStorage`.

```typescript
// src/i18n.ts — singleton
import { createI18nCore } from "@better-i18n/core";

export const i18n = createI18nCore({
  project: "acme/app",
  defaultLocale: "en",
});
```

```typescript
// src/App.tsx — detect locale from URL, load messages, render provider
import { BetterI18nProvider } from "@better-i18n/use-intl";
import { getLocaleFromPath, normalizeLocale } from "@better-i18n/core";
import { useEffect, useState } from "react";
import { i18n } from "./i18n";

export default function App() {
  const locale = normalizeLocale(getLocaleFromPath(window.location.pathname) ?? "en");
  const [messages, setMessages] = useState<Record<string, unknown> | undefined>();

  useEffect(() => {
    i18n.getMessages(locale).then(setMessages);
  }, [locale]);

  return (
    <BetterI18nProvider project="acme/app" locale={locale} messages={messages}>
      <Router />
    </BetterI18nProvider>
  );
}
```

**Dynamic languages from manifest** — instead of hard-coding `supportedLocales`, fetch the manifest once and derive the list:

```typescript
// src/i18n.ts
import { createI18nCore } from "@better-i18n/core";

export const i18n = createI18nCore({
  project: "acme/app",
  defaultLocale: "en",
});

// Returns only active languages (active: true in manifest)
export async function getSupportedLocales(): Promise<string[]> {
  const manifest = await i18n.getManifest();
  return manifest.languages
    .filter((l) => l.active)
    .map((l) => l.code);      // already lowercase BCP 47
}

// Usage: locale switcher, route validation, <html lang> attribute
const locales = await getSupportedLocales();
// → ["en", "tr", "de"]  — updates automatically when you add languages in dashboard
```
```

### React Router v6 — locale-prefixed routes

```typescript
// src/router.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { removeLocalePrefix } from "@better-i18n/core";

const router = createBrowserRouter([
  {
    path: "/:locale?",
    element: <LocaleLayout />,     // loads messages for :locale
    children: [
      { path: "", element: <Home /> },
      { path: "about", element: <About /> },
    ],
  },
]);
```

> **Full React Router guide:** https://docs.better-i18n.com/frameworks/vite/react-router.mdx

---

## Formatting — dates, numbers, relative time

Available through `useFormatter` from `@better-i18n/use-intl` (wraps `use-intl` formatters):

> **Docs:** https://docs.better-i18n.com/frameworks/formatting.mdx

```typescript
import { useFormatter } from "@better-i18n/use-intl";

function Dashboard() {
  const format = useFormatter();

  // Date formatting
  format.dateTime(new Date("2025-03-01"), { dateStyle: "long" });
  // → "March 1, 2025" (en) or "1 Mart 2025" (tr)

  // Number / currency
  format.number(1234.56, { style: "currency", currency: "USD" });
  // → "$1,234.56" (en) or "1.234,56 $" (tr)

  // Relative time
  format.relativeTime(-3, "days");
  // → "3 days ago" (en) or "3 gün önce" (tr)

  // List
  format.list(["apples", "oranges", "bananas"], { type: "conjunction" });
  // → "apples, oranges, and bananas"
}
```

---

## TypeScript — type-safe translation keys

> **Docs:** https://docs.better-i18n.com/frameworks/tanstack-start/typescript.mdx · [Next.js](https://docs.better-i18n.com/frameworks/nextjs/api-reference.mdx) · [Vite](https://docs.better-i18n.com/frameworks/vite/typescript.mdx)

Enable autocomplete and compile-time checking for `t("key.path")`:

```typescript
// src/types/i18n.d.ts
import en from "./locales/en.json";

declare module "use-intl" {
  interface IntlMessages extends typeof en {}
  interface AppConfig {
    Messages: typeof en;
  }
}
```

With this in place:
- `t("auth.login")` → autocompletes
- `t("auth.typo")` → TypeScript error
- Works in Next.js (`next-intl`), `use-intl`, and TanStack Start

For namespaced usage in Next.js:
```typescript
const t = useTranslations("auth");
t("login");     // ✓ — autocompletes within "auth" namespace
t("unknown");   // ✗ — TypeScript error
```

---

## Server utilities — pre-load on server

> **Docs:** https://docs.better-i18n.com/frameworks/server.mdx

For SSR frameworks, pre-load messages on the server to avoid client-side loading flash:

```typescript
import { getServerTranslations, getServerLocale } from "@better-i18n/use-intl/server";

// Node.js / Edge function
export async function getServerSideProps({ req }) {
  const locale = getServerLocale(req.headers["accept-language"], {
    supportedLocales: ["en", "tr", "de"],
    defaultLocale: "en",
  });

  const messages = await getServerTranslations({
    project: "acme/dashboard",
    locale,
  });

  return { props: { locale, messages } };
}
```

Pass `messages` to `BetterI18nProvider` to skip the client-side CDN fetch entirely.
