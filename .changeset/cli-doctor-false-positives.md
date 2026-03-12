---
"@better-i18n/cli": patch
---

Fix false positives in doctor code analysis: jsx-attribute rule now filters out coordinates, time strings, hex colors, CSS values, and identifiers. jsx-text rule now correctly ignores decimal numbers (e.g. "41.0082").
