# Better i18n OSS — Claude Code Context

## What This Is

Open-source SDK ecosystem for the **Better i18n** localization platform. These packages are used by **customers** in their production applications — code quality, backwards compatibility, and reliability are critical.

**Platform repo:** `better-i18n` (private) — API, dashboard, sync workers, CDN worker
**This repo:** `better-i18n-oss` (public) — SDKs, CLI, MCP servers that customers install

## AI Assistant Guidelines

- **Package manager:** Bun — use `bun install`, `bun test`, `bun run build`
- **Test runner:** Vitest (root `vitest.config.ts`), except `packages/cli` which uses bun:test
- **Build:** `tsc` per-package (no bundler)
- **Language:** TypeScript 5.9, ESNext modules, `"moduleResolution": "Bundler"`
- **NEVER introduce breaking changes** without explicit approval — customers depend on these packages
- **ALWAYS run tests** after modifying any package: `bun test packages/{name}`
- **ALWAYS use changesets** for version bumps: `bunx changeset` — publishing is
  local, see "Changesets & Releases (LOCAL)". Never hand-edit a version field,
  and never call a release done without `npm view` confirming it.
- **ALWAYS update Linear tickets after commit** — If the task has a Linear issue (BETTER-xxx), update its status to "Done" using `mcp__linear-server__save_issue` after committing. Reference the ticket ID in the commit message (e.g., `feat: add feature [BETTER-105]`). Tickets must not be left open after work is completed.

## Monorepo Structure

```
better-i18n-oss/
├── packages/
│   ├── core/          # Foundation — CDN fetch, TtlCache, locale utils (ALL packages depend on this)
│   ├── use-intl/      # React + TanStack Router adapter (wraps use-intl)
│   ├── next/          # Next.js + next-intl adapter with ISR
│   ├── expo/          # React Native / Expo adapter (i18next)
│   ├── server/        # Server-side: Hono middleware + Node.js adapter
│   ├── remix/         # Remix / Shopify Hydrogen adapter
│   ├── cli/           # CLI: scan, sync, check, doctor commands
│   ├── sdk/           # Headless CMS content client (Supabase-style API)
│   ├── mcp/           # MCP server for translation management (AI agents)
│   ├── mcp-content/   # MCP server for content management
│   ├── mcp-types/     # Shared types — synced from internal repo, DO NOT edit manually
│   ├── schemas/       # Shared Zod schemas
│   └── flutter/       # Flutter/Dart SDK
├── apps/
│   ├── landing/       # Marketing site (TanStack Start, dogfoods use-intl + sdk)
│   ├── docs/          # VitePress documentation
│   ├── hono-example/  # Example Hono server
│   └── hydrogen-demo/ # Shopify Hydrogen example
```

## Package Dependency Graph

```
@better-i18n/core          ← Foundation (no deps)
       ↓
@better-i18n/use-intl      (core + use-intl + @tanstack/react-router)
@better-i18n/next          (core + next-intl + next)
@better-i18n/expo          (core + i18next)
@better-i18n/server        (core + use-intl/core + hono)
@better-i18n/remix         (core)

@better-i18n/mcp-types     ← private, synced from internal
       ↓
@better-i18n/mcp           (mcp-types + @trpc/client + @modelcontextprotocol/sdk)
@better-i18n/mcp-content   (mcp-types + @modelcontextprotocol/sdk)

@better-i18n/sdk           (standalone)
@better-i18n/cli           (standalone)
```

**CRITICAL:** Changes to `@better-i18n/core` affect ALL downstream packages. Test thoroughly.

## CDN Architecture (Platform Side)

Understanding the CDN is essential for working on SDKs — this is what SDKs talk to.

### CDN URL Pattern

```
https://cdn.better-i18n.com/{org}/{project}/manifest.json
https://cdn.better-i18n.com/{org}/{project}/{locale}/translations.json
```

### How the CDN Worker Serves Translations

```
SDK fetch → CDN Worker (CF Worker on cdn.better-i18n.com)
                ↓
          CF Cache API (L1) — 60s translations, 300s manifest
                ↓ (miss)
          R2 Bucket (L2) — source of truth, written by sync-worker
                ↓ (timeout/error)
          Stale Cache (L3) — resilience fallback
                ↓ (nothing)
          {} or { fallback: true } — always HTTP 200, never 5xx
```

