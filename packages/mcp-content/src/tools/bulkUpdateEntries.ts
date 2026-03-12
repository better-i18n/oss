/**
 * bulkUpdateEntries MCP Tool
 *
 * Update multiple content entries in a single call.
 * Ideal for batch-translating entries returned by listContentEntries({ missingLanguage: "X" }).
 * Partial success possible — response reports updated count and failures.
 */

import { z } from "zod";
import {
  customFieldsSchema,
  executeTool,
  projectInputProperty,
  projectSchema,
  success,
} from "../base-tool.js";
import type { Tool } from "../types/index.js";

const translationValue = z.object({
  title: z.string().optional(),
  bodyMarkdown: z.string().optional(),
  customFields: customFieldsSchema,
});

const inputSchema = projectSchema.extend({
  entries: z.array(z.object({
    entryId: z.string().uuid(),
    languageCode: z.string().optional(),
    title: z.string().optional(),
    slug: z.string().optional(),
    bodyMarkdown: z.string().optional(),
    customFields: customFieldsSchema,
    translations: z.record(z.string(), translationValue).optional(),
    status: z.enum(["draft", "published", "archived"]).optional(),
  })).min(1).max(20),
});

export const bulkUpdateEntries: Tool = {
  definition: {
    name: "bulkUpdateEntries",
    description: `Update multiple content entries in a single call (max 20).
Ideal workflow: listContentEntries({ missingLanguage: "tr" }) → bulkUpdateEntries to batch-translate missing entries.

Each entry supports the same modes as updateContentEntry:
- Single-language: provide languageCode + title/bodyMarkdown/customFields
- Multi-language: provide translations map — { langCode: { title, bodyMarkdown, customFields } }
- Both modes can be combined per entry

status field: "draft" saves without publishing (default: published when omitted).

Partial success is possible — check the failed array in the response.

EXAMPLE (batch-translate to Turkish):
{
  "entries": [
    {
      "entryId": "uuid-1",
      "languageCode": "tr",
      "title": "Merhaba Dünya",
      "bodyMarkdown": "# İçerik"
    },
    {
      "entryId": "uuid-2",
      "translations": {
        "tr": { "title": "İkinci Makale" },
        "de": { "title": "Zweiter Artikel" }
      }
    }
  ]
}`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        entries: {
          type: "array",
          description: "Entries to update (max 20)",
          items: {
            type: "object",
            properties: {
              entryId: { type: "string", description: "Content entry UUID" },
              languageCode: { type: "string", description: "Single-language mode: language to update" },
              title: { type: "string", description: "Updated title" },
              slug: { type: "string", description: "Updated URL slug" },
              bodyMarkdown: { type: "string", description: "Updated content body in Markdown" },
              customFields: { type: "object", description: "Updated custom field values as { fieldName: value }" },
              translations: { type: "object", description: "Multi-language translations — { langCode: { title, bodyMarkdown, customFields } }" },
              status: { type: "string", enum: ["draft", "published", "archived"], description: "Updated entry status" },
            },
            required: ["entryId"],
          },
        },
      },
      required: ["project", "entries"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      // Normalize language codes to lowercase for each entry
      const entries = input.entries.map(entry => {
        const normalizedTranslations = entry.translations
          ? Object.fromEntries(
              Object.entries(entry.translations).map(([lang, value]) => [lang.toLowerCase(), value]),
            )
          : undefined;

        return {
          ...entry,
          languageCode: entry.languageCode?.toLowerCase(),
          translations: normalizedTranslations,
        };
      });

      const result = await client.mcpContent.bulkUpdateEntries.mutate({
        orgSlug: workspaceId,
        projectSlug,
        entries,
      } as Parameters<typeof client.mcpContent.bulkUpdateEntries.mutate>[0]);

      return success(result);
    }),
};
