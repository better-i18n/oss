#!/usr/bin/env node

/**
 * Better i18n MCP Server
 *
 * Model Context Protocol server for Better i18n translation management.
 * Enables AI assistants (Claude, ChatGPT, etc.) to manage translations
 * directly from IDEs like Cursor.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { createBetterI18nClient } from "./client.js";
import { addLanguage } from "./tools/addLanguage.js";
import { createKeys } from "./tools/createKeys.js";
import { deleteKeys } from "./tools/deleteKeys.js";
import { getPendingChanges } from "./tools/getPendingChanges.js";
import { getProject } from "./tools/getProject.js";
import { getSync } from "./tools/getSync.js";
import { getSyncs } from "./tools/getSyncs.js";
import { listKeys } from "./tools/listKeys.js";
import { listProjects } from "./tools/listProjects.js";
import { publish } from "./tools/publish.js";
import { updateKeys } from "./tools/updateKeys.js";

class BetterI18nServer {
  private server: Server;
  private apiClient: ReturnType<typeof createBetterI18nClient> | null;

  constructor() {
    this.server = new Server(
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

    this.apiClient = null;
  }

  async init() {
    // Auto-detect if running from source (local dev) vs npm package (production)
    const scriptPath = process.argv[1] || "";
    const isLocalDev =
      scriptPath.includes("packages/mcp/src") ||
      scriptPath.includes("better-i18n/packages/mcp");

    // Read configuration from environment
    const apiUrl =
      process.env.BETTER_I18N_API_URL ||
      (isLocalDev ? "http://localhost:8787" : "https://dash.better-i18n.com");
    const apiKey = process.env.BETTER_I18N_API_KEY;
    const debug = process.env.BETTER_I18N_DEBUG === "true" || isLocalDev;

    console.error(
      `[better-i18n] Mode: ${isLocalDev ? "LOCAL DEV" : "PRODUCTION"}`,
    );
    console.error(`[better-i18n] API URL: ${apiUrl}`);

    if (!apiKey) {
      console.error(
        "[better-i18n] ERROR: BETTER_I18N_API_KEY environment variable is required",
      );
      console.error(
        "[better-i18n] Get your API key from: https://dash.better-i18n.com/settings/api-keys",
      );
      process.exit(1);
    }

    // Create Better i18n API client
    this.apiClient = createBetterI18nClient({ apiUrl, apiKey, debug });

    this.setupHandlers();
    console.error("[better-i18n] MCP Server ready");
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        listProjects.definition,
        getProject.definition,
        addLanguage.definition,
        listKeys.definition,
        createKeys.definition,
        updateKeys.definition,
        deleteKeys.definition,
        getPendingChanges.definition,
        publish.definition,
        getSyncs.definition,
        getSync.definition,
      ],
    }));

    // Execute tools
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (!this.apiClient) {
        throw new Error("API client not initialized. Call init() first.");
      }

      const client = this.apiClient;

      try {
        let result;

        switch (name) {
          case "listProjects":
            result = await listProjects.execute(client, args);
            break;
          case "getProject":
            result = await getProject.execute(client, args);
            break;
          case "addLanguage":
            result = await addLanguage.execute(client, args);
            break;
          case "listKeys":
            result = await listKeys.execute(client, args);
            break;
          case "createKeys":
            result = await createKeys.execute(client, args);
            break;
          case "updateKeys":
            result = await updateKeys.execute(client, args);
            break;
          case "deleteKeys":
            result = await deleteKeys.execute(client, args);
            break;
          case "getSyncs":
            result = await getSyncs.execute(client, args);
            break;
          case "getPendingChanges":
            result = await getPendingChanges.execute(client, args);
            break;
          case "publish":
            result = await publish.execute(client, args);
            break;
          case "getSync":
            result = await getSync.execute(client, args);
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
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("[better-i18n] MCP Server running on stdio");
  }
}

// Start the server
const server = new BetterI18nServer();
server
  .init()
  .then(() => server.run())
  .catch((error) => {
    console.error("[better-i18n] Fatal error:", error);
    process.exit(1);
  });