**Key behaviors:**
- CDN **always returns HTTP 200** — even on errors, SDKs get `{}` or `{ fallback: true }`
- Response headers: `Cache-Control: public, max-age=60, s-maxage=60` (translations), `max-age=300, s-maxage=600` (manifest)
- Analytics Engine writes per-request: language, namespace, cache status, bytes, latency

### Publish → Purge → Fresh Data Flow

```
User publishes translations
  → Sync Worker uploads JSON to R2
  → Sync Worker fires purge request to CDN Worker (fire-and-forget)
  → CDN Worker: R2.list() → caches.default.delete() per file + manifest
  → Next SDK request: Cache MISS → R2 read → fresh data
```

**Purge is non-critical** — if it fails, `max-age=60` ensures data refreshes within 60s anyway.

### Cache Layers Across Platforms (After Publish + Purge)

| Platform | Max Stale Duration | Cache Source |
|----------|-------------------|-------------|
| Browser SPA | ~60s | CDN `max-age=60` + SDK TtlCache (60s) |
| Next.js (ISR) | ~30s | ISR `revalidate: 30` for messages |
| TanStack Start (CF Worker SSR) | ~60s | SDK TtlCache (60s) — `no-store` bypasses CF subrequest cache |
| Expo (React Native) | ~60s | SDK TtlCache (60s) — network-first, then AsyncStorage fallback |
| Node.js / Hono / Remix | ~60s | SDK TtlCache (60s) |

## Core Package (`@better-i18n/core`) — Deep Reference

This is the foundation. Every SDK builds on this.

### `createI18nCore(config)` — Main Factory

```typescript
const i18n = createI18nCore({
  project: "acme/dashboard",     // REQUIRED: "org/project" format
  defaultLocale: "en",           // REQUIRED
  cdnBaseUrl: "https://cdn.better-i18n.com", // default
  manifestCacheTtlMs: 60000,     // default: 60s in-memory cache
  fetchTimeout: 10000,           // default: 10s
  retryCount: 1,                 // default: 1 retry with exponential backoff
  fetch: customFetch,            // optional: override fetch function
  storage: createAutoStorage(),  // optional: persistent offline fallback
  staticData: { en: { ... } },   // optional: last-resort fallback data
  debug: false,
});

i18n.getMessages("en")     // → Promise<Messages>
i18n.getManifest()         // → Promise<ManifestResponse>
i18n.getLocales()          // → Promise<string[]>
i18n.getLanguages()        // → Promise<LanguageOption[]>
```

### Message Fetching — 5-Layer Fallback Chain

```
1. TtlCache (in-memory, 60s TTL, global singleton)
     ↓ miss
2. CDN fetch (Cache-Control: no-store, timeout + retry)
     ↓ fail
3. Persistent storage (if configured)
     ↓ fail
4. staticData (static object or lazy import)
     ↓ fail
5. Throw error
```

**TtlCache is module-level global** — shared across all `createI18nCore()` instances in the same process. Cache key: `{cdnBaseUrl}|{project}|{locale}`.

**`Cache-Control: no-store`** on fetch requests — bypasses CF subrequest edge cache when SDK runs inside a CF Worker (e.g., landing page SSR). Does NOT affect browser cache, Next.js ISR, or Expo storage.

### Locale Conventions

- CDN uses **lowercase BCP 47**: `normalizeLocale("pt-BR")` → `"pt-br"`
- Default locale has **no URL prefix**: `/about` = English, `/tr/about` = Turkish
- `project` format is always `"org/project"` — validated by `parseProject()`

### Storage Key Conventions

- Manifest: `@better-i18n:manifest:{project}`
- Messages: `@better-i18n:messages:{project}:{locale}`

## Framework Adapter Quick Reference

### `@better-i18n/next` — Next.js

```typescript
// i18n.ts
const i18n = createI18n({
  project: "acme/dashboard",
  defaultLocale: "en",
  localePrefix: "always",           // "always" | "as-needed" | "never"
  manifestRevalidateSeconds: 3600,  // ISR for manifest
  messagesRevalidateSeconds: 30,    // ISR for messages
});

// i18n/request.ts
export default i18n.requestConfig;

// middleware.ts
export default i18n.betterMiddleware();
```

