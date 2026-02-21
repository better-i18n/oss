---
"@better-i18n/mcp": minor
---

Add `fields` parameter to `listKeys` tool for token-efficient coverage queries.

**New parameter:** `fields` — controls which fields are returned per key.

- `"translatedLanguageCount"` (`tlc`) — returns count as integer instead of full array. Significantly reduces tokens for large projects.
- `"translatedLanguages"` (`tl`) — full list of translated language codes (existing behavior, now opt-in)
- `"translations"` (`tr`) — actual translation text
- `"id"`, `"sourceText"` — included by default

**Default changed:** Fields default is now `["id", "sourceText"]` — `translatedLanguages` must be requested explicitly.

**Example:**
```json
{ "project": "org/project", "fields": ["id", "translatedLanguageCount"] }
```

Bumps `@better-i18n/mcp-types` to `^0.11.0`.
