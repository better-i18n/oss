---
"@better-i18n/mcp": patch
"@better-i18n/mcp-content": patch
---

Fix npx executable resolution by removing duplicate HTTP bin entry. Having multiple bin entries caused `npx @better-i18n/mcp` to fail with "could not determine executable to run" on npm v10+. HTTP transport is still available via `node dist/http.js`.