**Two `createI18nCore` instances internally** — one with ISR fetch for manifest (3600s), one for messages (30s).

### `@better-i18n/use-intl` — React + TanStack Router

```typescript
// Provider wraps use-intl's IntlProvider
<BetterI18nProvider
  project="acme/web"
  locale={locale}
  messages={messages}        // from SSR loader — prevents client loading flash
  initialLanguages={langs}   // from SSR — prevents language loading state
>
```

**SSR pattern:** Pass `messages` prop from server loader → provider skips client-side fetch.

### `@better-i18n/expo` — React Native

```typescript
const { core, languages } = await initBetterI18n({
  project: "acme/app",
  i18n: i18nInstance,
  storage: storageAdapter(new MMKV()),
  useDeviceLocale: true,
});
```

**Overrides `i18n.changeLanguage()`** to pre-load translations BEFORE switching — prevents English flash.

### `@better-i18n/server` — Hono / Node.js

```typescript
const i18n = createServerI18n({ project: "acme/api", defaultLocale: "en" });
app.use("*", betterI18n(i18n)); // Injects c.get("locale"), c.get("t")
```

**Must be singleton at module scope** — TtlCache is shared across requests.

## MCP Tool Design Principles (CRITICAL)

The `packages/mcp` and `packages/mcp-content` packages define tools that AI agents use via Model Context Protocol. Tool quality directly impacts agent behavior.

### 1. Defensive Tool Descriptions

Tool descriptions are the **primary guardrail** for AI agent behavior. LLMs treat them as system prompts.
- Always document required parameter combinations
- Warn about common misuse patterns directly in the description
- Include step-by-step workflows
- Explain what happens with wrong inputs

### 2. Response Warning Fields

MCP tool responses can include warning fields:
- `warn`: Cross-entity collision warnings (e.g., key exists in another namespace)
- `hint`: Ignored filter warnings (e.g., status filter without languages)

### 3. Agent Misuse Prevention

When modifying MCP tools:
1. **What could an agent do wrong?** → Add guardrails to description (proactive)
2. **What if it does?** → Add warnings to response (reactive)
3. Both are needed — description alone isn't enough

**Reference incident:** An AI agent created 1005 phantom keys by using `createKeys` with wrong namespace instead of `updateKeys`.

## packages/mcp-types — Source Management (CRITICAL)

`packages/mcp-types/src/` files are **synced from the internal repo**. DO NOT edit manually — changes are overwritten on next sync.

**To make changes:**
1. Edit in internal repo (`packages/mcp-types/src/`)
2. Run `bun run sync:mcp-types` in internal repo
3. Commit the synced changes in OSS

This package is `private: true` — never published to npm.

## Testing (CRITICAL)

```bash
bun test                      # All tests
bun test packages/core        # Core package
bun test packages/mcp         # MCP server
bun test packages/mcp-content # MCP content server
bun test packages/next        # Next.js adapter
bun test packages/expo        # Expo adapter
bun test packages/server      # Server adapter
```

**Two test tiers:**
- **Unit tests** (mocked client) — always run, no external deps
- **Integration tests** — run when `BETTER_I18N_API_KEY` is set

**After ANY package change:** Run tests, fix failures before considering done.

## Changesets & Releases (LOCAL)

Publishing happens **from a maintainer's machine**, not from CI. `NPM_TOKEN` was
removed from the repo secrets on 2026-08-09. The Release workflow still runs on
push to `main`, but its publish step can no longer reach the registry — a red or
no-op run there is expected, not a regression.

### Why CI publishing was retired

Three failures stacked, and the shape they share is that **a green CI run proved
nothing about npm**:

1. **Silent partial publish.** On 2026-08-09 `changesets/action` reported success
   and pushed git tags for `core`, `use-intl`, `next`, `expo`, `remix`, `server`
   and `vite`. Only `next@0.9.1` actually reached npm. The other four were tagged
   as released and would never have been retried, because tags are what changesets
   reads to decide "already published".
2. **`bun publish` exits 0 on a failed publish.** Its own post-publish check
   printed `404 Not Found: registry.npmjs.org/@better-i18n%2fvite` and
   `'@better-i18n/vite@0.2.13' does not exist in this registry`, then returned
   success anyway.
