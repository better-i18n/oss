---
"@better-i18n/mcp-content": minor
---

Add Block Catalog MCP tools (BETTER-246 / BETTER-247).

Six new tools for managing the per-project block catalog — code-first renderable
primitives (hero, feature grid, cover, FAQ, CTA) registered by the customer's SDK
and used by AI agents to compose content entries:

- `registerBlock` — upsert one block by (project, slug) with JSON Schema + metadata
- `bulkRegisterBlocks` — register up to 50 blocks atomically in one transaction
- `listBlocks` — browse the catalog with optional category/search filters
- `getBlock` — fetch a single block's full detail including paramsSchema
- `validateBlockParams` — dry-run validate block params against the stored schema
- `deleteBlock` — remove a block from the catalog (policies: strict/warn/orphan)

Only JSON Schema + metadata are stored — no customer render code enters Better.
Static PNG previews and optional iframe live previews are customer-hosted.

Paired with platform changes to `mcpContent` tRPC router and the new
`block_catalog` Postgres table.
