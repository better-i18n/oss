---
"@better-i18n/mcp": minor
---

Add phantom key detection to listKeys + createKeys responses.

`listKeys` now includes `p: true` on rows that are legacy duplicates with
namespace_id=NULL whose key contains the full namespace path while a proper
namespaced row exists. These shadow proper rows in CDN file generation
(BETTER-260). Recommended action: call `deleteKeys` with the row's `id`,
then `publishTranslations` to clean the CDN.

`createKeys` now returns phantom warnings in its `warnings[]` array when a
legacy phantom row exists for a key being created. Each warning carries the
phantom's UUID and a deleteKeys hint.
