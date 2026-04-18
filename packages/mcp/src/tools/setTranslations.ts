/**
 * setTranslations MCP Tool
 *
 * Narrow-purpose write: upsert TARGET translations for existing keys in bulk,
 * with a minimal payload shape optimized for AI agents that translate many
 * keys into many languages in one shot.
 *
 * Shape: t=[{ id, t: { langCode: text, ... } }] — key-grouped, not flat.
 *
 * Use this INSTEAD of updateKeys when:
 *   - You have UUIDs (from listKeys / getTranslations) for existing keys
 *   - You want to write translations for several languages per key
 *   - You don't need to edit source text or change status
 *
 * Use updateKeys (NOT this) when:
 *   - Editing source-language text (s=true)
 *   - Changing translation status (st)
 *
 * Use createKeys (NOT this) when:
 *   - The key does not yet exist
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
  t: z
    .array(
      z.object({
        id: z
          .string()
          .uuid()
          .describe(
            "Translation key UUID — get from listKeys or getAllTranslations id field.",
          ),
        t: z
          .record(z.string(), z.string())
          .describe(
            "Map of { languageCode: translationText }. Target languages only. Language codes are lowercased server-side (BCP 47: 'zh-Hans' becomes 'zh-hans').",
          ),
      }),
    )
    .min(1)
    .max(500),
});

export const setTranslations: Tool = {
  definition: {
    name: "setTranslations",
    description: `Upsert target translations for existing keys in bulk. Minimal payload — use this for AI translation batches.

INPUT SHAPE (≈55-65% smaller than updateKeys for N-language batches):
  { t: [
    { id: "<uuid>", t: { tr: "Modüllerim", de: "Meine Module", fr: "Mes modules" } },
    { id: "<uuid>", t: { tr: "Başlık", de: "Titel" } }
  ]}

WORKFLOW:
1. listKeys({ missingLanguage: 'tr', fields: ['id'] }) → get UUIDs needing translation
2. (AI generates translations for multiple languages per key)
3. setTranslations({ t: [{ id: '<uuid>', t: { tr: '...', de: '...' } }, ...] })
4. getPendingChanges → publishTranslations

SEMANTICS:
- Merge at language level: unlisted languages are untouched.
- Upsert at value level: insert if missing, overwrite if present.
- All writes land at status='approved'.
- Source language entries in the map are silently IGNORED — use updateKeys
  with s=true to edit source text.
- Unknown UUIDs are returned in errors[], NEVER silent-created.
- Max 500 keys per call.

WHEN TO USE WHICH TOOL:
- Translate N keys into M languages in bulk → setTranslations (this one)
- Edit source text / change status             → updateKeys
- Create new keys                              → createKeys

CHARACTER ENCODING: UTF-8 — send non-ASCII (ö, ş, 中, é, ñ, etc.) as-is,
never transliterate to ASCII. See server instructions for details.`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        t: {
          type: "array",
          description:
            "Array of per-key translation batches. Each item: { id: UUID, t: { languageCode: text } }. Max 500 keys per call.",
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description:
                  "Translation key UUID (required). Get from listKeys or getAllTranslations id field.",
              },
              t: {
                type: "object",
                description:
                  "Map of { languageCode: translationText }, e.g. { tr: \"Modüllerim\", de: \"Meine Module\" }. Target languages only. UTF-8 — send non-ASCII as-is, never transliterate to ASCII.",
              },
            },
            required: ["id", "t"],
          },
        },
      },
      required: ["project", "t"],
    },
  },

  execute: (client, args) =>
    executeTool(
      args,
      inputSchema,
      async (input, { workspaceId, projectSlug }) => {
        // Normalize language codes to lowercase (matches CDN + platform convention)
        const t = input.t.map((item) => {
          const normalized: Record<string, string> = {};
          for (const [lang, text] of Object.entries(item.t)) {
            normalized[lang.toLowerCase()] = text;
          }
          return { id: item.id, t: normalized };
        });

        const result = await client.mcp.setTranslations.mutate({
          orgSlug: workspaceId,
          projectSlug,
          t,
        });

        return success(result);
      },
    ),
};
