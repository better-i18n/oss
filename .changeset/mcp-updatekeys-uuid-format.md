---
"@better-i18n/mcp": patch
---

fix(updateKeys): Use `id` (UUID) instead of deprecated `k`/`ns` fields

The `updateKeys` tool was sending `k` (key name) and `ns` (namespace) fields to the API, but the API requires `id` (UUID) since v0.8. This caused a `BAD_REQUEST: id Required` validation error.

**Breaking change for `updateKeys` tool users:** You must now provide `id` (UUID) instead of `k`/`ns`. Get the UUID from `getAllTranslations` or `listKeys` response first.

**Before (broken):**
```json
{ "t": [{ "k": "auth.login.title", "ns": "auth", "l": "tr", "t": "Giriş" }] }
```

**After (correct):**
```json
{ "t": [{ "id": "550e8400-e29b-41d4-a716-446655440000", "l": "tr", "t": "Giriş" }] }
```
