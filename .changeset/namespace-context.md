---
"@better-i18n/mcp": minor
---

Add namespace context support and rich namespace metadata

- `createKeys` and `updateKeys` now accept optional `namespaceContext` per item (`description`, `team`, `domain`, `aiPrompt`, `tags`)
- Mapped to compact `nc` field in API payload; backend groups by namespace and applies after key resolve
- `getProject` response now includes rich namespace objects with `keyCount`, `description`, and `context`
- `listKeys` response now includes `namespaceDetails` map for all namespaces in result
- Updated `@better-i18n/mcp-types` to `^0.4.0`
