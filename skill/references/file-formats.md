---
title: File Formats — JSON Flat, Nested, and Namespaced
---

# File Formats

Better i18n supports three JSON translation file formats. Choose based on your existing project structure or start fresh with the recommended format.

---

## JSON_FLAT — flat keys, single file per locale

All keys at root level, dot notation for logical grouping. All translations in one file per locale.

```json
// locales/en.json
{
  "auth.login": "Sign in",
  "auth.logout": "Sign out",
  "home.title": "Dashboard",
  "home.subtitle": "Welcome back",
  "common.save": "Save",
  "common.cancel": "Cancel"
}
```

**CDN URL:** `https://cdn.better-i18n.com/{org}/{project}/{locale}/translations.json`

**When to use:**
- Simple projects with a flat key structure
- Projects migrating from `i18n-js`, `react-i18next` flat mode
- When you want a single file per locale

**File pattern:** `locales/{{lang}}.json`

---

## JSON_NESTED — nested objects, namespaces as top-level keys

Nested JSON where the first level of keys becomes **namespaces**. A single file per locale.

```json
// messages/en.json
{
  "auth": {
    "login": "Sign in",
    "logout": "Sign out",
    "form": {
      "email": "Email address",
      "password": "Password"
    }
  },
  "home": {
    "title": "Dashboard",
    "subtitle": "Welcome back"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

**CDN URL:** `https://cdn.better-i18n.com/{org}/{project}/{locale}/translations.json`

**Namespace rule:** Only the **first level** becomes the namespace. `auth.form.email` → namespace `auth`, key `form.email`.

**When to use:**
- Projects using next-intl, react-intl, or similar namespace-aware libraries
- When you want logical grouping visible in the file structure
- **Recommended for new projects**

**File pattern:** `messages/{{lang}}.json` or `locales/{{lang}}.json`

---

## JSON_NAMESPACED — separate files per namespace and locale

Each namespace is a separate JSON file. Files are organized in locale directories.

```
locales/
  en/
    common.json
    auth.json
    home.json
  tr/
    common.json
    auth.json
    home.json
```

```json
// locales/en/auth.json
{
  "login": "Sign in",
  "logout": "Sign out"
}
```

**CDN URL:**
```
https://cdn.better-i18n.com/{org}/{project}/{locale}/{namespace}.json
```

**When to use:**
- Large projects where a single file would be too big
- i18next with namespace loading (`ns: ['common', 'auth']`)
- Projects that lazy-load namespaces on demand

**File pattern:** `locales/{{lang}}/{{ns}}.json` or `public/locales/{{lang}}/{{ns}}.json`

---

## Default namespace

In all formats, the `"default"` namespace is stored internally as `"translations"`.

| Namespace in dashboard | File name (NAMESPACED) | Key in CDN JSON (FLAT/NESTED) |
|---|---|---|
| `auth` | `auth.json` | top-level `"auth"` key |
| `common` | `common.json` | top-level `"common"` key |
| `default` | `translations.json` | top-level `"translations"` key |

---

## Format comparison

| | JSON_FLAT | JSON_NESTED | JSON_NAMESPACED |
|---|---|---|---|
| Files per locale | 1 | 1 | N (one per namespace) |
| Namespace support | Implicit (dot prefix) | First-level keys | Separate files |
| Lazy loading | No | No | Yes |
| next-intl compatible | Partial | Yes | Yes |
| i18next compatible | Yes | Partial | Yes |
| Recommended | ✓ Simple projects | ✓ New projects | ✓ Large projects |

---

## CDN-first upload formats

When uploading via CDN Upload (no GitHub), accepted formats:

- **Flat JSON** — `{ "key": "value", "nested.key": "value" }`
- **Nested JSON** — `{ "section": { "key": "value" } }`

The dashboard detects the format automatically based on the structure.

---

## ICU message format support

All formats support ICU message syntax in values:

```json
{
  "greeting": "Hello, {name}!",
  "itemCount": "{count, plural, =0 {No items} one {# item} other {# items}}",
  "lastSeen": "{when, selectordinal, one {#st} two {#nd} few {#rd} other {#th}} time"
}
```

Placeholders are validated by the `placeholder-mismatch` doctor rule — if `{name}` exists in the source but is missing or renamed in a translation, the rule flags it as an error.
