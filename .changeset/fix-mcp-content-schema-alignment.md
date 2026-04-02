---
"@better-i18n/mcp-content": patch
---

Fix schema alignment between MCP content tools and platform API:

- **listContentEntries**: Map `modelSlug` input to `models` API field (filter was silently ignored since platform API refactor on Mar 30)
- **createContentEntry**: Add missing `sourceLanguageCode`, `excerpt`, `featuredImage`, `tags` fields; make translation `title` optional to match platform schema
- **updateContentEntry**: Add missing `excerpt`, `featuredImage`, `metaTitle`, `metaDescription`, `tags`, `translationStatus` fields
- Fix test expectations for `modelSlug → models` mapping
