---
"@better-i18n/cli": patch
---

fix(cli): correct dashboard URLs and suppress CI exit code on successful report upload

- Fixed report URLs to use correct path: `/{org}/{project}/integrations/doctor?reportId={id}`
- API key path fallback uses full deep-link URL with org/project context
- OIDC path fallback trusts API response URL, falls back to base domain
- `--report --ci` no longer exits with code 1 when report uploads successfully