3. **A missing devDependency silently emptied `dist/`.** `@better-i18n/remix`
   ships React components but had no `@types/react`, so `tsc` failed with TS7016,
   `dist/` was never written, and publish had nothing to send. Identical in shape
   to the `@better-i18n/server` 0.2.2-0.2.9 incident, where a TypeScript error in
   `node.ts` plus a `2>/dev/null || true` in the CI build produced the same
   invisible skip.

Automating this again is possible — it needs an **Automation**-type npm token
(the account has 2FA, and a classic token makes authenticated registry reads
return 404) plus a publish step that fails loudly. Until then, publish by hand.

### Release Flow (local)

```
1. Build the changed package    →  cd packages/{name} && bun run build   (MUST pass)
2. Write a changeset            →  .changeset/<descriptive-name>.md
3. Version the workspace        →  bunx changeset version
4. Rebuild every bumped package →  cd packages/{name} && bun run build
5. Publish, dependencies first  →  cd packages/{name} && npm publish [--otp=<code>]
6. VERIFY against the registry  →  npm view @better-i18n/{name}@{version} version
7. Commit the version bumps + CHANGELOGs and push
```

Step 6 is not optional. `+ @better-i18n/x@1.2.3` in the publish output is the
only trustworthy success signal, and even that is confirmed by asking npm.
`npm view @better-i18n/x version` without the version suffix reads a cached
`latest` and lied about `next@0.9.1` for several minutes.

Publish `core` before anything that depends on it, then `use-intl`, then the
framework adapters. OTP codes expire in about 30 seconds, so expect a fresh code
per package.

### ⚠️ CRITICAL: an empty `dist/` publishes silently

**ALWAYS run `bun run build` in every package you are about to publish, and look
at the output.** If `tsc` fails, `dist/` is stale or absent and npm happily
publishes a package with no code in it. Check `ls packages/{name}/dist` when in
doubt.

### Changeset file format

```markdown
---
"@better-i18n/cli": minor
---

Short description of what changed and why
```

**Bump types:** `patch` for fixes, `minor` for new features, `major` for breaking changes.

### Rules

- **NEVER hand-edit a `version` field in package.json** — `bunx changeset version`
  owns it, and it also updates CHANGELOGs and internal dependency ranges.
- Only write changesets for packages with **actual source code changes**.
  `changeset version` derives the dependents' patch bumps on its own.
- `core` changes do NOT require a changeset for downstream packages unless their
  own code changed.
- One changeset per logical change — don't batch unrelated work.
- If a publish fails halfway, **do not** delete or move the git tags changesets
  pushed; just publish the missing packages and verify each with `npm view`.

## Key Patterns and Conventions

1. **Singleton server instances** — `createServerI18n`, `createRemixI18n`, `createI18n` must be instantiated once at module scope (TtlCache is shared)
2. **`project` format** — Always `"org/project"` (e.g., `"acme/dashboard"`)
3. **Locale normalization** — CDN uses lowercase: `normalizeLocale("pt-BR")` → `"pt-br"`
4. **Default locale = no URL prefix** — `/about` = default locale, `/{locale}/about` = other locales
5. **SSR hydration** — Pass `messages` prop to provider from server loader (skip client loading)
6. **`staticData` = last resort** — Can be static object or `() => import('./fallback.json')`
7. **Namespace structure** — CDN returns `{ "namespace": { "key": "value" } }`
8. **Never import storage directly in expo** — Use `storageAdapter()` with duck-typing
9. **`mcp-types` sync** — Never edit in OSS, always edit in internal repo

## Supply Chain Security (CRITICAL)

This repo publishes npm packages used by customers in production. We treat all install-time and CI execution as untrusted unless the code path was reviewed by a human.

### Threat 1 — Invisible Unicode payloads (Glassworm)

The Glassworm threat actor has been compromising GitHub repos and npm packages using invisible Unicode characters (PUA: `U+FE00–FE0F`, `U+E0100–E01EF`) that are invisible in editors, terminals, and code review UIs.

**When reviewing or adding code:**
- Watch for empty-looking template literals or strings that might contain invisible payload characters
- Never add code snippets from unknown sources without verification
- Check for suspicious dynamic code execution patterns (`Buffer.from()` + decode chains)
- To detect invisible characters in a file: `cat -v <file>` (shows non-printable chars as `M-^` sequences)
- When adding new dependencies, verify the package's npm publish date, maintainer, and download count
- Especially critical for: `packages/core`, `packages/mcp`, `packages/cli`, `packages/sdk` — these are direct customer-facing npm packages

