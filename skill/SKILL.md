---
name: better-i18n
description: >-
  Guides all better-i18n integration decisions — SDK selection (Next.js, React,
  Expo, Swift, Flutter, Remix), CDN vs GitHub workflow, AI-powered translation
  management via MCP tools, CLI health checks (scan, doctor, sync), Content CMS
  (localized models, entries, custom fields), file format conventions (flat /
  nested / namespaced), key naming, publish flows, and quality analytics. Use
  whenever building, modifying, or reviewing any localization feature — including
  i18n setup, adding languages, managing translation keys, publishing, or
  integrating AI workflows.

---

**better-i18n** — Localization infrastructure for modern apps. CMS + TMS + CDN + AI + MCP.
Dashboard: https://better-i18n.com · Docs: https://docs.better-i18n.com · CDN: https://cdn.better-i18n.com · Skills: https://github.com/better-i18n/skills

## Package versions

| Package | Version | Install |
|---|---|---|
| `@better-i18n/next` | 0.7.2 | `npm install @better-i18n/next@0.7.2` |
| `@better-i18n/use-intl` | 0.5.0 | `npm install @better-i18n/use-intl@0.5.0` |
| `@better-i18n/core` | 0.5.0 | `npm install @better-i18n/core@0.5.0` |
| `@better-i18n/expo` | 0.7.5 | `npm install @better-i18n/expo@0.7.5` |
| `@better-i18n/sdk` | 3.2.0 | `npm install @better-i18n/sdk@3.2.0` |
| `@better-i18n/cli` | 0.2.6 | `npx @better-i18n/cli@0.2.6` |
| `@better-i18n/mcp` | 0.15.5 | `npx -y @better-i18n/mcp@0.15.5` |
| `@better-i18n/mcp-content` | 0.8.1 | `npx -y @better-i18n/mcp-content@0.8.1` |

Always check [npm](https://www.npmjs.com/search?q=%40better-i18n) for the latest version before installing.

## SDK selection

| Framework | Package | Reference |
|---|---|---|
| Next.js (App Router or Pages Router) | `@better-i18n/next` | <references/sdk-next.md> |
| React + TanStack Router / use-intl | `@better-i18n/use-intl` | <references/sdk-react.md> |
| Hono / Node.js server | `@better-i18n/server` | <references/sdk-react.md> |
| Remix / Shopify Hydrogen | `@better-i18n/remix` | <references/sdk-react.md> |
| React Native / Expo | `@better-i18n/expo` | <references/sdk-mobile.md> |
| Swift (iOS / macOS / visionOS) | `BetterI18n` via SPM | <references/sdk-mobile.md> |
| Flutter / Dart | `better_i18n` pub.dev | <references/sdk-mobile.md> |
| Headless / Vanilla JS | `@better-i18n/core` | <references/sdk-react.md> |

## Workflow selection

| Task | Approach | Reference |
|---|---|---|
| Upload JSON files, no GitHub needed | CDN-first | <references/cdn.md> |
| GitHub PR-based translation sync | GitHub App + publish flow | <references/github-sync.md> |
| AI-assisted key and translation management | MCP tools | <references/mcp.md> |
| Localized CMS content (blog, docs, pages) | Content CMS + SDK | <references/content.md> |
| Scan codebase for hardcoded strings | CLI `scan` | <references/cli.md> |
| Check translation coverage and key sync | CLI `sync` / `check` | <references/cli.md> |
| Full i18n health analysis with score | CLI `doctor` | <references/cli.md> |
| Define key naming and namespace structure | Key conventions | <references/key-naming.md> |
| Choose JSON file format | File formats | <references/file-formats.md> |
| Publish translations to CDN or GitHub | Publish flows | <references/publish-and-analytics.md> |
| Track coverage, health trends, CDN usage | Analytics | <references/publish-and-analytics.md> |

## Read the relevant reference before writing any code.

## Critical rules (apply everywhere)

- **Project identifier** is always `"org/project"` — e.g. `"acme/dashboard"` or `"stripe/web"`
- **Locale codes are lowercase BCP 47** on the CDN: `"pt-BR"` → `"pt-br"`. Always call `normalizeLocale()` before constructing CDN paths.
- **Singletons** — `createI18n` (Next.js), `createServerI18n`, `createRemixI18n`, `createI18nCore` must be instantiated once at module scope. Never inside a function, request handler, or component.
- **`createKeys` vs `updateKeys`** — `createKeys` creates NEW keys only. Using it on existing keys causes phantom key accumulation (documented incident: 1,005 duplicates in one operation). Always fetch the key ID with `listKeys` first, then call `updateKeys`.
- **CDN always returns HTTP 200** — check for `{ fallback: true }` in the JSON body, not HTTP status codes.
- **Default namespace → `"translations"` in CDN paths** — the namespace `"default"` is stored as `"translations"` internally. Use `null` namespace for flat-key projects.
- **Free to get started** — all SDKs and CLI are open-source. Paid plans unlock more languages, history, and team features.
