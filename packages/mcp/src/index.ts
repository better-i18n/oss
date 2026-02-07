#!/usr/bin/env node

/**
 * Better i18n MCP Server — stdio transport
 *
 * Model Context Protocol server for Better i18n translation management.
 * Enables AI assistants (Claude, ChatGPT, etc.) to manage translations
 * directly from IDEs like Cursor.
 *
 * For HTTP transport (OpenAI, Codex, Agents SDK), see http.ts.
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  resolveConfig,
  createConfiguredServer,
  createBetterI18nClient,
} from "./server.js";

async function main() {
  const config = resolveConfig();

  console.error(
    `[better-i18n] Mode: ${config.isLocalDev ? "LOCAL DEV" : "PRODUCTION"}`,
  );
  console.error(`[better-i18n] API URL: ${config.apiUrl}`);

  if (!config.apiKey) {
    console.error(
      "[better-i18n] ERROR: BETTER_I18N_API_KEY environment variable is required",
    );
    console.error(
      "[better-i18n] Get your API key from: https://dash.better-i18n.com/settings/api-keys",
    );
    process.exit(1);
  }

  const apiClient = createBetterI18nClient({
    apiUrl: config.apiUrl,
    apiKey: config.apiKey,
    debug: config.debug,
  });

  const server = createConfiguredServer(apiClient);

  console.error("[better-i18n] MCP Server ready");

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[better-i18n] MCP Server running on stdio");
}

main().catch((error) => {
  console.error("[better-i18n] Fatal error:", error);
  process.exit(1);
});
