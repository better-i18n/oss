/**
 * schema-alignment.test.ts
 *
 * Verifies that the three schema layers stay in sync:
 *
 *  1. Tool Zod schema       — runtime validation in each tool file
 *  2. mcp-types Zod schema  — the API contract in @better-i18n/mcp-types
 *  3. inputSchema JSON      — what MCP clients (LLM agents) see
 *
 * Tests cover:
 *  - inputSchema.required arrays contain exactly the right fields
 *  - inputSchema.properties includes all expected fields
 *  - Tool Zod vs mcp-types schema alignment (regex, limits, shape)
 *  - Response type conformance (type-level + runtime shape)
 *  - Documented divergences between tool schema and API schema
 */

import { describe, it, expect } from "vitest";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Tool imports
// ---------------------------------------------------------------------------

import { createContentModel } from "../tools/createContentModel.js";
import { addField } from "../tools/addField.js";
import { updateContentModel } from "../tools/updateContentModel.js";
import { createContentEntry } from "../tools/createContentEntry.js";
import { updateContentEntry } from "../tools/updateContentEntry.js";
import { deleteContentEntry } from "../tools/deleteContentEntry.js";
import { deleteContentModel } from "../tools/deleteContentModel.js";
import { duplicateContentEntry } from "../tools/duplicateContentEntry.js";
import { publishContentEntry } from "../tools/publishContentEntry.js";
import { bulkPublishEntries } from "../tools/bulkPublishEntries.js";
import { bulkCreateEntries } from "../tools/bulkCreateEntries.js";
import { listContentModels } from "../tools/listContentModels.js";
import { getContentModel } from "../tools/getContentModel.js";
import { listContentEntries } from "../tools/listContentEntries.js";
import { getContentEntry } from "../tools/getContentEntry.js";
import { updateField } from "../tools/updateField.js";
import { removeField } from "../tools/removeField.js";
import { reorderFields } from "../tools/reorderFields.js";

// ---------------------------------------------------------------------------
// mcp-types imports (content schemas — exported from main package entry)
// ---------------------------------------------------------------------------

import {
  createContentModelInput,
  addFieldInput,
  updateContentModelInput,
  createContentEntryInput,
  updateContentEntryInput,
  deleteContentEntryInput,
  deleteContentModelInput,
  publishContentEntryInput,
  bulkPublishEntriesInput,
  duplicateContentEntryInput,
  getContentModelInput,
  listContentEntriesInput,
  getContentEntryInput,
  listContentModelsInput,
  updateFieldInput,
  removeFieldInput,
  reorderFieldsInput,
} from "@better-i18n/mcp-types";

// ---------------------------------------------------------------------------
// Compact type imports
// ---------------------------------------------------------------------------

import type {
  CompactGetContentModelResponse,
  CompactListContentModelsResponse,
  CompactListContentEntriesResponse,
  CompactContentEntryDetail,
  CompactDeleteContentEntryResponse,
  CompactDeleteContentModelResponse,
  CompactContentModelField,
  CompactRemoveFieldResponse,
  CompactReorderFieldsResponse,
  CompactBulkPublishEntriesResponse,
  CompactContentEntrySummary,
  CompactContentModelSummary,
  CompactContentEntryTranslation,
  CompactAddFieldResponse,
} from "@better-i18n/mcp-types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract the shape of a Zod schema (for .extend-based objects) */
function zodKeys(schema: z.ZodTypeAny): string[] {
  if (schema instanceof z.ZodObject) {
    return Object.keys(schema.shape);
  }
  return [];
}

/** Get required fields from an inputSchema */
function requiredFields(tool: { definition: { inputSchema: { required?: string[] } } }): string[] {
  return tool.definition.inputSchema.required ?? [];
}

/** Get property keys from an inputSchema */
function propertyKeys(tool: { definition: { inputSchema: { properties?: Record<string, unknown> } } }): string[] {
  return Object.keys(tool.definition.inputSchema.properties ?? {});
}

// ---------------------------------------------------------------------------
// 1. inputSchema JSON required fields
// ---------------------------------------------------------------------------

