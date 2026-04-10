/**
 * createKeys MCP Tool
 *
 * Creates one or more translation keys with source text and optional translations.
 * Uses compact schema matching the API: k=[{n, ns, v, t, nc}].
 */

import { z } from "zod";
import {
  executeTool,
  projectInputProperty,
  projectSchema,
  success,
} from "../base-tool.js";
import type { Tool } from "../types/index.js";

const namespaceContextSchema = z.object({
  description: z.string().optional(),
  team: z.string().optional(),
  domain: z.string().optional(),
  aiPrompt: z.string().optional(),
  tags: z.array(z.string()).optional(),
}).optional();

const inputSchema = projectSchema.extend({
  k: z.array(
    z.object({
      n: z.string().describe("Key name (e.g., 'submit_button', 'nav.home')"),
      ns: z.string().default("default").describe("Namespace (default: 'default')"),
      v: z.string().optional().describe("Source language text"),
      t: z.record(z.string(), z.string()).optional().describe("Target translations as {langCode: text}"),
      nc: namespaceContextSchema,
    }),
  ).min(1),
  force: z.boolean().optional().default(false).describe("Force creation despite path collisions (leaf↔object conflicts). Use with caution."),
});

export const createKeys: Tool = {
  definition: {
    name: "createKeys",
    description: `Create NEW translation keys with source text and optional translations.

REQUIRED WORKFLOW (follow in order):
1. Call getProject FIRST to get the list of existing namespaces and languages.
2. Use the namespace list to set 'ns' correctly for each key.
3. Call createKeys with properly routed keys.
4. Call getPendingChanges to verify, then publishTranslations to deploy.

NAMESPACE RULE (CRITICAL):
- First dot-segment = namespace (ns), remaining segments = key name (n).
- WRONG: { n: "terms.meta.title", ns: "default" } — namespace embedded in key name!
- CORRECT: { n: "meta.title", ns: "terms" }
- An unknown ns value silently creates a NEW namespace — always verify against getProject output.
- Same key name in a different namespace creates a SEPARATE key (not a duplicate).

PATH COLLISION GUARD (CRITICAL):
- In nested JSON, a key cannot be both a leaf value AND a parent object.
- Creating "step.workspace.title" when "step.workspace" exists as a leaf → CONFLICT error.
- Creating "nav" when "nav.home" exists → CONFLICT error.
- Sibling keys are fine: "nav.home" + "nav.settings" = OK.
- Use force=true to override (risky — may cause orphan keys on CDN).
- This also checks within the same batch: sending both "workspace" and "workspace.title" → CONFLICT.

SILENT BEHAVIORS:
- Existing keys (same name + namespace) are silently SKIPPED. Use updateKeys instead.
- Source language translations in 't' are silently DROPPED. Use 'v' for source text.
- If 'n' starts with an existing namespace, server auto-corrects but returns a warning.

Response fields: 'dup' = same-namespace skips, 'warn' = cross-namespace name matches.
To add translations to EXISTING keys, use listKeys + updateKeys instead.`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        k: {
          type: "array",
          description: "Array of keys to create",
          items: {
            type: "object",
            properties: {
              n: { type: "string", description: "Key name (e.g., 'submit_button', 'nav.home')" },
              ns: { type: "string", description: "Namespace (default: 'default'). MUST match existing keys' namespace — wrong namespace creates duplicate keys." },
              v: { type: "string", description: "Source language text" },
              t: { type: "object", description: "Target translations as {langCode: text}" },
              nc: {
                type: "object",
                description: "Optional context for the namespace (description, team, domain, aiPrompt, tags). Applied once per namespace.",
                properties: {
                  description: { type: "string", description: "What this namespace is about" },
                  team: { type: "string", description: "Team owning this namespace" },
                  domain: { type: "string", description: "Business domain (e.g., 'auth', 'billing')" },
                  aiPrompt: { type: "string", description: "Custom AI prompt for translations in this namespace" },
                  tags: { type: "array", items: { type: "string" }, description: "Tags for categorization" },
                },
              },
            },
            required: ["n"],
          },
        },
        force: {
          type: "boolean",
          description: "Force creation despite path collisions (leaf↔object conflicts). Default: false. Use with caution — may cause orphan keys on CDN.",
        },
      },
      required: ["project", "k"],
    },
  },

  execute: (client, args) =>
    executeTool(
      args,
      inputSchema,
      async (input, { workspaceId, projectSlug }) => {
        // Normalize translation record keys to lowercase
        const k = input.k.map(key => {
          if (!key.t) return key;
          const normalized: Record<string, string> = {};
          for (const [lang, text] of Object.entries(key.t)) {
            normalized[lang.toLowerCase()] = text;
          }
          return { ...key, t: normalized };
        });

        const result = await client.mcp.createKeys.mutate({
          orgSlug: workspaceId,
          projectSlug,
          k,
          ...(input.force && { force: true }),
        });

        return success(result);
      },
    ),
};
