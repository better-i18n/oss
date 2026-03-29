---
title: React / Core / Server SDKs
---

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
