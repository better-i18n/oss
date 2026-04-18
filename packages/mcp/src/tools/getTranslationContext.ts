/**
 * getTranslationContext MCP Tool
 *
 * Returns the translation-relevant project context — brand voice, glossary
 * (with locked translations), tone preferences, and the owner-configured
 * system prompt — so external AI agents translate with the same guidance
 * the in-platform AI drawer uses.
 *
 * v2: passing `keys: string[]` triggers per-key RAG retrieval over pgvector.
 * Each key receives its own top-K similar passages (past approved translations,
 * glossary, preferences, instructions, content) attributed back to its UUID
 * in `rules[]`. Gracefully degrades to the v1 project-wide snapshot when
 * the embedding service is unavailable.
 */

import { z } from "zod";
import {
  executeTool,
  projectInputProperty,
  projectSchema,
  success,
} from "../base-tool.js";
import type { Tool } from "../types/index.js";

const inputSchema = projectSchema.extend({
  keys: z
    .array(z.string().uuid())
    .max(50)
    .optional()
    .describe(
      "Optional — key UUIDs (max 50) for per-key RAG retrieval. Omit for project-wide context only.",
    ),
  kPerKey: z
    .number()
    .int()
    .min(1)
    .max(20)
    .optional()
    .describe(
      "Top-K similar passages per key (1-20, default 5). Only used with `keys`.",
    ),
  languages: z
    .array(z.string())
    .optional()
    .describe(
      "Optional BCP 47 language codes. Narrows glossary customTranslation entries and RAG retrieval to these languages.",
    ),
});

export const getTranslationContext: Tool = {
  definition: {
    name: "getTranslationContext",
    description: `Fetch the translation-relevant project context for a Better i18n project — the same brand voice, glossary, locked translations, and past-decision RAG the platform's own AI drawer uses. Call ONCE per translation session and inject into your system prompt.

WHAT YOU GET (always):
- inst — owner-configured system prompt (treat as high-priority).
- ctx — brand voice, tone (formality / emotionalTone / technicalLevel / pacing / voiceCharacteristics), product description, target audience.
- gl — up to 30 approved glossary terms, each with:
    • tp: brand | product | technical | terminology
    • d: short definition
    • mnt: true ⇒ NEVER translate this term (brand names, product names)
    • tr: { [langCode]: lockedTranslation } — human-approved, prefer over free translation
- src / tgt — source language + active target languages (BCP 47, lowercase).

V2 — PER-KEY RAG RETRIEVAL (optional):
Pass \`keys: string[]\` (UUIDs from listKeys) to get attributed past-decision context for each key in \`rules[]\`. Each rules[i] is:
    { id: "<keyUuid>", k: "<keyName>", sim: [{ tp, c, s, l }, ...] }
- tp: translation | glossary | preference | instruction | content — what the retrieved passage IS
- c: the passage text (truncated at 200 chars)
- s: cosine similarity score in [0, 1] — higher = more relevant
- l: language code (null for language-agnostic entries)

Passages are pgvector-retrieved from this project's embeddings and ranked per-key. Use them for terminology consistency across sessions: if a past translation for a similar key was "Panel" (score 0.91), reuse that term rather than inventing a new one.

HOW TO USE:
1. Call getTranslationContext({ project, keys? }) at the start of the session.
2. Inject inst + ctx.tone into your system prompt.
3. Treat gl[].mnt === true as a HARD rule — never translate those terms.
4. For glossary terms with gl[].tr[lang] present, use that locked translation instead of free translation.
5. For each rules[i], read sim[] — re-use the best-scoring past translations as the source of truth for terminology in that key.
6. Cache the response in-process — it rarely changes within a session.

DEGRADATION:
If the embedding service is unavailable (no API key, circuit breaker open, no embeddings seeded), \`rules\` is omitted and \`hint\` explains. The v1 project-wide context always returns — you are never blocked.

PERFORMANCE:
- Without keys: single DB hit.
- With keys: +1 batched Gemini embed API call + N parallel pgvector searches (LIMIT kPerKey). Budget ~500ms-1s for 10 keys.
- Max 50 keys per call. Do NOT call once per key — batch them.`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        keys: {
          type: "array",
          description:
            "Optional — key UUIDs (max 50) from listKeys for per-key RAG retrieval. Omit for project-wide context only.",
          items: { type: "string" },
        },
        kPerKey: {
          type: "number",
          description:
            "Top-K similar passages per key (1-20, default 5). Only used when `keys` is provided.",
        },
        languages: {
          type: "array",
          description:
            "Optional list of BCP 47 language codes. Narrows glossary customTranslation entries and RAG retrieval to these languages.",
          items: { type: "string" },
        },
      },
      required: ["project"],
    },
  },

  execute: (client, args) =>
    executeTool(
      args,
      inputSchema,
      async (input, { workspaceId, projectSlug }) => {
        const result = await client.mcp.getTranslationContext.query({
          orgSlug: workspaceId,
          projectSlug,
          ...(input.keys ? { keys: input.keys } : {}),
          ...(input.kPerKey !== undefined ? { kPerKey: input.kPerKey } : {}),
          ...(input.languages ? { languages: input.languages } : {}),
        });
        return success(result);
      },
    ),
};
