# Better i18n OSS - Claude Code Context

## AI Assistant Guidelines

- **Package manager:** Bun — use `bun install`, `bun test`, `bun run build`
- **Test runner:** Bun test (not Vitest) — files need `.test.ts` extension
- **Build:** `tsc` per-package (no bundler)
- **Language:** TypeScript 5.9, ESNext modules, `"moduleResolution": "Bundler"`

## Monorepo Structure

```
better-i18n-oss/
├── packages/
│   ├── core/          # Framework-agnostic i18n core (TtlCache, CDN fetch)
│   ├── use-intl/      # React + TanStack Router adapter
│   ├── next/          # Next.js adapter
│   ├── expo/          # Expo adapter
│   ├── server/        # Server-side (Hono + Node.js)
│   ├── mcp/           # MCP server for AI agent integration
│   ├── mcp-content/   # MCP content management tools
│   ├── mcp-types/     # Shared types/schemas — synced from internal, DO NOT edit manually
│   ├── cli/           # CLI tool
│   ├── sdk/           # SDK
│   ├── schemas/       # Shared schemas
│   └── flutter/       # Flutter/Dart SDK
```

## MCP Tool Design Principles (CRITICAL)

The `packages/mcp` package defines tools that AI agents use via Model Context Protocol. Tool quality directly impacts agent behavior — bad descriptions lead to bad agent actions.

### 1. Defensive Tool Descriptions
Tool descriptions are the **primary guardrail** for AI agent behavior. LLMs treat them as system prompts.
- Always document required parameter combinations (e.g., "status filter REQUIRES languages parameter")
- Warn about common misuse patterns directly in the description
- Include step-by-step workflows (e.g., "1. listKeys → 2. updateKeys" not just "use updateKeys")
- Explain what happens with wrong inputs (e.g., "wrong namespace creates duplicate keys")

### 2. Description Anti-patterns to Avoid
- Never assume the agent will call tools in the right order — spell out the workflow
- Never leave parameter dependencies undocumented (e.g., status needs languages)
- Never use vague descriptions like "optional filter" when there are consequences to misuse
- Don't rely only on response errors — by then the agent may have already caused damage

### 3. Response Warning Fields
MCP tool responses can include warning fields that guide the agent:
- `warn`: Cross-entity collision warnings (e.g., key exists in another namespace)
- `hint`: Ignored filter warnings (e.g., status filter without languages)
- These fields are the **reactive** safety net — tool descriptions are the **proactive** one

### 4. Agent Misuse Prevention Pattern
When modifying MCP tools, always consider:
1. **What could an agent do wrong?** (wrong namespace, missing parameters, wrong tool choice)
2. **Add guardrails to description** (proactive — prevents misuse)
3. **Add warnings to response** (reactive — catches misuse after the fact)

**Reference incident:** An AI agent created 1005 phantom keys by using `createKeys` with wrong namespace instead of `updateKeys`. This led to cross-namespace warnings and improved tool descriptions.

## packages/mcp-types — Kaynak Yönetimi (KRİTİK)

`packages/mcp-types/src/` dosyaları **internal repodan otomatik olarak sync'lenir**.
Bu dizindeki dosyaları elle düzenleme — değişiklikler bir sonraki sync'te kaybolur.

### Değişiklik yapmak için

1. Internal repoda (`packages/mcp-types/src/`) düzenlemeyi yap
2. Internal'de çalıştır: `bun run sync:mcp-types`
3. OSS'e gelen değişikliği commit et

### Neden `private: true`?

Bu paket npm'e publish edilmez. OSS release script'i `private: true` olan
paketleri otomatik atlar. `packages/mcp` ve `packages/mcp-content` ise
`workspace:*` ile bu paketi doğrudan kaynak olarak kullanır.

## Testing (CRITICAL)

- **ALWAYS run tests after modifying `packages/mcp` or `packages/mcp-content`:**
  ```bash
  bun test packages/mcp
  bun test packages/mcp-content
  ```
- **Test runner:** Vitest (configured via root `vitest.config.ts`), except `packages/cli` which uses bun:test
- **Two test tiers:**
  - **Unit tests** (mocked client) — always run, no external deps
  - **Integration tests** (real API) — run when `BETTER_I18N_API_KEY` is set, hits local API at `BETTER_I18N_API_URL`
- **After ANY MCP tool change:** run tests, fix failures before considering done
- **After adding a new MCP tool:** create matching test file in `tools/__tests__/`
- **Test pattern:** Each tool test covers input validation, data normalization, API call correctness, and error handling

```bash
# Run all tests
bun test

# Run MCP package tests
bun test packages/mcp

# Run MCP content tests
bun test packages/mcp-content

# Run specific package tests
bun test packages/core
```

## Changesets

Use changesets for version management:
```bash
bunx changeset        # Create a new changeset
bunx changeset version # Apply changesets and bump versions
```
