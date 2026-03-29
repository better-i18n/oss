---
title: CDN — Delivery, Caching, and Architecture
---

# CDN

Better i18n's CDN delivers translations globally via Cloudflare's edge network. No GitHub required — upload a JSON file and you're live.

**Base URL:** `https://cdn.better-i18n.com`

---

## URL structure

```
manifest:      https://cdn.better-i18n.com/{org}/{project}/manifest.json
translations:  https://cdn.better-i18n.com/{org}/{project}/{locale}/translations.json
```

Examples:
```
https://cdn.better-i18n.com/acme/dashboard/manifest.json
https://cdn.better-i18n.com/acme/dashboard/tr/translations.json
https://cdn.better-i18n.com/acme/dashboard/pt-br/translations.json
```

**Important:** Locale codes are **lowercase BCP 47**. `"pt-BR"` → `"pt-br"`. Always call `normalizeLocale()` before constructing paths.

---

## Manifest structure

```json
{
  "version": "1.0",
  "project": "acme/dashboard",
  "languages": [
    { "code": "en", "label": "English", "active": true },
    { "code": "tr", "label": "Türkçe", "active": true },
    { "code": "de", "label": "Deutsch", "active": false }
  ],
  "files": [
    { "locale": "en", "url": "/acme/dashboard/en/translations.json", "updatedAt": "..." },
    { "locale": "tr", "url": "/acme/dashboard/tr/translations.json", "updatedAt": "..." }
  ]
}
```

Only `active: true` languages are served on CDN. `active: false` languages are in draft state.

---

## Translation file structure

```json
// https://cdn.better-i18n.com/acme/dashboard/tr/translations.json
{
  "auth": {
    "login": "Giriş Yap",
    "logout": "Çıkış Yap",
    "password": { "placeholder": "Şifrenizi girin" }
  },
  "common": {
    "save": "Kaydet",
    "cancel": "İptal"
  },
  "translations": {
    "title": "Kontrol Paneli"
  }
}
```

- Top-level keys are **namespaces**.
- The `"default"` namespace is stored and served as `"translations"` in the JSON.
- For flat-key projects (no namespaces), all keys are under `"translations"`.

---

## Cache architecture (4 layers)

```
Request
   ↓
1. CF Cache API (L1)    — 60s translations, 300s manifest
   ↓ miss
2. R2 Bucket (L2)       — source of truth, written by sync-worker on publish
   ↓ miss
3. Stale Cache (L3)     — previous R2 content served if R2 unavailable
   ↓ miss
4. Empty JSON           — {} or { fallback: true }, always HTTP 200
```

**The CDN never returns 5xx.** It always returns HTTP 200. Check for `{ fallback: true }` in the JSON body to detect cache misses, not HTTP status.

---

## Publish → purge flow

```
User approves translations
      ↓
API queues PUBLISH_BATCH job
      ↓
sync-worker:
  1. Generate JSON files from approved translations
  2. Upload to R2 (L2, source of truth)
  3. Fire CDN purge request (CDN_PURGE_SECRET)
      ↓
CF Cache API purged for affected locales
      ↓
Next request fetches fresh data from R2 → stored in CF Cache (L1)
```

Purge is non-critical: even without purge, all clients get fresh translations within 60 seconds due to `max-age: 60` on translation files.

---

## SDK fetch behavior

