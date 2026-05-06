---
"@better-i18n/cli": minor
---

Add full translation management to CLI — login, keys, translations, publish, languages, and sync monitoring.

New commands:
- `login` / `logout` / `whoami` — browser-based OAuth + API key auth (better-auth native)
- `projects` / `project` — list and inspect projects
- `keys list` / `keys create` / `keys delete` — key management with stdin JSON support
- `translate` — set translations in bulk via stdin JSON
- `translations` — get full translation text with search/filter
- `publish` / `publish:status` — deploy to CDN with pending changes preview
- `languages add` / `languages edit` — manage target languages
- `syncs list` / `syncs get` / `syncs cancel` — sync job monitoring

All commands support `--json` for machine-readable output and `--yes` to skip confirmations.
Every MCP tool now has a CLI equivalent — agents can use the CLI when MCP is unavailable.
