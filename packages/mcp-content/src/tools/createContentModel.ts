/**
 * createContentModel MCP Tool
 *
 * Creates a new content model with optional field definitions.
 */

import { z } from "zod";
import {
  executeTool,
  projectInputProperty,
  projectSchema,
  success,
} from "../base-tool.js";
import type { Tool } from "../types/index.js";

const enumValueItem = z.object({
  label: z.string().min(1).max(200),
  value: z.string().min(1).max(200),
});

const fieldOptionsSchema = z.object({
  enumValues: z.array(enumValueItem).max(200).optional(),
  unsplash: z.object({ enabled: z.boolean() }).optional(),
  aiGeneration: z.object({
    enabled: z.boolean(),
    prompt: z.string().max(2000).optional(),
    model: z.string().max(100).optional(),
  }).optional(),
  showInTable: z.boolean().optional(),
}).optional();

const fieldDefinition = z.object({
  name: z.string().min(1).max(100).regex(/^[a-z_][a-z0-9_]*$/),
  displayName: z.string().min(1).max(200),
  type: z.enum(["text", "textarea", "richtext", "number", "boolean", "date", "datetime", "enum", "media", "relation"]).default("text"),
  localized: z.boolean().default(false),
  required: z.boolean().default(false),
  placeholder: z.string().max(500).optional(),
  helpText: z.string().max(500).optional(),
  position: z.number().int().min(0).optional(),
  options: fieldOptionsSchema,
  fieldConfig: z.object({
    targetModel: z.string().optional(),
  }).optional(),
});

const inputSchema = projectSchema.extend({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  displayName: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  kind: z.enum(["collection", "single"]).default("collection"),
  icon: z.string().max(50).optional(),
  enableVersionHistory: z.boolean().default(true),
  includeBody: z.boolean().default(true),
  fields: z.array(fieldDefinition).default([]),
});

export const createContentModel: Tool = {
  definition: {
    name: "createContentModel",
    description: `Create a new content model with optional field definitions.

⚠️ CHECK FIRST — Before creating a model, call listContentModels to verify the slug doesn't already exist. Creating a duplicate slug fails with an error and wastes a round-trip. If the model already exists, use getContentModel + addField / updateField instead.

MODEL TYPES (kind):
- collection (default): Multiple entries (e.g., blog posts, products).
- single: Single entry only (e.g., homepage hero, site settings).

BODY FIELD (includeBody):
- true (default): Enables rich-text body for long-form content (articles, docs).
- false: Only custom fields — ideal for taxonomy/lookup models (categories, tags, authors).

SLUG: Must be unique within project. Used in API paths. Cannot be changed after creation.

Field types: text, textarea, richtext, number, boolean, date, datetime, enum, media, relation.
- localized=true: Field value stored per-language (requires languageCode on update).
- required=true: Entries cannot be created without this field.

EXAMPLES:
{
  "slug": "blog-posts",
  "displayName": "Blog Posts",
  "kind": "collection",
  "fields": [
    { "name": "author", "displayName": "Author", "type": "relation", "fieldConfig": { "targetModel": "users" } },
    { "name": "category", "displayName": "Category", "type": "relation", "fieldConfig": { "targetModel": "categories" } },
    { "name": "status", "displayName": "Status", "type": "enum", "options": { "enumValues": [{ "label": "Draft", "value": "draft" }, { "label": "Review", "value": "review" }, { "label": "Published", "value": "published" }], "showInTable": true } },
    { "name": "read_time", "displayName": "Read Time", "type": "number" }
  ]
}`,
    inputSchema: {
      type: "object",
      properties: {
        ...projectInputProperty,
        slug: {
          type: "string",
          description: "Model slug (lowercase, hyphens only, e.g., 'blog-posts')",
        },
        displayName: {
          type: "string",
          description: "Human-readable model name",
        },
        description: {
          type: "string",
          description: "Model description",
        },
        kind: {
          type: "string",
          enum: ["collection", "single"],
          description: "Model kind — collection (multiple entries) or single (one entry)",
        },
        icon: {
          type: "string",
          description: "Icon identifier",
        },
        enableVersionHistory: {
          type: "boolean",
          description: "Enable version history tracking (default: true)",
        },
        includeBody: {
          type: "boolean",
          description: "Set false for models without a body/rich-text field (e.g., structured data models with only custom fields). Default: true",
        },
        fields: {
          type: "array",
          description: "Initial field definitions",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Field name (snake_case)" },
              displayName: { type: "string", description: "Display name" },
              type: { type: "string", enum: ["text", "textarea", "richtext", "number", "boolean", "date", "datetime", "enum", "media", "relation"], description: "Field type. For user fields, use 'relation' with fieldConfig.targetModel = 'users'" },
              localized: { type: "boolean", description: "Whether field is localized per language" },
              required: { type: "boolean", description: "Whether field is required" },
              placeholder: { type: "string", description: "Placeholder text" },
              helpText: { type: "string", description: "Help text" },
              options: {
                type: "object",
                description: "Field-level options. For enum fields: { enumValues: [{ label, value }] }",
                properties: {
                  enumValues: {
                    type: "array",
                    description: "Allowed values for enum fields",
                    items: {
                      type: "object",
                      properties: {
                        label: { type: "string", description: "Display label" },
                        value: { type: "string", description: "Stored value" },
                      },
                      required: ["label", "value"],
                    },
                  },
                  showInTable: {
                    type: "boolean",
                    description: "Whether this field appears as a column in the content list table",
                  },
                },
              },
              fieldConfig: {
                type: "object",
                description: "Type-specific configuration (e.g., targetModel for relation fields)",
                properties: {
                  targetModel: { type: "string", description: "Target model slug for relation fields" },
                },
              },
            },
            required: ["name", "displayName"],
          },
        },
      },
      required: ["project", "slug", "displayName"],
    },
  },

  execute: (client, args) =>
    executeTool(args, inputSchema, async (input, { workspaceId, projectSlug }) => {
      const result = await client.mcpContent.createContentModel.mutate({
        orgSlug: workspaceId,
        projectSlug,
        slug: input.slug,
        displayName: input.displayName,
        description: input.description,
        kind: input.kind,
        icon: input.icon,
        enableVersionHistory: input.enableVersionHistory,
        includeBody: input.includeBody,
        fields: input.fields,
      });

      return success({
        created: true,
        model: result,
      });
    }),
};