The Core SDK uses `Cache-Control: no-store` when running inside a Cloudflare Worker (to bypass CF's subrequest cache). This does **not** affect:
- Browser caching
- Next.js ISR (uses its own cache layer)
- Expo AsyncStorage / MMKV caching

---

## CDN-first workflow (no GitHub)

```
1. Prepare translation JSON files locally
2. Upload via dashboard → Project → CDN Upload
   (or use CLI: better-i18n sync --push)
3. CDN serves translations immediately after publish
4. SDK fetches from CDN at runtime
```

JSON file formats accepted on upload: flat JSON, nested JSON. See <file-formats.md>.

---

## Cache invalidation (SDK)

```typescript
import { clearManifestCache, clearMessagesCache } from "@better-i18n/core";

// After publishing new translations:
clearMessagesCache("tr");        // clear one locale
clearMessagesCache();            // clear all locales
clearManifestCache();            // clear manifest
```

This clears the in-memory `TtlCache`. Persistent storage (localStorage / AsyncStorage) expires on its own TTL.

---

## CDN fallback configuration

When a locale is not available, the SDK falls back through:

1. **Requested locale** (e.g., `tr`)
2. **CDN fallback locale** (if configured in project settings)
3. **Default locale** (e.g., `en`)
4. **staticData** (bundled translations)
5. **Empty object** (no throw)

Configure fallback locale in: Project → Settings → CDN Fallback.

---

## Locale code mismatch — region variants

The manifest lists exact locale codes. If your app requests `"en-US"` but the manifest only has `"en"`, the CDN fetch goes to `/acme/dashboard/en-us/translations.json` — a path that doesn't exist — and returns `{ fallback: true }`.

**Always match locale codes exactly to what's in the manifest:**

```typescript
// manifest.languages: [{ code: "en" }, { code: "pt-br" }, { code: "tr" }]

// WRONG — en-US not in manifest
i18n.getMessages("en-US");

// CORRECT — normalize to match manifest
import { normalizeLocale } from "@better-i18n/core";
const locale = normalizeLocale(userLocale);     // "en-US" → "en-us"
// Then use the manifest to find the closest match if exact match isn't found:
const manifest = await i18n.getManifest();
const available = manifest.languages.map(l => l.code);  // ["en", "pt-br", "tr"]
const resolved = available.find(c => c === locale) ??
                 available.find(c => c.startsWith(locale.split("-")[0])) ??
                 "en";  // default
```

---

## Debugging `{ fallback: true }` — silent empty strings

The CDN always returns HTTP 200. When translations are unavailable (project not published yet, wrong locale code, R2 unavailable), the response body is:

```json
{ "fallback": true }
```

The SDK treats this as an empty message set — **no keys resolve**, components render empty strings. This is the most common "everything works but strings are blank" scenario.

**Diagnosis checklist:**

```typescript
// 1. Check CDN response directly
const res = await fetch("https://cdn.better-i18n.com/acme/dashboard/tr/translations.json");
const body = await res.json();

if (body.fallback === true) {
  // Not published yet, wrong locale code, or R2 unavailable
}

// 2. Check locale code normalization
import { normalizeLocale } from "@better-i18n/core";
normalizeLocale("pt-BR"); // → "pt-br"
// CDN path must use lowercase: /acme/dashboard/pt-br/translations.json

// 3. Check manifest — is the language active?
const manifest = await fetch("https://cdn.better-i18n.com/acme/dashboard/manifest.json").then(r => r.json());
manifest.languages.find(l => l.code === "tr")?.active;  // must be true
```

**Common causes:**

| Symptom | Cause | Fix |
|---|---|---|
| `{ fallback: true }` for all locales | Project never published | Click Publish in dashboard |
| `{ fallback: true }` for one locale | Locale inactive (`active: false`) | Activate language in Project → Languages |
| `{ fallback: true }` for one locale | Wrong locale code case (`pt-BR` vs `pt-br`) | Use `normalizeLocale()` |
| Keys exist in dashboard, not on CDN | Translations in `draft` state, not `approved` | Approve translations, then publish |
| Some keys missing, others present | Namespace path wrong | Check `"default"` → stored as `"translations"` in CDN JSON |

**`{ fallback: true }` propagation through the SDK fallback chain:**

```
CDN returns { fallback: true }
       ↓
SDK treats response as {} (empty messages)
       ↓
Falls through to persistent storage (if configured)
       ↓
Falls through to staticData (if configured)
       ↓
Returns {} — no error thrown, components render empty strings
```

If you have `staticData` configured, `{ fallback: true }` from CDN will silently fall back to your bundled data — which may be outdated but is better than empty strings.

---

## ISR + CDN cache compounding (Next.js)

Next.js ISR and the CDN have independent cache TTLs. After publishing:

```
Publish triggers CDN purge
       ↓
CDN fresh within 60s (max-age=60)
       ↓
Next.js ISR still serving cached page (messagesRevalidate: 60)
       ↓
Max total stale: CDN (60s) + ISR (60s) = up to 120s
```

For on-demand revalidation after publish (webhook-based):

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const { secret } = await request.json();
  if (secret !== process.env.REVALIDATE_SECRET) return new Response("Unauthorized", { status: 401 });

  revalidatePath("/", "layout");  // revalidate all pages
  return Response.json({ revalidated: true });
}
```

Configure the webhook in Project → Settings → Webhooks → `translation.published` → your `/api/revalidate` endpoint.

---

## Self-hosted CDN

If you're deploying on your own infrastructure, override the CDN base URL:

```typescript
createI18nCore({
  project: "acme/dashboard",
  defaultLocale: "en",
  cdnBaseUrl: "https://i18n.your-domain.com",  // must serve same URL pattern
});
```
