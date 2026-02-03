import { z } from "zod";
import {
  executeTool,
  projectInputProperty,
  projectSchema,
  success,
} from "../base-tool.js";
import type { Tool } from "../types/index.js";

const inputSchema = projectSchema.extend({
  translations: z
    .array(
      z.object({
        keyId: z.string(),
        languageCode: z.string(),
      })
    )
    .optional(),
});

export const publish: Tool = {
  definition: {
    name: "publish",
    description: `Deploy pending changes to production (CDN or GitHub).

⚠️ PRODUCTION IMPACT - deploys to live systems.
ALWAYS call getPendingChanges first to verify what will be deployed.

If translations array is omitted, ALL pending changes are published.
If translations array is provided, only those specific items are published.

Returns syncJobIds - use getSync(syncId) to verify deployment completed successfully.`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        translations: {
          type: "array",
          description:
            "Specific translations to publish. If omitted, all pending changes are published.",
          items: {
            type: "object",
            properties: {
              keyId: { type: "string", description: "Translation key UUID" },
              languageCode: {
                type: "string",
                description: "Language code (e.g., 'tr')",
              },
            },
            required: ["keyId", "languageCode"],
          },
        },
      },
      required: ["project"],
    },
  },
  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcp.publish.mutate({
        orgSlug: workspaceId,
        projectSlug,
        translations: input.translations,
      });
      return success(result);
    }),
};
