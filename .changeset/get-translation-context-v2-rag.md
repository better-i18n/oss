---
"@better-i18n/mcp": minor
"@better-i18n/mcp-types": patch
---

`getTranslationContext` v2 — per-key RAG retrieval via pgvector.

Passing `keys: string[]` (UUIDs from listKeys, max 50) now triggers per-key semantic retrieval over the project's `project_embedding` index. Each key receives its own top-K similar passages in `rules[]`, scored by cosine similarity, preserving attribution so the agent can map past-decision context back to the key it was resolving:

```json
{
  "rules": [
    {
      "id": "<keyUuid>",
      "k": "auth.login.title",
      "sim": [
        { "tp": "translation", "c": "Hesabınıza giriş yapın", "s": 0.87, "l": "tr" },
        { "tp": "glossary",    "c": "Login — sign-in action",  "s": 0.71, "l": null }
      ]
    }
  ]
}
```

Retrieval types: `translation` (approved past pairs), `glossary` (term definitions), `preference` (user corrections to AI suggestions), `instruction` (project-level AI instructions), `content` (CMS entries). Scores below 0.5 are dropped. Content is truncated at 200 chars in the compact payload.

`kPerKey` (1-20, default 5) caps per-key results. `languages` now also scopes RAG retrieval — language-agnostic entries (instructions, glossary definitions) are always included, language-specific entries match only the requested locales.

Graceful degradation at every step:
- No API key on server → `rules` omitted, hint explains.
- Circuit breaker open (Gemini outage) → `rules` omitted, hint explains.
- Unknown / cross-project UUIDs → silently dropped (security), remaining keys still processed, hint counts the skips.
- No embeddings seeded → `rules: []`, hint suggests running Analyze Website.

The v1 project-wide context (instructions, glossary, tone) always returns, even when RAG fails. Calls that omit `keys` are unchanged.

`mcp-types`: adds `TranslationContextSimilarItem`, `TranslationContextKeyRule`, `CompactTranslationContextSimilarItem`, `CompactTranslationContextKeyRule`; extends response types with the optional `keySpecificRules` / `rules` field; input schema gains `kPerKey`.
