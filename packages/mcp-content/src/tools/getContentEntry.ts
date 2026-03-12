/**
 * getContentEntry MCP Tool
 *
 * Gets a single content entry with all translations, custom field values,
 * and version history. Use this to read content for translation or editing.
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
  entryId: z.string().uuid(),
  expand: z.array(z.string()).optional(),
  compact: z.boolean().optional().default(false),
});

export const getContentEntry: Tool = {
  definition: {
    name: "getContentEntry",
    description: `Get a content entry with all translations, custom field values, and version history. Use this to read full content for translation or editing.

Response fields:
- slang: entry's source language code
- cfv: custom field values (non-localized + source language for localized)
- tr.{lang}.cfv: per-language custom field values for localized fields (returned within each translation)
- rels: expanded relation data (only when expand is provided; ignored when compact=true)

RESPONSE MODES:
- compact: When true, omits translations (tr) and version history (vers). Returns only metadata and available language list. expand is ignored. ~70% token reduction. Use when you only need to check entry status or available languages.`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        entryId: {
          type: "string",
          description: "Content entry UUID",
        },
        expand: {
          type: "array",
          items: { type: "string" },
          description: "Relation field names to expand with referenced entry data (e.g., [\"author\", \"category\"]). Ignored when compact=true.",
        },
        compact: {
          type: "boolean",
          description: "When true, omits translations and version history. Returns metadata + available language list only. expand is ignored. ~70% token reduction.",
        },
      },
      required: ["project", "entryId"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.getContentEntry.query({
        orgSlug: workspaceId,
        projectSlug,
        entryId: input.entryId,
        expand: input.expand,
        compact: input.compact,
      });
      return success(result);
    }),
};
