#!/usr/bin/env node

/**
 * Shared MCP Server Factory
 *
 * Provides configuration resolution and server creation used by both
 * stdio (index.ts) and HTTP (http.ts) transport entry points.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { createBetterI18nClient } from "./client.js";
import type { ToolDefinition } from "./types/index.js";

// Read tools
import { listContentModels } from "./tools/listContentModels.js";
import { getContentModel } from "./tools/getContentModel.js";
import { listContentEntries } from "./tools/listContentEntries.js";
import { getContentEntry } from "./tools/getContentEntry.js";

// Entry write tools
import { createContentEntry } from "./tools/createContentEntry.js";
import { updateContentEntry } from "./tools/updateContentEntry.js";
import { publishContentEntry } from "./tools/publishContentEntry.js";
import { deleteContentEntry } from "./tools/deleteContentEntry.js";
import { duplicateContentEntry } from "./tools/duplicateContentEntry.js";
import { bulkPublishEntries } from "./tools/bulkPublishEntries.js";

// Model management tools
import { createContentModel } from "./tools/createContentModel.js";
import { updateContentModel } from "./tools/updateContentModel.js";
import { deleteContentModel } from "./tools/deleteContentModel.js";

// Field management tools
import { addField } from "./tools/addField.js";
import { updateField } from "./tools/updateField.js";
import { removeField } from "./tools/removeField.js";
import { reorderFields } from "./tools/reorderFields.js";

export interface ServerConfig {
  apiUrl: string;
  apiKey: string;
  debug: boolean;
  isLocalDev: boolean;
}

/**
 * Resolves configuration from environment variables.
 * Returns null for apiKey if not set (caller decides how to handle).
 */
export function resolveConfig(): Omit<ServerConfig, "apiKey"> & {
  apiKey: string | undefined;
} {
  const scriptPath = process.argv[1] || "";
  const isLocalDev =
    scriptPath.includes("packages/mcp-content/src") ||
    scriptPath.includes("better-i18n/packages/mcp-content");

  const apiUrl =
    process.env.BETTER_I18N_API_URL ||
    (isLocalDev ? "http://localhost:8787" : "https://dash.better-i18n.com");
  const apiKey = process.env.BETTER_I18N_API_KEY;
  const debug = process.env.BETTER_I18N_DEBUG === "true" || isLocalDev;

  return { apiUrl, apiKey, debug, isLocalDev };
}

/**
 * Creates a fully configured MCP Server with all tool handlers registered.
 * The server is NOT connected to any transport — caller handles that.
 */
export function createConfiguredServer(
  apiClient: ReturnType<typeof createBetterI18nClient>,
): Server {
  const server = new Server(
    {
      name: "better-i18n-content",
      version: "0.0.1",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  // Tool annotations for ChatGPT compatibility (readOnlyHint, openWorldHint, destructiveHint)
  const readOnly = { readOnlyHint: true, openWorldHint: false, destructiveHint: false };
  const write = { readOnlyHint: false, openWorldHint: false, destructiveHint: false };
  const destructive = { readOnlyHint: false, openWorldHint: false, destructiveHint: true };

  const annotate = (def: ToolDefinition, annotations: Record<string, boolean>) => ({
    ...def,
    annotations,
  });

  // All tools in a map for dispatch
  const tools = {
    listContentModels,
    getContentModel,
    listContentEntries,
    getContentEntry,
    createContentEntry,
    updateContentEntry,
    publishContentEntry,
    deleteContentEntry,
    duplicateContentEntry,
    bulkPublishEntries,
    createContentModel,
    updateContentModel,
    deleteContentModel,
    addField,
    updateField,
    removeField,
    reorderFields,
  };

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      // Read
      annotate(listContentModels.definition, readOnly),
      annotate(getContentModel.definition, readOnly),
      annotate(listContentEntries.definition, readOnly),
      annotate(getContentEntry.definition, readOnly),
      // Entry write
      annotate(createContentEntry.definition, write),
      annotate(updateContentEntry.definition, write),
      annotate(publishContentEntry.definition, write),
      annotate(duplicateContentEntry.definition, write),
      annotate(bulkPublishEntries.definition, write),
      // Model management
      annotate(createContentModel.definition, write),
      annotate(updateContentModel.definition, write),
      // Field management
      annotate(addField.definition, write),
      annotate(updateField.definition, write),
      annotate(reorderFields.definition, write),
      // Destructive
      annotate(deleteContentEntry.definition, destructive),
      annotate(deleteContentModel.definition, destructive),
      annotate(removeField.definition, destructive),
    ],
  }));

  // Execute tools
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      const tool = tools[name as keyof typeof tools];
      if (!tool) {
        throw new Error(`Unknown tool: ${name}`);
      }

      return await tool.execute(apiClient, args);
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

export { createBetterI18nClient };