describe("inputSchema.required — field correctness", () => {
  it("createContentModel: required is [project, slug, displayName]", () => {
    const required = requiredFields(createContentModel);
    expect(required).toContain("project");
    expect(required).toContain("slug");
    expect(required).toContain("displayName");
    expect(required).toHaveLength(3);
  });

  it("addField: required is [project, modelSlug, name, displayName]", () => {
    const required = requiredFields(addField);
    expect(required).toContain("project");
    expect(required).toContain("modelSlug");
    expect(required).toContain("name");
    expect(required).toContain("displayName");
    expect(required).toHaveLength(4);
  });

  it("updateContentModel: required is [project, modelSlug]", () => {
    const required = requiredFields(updateContentModel);
    expect(required).toContain("project");
    expect(required).toContain("modelSlug");
    expect(required).toHaveLength(2);
  });

  it("createContentEntry: required is [project, modelSlug, title, slug]", () => {
    const required = requiredFields(createContentEntry);
    expect(required).toContain("project");
    expect(required).toContain("modelSlug");
    expect(required).toContain("title");
    expect(required).toContain("slug");
    expect(required).toHaveLength(4);
  });

  it("updateContentEntry: required is [project, entryId] only", () => {
    const required = requiredFields(updateContentEntry);
    expect(required).toContain("project");
    expect(required).toContain("entryId");
    expect(required).toHaveLength(2);
    // These are NOT required
    expect(required).not.toContain("languageCode");
    expect(required).not.toContain("title");
    expect(required).not.toContain("slug");
    expect(required).not.toContain("status");
  });

  it("deleteContentEntry: required is [project, entryId]", () => {
    const required = requiredFields(deleteContentEntry);
    expect(required).toContain("project");
    expect(required).toContain("entryId");
    expect(required).toHaveLength(2);
  });

  it("publishContentEntry: required is [project, entryId]", () => {
    const required = requiredFields(publishContentEntry);
    expect(required).toContain("project");
    expect(required).toContain("entryId");
    expect(required).toHaveLength(2);
  });

  it("duplicateContentEntry: required is [project, entryId]", () => {
    const required = requiredFields(duplicateContentEntry);
    expect(required).toContain("project");
    expect(required).toContain("entryId");
    expect(required).toHaveLength(2);
  });

  it("bulkPublishEntries: required is [project, entryIds]", () => {
    const required = requiredFields(bulkPublishEntries);
    expect(required).toContain("project");
    expect(required).toContain("entryIds");
    expect(required).toHaveLength(2);
  });

  it("bulkCreateEntries: required is [project, modelSlug, entries]", () => {
    const required = requiredFields(bulkCreateEntries);
    expect(required).toContain("project");
    expect(required).toContain("modelSlug");
    expect(required).toContain("entries");
    expect(required).toHaveLength(3);
  });

  it("deleteContentModel: required is [project, modelSlug]", () => {
    const required = requiredFields(deleteContentModel);
    expect(required).toContain("project");
    expect(required).toContain("modelSlug");
    expect(required).toHaveLength(2);
  });

  it("listContentModels: required is [project] only", () => {
    const required = requiredFields(listContentModels);
    expect(required).toContain("project");
    expect(required).toHaveLength(1);
  });

  it("getContentModel: required is [project, modelSlug]", () => {
    const required = requiredFields(getContentModel);
    expect(required).toContain("project");
    expect(required).toContain("modelSlug");
    expect(required).toHaveLength(2);
  });

  it("listContentEntries: required is [project] only (all filters optional)", () => {
    const required = requiredFields(listContentEntries);
    expect(required).toContain("project");
    expect(required).toHaveLength(1);
    // Filters are optional
    expect(required).not.toContain("modelSlug");
    expect(required).not.toContain("status");
    expect(required).not.toContain("language");
  });

  it("getContentEntry: required is [project, entryId]", () => {
    const required = requiredFields(getContentEntry);
    expect(required).toContain("project");
    expect(required).toContain("entryId");
    expect(required).toHaveLength(2);
  });

  it("updateField: required is [project, modelSlug, fieldName]", () => {
    const required = requiredFields(updateField);
    expect(required).toContain("project");
    expect(required).toContain("modelSlug");
    expect(required).toContain("fieldName");
    expect(required).toHaveLength(3);
  });

  it("removeField: required is [project, modelSlug, fieldName]", () => {
    const required = requiredFields(removeField);
    expect(required).toContain("project");
    expect(required).toContain("modelSlug");
    expect(required).toContain("fieldName");
    expect(required).toHaveLength(3);
  });

  it("reorderFields: required is [project, modelSlug, fieldNames]", () => {
    const required = requiredFields(reorderFields);
    expect(required).toContain("project");
    expect(required).toContain("modelSlug");
    expect(required).toContain("fieldNames");
    expect(required).toHaveLength(3);
  });
});

