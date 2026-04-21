/**
 * getProject MCP Tool
 *
 * Gets project information including namespaces, languages, key count, and coverage stats.
 */

import {
  executeTool,
  projectInputProperty,
  projectSchema,
  success,
} from "../base-tool.js";
import type { Tool } from "../types/index.js";

const inputSchema = projectSchema;

export const getProject: Tool = {
  definition: {
    name: "getProject",
    description:
      "Get project details including namespaces, languages, key count, and translation coverage. " +
      "CALL THIS BEFORE createKeys — you need the namespace list to route keys correctly. " +
      "Using wrong namespaces silently creates duplicates in the wrong namespace. " +
      "Namespaces include rich metadata: name, keyCount, description, and context (team, domain, aiPrompt, tags). " +
      "Response includes CDN delivery metadata (cdn field): base URL, manifest URL, " +
      "URL pattern, example URLs, fileStructure (fs), and keyFormat (kf). " +
      'cdn.fs="single_file" → all keys in /{locale}/translations.json. ' +
      'cdn.fs="namespaced_folders" → one file per namespace at /{locale}/{namespace}.json. ' +
      'cdn.kf="flat" → dot-notation keys. cdn.kf="nested" → nested objects. ' +
      'IMPORTANT: "default" namespace maps to "translations" in CDN paths.',
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
      },
      required: ["project"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcp.getProject.query({
        orgSlug: workspaceId,
        projectSlug,
      });
      return success(result);
    }),
};
