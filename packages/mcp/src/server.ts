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
import { proposeLanguages } from "./tools/proposeLanguages.js";
import { proposeLanguageEdits } from "./tools/proposeLanguageEdits.js";
import { createKeys } from "./tools/createKeys.js";
import { deleteKeys } from "./tools/deleteKeys.js";
import { getPendingChanges } from "./tools/getPendingChanges.js";
import { getProject } from "./tools/getProject.js";
import { cancelSync } from "./tools/cancelSync.js";
import { getSync } from "./tools/getSync.js";
import { getSyncs } from "./tools/getSyncs.js";
import { getTranslationContext } from "./tools/getTranslationContext.js";
import { getTranslations } from "./tools/getTranslations.js";
import { listKeys } from "./tools/listKeys.js";
import { listProjects } from "./tools/listProjects.js";
import { publishTranslations } from "./tools/publishTranslations.js";
import { setTranslations } from "./tools/setTranslations.js";
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
  options?: { packageName?: string; version?: string },
): Server {
  const packageName = options?.packageName ?? "@better-i18n/mcp";
  const version = options?.version ?? "0.0.0";

  const server = new Server(
    {
      name: "better-i18n",
      version,
    },
    {
      capabilities: {
        tools: {},
        logging: {},
      },
      instructions: `Better i18n MCP — manages translation keys and publishes localized content for the Better i18n platform.

## Character encoding (UTF-8) — CRITICAL

All string inputs are UTF-8. Send non-ASCII characters in every language (diacritics, CJK, Cyrillic, Arabic, Hebrew, emoji, etc.) exactly as the user wrote them. Do NOT transliterate, strip, or "simplify" them to ASCII — stored values are served verbatim through the CDN and corrupt end-user translations. If your JSON serializer mangles characters, use Unicode escapes (e.g. \u00f6) instead. Lossy encoding is always a client-side bug, never a limitation of this MCP.

## Key creation safety

Before calling createKeys, always listKeys first. If the key already exists in any namespace, use updateKeys — not createKeys — to avoid duplicates. (Reference incident: an AI agent once created 1005 phantom keys by calling createKeys with a wrong namespace when updateKeys was the correct tool.)

## Choosing between translation-write tools

Three tools can write translation data. Pick the narrowest one for the task:

- **setTranslations** — FAST PATH for bulk target translations. Shape: t=[{ id, t: { lang: "...", lang: "..." } }]. One entry per KEY, map of languages inside. Use this when an AI has translated N keys into M languages in one shot — roughly 55-65% smaller payload than updateKeys for the same work. Only writes target languages at status="approved". Source-language entries in the map are silently ignored.
- **updateKeys** — Use when editing source text (s=true), changing status (st), or doing single-language edits. Shape: t=[{ id, l, t, s?, st? }], one entry per (key × language).
- **createKeys** — Only when the key does not yet exist.

For translation batches in particular: prefer **setTranslations** over **updateKeys**. Both require UUIDs from listKeys / getAllTranslations.

## Translating with project context

Before translating non-trivial content, call **getTranslationContext({ project })** ONCE and inject the result into your system prompt. You get the owner-configured instructions, brand voice / tone, and the approved glossary — including locked translations and must-not-translate terms. Treat gl[].mnt === true as a hard rule: never translate those terms. When gl[].tr[lang] is present, prefer the locked translation over free translation. Cache the response in-process; it rarely changes within a session.

For a sharper signal, pass **keys: string[]** (UUIDs from listKeys, max 50) alongside the call. You get back rules[] — per-key pgvector RAG retrieval of the most similar past translations, glossary hits, preferences, and instructions for THIS project. Use rules[i].sim[] entries (scored 0-1) as the authoritative source for terminology consistency: if a past translation for a similar key was "Panel" (score 0.91), reuse that term rather than inventing a new one.

## Finding untranslated content

Use getPendingChanges to inspect unpublished edits before calling publishTranslations. Published translations reach the CDN immediately.

## Recovering from a wrong publish

If publishTranslations was called with wrong data, call **cancelSync(syncId)** as early as possible — only jobs still in status="pending" can be cancelled. Once the worker has picked the job up (status="in_progress") or it has reached a terminal state, cancelSync returns can=false and the agent should compensate with a corrective publish instead of trying to abort.`,
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
          logger: "better-i18n",
        });
        console.error(
          `[better-i18n] Update available: ${update.current} → ${update.latest}. Run: npx ${packageName}@latest`,
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

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      annotate(listProjects.definition, readOnly),
      annotate(getProject.definition, readOnly),
      annotate(proposeLanguages.definition, write),
      annotate(proposeLanguageEdits.definition, write),
      annotate(listKeys.definition, readOnly),
      annotate(getTranslations.definition, readOnly),
      annotate(createKeys.definition, write),
      annotate(updateKeys.definition, write),
      annotate(setTranslations.definition, write),
      annotate(deleteKeys.definition, destructive),
      annotate(getPendingChanges.definition, readOnly),
      annotate(publishTranslations.definition, write),
      annotate(getSyncs.definition, readOnly),
      annotate(getSync.definition, readOnly),
      annotate(cancelSync.definition, write),
      annotate(getTranslationContext.definition, readOnly),
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
        case "proposeLanguages":
          result = await proposeLanguages.execute(apiClient, args);
          break;
        case "proposeLanguageEdits":
          result = await proposeLanguageEdits.execute(apiClient, args);
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
        case "setTranslations":
          result = await setTranslations.execute(apiClient, args);
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
        case "cancelSync":
          result = await cancelSync.execute(apiClient, args);
          break;
        case "getTranslationContext":
          result = await getTranslationContext.execute(apiClient, args);
          break;
        default:
          throw new Error(`Unknown tool: ${name}`);
      }

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