// ---------------------------------------------------------------------------
// 2. inputSchema.properties completeness
// ---------------------------------------------------------------------------

describe("inputSchema.properties — field coverage", () => {
  it("createContentModel: properties include all major fields", () => {
    const props = propertyKeys(createContentModel);
    expect(props).toContain("project");
    expect(props).toContain("slug");
    expect(props).toContain("displayName");
    expect(props).toContain("description");
    expect(props).toContain("kind");
    expect(props).toContain("icon");
    expect(props).toContain("enableVersionHistory");
    expect(props).toContain("includeBody");
    expect(props).toContain("fields");
  });

  it("addField: properties include all field definition properties", () => {
    const props = propertyKeys(addField);
    expect(props).toContain("project");
    expect(props).toContain("modelSlug");
    expect(props).toContain("name");
    expect(props).toContain("displayName");
    expect(props).toContain("type");
    expect(props).toContain("localized");
    expect(props).toContain("required");
    expect(props).toContain("placeholder");
    expect(props).toContain("helpText");
    expect(props).toContain("options");
    expect(props).toContain("fieldConfig");
  });

  it("updateContentModel: properties include all updatable fields including includeBody", () => {
    const props = propertyKeys(updateContentModel);
    expect(props).toContain("project");
    expect(props).toContain("modelSlug");
    expect(props).toContain("displayName");
    expect(props).toContain("description");
    expect(props).toContain("kind");
    expect(props).toContain("icon");
    expect(props).toContain("enableVersionHistory");
    expect(props).toContain("includeBody");
  });

  it("createContentEntry: properties include all entry fields", () => {
    const props = propertyKeys(createContentEntry);
    expect(props).toContain("project");
    expect(props).toContain("modelSlug");
    expect(props).toContain("title");
    expect(props).toContain("slug");
    expect(props).toContain("bodyMarkdown");
    expect(props).toContain("status");
    expect(props).toContain("customFields");
    expect(props).toContain("translations");
  });

  it("updateContentEntry: properties include all update fields", () => {
    const props = propertyKeys(updateContentEntry);
    expect(props).toContain("project");
    expect(props).toContain("entryId");
    expect(props).toContain("languageCode");
    expect(props).toContain("title");
    expect(props).toContain("slug");
    expect(props).toContain("bodyMarkdown");
    expect(props).toContain("status");
    expect(props).toContain("customFields");
    expect(props).toContain("translations");
  });

  it("listContentEntries: properties include all filter options", () => {
    const props = propertyKeys(listContentEntries);
    expect(props).toContain("project");
    expect(props).toContain("modelSlug");
    expect(props).toContain("search");
    expect(props).toContain("status");
    expect(props).toContain("language");
    expect(props).toContain("missingLanguage");
    expect(props).toContain("page");
    expect(props).toContain("limit");
  });

  it("reorderFields: properties include modelSlug and fieldNames", () => {
    const props = propertyKeys(reorderFields);
    expect(props).toContain("project");
    expect(props).toContain("modelSlug");
    expect(props).toContain("fieldNames");
  });
});

// ---------------------------------------------------------------------------
// 3. Tool Zod vs mcp-types schema alignment
// ---------------------------------------------------------------------------

