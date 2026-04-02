---
"@better-i18n/mcp-content": patch
---

Fix schema alignment between MCP content tools and platform API:

- **listContentEntries**: Map `modelSlug` input to `models` API field — filter was silently ignored since platform API refactor on Mar 30
- **createContentEntry**: Add `sourceLanguageCode` field; make translation `title` optional to match platform schema
- **create/update tools**: Remove non-base fields (`excerpt`, `featuredImage`, `tags`, `metaTitle`, `metaDescription`, `translationStatus`) from tool schemas — these are model-specific custom fields that belong in `customFields`, not top-level parameters
