---
"@better-i18n/mcp": minor
"@better-i18n/mcp-types": patch
---

Add `getTranslationContext` MCP tool — v1 ships project-wide translation context (brand voice, tone, glossary, locked translations, owner instructions) so external AI agents (Claude Code, Codex, Cursor, …) translate with the same guidance the in-platform AI drawer already uses.

Before this tool, agents connected over MCP translated blind: glossary terms marked "must not translate" (brand names) could be translated anyway, locked customer-approved translations were ignored, and project tone/voice preferences never reached the model. The platform's own AI drawer has had this context injected via RAG since March; this tool closes the parity gap for third-party agents.

v1 response:

- `inst` — owner-configured system prompt (`project.aiSystemPrompt`).
- `ctx` — brand description, target audience, product category, tone (formality, emotionalTone, technicalLevel, pacing, voiceCharacteristics).
- `gl` — up to 30 approved glossary terms with `tp` (type), `d` (description, ≤120 chars), `mnt` (must-not-translate), `tr` (locked translations per language).
- `src` / `tgt` — source + active target language codes.
- `hint` — guidance when the project has no context configured yet.

v2 roadmap (already accepted in the schema, ignored by v1): passing `keys: string[]` will trigger pgvector top-K RAG retrieval and add key-specific rules. v1 accepts the parameter so integrations can wire it today without a breaking change when v2 lands.

`mcp-types`: adds `getTranslationContextInput`, `GetTranslationContextResponse`, `CompactGetTranslationContextResponse`, and exposes `getTranslationContext` on the `MCPClient` interface.
