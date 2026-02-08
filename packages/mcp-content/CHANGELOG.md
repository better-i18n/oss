# @better-i18n/mcp-content

## 0.0.3

### Patch Changes

- 80afe51: Initial publish of MCP Content server for headless CMS content management

## 0.0.2

### Patch Changes

- d2b320b: Fix npx executable resolution by removing duplicate HTTP bin entry. Having multiple bin entries caused `npx @better-i18n/mcp` to fail with "could not determine executable to run" on npm v10+. HTTP transport is still available via `node dist/http.js`.
