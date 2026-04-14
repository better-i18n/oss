/**
 * listProjects MCP Tool
 *
 * Lists all projects the user has access to across all organizations.
 */

import { executeSimpleTool, success } from "../base-tool.js";
import type { Tool } from "../types/index.js";
import { z } from "zod";

const inputSchema = z.object({});

export const listProjects: Tool = {
  definition: {
    name: "listProjects",
    description:
      "List all projects you have access to. Call this first to discover available projects before using other tools. " +
      "Response: { cdnBaseUrl, projects[] }. Build CDN URLs as `${cdnBaseUrl}/${slug}/${locale}/${ns}.json`. " +
      "Per-project fileStructure and keyFormat control CDN layout and JSON shape: " +
      'fileStructure="single_file" → one file per language, use "translations" as ns literal (/en/translations.json). ' +
      'fileStructure="namespaced_folders" → one file per namespace (/en/common.json, /en/auth.json). ' +
      'keyFormat="flat" → dot-notation string keys. keyFormat="nested" → tree-shaped objects (parent paths become objects, not leaf strings).',
    inputSchema: {
      type: "object",
      properties: {},
    },
  },

  execute: (client, args) =>
    executeSimpleTool(args, inputSchema, async () => {
      const result = await client.mcp.listProjects.query();
      return success(result);
    }),
};
