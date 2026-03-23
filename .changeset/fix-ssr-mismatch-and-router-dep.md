---
"@better-i18n/use-intl": minor
"@better-i18n/vite": patch
---

### @better-i18n/use-intl

**Breaking:** `useLocaleRouter` is no longer exported from the main entry point. Import it from the new `/router` sub-path:

```ts
// Before
import { useLocaleRouter } from "@better-i18n/use-intl";

// After
import { useLocaleRouter } from "@better-i18n/use-intl/router";
```

**New:** `useLocalePath` — a router-agnostic hook for locale path building and navigation. Works with React Router, TanStack Router, or plain Vite apps without any router dependency.

```ts
import { useLocalePath } from "@better-i18n/use-intl";

const { localePath, navigate, locale, isReady } = useLocalePath();
```

**Fixed:**
- **SSR locale mismatch (critical):** When using `@better-i18n/vite` plugin with URL-based locale routing (e.g., `/:locale/*`), non-default locale URLs (like `/tr`) would display the default locale's messages instead of fetching the correct translations from CDN. The provider now correctly tracks the SSR data's locale separately from the prop locale.
- **`setLocale()` dual-write:** When `onLocaleChange` is provided, the provider no longer calls `window.history.replaceState` internally — the consumer's router handles URL updates exclusively, preventing race conditions.
- **`replaceState` locale detection:** The fallback URL updater now validates path segments against `supportedLocales` from SSR data, preventing false positives on 2-letter path segments like `/us/profile`.

### @better-i18n/vite

- Inject `supportedLocales` and `localeCookie` into SSR data payload
- Validate detected locale against CDN manifest before injecting — falls back to default locale if unsupported
