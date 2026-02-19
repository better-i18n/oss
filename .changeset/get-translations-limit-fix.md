---
"@better-i18n/mcp": minor
---

feat(getTranslations): Remove `limit: 0` ("fetch all") and add pagination metadata

**Breaking change:** `limit: 0` is no longer accepted. Valid range is now `1–200`.
This prevents token-limit crashes (e.g., 10K+ keys = 4M chars = exceeds 1M token limit).

**New response fields:**
- `returned`: number of keys in this response (after all filters)
- `total`: total keys in DB matching namespace/search/key filters (before in-memory status filter)
- `hasMore`: `true` when `total > limit` — use narrower filters to get specific keys

**Example response:**
```json
{
  "returned": 100,
  "total": 10483,
  "hasMore": true,
  "keys": [...]
}
```

**Migration:** Replace `limit: 0` with targeted filters — use `namespaces`, `search`, `keys[]`,
or `status: "missing"` to narrow results instead of fetching everything.
