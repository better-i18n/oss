/**
 * addLanguage MCP Tool
 *
 * Adds a new target language to the project.
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
  languageCode: z.string().min(2).max(5),
});

export const addLanguage: Tool = {
  definition: {
    name: "addLanguage",
    description:
      "Add a new target language to the project. Use ISO 639-1 codes (e.g. 'fr', 'ja', 'de', 'es').",
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        languageCode: { type: "string" },
      },
      required: ["project", "languageCode"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcp.addLanguage.mutate({
        orgSlug: workspaceId,
        projectSlug,
        languageCode: input.languageCode,
      });

      return success({
        success: result.success,
        message: result.message,
        languageCode: input.languageCode,
        project: input.project,
        alreadyExists: result.alreadyExists,
      });
    }),
};
