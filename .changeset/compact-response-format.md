---
"@better-i18n/mcp": minor
---

Upgrade to @better-i18n/mcp-types@0.6.0 with compact response format for read endpoints

**Breaking: Compact response format**

Read endpoints now return compact field names for efficient AI communication:
- `getProject` → `{ prj, sl, nss, lng, tk, cov }`
- `getSyncs` → `{ prj, tot, sy }`
- `getSync` → `{ id, tp, st, st_at, cp_at, log, aff_k }`
- `getPendingChanges` → `{ prj, has_chg, sum, by_lng, del_k }`

Write endpoints (`createKeys`, `updateKeys`, `deleteKeys`, `publishTranslations`) remain verbose.

**listKeys: multi-term search**
- `search` parameter now accepts `string | string[]` for OR-based multi-term search

**Other changes:**
- Removed `approveTranslations` tool — use `updateKeys` with `status` parameter instead
- Updated README with all 11 tools and compact field legend
