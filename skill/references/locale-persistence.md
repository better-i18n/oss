---
title: Locale Persistence & Auth Integration
---

> **Docs:** [Provider](https://docs.better-i18n.com/frameworks/provider.mdx) · [Better Auth](https://docs.better-i18n.com/frameworks/server-sdk/better-auth.mdx) · [Vite Plugin](https://docs.better-i18n.com/frameworks/vite/setup.mdx)

# Locale Persistence & Auth Integration

## The problem

When a user picks Turkish in the app, the locale should persist across:
- Page refreshes (SPA/static builds have no server middleware)
- Auth requests (Better Auth uses `Accept-Language` by default — browser's OS language, not the app's)
- Third-party SDK calls (analytics, support chat, etc.)

Without explicit persistence, locale resets to `"en"` on every page load.

## Three-layer solution

```
┌─ CLIENT ──────────────────────────────────────────┐
│                                                    │
│  1. BetterI18nProvider                             │
│     localeCookie="preferred-locale"               │
│     → Writes cookie on every locale change         │
│     → Reads cookie on mount (fallback for SPA)     │
│                                                    │
│  2. Non-React contexts (auth client, analytics)    │
│     getLocaleCookie("preferred-locale")          │
│     → Reads cookie in module-level code            │
│                                                    │
│  Browser sends cookie automatically with requests  │
└────────────────────────┬──────────────────────────┘
                         │ HTTP Request
                         │ Cookie: preferred-locale=tr
                         ▼
┌─ SERVER ──────────────────────────────────────────┐
│                                                    │
│  3. createBetterAuthProvider(i18n, {               │
│       localeCookie: "preferred-locale"             │
│     })                                             │
│     → Reads cookie from request                    │
│     → Falls back to Accept-Language if no cookie   │
│                                                    │
│  Detection: getLocale > cookie > Accept-Language   │
│             > defaultLocale                        │
└────────────────────────────────────────────────────┘
```

**Key insight:** The cookie name must match across all three layers.

---

## Layer 1: Provider — write & read the cookie

```tsx
import { BetterI18nProvider } from "@better-i18n/use-intl";

<BetterI18nProvider
  project="acme/dashboard"
  localeCookie="preferred-locale"  // ← cookie name
>
  <App />
</BetterI18nProvider>
```

**What `localeCookie` does:**
- `true` → uses default cookie name `"locale"`
- `string` → custom cookie name (e.g., `"ct-locale"`, `"app-lang"`)
- On every locale change (including mount): writes `document.cookie`
- On initialization (SPA/static): reads cookie as fallback before `"en"`

**Locale resolution chain:**
```
propLocale → ssrData → cookie (localeCookie prop or Vite plugin) → "en"
```

---

## Layer 2: Non-React contexts — read the cookie

For module-level code where React hooks aren't available:

```typescript
import { getLocaleCookie } from "@better-i18n/core";
// Also available: import { getLocaleCookie } from "@better-i18n/use-intl";

// Auth client
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "/api/auth",
  fetchOptions: {
    headers: {
      // Getter — reads fresh cookie value on every request
      get "Accept-Language"() {
        return getLocaleCookie("preferred-locale") ?? "en";
      },
    },
  },
});
```

```typescript
// Analytics
analytics.identify({
  locale: getLocaleCookie("preferred-locale"),
});
```

```typescript
// Any fetch wrapper
function apiFetch(url: string, init?: RequestInit) {
  return fetch(url, {
    ...init,
    headers: {
      "Accept-Language": getLocaleCookie("preferred-locale") ?? "en",
      ...init?.headers,
    },
  });
}
```

**Why a getter?** Auth clients are module-level singletons. A static value would freeze the locale at import time. The getter reads the cookie fresh on every request.

---

## Layer 3: Server — read the cookie from request

### Better Auth plugin

```typescript
import { createServerI18n } from "@better-i18n/server";
import { createBetterAuthProvider } from "@better-i18n/server/providers/better-auth";

const i18n = createServerI18n({
  project: "acme/dashboard",
  defaultLocale: "en",
});

export const auth = betterAuth({
  plugins: [
    createBetterAuthProvider(i18n, {
      localeCookie: "preferred-locale",  // ← same cookie name as client
    }),
  ],
});
```

**Detection priority:** `getLocale` callback > `localeCookie` > `Accept-Language` > `defaultLocale`

### Vite plugin (SSR)

```typescript
// vite.config.ts
import betterI18n from "@better-i18n/vite";

export default defineConfig({
  plugins: [
    betterI18n({
      project: "acme/dashboard",
      defaultLocale: "en",
      localeCookie: "preferred-locale",  // ← same cookie name
    }),
  ],
});
```

---

## Common mistakes

### 1. Cookie name mismatch (silent bug)

```typescript
// ❌ Different cookie names — server never reads client's cookie
<BetterI18nProvider localeCookie="app-locale" />
createBetterAuthProvider(i18n, { localeCookie: "preferred-locale" })

// ✅ Same cookie name everywhere
<BetterI18nProvider localeCookie="preferred-locale" />
createBetterAuthProvider(i18n, { localeCookie: "preferred-locale" })
```

### 2. Cross-origin auth (cookie won't be sent)

If auth API is on a different domain, the browser won't send the cookie. Use explicit headers:

```typescript
export const authClient = createAuthClient({
  baseURL: "https://auth.example.com",  // different domain
  fetchOptions: {
    headers: {
      get "Accept-Language"() {
        return getLocaleCookie("preferred-locale") ?? "en";
      },
    },
  },
});
```

### 3. Missing `localeCookie` on provider

Without `localeCookie`, the locale resets to `"en"` on every page refresh in SPA/static builds. SSR apps with middleware don't need this — the middleware detects locale from the URL or cookie on every request.

**When you need `localeCookie`:**
- Vite SPA (no SSR middleware)
- Static builds
- `localePrefix: "never"` (no locale in URL)

**When you don't need it:**
- TanStack Start with SSR middleware (middleware handles cookies)
- Next.js with middleware (middleware handles cookies)

### 4. Using `Accept-Language` from browser instead of app locale

```typescript
// ❌ Browser sends OS language, not app language
// No fetchOptions → Accept-Language: en-US (user's OS is English)
export const authClient = createAuthClient({ baseURL: "/api/auth" });

// ✅ Send app's chosen locale
export const authClient = createAuthClient({
  baseURL: "/api/auth",
  fetchOptions: {
    headers: {
      get "Accept-Language"() {
        return getLocaleCookie("preferred-locale") ?? "en";
      },
    },
  },
});
```

---

## API Reference

### `localeCookie` (BetterI18nProvider prop)

| Value | Behavior |
|---|---|
| `false` (default) | No persistence |
| `true` | Cookie name: `"locale"` |
| `string` | Custom cookie name |

Cookie format: `{name}={locale}; path=/; max-age=31536000; SameSite=Lax`

### `getLocaleCookie(cookieName)` (from `@better-i18n/core`)

| Parameter | Type | Description |
|---|---|---|
| `cookieName` | `string` | Cookie name to read |
| **Returns** | `string \| null` | Locale value or `null` |

Returns `null` when: server-side (no `document`), cookie missing, value fails BCP 47 validation.

### `localeCookie` (createBetterAuthProvider option)

| Option | Type | Default | Description |
|---|---|---|---|
| `localeCookie` | `string` | `undefined` | Cookie name to read from request |

When set, reads the named cookie from the `Cookie` header before falling back to `Accept-Language`.
