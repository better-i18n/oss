import { z } from "zod";
import {
  executeTool,
  projectInputProperty,
  projectSchema,
  success,
} from "../base-tool.js";
import type { Tool } from "../types/index.js";

const inputSchema = projectSchema.extend({
  translations: z
    .array(
      z.object({
        keyId: z.string(),
        languageCode: z.string(),
      })
    )
    .optional(),
});

export const publishTranslations: Tool = {
  definition: {
    name: "publishTranslations",
    description: `Deploy pending changes to production (CDN or GitHub).

⚠️ PRODUCTION IMPACT — deploys to live systems.

REQUIRED WORKFLOW (follow in order):
1. Call getPendingChanges FIRST to see what will be deployed.
2. Check 'cannotPublishReason' — if set, publishing is blocked (fix the issue first).
3. Review the changes, then call publishTranslations.
4. Use getSync(syncId) to verify completion.

⚠️ COOLDOWN: 30-second per-project cooldown between publishes. Calling too frequently returns TOO_MANY_REQUESTS error. Wait and retry.

⚠️ PERMANENT DELETION: Soft-deleted keys (from deleteKeys) become permanently deleted after publish. There is NO way to recover them. Verify with getPendingChanges → deletedKeys before publishing.

DEFAULT BEHAVIOR (what you almost always want):
Omit the 'translations' parameter. Everything returned by getPendingChanges
is published in one go. Don't track UUIDs across tool calls — just
getPendingChanges to review, then publishTranslations with no filter.

THE 'translations' FILTER IS A NARROW OPT-IN:
Only use it when you explicitly need to publish a SUBSET of pending
changes (e.g. the user said "publish only the German translations",
or a reviewer wants to ship one language while leaving others in draft).
Passing hundreds of (keyId, languageCode) pairs you just wrote back into
this call is an anti-pattern — bloats payload and adds state-tracking
burden for no benefit over the default.

Returns syncJobIds — use getSync(syncId) to verify deployment completed successfully.`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        translations: {
          type: "array",
          description:
            "Specific translations to publish. If omitted, all pending changes are published.",
          items: {
            type: "object",
            properties: {
              keyId: { type: "string", description: "Translation key UUID" },
              languageCode: {
                type: "string",
                description: "Language code (e.g., 'tr')",
              },
            },
            required: ["keyId", "languageCode"],
          },
        },
      },
      required: ["project"],
    },
  },
  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      // Normalize language codes to lowercase
      const translations = input.translations?.map(t => ({
        ...t,
        languageCode: t.languageCode.toLowerCase(),
      }));

      const result = await client.mcp.publishTranslations.mutate({
        orgSlug: workspaceId,
        projectSlug,
        translations,
      });
      return success(result);
    }),
};
