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
import { addLanguage } from "./tools/addLanguage.js";
import { createKeys } from "./tools/createKeys.js";
import { deleteKeys } from "./tools/deleteKeys.js";
import { getPendingChanges } from "./tools/getPendingChanges.js";
import { getProject } from "./tools/getProject.js";
import { getSync } from "./tools/getSync.js";
import { getSyncs } from "./tools/getSyncs.js";
import { getTranslations } from "./tools/getTranslations.js";
import { listKeys } from "./tools/listKeys.js";
import { listProjects } from "./tools/listProjects.js";
import { publishTranslations } from "./tools/publishTranslations.js";
import { updateKeys } from "./tools/updateKeys.js";

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
    scriptPath.includes("packages/mcp/src") ||
    scriptPath.includes("better-i18n/packages/mcp");

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
      name: "better-i18n",
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
      annotate(listProjects.definition, readOnly),
      annotate(getProject.definition, readOnly),
      annotate(addLanguage.definition, write),
      annotate(listKeys.definition, readOnly),
      annotate(getTranslations.definition, readOnly),
      annotate(createKeys.definition, write),
      annotate(updateKeys.definition, write),
      annotate(deleteKeys.definition, destructive),
      annotate(getPendingChanges.definition, readOnly),
      annotate(publishTranslations.definition, write),
      annotate(getSyncs.definition, readOnly),
      annotate(getSync.definition, readOnly),
    ],
  }));

  // Execute tools
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      let result;

      switch (name) {
        case "listProjects":
          result = await listProjects.execute(apiClient, args);
          break;
        case "getProject":
          result = await getProject.execute(apiClient, args);
          break;
        case "addLanguage":
          result = await addLanguage.execute(apiClient, args);
          break;
        case "listKeys":
          result = await listKeys.execute(apiClient, args);
          break;
        case "getTranslations":
          result = await getTranslations.execute(apiClient, args);
          break;
        case "createKeys":
          result = await createKeys.execute(apiClient, args);
          break;
        case "updateKeys":
          result = await updateKeys.execute(apiClient, args);
          break;
        case "deleteKeys":
          result = await deleteKeys.execute(apiClient, args);
          break;
        case "getSyncs":
          result = await getSyncs.execute(apiClient, args);
          break;
        case "getPendingChanges":
          result = await getPendingChanges.execute(apiClient, args);
          break;
        case "publishTranslations":
          result = await publishTranslations.execute(apiClient, args);
          break;
        case "getSync":
          result = await getSync.execute(apiClient, args);
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
