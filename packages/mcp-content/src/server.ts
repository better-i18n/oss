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
import { checkForUpdate } from "./version-check.js";

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
import { bulkCreateEntries } from "./tools/bulkCreateEntries.js";
import { bulkUpdateEntries } from "./tools/bulkUpdateEntries.js";

// Model management tools
import { createContentModel } from "./tools/createContentModel.js";
import { updateContentModel } from "./tools/updateContentModel.js";
import { deleteContentModel } from "./tools/deleteContentModel.js";

// Field management tools
import { addField } from "./tools/addField.js";
import { updateField } from "./tools/updateField.js";
import { removeField } from "./tools/removeField.js";
import { reorderFields } from "./tools/reorderFields.js";

// Block catalog tools (BETTER-246 / BETTER-247)
import { registerBlock } from "./tools/registerBlock.js";
import { bulkRegisterBlocks } from "./tools/bulkRegisterBlocks.js";
import { listBlocks } from "./tools/listBlocks.js";
import { getBlock } from "./tools/getBlock.js";
import { validateBlockParams } from "./tools/validateBlockParams.js";
import { deleteBlock } from "./tools/deleteBlock.js";

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
  options?: { packageName?: string; version?: string },
): Server {
  const packageName = options?.packageName ?? "@better-i18n/mcp-content";
  const version = options?.version ?? "0.0.0";

  const server = new Server(
    {
      name: "better-i18n-content",
      version,
    },
    {
      capabilities: {
        tools: {},
        logging: {},
      },
      instructions: `Better i18n Content MCP — manages multilingual content entries and content models.

## Workflow rules (follow strictly)

### Before creating a model
Always call listContentModels first. If the slug already exists, use getContentModel + addField/updateField instead of createContentModel.

### Creating entries in multiple languages
Include ALL language translations in the INITIAL createContentEntry call via the translations map.
Do NOT create first, then loop updateContentEntry per language — that wastes N extra API calls.

### Updating entries in bulk
If you need to update 2+ entries → use bulkUpdateEntries, not a loop of updateContentEntry calls.
If you need to create 2+ entries → use bulkCreateEntries, not a loop of createContentEntry calls.

### Localized custom fields
Custom fields with localized=true store a separate value per language.
- Setting top-level customFields (metadata-only mode) → updates SOURCE LANGUAGE only
- To update for a specific language → use languageCode or translations.{lang}.customFields

### Slug vs localized slug
- top-level slug: universal CMS identifier, shared across all languages. Do NOT use for per-language URLs.
- per-language URL slugs must be a separate custom field with localized=true (e.g., "localized_slug"), set via translations.{lang}.customFields

### Finding untranslated content
- language="fr"        → entries that ALREADY HAVE French (do not use for finding missing translations)
- missingLanguage="fr" → entries that NEED French (use this when looking for untranslated content)
Never use language= when you want to find content that needs translating — always use missingLanguage=.

### Typical batch-translate workflow
1. listContentEntries({ missingLanguage: "X" })  — find untranslated entries
2. bulkUpdateEntries with translations map        — update all at once (max 200 per call; 'failed' array reports partial fails, retry only those)
3. bulkPublishEntries                             — publish if needed

### Character encoding (UTF-8) — CRITICAL
All string inputs are UTF-8. Send non-ASCII characters in every language (diacritics, CJK, Cyrillic, Arabic, Hebrew, emoji, etc.) exactly as the user wrote them. Do NOT transliterate, strip, or "simplify" them to ASCII — stored values are served verbatim and corrupt end-user content. If your JSON serializer mangles characters, use Unicode escapes (e.g. \u00f6) instead. Lossy encoding is always a client-side bug, never a limitation of this MCP.`,
    },
  );

  // Version check state — cached at initialization, shown once in first tool response
  let updateWarning: string | null = null;
  let updateWarningShown = false;

  server.oninitialized = async () => {
    try {
      const update = await checkForUpdate(packageName, version);
      if (update?.needsUpdate) {
        updateWarning = `⚠️ Update available: ${packageName} ${update.current} → ${update.latest}. Run: npx ${packageName}@latest`;
        server.sendLoggingMessage({
          level: "warning",
          data: updateWarning,
          logger: "better-i18n-content",
        });
        console.error(
          `[better-i18n-content] Update available: ${update.current} → ${update.latest}. Run: npx ${packageName}@latest`,
        );
      }
    } catch {
      // Version check is non-critical — silently ignore
    }
  };

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
    bulkCreateEntries,
    bulkUpdateEntries,
    createContentModel,
    updateContentModel,
    deleteContentModel,
    addField,
    updateField,
    removeField,
    reorderFields,
    // Block catalog
    registerBlock,
    bulkRegisterBlocks,
    listBlocks,
    getBlock,
    validateBlockParams,
    deleteBlock,
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
      annotate(bulkCreateEntries.definition, write),
      annotate(bulkUpdateEntries.definition, write),
      // Model management
      annotate(createContentModel.definition, write),
      annotate(updateContentModel.definition, write),
      // Field management
      annotate(addField.definition, write),
      annotate(updateField.definition, write),
      annotate(reorderFields.definition, write),
      // Block catalog (read)
      annotate(listBlocks.definition, readOnly),
      annotate(getBlock.definition, readOnly),
      annotate(validateBlockParams.definition, readOnly),
      // Block catalog (write)
      annotate(registerBlock.definition, write),
      annotate(bulkRegisterBlocks.definition, write),
      // Destructive
      annotate(deleteContentEntry.definition, destructive),
      annotate(deleteContentModel.definition, destructive),
      annotate(removeField.definition, destructive),
      annotate(deleteBlock.definition, destructive),
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

      const result = await tool.execute(apiClient, args);

      // Inject version update warning into the first successful tool response
      if (updateWarning && !updateWarningShown) {
        updateWarningShown = true;
        const content = Array.isArray(result.content) ? result.content : [];
        return {
          ...result,
          content: [
            ...content,
            { type: "text", text: `\n${updateWarning}` },
          ],
        };
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