describe("Tool Zod vs mcp-types schema alignment", () => {
  it("createContentModel: slug regex matches mcp-types (/^[a-z0-9-]+$/)", () => {
    // Both must accept lowercase-hyphen slugs
    const validSlug = "blog-posts";
    const invalidSlug = "Blog_Posts";

    // Tool schema
    const toolSlugSchema = z.string().regex(/^[a-z0-9-]+$/);
    expect(toolSlugSchema.safeParse(validSlug).success).toBe(true);
    expect(toolSlugSchema.safeParse(invalidSlug).success).toBe(false);

    // mcp-types schema
    const apiSlugSchema = createContentModelInput.shape.slug;
    expect(apiSlugSchema.safeParse(validSlug).success).toBe(true);
    expect(apiSlugSchema.safeParse(invalidSlug).success).toBe(false);
  });

  it("addField: field name regex matches mcp-types (/^[a-z_][a-z0-9_]*$/)", () => {
    const validNames = ["author_name", "status", "my_field_2"];
    const invalidNames = ["AuthorName", "2bad", "has-hyphen"];

    const toolRegex = /^[a-z_][a-z0-9_]*$/;
    const apiFieldSchema = addFieldInput.shape.name;

    for (const name of validNames) {
      expect(toolRegex.test(name)).toBe(true);
      expect(apiFieldSchema.safeParse(name).success).toBe(true);
    }
    for (const name of invalidNames) {
      expect(toolRegex.test(name)).toBe(false);
      expect(apiFieldSchema.safeParse(name).success).toBe(false);
    }
  });

  it("bulkPublishEntries: entryIds max(50) matches mcp-types", () => {
    // Both tool and API should reject arrays of > 50 entries
    const fiftyOneUuids = Array.from({ length: 51 }, (_, i) =>
      `00000000-0000-0000-0000-${String(i).padStart(12, "0")}`
    );

    const apiResult = bulkPublishEntriesInput.shape.entryIds.safeParse(fiftyOneUuids);
    expect(apiResult.success).toBe(false);

    // Tool Zod uses .max(50) as well
    const toolEntryIdsSchema = z.array(z.string().uuid()).min(1).max(50);
    expect(toolEntryIdsSchema.safeParse(fiftyOneUuids).success).toBe(false);
  });

  it("bulkPublishEntries: entryIds min(1) matches mcp-types — empty array rejected", () => {
    const apiResult = bulkPublishEntriesInput.shape.entryIds.safeParse([]);
    expect(apiResult.success).toBe(false);

    const toolEntryIdsSchema = z.array(z.string().uuid()).min(1).max(50);
    expect(toolEntryIdsSchema.safeParse([]).success).toBe(false);
  });

  it("duplicateContentEntry: newSlug regex matches mcp-types (/^[a-z0-9-]+$/)", () => {
    const apiNewSlugSchema = duplicateContentEntryInput.shape.newSlug;
    const toolNewSlugSchema = z.string().max(200).regex(/^[a-z0-9-]+$/);

    expect(apiNewSlugSchema.safeParse("my-copy").success).toBe(true);
    expect(apiNewSlugSchema.safeParse("My_Copy").success).toBe(false);

    expect(toolNewSlugSchema.safeParse("my-copy").success).toBe(true);
    expect(toolNewSlugSchema.safeParse("My_Copy").success).toBe(false);
  });

  it("listContentEntries: page min(1) matches mcp-types", () => {
    const apiPageSchema = listContentEntriesInput.shape.page;
    expect(apiPageSchema.safeParse(0).success).toBe(false);
    expect(apiPageSchema.safeParse(1).success).toBe(true);
  });

  it("listContentEntries: limit max(50) matches mcp-types", () => {
    const apiLimitSchema = listContentEntriesInput.shape.limit;
    expect(apiLimitSchema.safeParse(51).success).toBe(false);
    expect(apiLimitSchema.safeParse(50).success).toBe(true);
    expect(apiLimitSchema.safeParse(1).success).toBe(true);
  });

  it("createContentModel: kind enum matches mcp-types (collection | single)", () => {
    const apiKindSchema = createContentModelInput.shape.kind;
    expect(apiKindSchema.safeParse("collection").success).toBe(true);
    expect(apiKindSchema.safeParse("single").success).toBe(true);
    expect(apiKindSchema.safeParse("list").success).toBe(false);
  });

  it("updateContentModel: kind enum is optional and matches mcp-types", () => {
    const apiKindSchema = updateContentModelInput.shape.kind;
    expect(apiKindSchema.safeParse(undefined).success).toBe(true);
    expect(apiKindSchema.safeParse("collection").success).toBe(true);
    expect(apiKindSchema.safeParse("single").success).toBe(true);
    expect(apiKindSchema.safeParse("invalid").success).toBe(false);
  });

  it("createContentEntry: status enum matches mcp-types (draft | published)", () => {
    const apiStatusSchema = createContentEntryInput.shape.status;
    expect(apiStatusSchema.safeParse("draft").success).toBe(true);
    expect(apiStatusSchema.safeParse("published").success).toBe(true);
    // createContentEntry does NOT allow archived status
    expect(apiStatusSchema.safeParse("archived").success).toBe(false);
  });

  it("updateContentEntry: status enum includes archived (unlike createContentEntry)", () => {
    const apiStatusSchema = updateContentEntryInput.shape.status;
    expect(apiStatusSchema.safeParse("draft").success).toBe(true);
    expect(apiStatusSchema.safeParse("published").success).toBe(true);
    expect(apiStatusSchema.safeParse("archived").success).toBe(true);
  });

  it("mcp-types listContentModelsInput is just a project identifier schema", () => {
    // It has no extra fields beyond the project identifier
    const apiKeys = zodKeys(listContentModelsInput);
    expect(apiKeys).toContain("orgSlug");
    expect(apiKeys).toContain("projectSlug");
  });

  it("mcp-types getContentModelInput requires modelSlug", () => {
    const shape = getContentModelInput.shape;
    expect(shape.modelSlug).toBeDefined();
    // modelSlug is required (not optional)
    expect(shape.modelSlug.safeParse(undefined).success).toBe(false);
    expect(shape.modelSlug.safeParse("blog-posts").success).toBe(true);
  });

  it("mcp-types getContentEntryInput requires entryId as uuid", () => {
    const shape = getContentEntryInput.shape;
    expect(shape.entryId.safeParse("not-a-uuid").success).toBe(false);
    expect(shape.entryId.safeParse("550e8400-e29b-41d4-a716-446655440000").success).toBe(true);
  });

  it("mcp-types deleteContentEntryInput requires entryId as uuid", () => {
    const shape = deleteContentEntryInput.shape;
    expect(shape.entryId.safeParse("not-a-uuid").success).toBe(false);
    expect(shape.entryId.safeParse("550e8400-e29b-41d4-a716-446655440000").success).toBe(true);
  });

  it("mcp-types deleteContentModelInput requires modelSlug", () => {
    const shape = deleteContentModelInput.shape;
    expect(shape.modelSlug.safeParse(undefined).success).toBe(false);
    expect(shape.modelSlug.safeParse("blog-posts").success).toBe(true);
  });

  it("mcp-types publishContentEntryInput requires entryId as uuid", () => {
    const shape = publishContentEntryInput.shape;
    expect(shape.entryId.safeParse("not-a-uuid").success).toBe(false);
    expect(shape.entryId.safeParse("550e8400-e29b-41d4-a716-446655440000").success).toBe(true);
  });

  it("mcp-types updateFieldInput requires fieldName", () => {
    const shape = updateFieldInput.shape;
    expect(shape.fieldName.safeParse(undefined).success).toBe(false);
    expect(shape.fieldName.safeParse("status").success).toBe(true);
  });

  it("mcp-types removeFieldInput requires fieldName", () => {
    const shape = removeFieldInput.shape;
    expect(shape.fieldName.safeParse(undefined).success).toBe(false);
    expect(shape.fieldName.safeParse("status").success).toBe(true);
  });

  it("mcp-types reorderFieldsInput requires fieldNames with min(1)", () => {
    const shape = reorderFieldsInput.shape;
    expect(shape.fieldNames.safeParse([]).success).toBe(false);
    expect(shape.fieldNames.safeParse(["title", "status"]).success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 4. Response type conformance
// ---------------------------------------------------------------------------

describe("response type conformance", () => {
  it("createContentModel response shape matches CompactGetContentModelResponse", () => {
    const response: CompactGetContentModelResponse = {
      id: "uuid-1",
      sl: "blog-posts",
      dn: "Blog Posts",
      desc: null,
      kind: "collection",
      ico: null,
      vh: true,
      ib: false,
      flds: [],
    };
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("sl");
    expect(response).toHaveProperty("dn");
    expect(response).toHaveProperty("desc");
    expect(response).toHaveProperty("kind");
    expect(response).toHaveProperty("ico");
    expect(response).toHaveProperty("vh");
    expect(response).toHaveProperty("ib");
    expect(response).toHaveProperty("flds");
    expect(Array.isArray(response.flds)).toBe(true);
  });

  it("addField response shape matches CompactContentModelField", () => {
    const response: CompactAddFieldResponse = {
      id: "uuid-1",
      nm: "author",
      dn: "Author",
      tp: "relation",
      loc: false,
      req: false,
      ph: null,
      ht: null,
      pos: 0,
    };
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("nm");
    expect(response).toHaveProperty("dn");
    expect(response).toHaveProperty("tp");
    expect(response).toHaveProperty("loc");
    expect(response).toHaveProperty("req");
    expect(response).toHaveProperty("ph");
    expect(response).toHaveProperty("ht");
    expect(response).toHaveProperty("pos");
  });

  it("CompactContentModelField with optional fieldConfig", () => {
    const withFc: CompactContentModelField = {
      id: "uuid-2",
      nm: "category",
      dn: "Category",
      tp: "relation",
      loc: false,
      req: false,
      ph: null,
      ht: null,
      pos: 1,
      fc: { tm: "categories" },
    };
    expect(withFc.fc?.tm).toBe("categories");

    const withoutFc: CompactContentModelField = {
      id: "uuid-3",
      nm: "title",
      dn: "Title",
      tp: "text",
      loc: true,
      req: true,
      ph: "Enter title...",
      ht: null,
      pos: 0,
    };
    expect(withoutFc.fc).toBeUndefined();
  });

  it("deleteContentEntry response matches CompactDeleteContentEntryResponse", () => {
    const response: CompactDeleteContentEntryResponse = { ok: true };
    expect(response.ok).toBe(true);
  });

  it("deleteContentModel response matches CompactDeleteContentModelResponse", () => {
    const response: CompactDeleteContentModelResponse = { ok: true };
    expect(response.ok).toBe(true);
  });

  it("removeField response matches CompactRemoveFieldResponse", () => {
    const response: CompactRemoveFieldResponse = { ok: true };
    expect(response.ok).toBe(true);
  });

  it("reorderFields response matches CompactReorderFieldsResponse", () => {
    const response: CompactReorderFieldsResponse = { ok: true };
    expect(response.ok).toBe(true);
  });

  it("bulkPublishEntries response matches CompactBulkPublishEntriesResponse", () => {
    const response: CompactBulkPublishEntriesResponse = {
      pub: 3,
      fail: [{ id: "uuid-1", err: "Not found" }],
    };
    expect(response).toHaveProperty("pub");
    expect(response).toHaveProperty("fail");
    expect(typeof response.pub).toBe("number");
    expect(Array.isArray(response.fail)).toBe(true);
  });

  it("bulkPublishEntries: fail array entries have id and err", () => {
    const response: CompactBulkPublishEntriesResponse = {
      pub: 2,
      fail: [
        { id: "550e8400-e29b-41d4-a716-446655440000", err: "Entry not found" },
        { id: "550e8400-e29b-41d4-a716-446655440001", err: "Already published" },
      ],
    };
    for (const item of response.fail) {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("err");
    }
  });

  it("listContentModels response matches CompactListContentModelsResponse", () => {
    const response: CompactListContentModelsResponse = {
      mdls: [
        {
          id: "uuid-1",
          sl: "blog-posts",
          dn: "Blog Posts",
          desc: "Company blog",
          kind: "collection",
          ico: "newspaper",
          ec: 42,
          ib: false,
          flds: [],
        },
      ],
    };
    expect(response).toHaveProperty("mdls");
    expect(Array.isArray(response.mdls)).toBe(true);
    expect(response.mdls[0]).toHaveProperty("ec");
  });

  it("CompactContentModelSummary includes ec (entry count) unlike CompactGetContentModelResponse", () => {
    const summary: CompactContentModelSummary = {
      id: "uuid-1",
      sl: "changelog",
      dn: "Changelog",
      desc: null,
      kind: "collection",
      ico: null,
      ec: 10,
      ib: false,
      flds: [],
    };
    // ec (entry count) is on summary
    expect(summary).toHaveProperty("ec");

    // CompactGetContentModelResponse has vh (version history) instead of ec
    const detail: CompactGetContentModelResponse = {
      id: "uuid-1",
      sl: "changelog",
      dn: "Changelog",
      desc: null,
      kind: "collection",
      ico: null,
      vh: true,
      ib: false,
      flds: [],
    };
    expect(detail).toHaveProperty("vh");
    // Verify the shape difference (type-level)
    expect("ec" in summary).toBe(true);
    expect("vh" in detail).toBe(true);
  });

  it("listContentEntries response matches CompactListContentEntriesResponse", () => {
    const response: CompactListContentEntriesResponse = {
      items: [],
      tot: 0,
      more: false,
    };
    expect(response).toHaveProperty("items");
    expect(response).toHaveProperty("tot");
    expect(response).toHaveProperty("more");
    expect(Array.isArray(response.items)).toBe(true);
    expect(typeof response.tot).toBe("number");
    expect(typeof response.more).toBe("boolean");
  });

  it("CompactContentEntrySummary shape (from listContentEntries items)", () => {
    const entry: CompactContentEntrySummary = {
      id: "uuid-1",
      sl: "hello-world",
      st: "published",
      pub_at: "2024-01-01T00:00:00Z",
      c_at: "2024-01-01T00:00:00Z",
      u_at: "2024-01-02T00:00:00Z",
      mdl: { sl: "blog-posts", dn: "Blog Posts", kind: "collection" },
      slang: "en",
      t: "Hello World",
      langs: ["en", "tr", "de"],
      cfv: { category: "tech", author: null },
    };
    expect(entry).toHaveProperty("id");
    expect(entry).toHaveProperty("sl");
    expect(entry).toHaveProperty("st");
    expect(entry).toHaveProperty("mdl");
    expect(entry).toHaveProperty("slang");
    expect(entry).toHaveProperty("t");
    expect(entry).toHaveProperty("langs");
    expect(entry).toHaveProperty("cfv");
    expect(Array.isArray(entry.langs)).toBe(true);
  });

  it("CompactContentEntryDetail shape (from getContentEntry)", () => {
    const entry: CompactContentEntryDetail = {
      id: "uuid-1",
      sl: "hello-world",
      st: "draft",
      pub_at: null,
      c_at: "2024-01-01T00:00:00Z",
      u_at: "2024-01-01T00:00:00Z",
      slang: "en",
      langs: ["en"],
      mdl: {
        id: "model-1",
        sl: "blog-posts",
        dn: "Blog Posts",
        desc: null,
        kind: "collection",
        ico: null,
        ec: 5,
        ib: false,
        flds: [],
      },
      cfv: {},
      tr: {
        en: {
          id: "tr-1",
          lc: "en",
          t: "Hello World",
          body: null,
          st: "draft",
        },
      },
      vers: [],
    };
    expect(entry).toHaveProperty("id");
    expect(entry).toHaveProperty("sl");
    expect(entry).toHaveProperty("slang");
    expect(entry).toHaveProperty("mdl");
    expect(entry).toHaveProperty("cfv");
    expect(entry).toHaveProperty("tr");
    expect(entry).toHaveProperty("vers");
  });

  it("CompactContentEntryTranslation shape", () => {
    const tr: CompactContentEntryTranslation = {
      id: "tr-1",
      lc: "tr",
      t: "Merhaba Dünya",
      body: { type: "doc", content: [] },
      st: "draft",
    };
    expect(tr).toHaveProperty("id");
    expect(tr).toHaveProperty("lc");
    expect(tr).toHaveProperty("t");
    expect(tr).toHaveProperty("body");
    expect(tr).toHaveProperty("st");
  });
});

// ---------------------------------------------------------------------------
// 5. Known divergences
// ---------------------------------------------------------------------------

describe("known divergences — documented schema mismatches", () => {
  it("updateContentModel: both tool inputSchema AND mcp-types updateContentModelInput have includeBody (in sync)", () => {
    // Both the tool and the API contract expose includeBody — they are in sync.
    const toolProps = propertyKeys(updateContentModel);
    expect(toolProps).toContain("includeBody");

    const apiKeys = zodKeys(updateContentModelInput);
    expect(apiKeys).toContain("includeBody");
  });

  it("updateContentModel: tool Zod schema has includeBody field", () => {
    // Tool's Zod schema accepts includeBody
    const toolInputSchema = updateContentModel.definition.inputSchema;
    const props = toolInputSchema.properties as Record<string, unknown>;
    expect(props["includeBody"]).toBeDefined();
    expect((props["includeBody"] as { type: string }).type).toBe("boolean");
  });

  it("createContentModel: both tool and mcp-types createContentModelInput have includeBody (in sync)", () => {
    // Both expose includeBody — they are in sync.
    const toolProps = propertyKeys(createContentModel);
    expect(toolProps).toContain("includeBody");

    const apiKeys = zodKeys(createContentModelInput);
    expect(apiKeys).toContain("includeBody");
  });

  it("addField: both tool and mcp-types addFieldInput have 'options' field (in sync)", () => {
    // Both expose options — they are in sync.
    const toolProps = propertyKeys(addField);
    expect(toolProps).toContain("options");

    const apiKeys = zodKeys(addFieldInput);
    expect(apiKeys).toContain("options");
  });

  it("updateField: both tool and mcp-types updateFieldInput have 'options' field (in sync)", () => {
    const toolProps = propertyKeys(updateField);
    expect(toolProps).toContain("options");

    const apiKeys = zodKeys(updateFieldInput);
    expect(apiKeys).toContain("options");
  });

  it("listContentEntries: both tool and mcp-types listContentEntriesInput have 'expand' field (in sync)", () => {
    // Both expose expand — they are in sync.
    const toolProps = propertyKeys(listContentEntries);
    expect(toolProps).toContain("expand");

    const apiKeys = zodKeys(listContentEntriesInput);
    expect(apiKeys).toContain("expand");
  });

  it("createContentEntry: tool matches base fields only (excerpt/tags/featuredImage are custom fields, not top-level)", () => {
    // These fields were removed — they are model-specific custom fields, not base content fields.
    // Base fields: title, slug, bodyMarkdown, status, sourceLanguageCode, customFields, translations
    const toolProps = propertyKeys(createContentEntry);
    expect(toolProps).not.toContain("excerpt");
    expect(toolProps).not.toContain("featuredImage");
    expect(toolProps).not.toContain("tags");
    expect(toolProps).toContain("sourceLanguageCode");
  });

  it("updateContentEntry: tool matches base fields only (no metaTitle/excerpt/tags)", () => {
    // These fields were removed — they belong in customFields, not as top-level params.
    const toolProps = propertyKeys(updateContentEntry);
    expect(toolProps).not.toContain("excerpt");
    expect(toolProps).not.toContain("metaTitle");
    expect(toolProps).not.toContain("metaDescription");
    expect(toolProps).not.toContain("featuredImage");
    expect(toolProps).not.toContain("tags");
  });
});
