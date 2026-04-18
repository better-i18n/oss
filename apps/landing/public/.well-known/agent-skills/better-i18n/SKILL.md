---
name: better-i18n
description: Guides all Better i18n integration decisions — SDK selection (Next.js, React, Expo, Swift, Flutter, Remix), CDN vs GitHub workflow, AI-powered translation management via MCP tools, CLI health checks (scan, doctor, sync), Content CMS (localized models, entries, custom fields), file format conventions (flat / nested / namespaced), key naming, publish flows, and quality analytics. Use whenever building, modifying, or reviewing any localization feature — including i18n setup, adding languages, managing translation keys, publishing, or integrating AI workflows.
version: 1.0.0
license: MIT
homepage: https://better-i18n.com
---

**Better i18n** — Localization infrastructure for modern apps. CMS + TMS + CDN + AI + MCP.

- Dashboard: https://dash.better-i18n.com
- Docs: https://docs.better-i18n.com
- CDN: https://cdn.better-i18n.com
- API: https://api.better-i18n.com
- Canonical skill repo (keeps sub-references in sync): https://github.com/better-i18n/skills

## Package versions

| Package | Install |
|---|---|
| `@better-i18n/next` | `npm install @better-i18n/next` |
| `@better-i18n/use-intl` | `npm install @better-i18n/use-intl` |
| `@better-i18n/core` | `npm install @better-i18n/core` |
| `@better-i18n/expo` | `npm install @better-i18n/expo` |
| `@better-i18n/sdk` | `npm install @better-i18n/sdk` |
| `@better-i18n/cli` | `npx @better-i18n/cli` |
| `@better-i18n/mcp` | `npx -y @better-i18n/mcp` |
| `@better-i18n/mcp-content` | `npx -y @better-i18n/mcp-content` |

## Quick decision tree

| Scenario | Use |
|---|---|
| Next.js app (App Router or Pages) | `@better-i18n/next` + middleware + `requestConfig` |
| Vite / TanStack Router SPA | `@better-i18n/use-intl` with SSR messages prop |
| React Native / Expo | `@better-i18n/expo` with `initBetterI18n()` + MMKV storage |
| Hono / Node backend | `@better-i18n/server` singleton at module scope |
| Remix / Shopify Hydrogen | `@better-i18n/remix` |
| Headless content (localized CMS) | `@better-i18n/sdk` + `createClient()` |
| Agent workflows | MCP servers `@better-i18n/mcp` + `@better-i18n/mcp-content` |
| CI/CD translation sync | `@better-i18n/cli` scan/check/doctor/sync |

## Canonical reference topics

The canonical skill on GitHub ships 11 reference docs that drill into each
topic. Agents should fetch these as needed:

| Reference | URL |
|---|---|
| SDK — Next.js | https://raw.githubusercontent.com/better-i18n/skills/main/skills/better-i18n/references/sdk-next.md |
| SDK — React / TanStack | https://raw.githubusercontent.com/better-i18n/skills/main/skills/better-i18n/references/sdk-react.md |
| SDK — Expo / React Native | https://raw.githubusercontent.com/better-i18n/skills/main/skills/better-i18n/references/sdk-mobile.md |
| CLI | https://raw.githubusercontent.com/better-i18n/skills/main/skills/better-i18n/references/cli.md |
| MCP | https://raw.githubusercontent.com/better-i18n/skills/main/skills/better-i18n/references/mcp.md |
| Content CMS | https://raw.githubusercontent.com/better-i18n/skills/main/skills/better-i18n/references/content.md |
| CDN delivery | https://raw.githubusercontent.com/better-i18n/skills/main/skills/better-i18n/references/cdn.md |
| GitHub sync | https://raw.githubusercontent.com/better-i18n/skills/main/skills/better-i18n/references/github-sync.md |
| Key naming | https://raw.githubusercontent.com/better-i18n/skills/main/skills/better-i18n/references/key-naming.md |
| File formats (flat / nested / namespaced) | https://raw.githubusercontent.com/better-i18n/skills/main/skills/better-i18n/references/file-formats.md |
| Publish + analytics | https://raw.githubusercontent.com/better-i18n/skills/main/skills/better-i18n/references/publish-and-analytics.md |

## Non-negotiable rules

1. `project` is always `"org/project"` format (e.g. `"acme/dashboard"`) — validated at runtime.
2. Default locale has NO URL prefix (`/about` = English, `/tr/about` = Turkish).
3. CDN uses lowercase BCP 47 locale codes (`pt-BR` → `pt-br`). Use `normalizeLocale()`.
4. `createServerI18n` and server-side factories must be SINGLETON at module scope — TtlCache is shared.
5. Agent MCP workflows: ALWAYS `listKeys` first, then decide between `createKeys` vs `updateKeys`. Wrong namespace = phantom keys.
6. SSR pattern: Pass `messages` prop from server loader → provider skips client-side fetch.

## Typical agent workflows

**Add a language to a project**
1. `mcp__better-i18n__proposeLanguages({ projectSlug, languages: ["fr", "de"] })`
2. Review proposal → agent approves
3. `mcp__better-i18n__publishTranslations({ languages: ["fr", "de"] })`

**Translate pending keys**
1. `listKeys({ status: "missing", language: "fr" })` → get key list
2. `getTranslations({ keyNames, language: "en" })` → source text
3. Model generates translations
4. `updateKeys({ translations: [...], language: "fr" })`
5. `publishTranslations({ languages: ["fr"] })`

**Integrate a new CMS entry**
1. `listContentModels()` → find target model
2. `createContentEntry({ modelSlug, translations: { en: {...}, tr: {...} } })` — include ALL languages in ONE call
3. `publishContentEntry({ id })`

**Scan a repo for missing keys**
```bash
npx @better-i18n/cli scan          # extracts t() calls
npx @better-i18n/cli doctor        # health report
npx @better-i18n/cli sync          # pushes new keys to platform
```
