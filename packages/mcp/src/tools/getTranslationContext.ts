/**
 * getTranslationContext MCP Tool
 *
 * Returns the translation-relevant project context — brand voice, glossary
 * (with locked translations), tone preferences, and the owner-configured
 * system prompt — so external AI agents translate with the same guidance
 * the in-platform AI drawer uses.
 *
 * Call this ONCE at the start of a translation session and reuse the
 * response. It is a read-only, project-scoped query; don't repeat it per key.
 *
 * v2 roadmap: passing `keys: string[]` will trigger pgvector top-K retrieval
 * server-side and add key-specific rules to the response. v1 accepts the
 * parameter and ignores it so integrations can wire it today without a
 * breaking change later.
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
    .optional()
    .describe(
      "Reserved for v2 (RAG top-K retrieval). v1 ignores this field.",
    ),
  languages: z
    .array(z.string())
    .optional()
    .describe(
      "Optional BCP 47 language codes. Narrows glossary customTranslation entries to these languages.",
    ),
});

export const getTranslationContext: Tool = {
  definition: {
    name: "getTranslationContext",
    description: `Fetch the translation-relevant project context for a Better i18n project — the same brand voice, glossary, and instructions the platform's own AI drawer uses. Call ONCE per translation session and inject into your system prompt.

WHAT YOU GET:
- inst — owner-configured system prompt (treat as high-priority).
- ctx — brand voice, tone (formality / emotionalTone / technicalLevel / pacing / voiceCharacteristics), product description, target audience.
- gl — up to 30 approved glossary terms, each with:
    • tp: brand | product | technical | terminology
    • d: short definition
    • mnt: true ⇒ NEVER translate this term (brand names, product names)
    • tr: { [langCode]: lockedTranslation } — human-approved, prefer over free translation
- src / tgt — source language + active target languages (BCP 47, lowercase).
- hint — guidance when the project has no configured context yet.

HOW TO USE:
1. Call getTranslationContext({ project }) at the start of the session.
2. Inject inst + ctx.tone into your system prompt.
3. Treat gl[].mnt === true as a HARD rule — never translate those terms.
4. For glossary terms with gl[].tr[lang] present, use that locked translation instead of free translation.
5. Cache the response in-process — it rarely changes within a session.

PERFORMANCE:
- Single DB hit. Safe to call once per session; do NOT call per key.
- Glossary descriptions are truncated at ~120 chars for token efficiency.

ROADMAP (v2):
- Passing \`keys\` (UUIDs from listKeys) will trigger pgvector RAG retrieval and add key-specific rules. v1 accepts and ignores the field for forward compatibility.`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        keys: {
          type: "array",
          description:
            "Reserved for v2 — v1 ignores. In v2, pass key UUIDs from listKeys for RAG top-K retrieval.",
          items: { type: "string" },
        },
        languages: {
          type: "array",
          description:
            "Optional list of BCP 47 language codes. Narrows glossary customTranslation entries to these languages.",
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
          ...(input.languages ? { languages: input.languages } : {}),
        });
        return success(result);
      },
    ),
};
