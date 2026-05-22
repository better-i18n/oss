---
"@better-i18n/mcp": minor
---

Add OAuth 2.1 browser login to the stdio bridge — connect without an API key.

`npx @better-i18n/mcp` now opens your browser to sign in to Better i18n on first run and caches tokens in `~/.better-i18n` (refreshed automatically). `BETTER_I18N_API_KEY=bi-…` still works for headless use (CI, scripts). The bridge proxies to the remote MCP endpoint and forwards the tool catalog from the server, so new tools ship on an API deploy without an npm release.
