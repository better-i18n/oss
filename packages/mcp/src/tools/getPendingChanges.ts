import {
  executeTool,
  projectInputProperty,
  projectSchema,
  success,
} from "../base-tool.js";
import type { Tool } from "../types/index.js";

const inputSchema = projectSchema;

export const getPendingChanges: Tool = {
  definition: {
    name: "getPendingChanges",
    description: `Preview what will be deployed when you call publish. Returns summary of pending translations, deleted keys, and publish destination.

ALWAYS call this before publish to verify changes.

Returns:
- hasPendingChanges: whether there's anything to publish
- summary: { translations, deletedKeys, languageChanges, total }
- byLanguage: breakdown by language with preview samples
- deletedKeys: keys that will be permanently removed
- publishDestination: "github" | "cdn" | "none"
- cannotPublishReason: explains why publishing isn't possible (if applicable)`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
      },
      required: ["project"],
    },
  },
  execute: (client, args) =>
    executeTool(args, inputSchema, async (_input, { workspaceId, projectSlug }) => {
      const result = await client.mcp.getPendingChanges.query({
        orgSlug: workspaceId,
        projectSlug,
      });
      return success(result);
    }),
};
