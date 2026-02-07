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
import { listContentModels } from "./tools/listContentModels.js";
import { getContentModel } from "./tools/getContentModel.js";
import { listContentEntries } from "./tools/listContentEntries.js";
import { getContentEntry } from "./tools/getContentEntry.js";
import { createContentEntry } from "./tools/createContentEntry.js";
import { updateContentEntry } from "./tools/updateContentEntry.js";
import { publishContentEntry } from "./tools/publishContentEntry.js";
import { deleteContentEntry } from "./tools/deleteContentEntry.js";

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

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      annotate(listContentModels.definition, readOnly),
      annotate(getContentModel.definition, readOnly),
      annotate(listContentEntries.definition, readOnly),
      annotate(getContentEntry.definition, readOnly),
      annotate(createContentEntry.definition, write),
      annotate(updateContentEntry.definition, write),
      annotate(publishContentEntry.definition, write),
      annotate(deleteContentEntry.definition, destructive),
    ],
  }));

  // Execute tools
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      let result;

      switch (name) {
        case "listContentModels":
          result = await listContentModels.execute(apiClient, args);
          break;
        case "getContentModel":
          result = await getContentModel.execute(apiClient, args);
          break;
        case "listContentEntries":
          result = await listContentEntries.execute(apiClient, args);
          break;
        case "getContentEntry":
          result = await getContentEntry.execute(apiClient, args);
          break;
        case "createContentEntry":
          result = await createContentEntry.execute(apiClient, args);
          break;
        case "updateContentEntry":
          result = await updateContentEntry.execute(apiClient, args);
          break;
        case "publishContentEntry":
          result = await publishContentEntry.execute(apiClient, args);
          break;
        case "deleteContentEntry":
          result = await deleteContentEntry.execute(apiClient, args);
          break;
        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return result;
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
