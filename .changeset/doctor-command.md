---
"@better-i18n/cli": minor
---

Add `doctor` command for i18n health analysis with CI integration.

- Detects missing translations, placeholder mismatches, and orphan keys
- Calculates health score (0-100) across 5 categories
- ESLint and JSON output formats
- `--report` flag uploads results to Better i18n via GitHub OIDC (zero secrets)
- `--ci` flag exits with error code if health score below threshold
