# @better-i18n/next

Next.js integration for [Better i18n](https://better-i18n.com). Provides seamless `next-intl` integration with CDN-powered translation fetching.

## Features

- **Zero-Config Sync** - Connects to your project via `i18n.config.ts`
- **Edge-Ready Caching** - Built-in ISR support for manifest and messages
- **Type-Safe** - Full TypeScript support
- **next-intl First** - Designed as a message provider for `next-intl`

## Installation

```bash
npm install @better-i18n/next next-intl
# or
bun add @better-i18n/next next-intl
```

## Quick Start

### 1. Create i18n config

```ts
// i18n.config.ts
import { createI18n } from "@better-i18n/next";

export const i18n = createI18n({
  project: "your-org/your-project", // Format: "org-slug/project-slug"
  defaultLocale: "en",
});
```

### 2. Setup request config

```ts
// src/i18n/request.ts
import { i18n } from "../i18n.config";

export default i18n.requestConfig;
```

### 3. Add middleware

```ts
// middleware.ts
import { i18n } from "./i18n.config";

export default i18n.middleware;

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
```

### 4. Use translations

```tsx
// app/page.tsx
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("common");
  return <h1>{t("welcome")}</h1>;
}
```

## Advanced Middleware

For more control, use `createBetterI18nMiddleware`:

```ts
import { createBetterI18nMiddleware, composeMiddleware } from "@better-i18n/next/middleware";

const i18nMiddleware = createBetterI18nMiddleware({
  project: "org/project",
  defaultLocale: "en",
  detection: {
    cookie: true,
    browserLanguage: true,
    cookieName: "locale",
    cookieMaxAge: 31536000, // 1 year
  },
});

// Compose with other middleware
export default composeMiddleware(i18nMiddleware, authMiddleware);
```

## Client Hook

```tsx
"use client";

import { useManifestLanguages } from "@better-i18n/next/client";

export function LanguageSwitcher() {
  const { languages, isLoading, error } = useManifestLanguages({
    project: "your-org/your-project",
    defaultLocale: "en",
  });

  if (isLoading) return <span>Loading...</span>;
  if (error) return <span>Error: {error.message}</span>;

  return (
    <select>
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.nativeName || lang.name || lang.code}
        </option>
      ))}
    </select>
  );
}
```

## Server Utilities

```ts
import {
  getMessages,
  getLocales,
  getManifestLanguages,
} from "@better-i18n/next/server";

const config = { project: "org/project", defaultLocale: "en" };

const locales = await getLocales(config);
const messages = await getMessages(config, "tr");
const languages = await getManifestLanguages(config);
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `project` | `string` | required | Project identifier (`org/project` format) |
| `defaultLocale` | `string` | required | Default/fallback locale code |
| `cdnBaseUrl` | `string` | auto | CDN base URL (auto-detected) |
| `localePrefix` | `"as-needed"` \| `"always"` \| `"never"` | `"as-needed"` | URL locale prefix behavior |
| `manifestRevalidateSeconds` | `number` | `3600` | Next.js ISR revalidation for manifest |
| `messagesRevalidateSeconds` | `number` | `30` | Next.js ISR revalidation for messages |
| `debug` | `boolean` | `false` | Enable debug logging |
| `logLevel` | `LogLevel` | `"warn"` | Logging verbosity |

## Debug Logging

Enable with environment variables:

- `BETTER_I18N_DEBUG=1`
- `BETTER_I18N_LOG_LEVEL=debug|info|warn|error|silent`

## Documentation

Full documentation available at [docs.better-i18n.com/next](https://docs.better-i18n.com/docs/next)

## License

MIT © [Better i18n](https://better-i18n.com)
