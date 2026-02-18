---
"@better-i18n/mcp": minor
---

Add `getTranslations` tool and fix `listKeys` to use compact paginated endpoint.

- Fix `listKeys` to call `mcp.listKeys` endpoint instead of `mcp.getAllTranslations`. Response now uses compact format with pagination (`tot`, `ret`, `has_more`, `nss` namespace lookup table).
- Add new `getTranslations` tool that preserves the previous full-text retrieval behavior for AI translation workflows (search by source/target text, filter by language/status/keys).
- `listKeys` is now for browsing and exploration; `getTranslations` is for reading/updating translation text.
- Bump `@better-i18n/mcp-types` dependency to `^0.8.0`.
