---
title: Next.js SDK — @better-i18n/next
---

# Next.js SDK

Package: `@better-i18n/next` · Wraps **next-intl** and adds a CDN-backed translation layer with ISR support.

## Installation

```bash
npm install @better-i18n/next next-intl
```

## Setup — three files

### 1. `i18n.ts` (module-level singleton)

```typescript
import { createI18n } from "@better-i18n/next";

export const { i18n, routing } = createI18n({
  project: "acme/dashboard",       // "org/project" — find in dashboard
  locales: ["en", "tr", "de"],
  defaultLocale: "en",
  localePrefix: "always",           // "always" | "as-needed" | "never"
});
```

**`localePrefix` modes:**
- `"always"` — `/en/about`, `/tr/about` (recommended for SEO)
- `"as-needed"` — `/about` (default locale), `/tr/about`
- `"never"` — `/about` for all locales (use `Accept-Language` header)

### 2. `i18n/request.ts` (per-request config)

```typescript
import { getRequestConfig } from "next-intl/server";
import { i18n } from "@/i18n";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  return await i18n.requestConfig(locale);
});
```

### 3. `middleware.ts`

```typescript
import { i18n } from "@/i18n";

export default i18n.betterMiddleware();

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

## Usage in App Router

```typescript
// app/[locale]/page.tsx
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("home");
  return <h1>{t("title")}</h1>;
}
```

```typescript
// Server Component (async)
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("home");
  return <h1>{t("title")}</h1>;
}
```

## ISR configuration

```typescript
export const { i18n, routing } = createI18n({
  project: "acme/dashboard",
  locales: ["en", "tr"],
  defaultLocale: "en",
  manifestRevalidate: 300,    // manifest cache: 5 min (default)
  messagesRevalidate: 60,     // translations cache: 1 min (default)
});
```

- Manifest revalidate controls how often available locales are refreshed.
- Messages revalidate controls how often translation content is refreshed.
- Both trigger Next.js ISR — no manual cache invalidation needed.

## Static params for SSG

```typescript
// app/[locale]/layout.tsx
import { routing } from "@/i18n";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
```

## Metadata localization

```typescript
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "metadata" });
  return { title: t("title"), description: t("description") };
}
```

## Locale switcher pattern

```typescript
import { useRouter, usePathname } from "next-intl/client";
import { routing } from "@/i18n";

function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <select onChange={(e) => router.replace(pathname, { locale: e.target.value })}>
      {routing.locales.map((locale) => (
        <option key={locale} value={locale}>{locale.toUpperCase()}</option>
      ))}
    </select>
  );
}
```

## Traps to avoid

- **Never instantiate `createI18n` inside a component or route handler** — it creates a new TtlCache instance on every call, breaking memory caching.
- **Don't use `next-intl`'s `getMessages()` directly** — it bypasses the CDN layer. Always use `i18n.requestConfig(locale)`.
- **Don't add locales to `next.config.ts` i18n block** — let `betterMiddleware()` handle routing.
