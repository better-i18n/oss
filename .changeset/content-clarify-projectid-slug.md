---
"@better-i18n/content": patch
---

Clarify `projectId` configuration in README — recommend the human-readable `org-slug/project-slug` format (matches dashboard URL + Content SDK + Translation SDK). The SDK itself was already format-agnostic and forwards whatever string is passed; the backend now accepts both slug and UUID, with slug as the canonical format going forward. No code changes — README + Configure section + concrete env var example added so new integrations land on the right pattern first try.
