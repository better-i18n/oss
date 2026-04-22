/**
 * Zod input schemas for Block Catalog MCP tools.
 *
 * Blocks are code-first renderable primitives (hero, feature grid, cover, FAQ, CTA, etc.)
 * defined by the customer's SDK client via `defineBlock()`. These schemas validate the
 * inputs for registering, listing, getting, validating, and deleting blocks.
 *
 * All inputs extend `projectIdentifierSchema` (orgSlug + projectSlug) for tenant scoping.
 *
 * See BETTER-246 (platform) and BETTER-247 (MCP tools).
 */

import { z } from "zod";
import { projectIdentifierSchema } from "./schemas";

// —————————————————————————————————————————————————————————————————————————————
// Shared primitives
// —————————————————————————————————————————————————————————————————————————————

/** Block slug — unique per project. Kebab-case, 2–64 chars. */
const blockSlug = z
  .string()
  .min(2)
  .max(64)
  .regex(/^[a-z][a-z0-9-]*$/, "Slug must be lowercase letters/numbers/hyphens, starting with a letter")
  .describe("Block slug (kebab-case, unique per project). Example: 'cover-gradient'");

/** Raw JSON Schema object — validated at runtime by Ajv against the draft-07 metaschema. */
const jsonSchemaObject = z
  .record(z.string(), z.unknown())
  .describe(
    "JSON Schema (draft-07 or 2020-12) derived from the block's Zod schema. Required. Used to render CMS forms + validate params.",
  );

/** Payload shared by single and bulk register endpoints. */
const blockDefinitionPayload = z.object({
  slug: blockSlug,
  displayName: z.string().min(1).max(120),
  category: z
    .string()
    .max(64)
    .optional()
    .describe("Grouping label for the picker (e.g. 'cover', 'marketing')"),
  description: z
    .string()
    .max(500)
    .optional()
    .describe("Help text shown to editors in the block picker"),
  jsonSchema: jsonSchemaObject,
  previewUrl: z
    .string()
    .url()
    .optional()
    .describe("Static preview PNG/WEBP URL. Customer-hosted; Better only stores the reference."),
  previewOrigin: z
    .string()
    .url()
    .optional()
    .describe(
      "Base URL where the customer serves live previews — CMS iframes this for opt-in live preview.",
    ),
  sourceCommit: z.string().max(64).optional(),
});

// —————————————————————————————————————————————————————————————————————————————
// Tool inputs
// —————————————————————————————————————————————————————————————————————————————

/** `registerBlock` — upsert a single block by (project, slug). */
export const registerBlockInput = projectIdentifierSchema.merge(blockDefinitionPayload);
export type RegisterBlockInput = z.infer<typeof registerBlockInput>;

/** `bulkRegisterBlocks` — register up to 50 blocks atomically in one call. */
export const bulkRegisterBlocksInput = projectIdentifierSchema.extend({
  blocks: z.array(blockDefinitionPayload).min(1).max(50),
});
export type BulkRegisterBlocksInput = z.infer<typeof bulkRegisterBlocksInput>;

/** `listBlocks` — browse the catalog with optional category/search filters. */
export const listBlocksInput = projectIdentifierSchema.extend({
  category: z.string().optional(),
  search: z
    .string()
    .optional()
    .describe("Case-insensitive substring match on slug, displayName, or description"),
});
export type ListBlocksInput = z.infer<typeof listBlocksInput>;

/** `getBlock` — fetch a single block's full detail (including JSON Schema). */
export const getBlockInput = projectIdentifierSchema.extend({
  slug: blockSlug,
});
export type GetBlockInput = z.infer<typeof getBlockInput>;

/**
 * `validateBlockParams` — dry-run validate params against a block's JSON Schema.
 * Used by AI agents before committing entry updates to avoid failed saves.
 */
export const validateBlockParamsInput = projectIdentifierSchema.extend({
  slug: blockSlug,
  params: z.unknown(),
  locale: z.string().min(2).max(10).optional(),
});
export type ValidateBlockParamsInput = z.infer<typeof validateBlockParamsInput>;

/**
 * `deleteBlock` — remove a block from the catalog.
 *
 * Policy controls what happens to existing content entries referencing the block:
 * - `strict` (default): fail if any entry uses it
 * - `warn`: delete + mark affected entries with a warning flag
 * - `orphan`: delete; entries keep raw data but render nothing for this block type
 */
export const deleteBlockInput = projectIdentifierSchema.extend({
  slug: blockSlug,
  policy: z.enum(["strict", "warn", "orphan"]).default("strict"),
});
export type DeleteBlockInput = z.infer<typeof deleteBlockInput>;