### Threat 2 — Malicious postinstall + dropped `.claude` hooks (Shai-Hulud)

Observed May 2026 in `fuma-nama/fuma-content` and `aidenybai/million`: a Renovate dependency-bump PR pulled in a malicious package version. The package's `postinstall` script ran in CI (where `pnpm` was still pre-v11) and **committed a `.claude/settings.json` plus payload scripts back to the repo** under a fake `Claude co-authored` tag. The repo itself became the landing pad — any developer who later opened it in Claude Code would trigger the hook locally and leak secrets.

**Existing mitigations in this repo:**
- `.gitignore` line `.claude` — refuses to track ANY `.claude/*` file (settings, hooks, skills). Hostile commits get silently dropped on `git add`.
- `.npmrc` `ignore-scripts=true` — even if someone runs `npm/pnpm/yarn install`, dep lifecycle scripts do NOT execute. Bun's default behavior already skips them.
- `.github/workflows/gitleaks.yml` — secret scanner on every PR.
- Changesets release: only triggered after a human merges the auto-generated "Version Packages" PR — no direct `npm publish` from a dep PR.

**Operating rules:**
- NEVER use `git add -f` on `.claude/` paths to bypass `.gitignore` — that's literally the attack vector.
- Dependabot/Renovate PRs require human review; do NOT enable auto-merge.
- If you ever see `.claude/settings.json` or `.claude/hooks/*` appear in a PR diff, treat the PR as compromised — close, revoke any tokens the workflow used, rotate `NPM_TOKEN`.
- Suspicious markers to grep before merging dep PRs: `setup.sh`, `shai-hulud`, `.background-agent.sh`, new files under `.github/workflows/` you didn't author, base64/`Buffer.from()` blobs in lockfile diffs.

## Common Mistakes to Avoid

1. **Breaking `@better-i18n/core` API** — Every other package depends on it
2. **Changing CDN URL patterns** — SDKs and CDN worker must agree
3. **Modifying TtlCache key format** — Existing cached data becomes orphaned
4. **Forgetting `normalizeLocale()`** — CDN uses lowercase, frameworks may not
5. **Making analytics/storage blocking** — Always fire-and-forget for non-critical operations
6. **Editing `packages/mcp-types/src/` directly** — Will be overwritten on sync

## Key Files Reference

| File | Purpose |
|------|---------|
| `packages/core/src/cdn.ts` | `createI18nCore` + full fallback chain |
| `packages/core/src/cache.ts` | `TtlCache` class |
| `packages/core/src/config.ts` | `normalizeConfig`, defaults (60s TTL) |
| `packages/core/src/types.ts` | All core types (`I18nCoreConfig`, `Messages`, etc.) |
| `packages/use-intl/src/provider.tsx` | `BetterI18nProvider` |
| `packages/use-intl/src/server.ts` | Server-side helpers + locale detection |
| `packages/next/src/index.ts` | `createI18n` factory |
| `packages/next/src/server.ts` | ISR-aware core + `createNextIntlRequestConfig` |
| `packages/next/src/middleware.ts` | Next.js middleware |
| `packages/expo/src/helpers.ts` | `initBetterI18n` + `changeLanguage` override |
| `packages/expo/src/storage.ts` | `storageAdapter`, cache read/write |
| `packages/server/src/index.ts` | `createServerI18n` |
| `packages/server/src/hono.ts` | Hono middleware |
| `packages/mcp/src/server.ts` | MCP server factory |
| `packages/sdk/src/client.ts` | Content SDK `createClient` |
| `packages/cli/src/index.ts` | CLI entrypoint |

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` to keep the graph current

## Debugging (CRITICAL — Log + Code methodology)

When ANY error is reported or suspected, ALWAYS read logs FIRST:
1. **Logs first** → Check `.openlogs/` or `ol tail` for the relevant service — find exact error, stack trace, timestamp
2. **Code second** → With log context, read the failing file/line — understand WHY it broke
3. **Fix with precision** → Logs show reality, code shows intent. The gap = the bug.

**Never debug by code-reading alone.** You'll guess at symptoms and risk false fixes. Logs pinpoint; code explains. Together = surgical fix.
