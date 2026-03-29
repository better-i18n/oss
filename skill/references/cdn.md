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

## Self-hosted CDN

If you're deploying on your own infrastructure, override the CDN base URL:

```typescript
createI18nCore({
  project: "acme/dashboard",
  defaultLocale: "en",
  cdnBaseUrl: "https://i18n.your-domain.com",  // must serve same URL pattern
});
```
