---
"@better-i18n/mcp": minor
---

Surface project JSON format info in `listProjects` so AI agents can predict CDN shape and avoid leaf/object collisions.

- New per-project fields: `fileStructure` (`"single_file"` | `"namespaced_folders"`) and `keyFormat` (`"flat"` | `"nested"`).
- Response shape simplified: `cdnBaseUrl` is now returned once at the top level instead of duplicating a per-project `cdnFormat` URL template. Agents build URLs as `${cdnBaseUrl}/${slug}/${locale}/${ns}.json` (use `"translations"` as the `ns` literal for `single_file` projects).
- Removed redundant per-project `organizationName` (derivable from `slug`).
- Tool description updated to document the new response shape and warn about nested JSON parent-path collisions.
