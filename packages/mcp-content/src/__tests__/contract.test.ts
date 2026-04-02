/**
 * contract.test.ts
 *
 * End-to-end contract tests for the MCP Content package.
 *
 * Tests the full chain:
 *   LLM args → Tool Zod validation → Tool normalize → API schema validation
 *
 * Three test suites:
 *   1. Forward contract  — tool output validates against mcp-types API schema
 *   2. Reverse contract  — LLM-plausible args pass through the tool successfully
 *   3. Negative contract — invalid args are rejected by the tool's own Zod schema
 *
 * NOTE on known divergences between tool and mcp-types schemas:
 *  - createContentModelInput has no `includeBody` — tool sends it, API accepts via passthrough/strip
 *  - updateContentModelInput has no `includeBody` — same as above
 *  - addFieldInput / updateFieldInput have no `options` — tool sends it, API accepts via passthrough/strip
 *  - createContentEntry tool has excerpt/featuredImage/tags — not in mcp-types
 *  - updateContentEntry tool has excerpt/metaTitle/metaDescription/featuredImage/tags — not in mcp-types
 *  For forward contract tests on these tools we validate only the common subset.
 */

import { describe, it, expect, vi } from "vitest";
import { createMockClient } from "./fixtures/mock-client.js";

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
import { bulkUpdateEntries } from "../tools/bulkUpdateEntries.js";
import { listContentModels } from "../tools/listContentModels.js";
import { getContentModel } from "../tools/getContentModel.js";
import { listContentEntries } from "../tools/listContentEntries.js";
import { getContentEntry } from "../tools/getContentEntry.js";
import { updateField } from "../tools/updateField.js";
import { removeField } from "../tools/removeField.js";
import { reorderFields } from "../tools/reorderFields.js";

// ---------------------------------------------------------------------------
// mcp-types API schema imports (the real API contract)
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
  bulkUpdateEntriesInput,
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
// Shared test fixtures
// ---------------------------------------------------------------------------

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const VALID_UUID_2 = "550e8400-e29b-41d4-a716-446655440001";
const VALID_UUID_3 = "550e8400-e29b-41d4-a716-446655440002";
const PROJECT = "my-org/my-app";

const MOCK_FIELD = {
  id: "field-uuid-1",
  nm: "status",
  dn: "Status",
  tp: "enum" as const,
  loc: false,
  req: false,
  ph: null,
  ht: null,
  pos: 0,
};

const MOCK_MODEL = {
  id: "model-uuid-1",
  sl: "blog-posts",
  dn: "Blog Posts",
  desc: null,
  kind: "collection" as const,
  ico: null,
  vh: true,
  flds: [],
};

const MOCK_ENTRY = {
  id: VALID_UUID,
  sl: "hello-world",
  st: "draft" as const,
  pub_at: null,
  c_at: "2024-01-01T00:00:00Z",
  u_at: "2024-01-01T00:00:00Z",
  slang: "en",
  langs: [],
  mdl: { sl: "blog-posts", dn: "Blog Posts", kind: "collection" as const, flds: [] },
  cfv: {},
  tr: {},
  vers: [],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extract the orgSlug/projectSlug from the call args and verify they were
 * split correctly from the "org/project" project string.
 */
function expectProjectSplit(
  args: Record<string, unknown>,
  expectedOrgSlug: string,
  expectedProjectSlug: string,
): void {
  expect(args.orgSlug).toBe(expectedOrgSlug);
  expect(args.projectSlug).toBe(expectedProjectSlug);
}

// ===========================================================================
// 1. Forward Contract: Tool output → API schema validation
// ===========================================================================

describe("forward contract: tool output → API schema", () => {
  // -------------------------------------------------------------------------
  // listContentModels
  // -------------------------------------------------------------------------
  describe("listContentModels", () => {
    it("sends valid listContentModelsInput to API", async () => {
      const queryMock = vi.fn().mockResolvedValue({ mdls: [] });
      const client = createMockClient({
        mcpContent: { listContentModels: { query: queryMock } },
      });

      await listContentModels.execute(client, { project: PROJECT });

      const apiArgs = queryMock.mock.calls[0][0];
      expectProjectSplit(apiArgs, "my-org", "my-app");
      expect(listContentModelsInput.safeParse(apiArgs).success).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // getContentModel
  // -------------------------------------------------------------------------
  describe("getContentModel", () => {
    it("sends valid getContentModelInput to API", async () => {
      const queryMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { getContentModel: { query: queryMock } },
      });

      await getContentModel.execute(client, {
        project: PROJECT,
        modelSlug: "blog-posts",
      });

      const apiArgs = queryMock.mock.calls[0][0];
      expectProjectSplit(apiArgs, "my-org", "my-app");
      expect(apiArgs.modelSlug).toBe("blog-posts");
      expect(getContentModelInput.safeParse(apiArgs).success).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // listContentEntries
  // -------------------------------------------------------------------------
  describe("listContentEntries", () => {
    it("sends valid listContentEntriesInput with no filters", async () => {
      const queryMock = vi.fn().mockResolvedValue({ items: [], tot: 0, more: false });
      const client = createMockClient({
        mcpContent: { listContentEntries: { query: queryMock } },
      });

      await listContentEntries.execute(client, { project: PROJECT });

      const apiArgs = queryMock.mock.calls[0][0];
      expectProjectSplit(apiArgs, "my-org", "my-app");
      expect(listContentEntriesInput.safeParse(apiArgs).success).toBe(true);
    });

    it("sends valid listContentEntriesInput with all filters", async () => {
      const queryMock = vi.fn().mockResolvedValue({ items: [], tot: 0, more: false });
      const client = createMockClient({
        mcpContent: { listContentEntries: { query: queryMock } },
      });

      await listContentEntries.execute(client, {
        project: PROJECT,
        modelSlug: "blog-posts",
        search: "hello world",
        status: "published",
        language: "tr",
        missingLanguage: "de",
        page: 2,
        limit: 10,
      });

      const apiArgs = queryMock.mock.calls[0][0];
      expectProjectSplit(apiArgs, "my-org", "my-app");
      expect(apiArgs.models).toBe("blog-posts");
      expect(apiArgs.search).toBe("hello world");
      expect(apiArgs.status).toBe("published");
      expect(apiArgs.language).toBe("tr");
      expect(apiArgs.missingLanguage).toBe("de");
      expect(apiArgs.page).toBe(2);
      expect(apiArgs.limit).toBe(10);
      expect(listContentEntriesInput.safeParse(apiArgs).success).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // getContentEntry
  // -------------------------------------------------------------------------
  describe("getContentEntry", () => {
    it("sends valid getContentEntryInput to API", async () => {
      const queryMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { getContentEntry: { query: queryMock } },
      });

      await getContentEntry.execute(client, {
        project: PROJECT,
        entryId: VALID_UUID,
      });

      const apiArgs = queryMock.mock.calls[0][0];
      expectProjectSplit(apiArgs, "my-org", "my-app");
      expect(apiArgs.entryId).toBe(VALID_UUID);
      expect(getContentEntryInput.safeParse(apiArgs).success).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // createContentModel
  // -------------------------------------------------------------------------
  describe("createContentModel", () => {
    it("API schema accepts what tool sends with full args", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { createContentModel: { mutate: mutateMock } },
      });

      await createContentModel.execute(client, {
        project: PROJECT,
        slug: "blog-posts",
        displayName: "Blog Posts",
        description: "Blog post content",
        kind: "collection",
        includeBody: true,
        enableVersionHistory: true,
        fields: [
          {
            name: "author",
            displayName: "Author",
            type: "relation",
            fieldConfig: { targetModel: "users" },
          },
          {
            name: "status_field",
            displayName: "Status",
            type: "enum",
          },
        ],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expectProjectSplit(apiArgs, "my-org", "my-app");
      expect(apiArgs.slug).toBe("blog-posts");
      expect(apiArgs.displayName).toBe("Blog Posts");
      expect(apiArgs.kind).toBe("collection");
      expect(Array.isArray(apiArgs.fields)).toBe(true);
      // Validate the subset that mcp-types knows about (it strips unknown fields like includeBody)
      const strippedArgs = {
        orgSlug: apiArgs.orgSlug,
        projectSlug: apiArgs.projectSlug,
        slug: apiArgs.slug,
        displayName: apiArgs.displayName,
        description: apiArgs.description,
        kind: apiArgs.kind,
        icon: apiArgs.icon,
        enableVersionHistory: apiArgs.enableVersionHistory,
        fields: apiArgs.fields,
      };
      expect(createContentModelInput.safeParse(strippedArgs).success).toBe(true);
    });

    it("API schema accepts minimal args", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { createContentModel: { mutate: mutateMock } },
      });

      await createContentModel.execute(client, {
        project: PROJECT,
        slug: "faq",
        displayName: "FAQ",
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      const strippedArgs = {
        orgSlug: apiArgs.orgSlug,
        projectSlug: apiArgs.projectSlug,
        slug: apiArgs.slug,
        displayName: apiArgs.displayName,
        description: apiArgs.description,
        kind: apiArgs.kind,
        icon: apiArgs.icon,
        enableVersionHistory: apiArgs.enableVersionHistory,
        fields: apiArgs.fields,
      };
      expect(createContentModelInput.safeParse(strippedArgs).success).toBe(true);
    });

    it("project string is split correctly into orgSlug and projectSlug", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { createContentModel: { mutate: mutateMock } },
      });

      await createContentModel.execute(client, {
        project: "acme-corp/internal-docs",
        slug: "changelog",
        displayName: "Changelog",
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.orgSlug).toBe("acme-corp");
      expect(apiArgs.projectSlug).toBe("internal-docs");
    });
  });

  // -------------------------------------------------------------------------
  // updateContentModel
  // -------------------------------------------------------------------------
  describe("updateContentModel", () => {
    it("API schema accepts updateContentModel partial update", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { updateContentModel: { mutate: mutateMock } },
      });

      await updateContentModel.execute(client, {
        project: PROJECT,
        modelSlug: "blog-posts",
        displayName: "Updated Blog Posts",
        description: "Updated description",
        kind: "collection",
        enableVersionHistory: false,
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expectProjectSplit(apiArgs, "my-org", "my-app");
      expect(apiArgs.modelSlug).toBe("blog-posts");
      // Validate against mcp-types (which does not include includeBody)
      const strippedArgs = {
        orgSlug: apiArgs.orgSlug,
        projectSlug: apiArgs.projectSlug,
        modelSlug: apiArgs.modelSlug,
        displayName: apiArgs.displayName,
        description: apiArgs.description,
        kind: apiArgs.kind,
        icon: apiArgs.icon,
        enableVersionHistory: apiArgs.enableVersionHistory,
      };
      expect(updateContentModelInput.safeParse(strippedArgs).success).toBe(true);
    });

    it("API schema accepts minimal updateContentModel (modelSlug only)", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { updateContentModel: { mutate: mutateMock } },
      });

      await updateContentModel.execute(client, {
        project: PROJECT,
        modelSlug: "blog-posts",
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      const strippedArgs = {
        orgSlug: apiArgs.orgSlug,
        projectSlug: apiArgs.projectSlug,
        modelSlug: apiArgs.modelSlug,
      };
      expect(updateContentModelInput.safeParse(strippedArgs).success).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // deleteContentModel
  // -------------------------------------------------------------------------
  describe("deleteContentModel", () => {
    it("API schema accepts deleteContentModel args", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ ok: true });
      const client = createMockClient({
        mcpContent: { deleteContentModel: { mutate: mutateMock } },
      });

      await deleteContentModel.execute(client, {
        project: PROJECT,
        modelSlug: "old-model",
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expectProjectSplit(apiArgs, "my-org", "my-app");
      expect(apiArgs.modelSlug).toBe("old-model");
      expect(deleteContentModelInput.safeParse(apiArgs).success).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // addField
  // -------------------------------------------------------------------------
  describe("addField", () => {
    it("API schema accepts full relation field definition", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
      const client = createMockClient({
        mcpContent: { addField: { mutate: mutateMock } },
      });

      await addField.execute(client, {
        project: PROJECT,
        modelSlug: "blog-posts",
        name: "category",
        displayName: "Category",
        type: "relation",
        localized: false,
        required: true,
        fieldConfig: { targetModel: "categories" },
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expectProjectSplit(apiArgs, "my-org", "my-app");
      expect(apiArgs.modelSlug).toBe("blog-posts");
      expect(apiArgs.name).toBe("category");
      expect(apiArgs.type).toBe("relation");
      expect(apiArgs.fieldConfig?.targetModel).toBe("categories");
      // Validate subset (mcp-types does not include options)
      const strippedArgs = {
        orgSlug: apiArgs.orgSlug,
        projectSlug: apiArgs.projectSlug,
        modelSlug: apiArgs.modelSlug,
        name: apiArgs.name,
        displayName: apiArgs.displayName,
        type: apiArgs.type,
        localized: apiArgs.localized,
        required: apiArgs.required,
        placeholder: apiArgs.placeholder,
        helpText: apiArgs.helpText,
        position: apiArgs.position,
        fieldConfig: apiArgs.fieldConfig,
      };
      expect(addFieldInput.safeParse(strippedArgs).success).toBe(true);
    });

    it("API schema accepts enum field with options stripped", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
      const client = createMockClient({
        mcpContent: { addField: { mutate: mutateMock } },
      });

      await addField.execute(client, {
        project: PROJECT,
        modelSlug: "blog-posts",
        name: "status_field",
        displayName: "Status",
        type: "enum",
        options: {
          enumValues: [
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" },
          ],
          showInTable: true,
        },
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      // options is sent in args (tool includes it)
      expect(apiArgs.options?.enumValues).toHaveLength(2);
      expect(apiArgs.options?.showInTable).toBe(true);
      // mcp-types API schema does not include options — strip it for validation
      const strippedArgs = {
        orgSlug: apiArgs.orgSlug,
        projectSlug: apiArgs.projectSlug,
        modelSlug: apiArgs.modelSlug,
        name: apiArgs.name,
        displayName: apiArgs.displayName,
        type: apiArgs.type,
        localized: apiArgs.localized,
        required: apiArgs.required,
      };
      expect(addFieldInput.safeParse(strippedArgs).success).toBe(true);
    });

    it("addField sends correct name and type to API", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
      const client = createMockClient({
        mcpContent: { addField: { mutate: mutateMock } },
      });

      await addField.execute(client, {
        project: PROJECT,
        modelSlug: "products",
        name: "published_at",
        displayName: "Published At",
        type: "datetime",
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.name).toBe("published_at");
      expect(apiArgs.type).toBe("datetime");
    });
  });

  // -------------------------------------------------------------------------
  // updateField
  // -------------------------------------------------------------------------
  describe("updateField", () => {
    it("API schema accepts updateField args", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
      const client = createMockClient({
        mcpContent: { updateField: { mutate: mutateMock } },
      });

      await updateField.execute(client, {
        project: PROJECT,
        modelSlug: "blog-posts",
        fieldName: "status",
        displayName: "Publication Status",
        required: true,
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expectProjectSplit(apiArgs, "my-org", "my-app");
      expect(apiArgs.fieldName).toBe("status");
      const strippedArgs = {
        orgSlug: apiArgs.orgSlug,
        projectSlug: apiArgs.projectSlug,
        modelSlug: apiArgs.modelSlug,
        fieldName: apiArgs.fieldName,
        displayName: apiArgs.displayName,
        type: apiArgs.type,
        localized: apiArgs.localized,
        required: apiArgs.required,
        placeholder: apiArgs.placeholder,
        helpText: apiArgs.helpText,
        fieldConfig: apiArgs.fieldConfig,
      };
      expect(updateFieldInput.safeParse(strippedArgs).success).toBe(true);
    });

    it("updateField with type change to relation sends fieldConfig", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
      const client = createMockClient({
        mcpContent: { updateField: { mutate: mutateMock } },
      });

      await updateField.execute(client, {
        project: PROJECT,
        modelSlug: "blog-posts",
        fieldName: "author",
        type: "relation",
        fieldConfig: { targetModel: "users" },
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.type).toBe("relation");
      expect(apiArgs.fieldConfig?.targetModel).toBe("users");
    });
  });

  // -------------------------------------------------------------------------
  // removeField
  // -------------------------------------------------------------------------
  describe("removeField", () => {
    it("API schema accepts removeField args", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ ok: true });
      const client = createMockClient({
        mcpContent: { removeField: { mutate: mutateMock } },
      });

      await removeField.execute(client, {
        project: PROJECT,
        modelSlug: "blog-posts",
        fieldName: "legacy_field",
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expectProjectSplit(apiArgs, "my-org", "my-app");
      expect(apiArgs.modelSlug).toBe("blog-posts");
      expect(apiArgs.fieldName).toBe("legacy_field");
      expect(removeFieldInput.safeParse(apiArgs).success).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // reorderFields
  // -------------------------------------------------------------------------
  describe("reorderFields", () => {
    it("API schema accepts reorderFields args", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ ok: true });
      const client = createMockClient({
        mcpContent: { reorderFields: { mutate: mutateMock } },
      });

      await reorderFields.execute(client, {
        project: PROJECT,
        modelSlug: "blog-posts",
        fieldNames: ["title", "status_field", "author", "published_at"],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expectProjectSplit(apiArgs, "my-org", "my-app");
      expect(apiArgs.modelSlug).toBe("blog-posts");
      expect(apiArgs.fieldNames).toEqual(["title", "status_field", "author", "published_at"]);
      expect(reorderFieldsInput.safeParse(apiArgs).success).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // createContentEntry
  // -------------------------------------------------------------------------
  describe("createContentEntry", () => {
    it("API schema accepts minimal createContentEntry args", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { createContentEntry: { mutate: mutateMock } },
      });

      await createContentEntry.execute(client, {
        project: PROJECT,
        modelSlug: "blog-posts",
        title: "Hello World",
        slug: "hello-world",
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expectProjectSplit(apiArgs, "my-org", "my-app");
      expect(apiArgs.modelSlug).toBe("blog-posts");
      expect(apiArgs.title).toBe("Hello World");
      expect(apiArgs.slug).toBe("hello-world");
      // Validate the subset that mcp-types knows about
      const strippedArgs = {
        orgSlug: apiArgs.orgSlug,
        projectSlug: apiArgs.projectSlug,
        modelSlug: apiArgs.modelSlug,
        title: apiArgs.title,
        slug: apiArgs.slug,
        bodyMarkdown: apiArgs.bodyMarkdown,
        status: apiArgs.status,
        customFields: apiArgs.customFields,
        translations: apiArgs.translations,
      };
      expect(createContentEntryInput.safeParse(strippedArgs).success).toBe(true);
    });

    it("API schema accepts createContentEntry with translations (normalized keys)", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { createContentEntry: { mutate: mutateMock } },
      });

      await createContentEntry.execute(client, {
        project: PROJECT,
        modelSlug: "blog-posts",
        title: "Hello World",
        slug: "hello-world",
        bodyMarkdown: "# Hello\nContent here",
        translations: {
          TR: { title: "Merhaba Dünya" },
          DE: { title: "Hallo Welt" },
        },
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      // Verify key normalization: TR → tr, DE → de
      expect(apiArgs.translations).toHaveProperty("tr");
      expect(apiArgs.translations).toHaveProperty("de");
      expect(apiArgs.translations).not.toHaveProperty("TR");
      expect(apiArgs.translations).not.toHaveProperty("DE");
      expect(apiArgs.translations.tr.title).toBe("Merhaba Dünya");
      expect(apiArgs.translations.de.title).toBe("Hallo Welt");

      const strippedArgs = {
        orgSlug: apiArgs.orgSlug,
        projectSlug: apiArgs.projectSlug,
        modelSlug: apiArgs.modelSlug,
        title: apiArgs.title,
        slug: apiArgs.slug,
        bodyMarkdown: apiArgs.bodyMarkdown,
        status: apiArgs.status,
        customFields: apiArgs.customFields,
        translations: apiArgs.translations,
      };
      expect(createContentEntryInput.safeParse(strippedArgs).success).toBe(true);
    });

    it("translation keys that are already lowercase pass through unchanged", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { createContentEntry: { mutate: mutateMock } },
      });

      await createContentEntry.execute(client, {
        project: PROJECT,
        modelSlug: "blog-posts",
        title: "Hello",
        slug: "hello",
        translations: { tr: { title: "Merhaba" }, "zh-CN": { title: "你好" } },
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.translations).toHaveProperty("tr");
      expect(apiArgs.translations).toHaveProperty("zh-cn");
    });
  });

  // -------------------------------------------------------------------------
  // updateContentEntry
  // -------------------------------------------------------------------------
  describe("updateContentEntry", () => {
    it("API schema accepts minimal updateContentEntry (entryId only)", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { updateContentEntry: { mutate: mutateMock } },
      });

      await updateContentEntry.execute(client, {
        project: PROJECT,
        entryId: VALID_UUID,
        slug: "new-slug",
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expectProjectSplit(apiArgs, "my-org", "my-app");
      expect(apiArgs.entryId).toBe(VALID_UUID);
      const strippedArgs = {
        orgSlug: apiArgs.orgSlug,
        projectSlug: apiArgs.projectSlug,
        entryId: apiArgs.entryId,
        slug: apiArgs.slug,
        status: apiArgs.status,
        languageCode: apiArgs.languageCode,
        title: apiArgs.title,
        bodyMarkdown: apiArgs.bodyMarkdown,
        customFields: apiArgs.customFields,
        translations: apiArgs.translations,
      };
      expect(updateContentEntryInput.safeParse(strippedArgs).success).toBe(true);
    });

    it("languageCode is normalized to lowercase", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { updateContentEntry: { mutate: mutateMock } },
      });

      await updateContentEntry.execute(client, {
        project: PROJECT,
        entryId: VALID_UUID,
        languageCode: "TR",
        title: "Merhaba Dünya",
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.languageCode).toBe("tr"); // normalized from "TR"
      const strippedArgs = {
        orgSlug: apiArgs.orgSlug,
        projectSlug: apiArgs.projectSlug,
        entryId: apiArgs.entryId,
        languageCode: apiArgs.languageCode,
        title: apiArgs.title,
      };
      expect(updateContentEntryInput.safeParse(strippedArgs).success).toBe(true);
    });

    it("multi-language translations map keys are normalized to lowercase", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { updateContentEntry: { mutate: mutateMock } },
      });

      await updateContentEntry.execute(client, {
        project: PROJECT,
        entryId: VALID_UUID,
        translations: {
          TR: { title: "Merhaba Dünya", bodyMarkdown: "# Merhaba" },
          DE: { title: "Hallo Welt" },
        },
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.translations).toHaveProperty("tr");
      expect(apiArgs.translations).toHaveProperty("de");
      expect(apiArgs.translations).not.toHaveProperty("TR");
      expect(apiArgs.translations).not.toHaveProperty("DE");
      expect(apiArgs.translations.tr.title).toBe("Merhaba Dünya");

      const strippedArgs = {
        orgSlug: apiArgs.orgSlug,
        projectSlug: apiArgs.projectSlug,
        entryId: apiArgs.entryId,
        translations: apiArgs.translations,
      };
      expect(updateContentEntryInput.safeParse(strippedArgs).success).toBe(true);
    });

    it("status update sends valid updateContentEntryInput", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { updateContentEntry: { mutate: mutateMock } },
      });

      await updateContentEntry.execute(client, {
        project: PROJECT,
        entryId: VALID_UUID,
        status: "archived",
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.status).toBe("archived");
      const strippedArgs = {
        orgSlug: apiArgs.orgSlug,
        projectSlug: apiArgs.projectSlug,
        entryId: apiArgs.entryId,
        status: apiArgs.status,
      };
      expect(updateContentEntryInput.safeParse(strippedArgs).success).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // publishContentEntry
  // -------------------------------------------------------------------------
  describe("publishContentEntry", () => {
    it("API schema accepts publishContentEntry args", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { publishContentEntry: { mutate: mutateMock } },
      });

      await publishContentEntry.execute(client, {
        project: PROJECT,
        entryId: VALID_UUID,
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expectProjectSplit(apiArgs, "my-org", "my-app");
      expect(apiArgs.entryId).toBe(VALID_UUID);
      expect(publishContentEntryInput.safeParse(apiArgs).success).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // deleteContentEntry
  // -------------------------------------------------------------------------
  describe("deleteContentEntry", () => {
    it("API schema accepts deleteContentEntry args", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ ok: true });
      const client = createMockClient({
        mcpContent: { deleteContentEntry: { mutate: mutateMock } },
      });

      await deleteContentEntry.execute(client, {
        project: PROJECT,
        entryId: VALID_UUID,
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expectProjectSplit(apiArgs, "my-org", "my-app");
      expect(apiArgs.entryId).toBe(VALID_UUID);
      expect(deleteContentEntryInput.safeParse(apiArgs).success).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // duplicateContentEntry
  // -------------------------------------------------------------------------
  describe("duplicateContentEntry", () => {
    it("API schema accepts duplicateContentEntry without newSlug", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { duplicateContentEntry: { mutate: mutateMock } },
      });

      await duplicateContentEntry.execute(client, {
        project: PROJECT,
        entryId: VALID_UUID,
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expectProjectSplit(apiArgs, "my-org", "my-app");
      expect(apiArgs.entryId).toBe(VALID_UUID);
      expect(duplicateContentEntryInput.safeParse(apiArgs).success).toBe(true);
    });

    it("API schema accepts duplicateContentEntry with newSlug", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { duplicateContentEntry: { mutate: mutateMock } },
      });

      await duplicateContentEntry.execute(client, {
        project: PROJECT,
        entryId: VALID_UUID,
        newSlug: "hello-world-copy",
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.newSlug).toBe("hello-world-copy");
      expect(duplicateContentEntryInput.safeParse(apiArgs).success).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // bulkPublishEntries
  // -------------------------------------------------------------------------
  describe("bulkPublishEntries", () => {
    it("API schema accepts bulkPublishEntries with single UUID", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ pub: 1, fail: [] });
      const client = createMockClient({
        mcpContent: { bulkPublishEntries: { mutate: mutateMock } },
      });

      await bulkPublishEntries.execute(client, {
        project: PROJECT,
        entryIds: [VALID_UUID],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expectProjectSplit(apiArgs, "my-org", "my-app");
      expect(apiArgs.entryIds).toEqual([VALID_UUID]);
      expect(bulkPublishEntriesInput.safeParse(apiArgs).success).toBe(true);
    });

    it("API schema accepts bulkPublishEntries with multiple UUIDs", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ pub: 3, fail: [] });
      const client = createMockClient({
        mcpContent: { bulkPublishEntries: { mutate: mutateMock } },
      });

      await bulkPublishEntries.execute(client, {
        project: PROJECT,
        entryIds: [VALID_UUID, VALID_UUID_2, VALID_UUID_3],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.entryIds).toHaveLength(3);
      expect(bulkPublishEntriesInput.safeParse(apiArgs).success).toBe(true);
    });

    it("API schema accepts bulkPublishEntries at max capacity (50 entries)", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ pub: 50, fail: [] });
      const client = createMockClient({
        mcpContent: { bulkPublishEntries: { mutate: mutateMock } },
      });

      const fiftyUuids = Array.from(
        { length: 50 },
        (_, i) => `550e8400-e29b-41d4-a716-${String(i).padStart(12, "0")}`,
      );

      await bulkPublishEntries.execute(client, {
        project: PROJECT,
        entryIds: fiftyUuids,
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.entryIds).toHaveLength(50);
      expect(bulkPublishEntriesInput.safeParse(apiArgs).success).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // bulkCreateEntries
  // -------------------------------------------------------------------------
  describe("bulkCreateEntries", () => {
    it("sends well-formed args for minimal entries", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ created: 2, failed: [] });
      const client = createMockClient({
        mcpContent: { bulkCreateEntries: { mutate: mutateMock } },
      });

      await bulkCreateEntries.execute(client, {
        project: PROJECT,
        modelSlug: "blog-posts",
        entries: [
          { title: "Post 1", slug: "post-1" },
          { title: "Post 2", slug: "post-2" },
        ],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expectProjectSplit(apiArgs, "my-org", "my-app");
      expect(apiArgs.modelSlug).toBe("blog-posts");
      expect(apiArgs.entries).toHaveLength(2);
      expect(apiArgs.entries[0].title).toBe("Post 1");
      expect(apiArgs.entries[0].slug).toBe("post-1");
    });

    it("per-entry translation keys are normalized to lowercase", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ created: 2, failed: [] });
      const client = createMockClient({
        mcpContent: { bulkCreateEntries: { mutate: mutateMock } },
      });

      await bulkCreateEntries.execute(client, {
        project: PROJECT,
        modelSlug: "blog-posts",
        entries: [
          {
            title: "Post 1",
            slug: "post-1",
            translations: { TR: { title: "Yazı 1" } },
          },
          {
            title: "Post 2",
            slug: "post-2",
          },
        ],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.entries[0].translations).toHaveProperty("tr");
      expect(apiArgs.entries[0].translations).not.toHaveProperty("TR");
      expect(apiArgs.entries[0].translations.tr.title).toBe("Yazı 1");
      // Entry without translations is unchanged
      expect(apiArgs.entries[1].translations).toBeUndefined();
    });

    it("bulkCreateEntries with customFields per entry", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ created: 1, failed: [] });
      const client = createMockClient({
        mcpContent: { bulkCreateEntries: { mutate: mutateMock } },
      });

      await bulkCreateEntries.execute(client, {
        project: PROJECT,
        modelSlug: "products",
        entries: [
          {
            title: "Product A",
            slug: "product-a",
            status: "published",
            customFields: { sku: "SKU-001", category: "electronics" },
          },
        ],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.entries[0].customFields.sku).toBe("SKU-001");
      expect(apiArgs.entries[0].status).toBe("published");
    });
  });
});

// ===========================================================================
// 2. Reverse Contract: LLM-plausible args → tool acceptance
// ===========================================================================

describe("reverse contract: LLM-plausible args → tool acceptance", () => {
  it("createContentModel — LLM sends only required fields", async () => {
    const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
    const client = createMockClient({
      mcpContent: { createContentModel: { mutate: mutateMock } },
    });

    const result = await createContentModel.execute(client, {
      project: PROJECT,
      slug: "changelog",
      displayName: "Changelog",
    });

    expect(result.isError).toBeUndefined();
    expect(mutateMock).toHaveBeenCalledOnce();
  });

  it("createContentModel — LLM sends all optional fields with fields array", async () => {
    const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
    const client = createMockClient({
      mcpContent: { createContentModel: { mutate: mutateMock } },
    });

    const result = await createContentModel.execute(client, {
      project: "acme/website",
      slug: "faq",
      displayName: "FAQ",
      description: "Frequently Asked Questions",
      kind: "collection",
      icon: "help-circle",
      enableVersionHistory: true,
      includeBody: false,
      fields: [
        { name: "question", displayName: "Question", type: "text", required: true },
        { name: "answer", displayName: "Answer", type: "richtext" },
        {
          name: "category",
          displayName: "Category",
          type: "enum",
          options: {
            enumValues: [
              { label: "General", value: "general" },
              { label: "Billing", value: "billing" },
            ],
            showInTable: true,
          },
        },
      ],
    });

    expect(result.isError).toBeUndefined();
    expect(mutateMock).toHaveBeenCalledOnce();
  });

  it("addField — LLM sends enum field with options", async () => {
    const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
    const client = createMockClient({
      mcpContent: { addField: { mutate: mutateMock } },
    });

    const result = await addField.execute(client, {
      project: PROJECT,
      modelSlug: "blog-posts",
      name: "priority",
      displayName: "Priority",
      type: "enum",
      options: {
        enumValues: [
          { label: "Low", value: "low" },
          { label: "Medium", value: "medium" },
          { label: "High", value: "high" },
        ],
        showInTable: true,
      },
    });

    expect(result.isError).toBeUndefined();
    expect(mutateMock).toHaveBeenCalledOnce();
  });

  it("addField — LLM sends relation field with targetModel", async () => {
    const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
    const client = createMockClient({
      mcpContent: { addField: { mutate: mutateMock } },
    });

    const result = await addField.execute(client, {
      project: PROJECT,
      modelSlug: "blog-posts",
      name: "author",
      displayName: "Author",
      type: "relation",
      fieldConfig: { targetModel: "users" },
    });

    expect(result.isError).toBeUndefined();
    expect(mutateMock).toHaveBeenCalledOnce();
  });

  it("updateContentModel — LLM sends displayName update only", async () => {
    const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
    const client = createMockClient({
      mcpContent: { updateContentModel: { mutate: mutateMock } },
    });

    const result = await updateContentModel.execute(client, {
      project: PROJECT,
      modelSlug: "blog-posts",
      displayName: "Company Blog",
    });

    expect(result.isError).toBeUndefined();
    expect(mutateMock).toHaveBeenCalledOnce();
  });

  it("updateContentModel — LLM sends includeBody: false", async () => {
    const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
    const client = createMockClient({
      mcpContent: { updateContentModel: { mutate: mutateMock } },
    });

    const result = await updateContentModel.execute(client, {
      project: PROJECT,
      modelSlug: "categories",
      includeBody: false,
    });

    expect(result.isError).toBeUndefined();
    expect(mutateMock).toHaveBeenCalledOnce();
    const apiArgs = mutateMock.mock.calls[0][0];
    expect(apiArgs.includeBody).toBe(false);
  });

  it("createContentEntry — LLM sends title, slug, bodyMarkdown", async () => {
    const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
    const client = createMockClient({
      mcpContent: { createContentEntry: { mutate: mutateMock } },
    });

    const result = await createContentEntry.execute(client, {
      project: PROJECT,
      modelSlug: "blog-posts",
      title: "Getting Started with i18n",
      slug: "getting-started-with-i18n",
      bodyMarkdown: "# Getting Started\n\nThis guide explains...",
      status: "draft",
    });

    expect(result.isError).toBeUndefined();
    expect(mutateMock).toHaveBeenCalledOnce();
  });

  it("createContentEntry — LLM uses uppercase lang codes in translations", async () => {
    const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
    const client = createMockClient({
      mcpContent: { createContentEntry: { mutate: mutateMock } },
    });

    const result = await createContentEntry.execute(client, {
      project: PROJECT,
      modelSlug: "blog-posts",
      title: "Hello",
      slug: "hello",
      translations: {
        TR: { title: "Merhaba", bodyMarkdown: "İçerik" },
        DE: { title: "Hallo" },
        FR: { title: "Bonjour" },
      },
    });

    expect(result.isError).toBeUndefined();
    const apiArgs = mutateMock.mock.calls[0][0];
    expect(Object.keys(apiArgs.translations)).toEqual(["tr", "de", "fr"]);
  });

  it("updateContentEntry — LLM updates status to published", async () => {
    const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
    const client = createMockClient({
      mcpContent: { updateContentEntry: { mutate: mutateMock } },
    });

    const result = await updateContentEntry.execute(client, {
      project: PROJECT,
      entryId: VALID_UUID,
      status: "published",
    });

    expect(result.isError).toBeUndefined();
    expect(mutateMock).toHaveBeenCalledOnce();
  });

  it("updateContentEntry — LLM sends single-language update", async () => {
    const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
    const client = createMockClient({
      mcpContent: { updateContentEntry: { mutate: mutateMock } },
    });

    const result = await updateContentEntry.execute(client, {
      project: PROJECT,
      entryId: VALID_UUID,
      languageCode: "tr",
      title: "Merhaba Dünya",
      bodyMarkdown: "# Merhaba\nİçerik burada.",
    });

    expect(result.isError).toBeUndefined();
    expect(mutateMock).toHaveBeenCalledOnce();
  });

  it("deleteContentEntry — LLM sends valid UUID", async () => {
    const mutateMock = vi.fn().mockResolvedValue({ ok: true });
    const client = createMockClient({
      mcpContent: { deleteContentEntry: { mutate: mutateMock } },
    });

    const result = await deleteContentEntry.execute(client, {
      project: PROJECT,
      entryId: VALID_UUID,
    });

    expect(result.isError).toBeUndefined();
    expect(mutateMock).toHaveBeenCalledOnce();
  });

  it("deleteContentModel — LLM sends modelSlug", async () => {
    const mutateMock = vi.fn().mockResolvedValue({ ok: true });
    const client = createMockClient({
      mcpContent: { deleteContentModel: { mutate: mutateMock } },
    });

    const result = await deleteContentModel.execute(client, {
      project: PROJECT,
      modelSlug: "old-model",
    });

    expect(result.isError).toBeUndefined();
    expect(mutateMock).toHaveBeenCalledOnce();
  });

  it("duplicateContentEntry — LLM sends entryId only", async () => {
    const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
    const client = createMockClient({
      mcpContent: { duplicateContentEntry: { mutate: mutateMock } },
    });

    const result = await duplicateContentEntry.execute(client, {
      project: PROJECT,
      entryId: VALID_UUID,
    });

    expect(result.isError).toBeUndefined();
    expect(mutateMock).toHaveBeenCalledOnce();
  });

  it("duplicateContentEntry — LLM provides a new slug", async () => {
    const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
    const client = createMockClient({
      mcpContent: { duplicateContentEntry: { mutate: mutateMock } },
    });

    const result = await duplicateContentEntry.execute(client, {
      project: PROJECT,
      entryId: VALID_UUID,
      newSlug: "hello-world-v2",
    });

    expect(result.isError).toBeUndefined();
    expect(mutateMock).toHaveBeenCalledOnce();
  });

  it("publishContentEntry — LLM sends entryId UUID", async () => {
    const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
    const client = createMockClient({
      mcpContent: { publishContentEntry: { mutate: mutateMock } },
    });

    const result = await publishContentEntry.execute(client, {
      project: PROJECT,
      entryId: VALID_UUID,
    });

    expect(result.isError).toBeUndefined();
    expect(mutateMock).toHaveBeenCalledOnce();
  });

  it("bulkPublishEntries — LLM sends array of UUIDs", async () => {
    const mutateMock = vi.fn().mockResolvedValue({ pub: 2, fail: [] });
    const client = createMockClient({
      mcpContent: { bulkPublishEntries: { mutate: mutateMock } },
    });

    const result = await bulkPublishEntries.execute(client, {
      project: PROJECT,
      entryIds: [VALID_UUID, VALID_UUID_2],
    });

    expect(result.isError).toBeUndefined();
    expect(mutateMock).toHaveBeenCalledOnce();
  });

  it("bulkCreateEntries — LLM sends minimal entries array", async () => {
    const mutateMock = vi.fn().mockResolvedValue({ created: 3, failed: [] });
    const client = createMockClient({
      mcpContent: { bulkCreateEntries: { mutate: mutateMock } },
    });

    const result = await bulkCreateEntries.execute(client, {
      project: PROJECT,
      modelSlug: "blog-posts",
      entries: [
        { title: "First Post", slug: "first-post", status: "draft" },
        { title: "Second Post", slug: "second-post", status: "published" },
        { title: "Third Post", slug: "third-post" },
      ],
    });

    expect(result.isError).toBeUndefined();
    expect(mutateMock).toHaveBeenCalledOnce();
  });

  it("listContentModels — LLM sends only project", async () => {
    const queryMock = vi.fn().mockResolvedValue({ mdls: [] });
    const client = createMockClient({
      mcpContent: { listContentModels: { query: queryMock } },
    });

    const result = await listContentModels.execute(client, { project: PROJECT });

    expect(result.isError).toBeUndefined();
    expect(queryMock).toHaveBeenCalledOnce();
  });

  it("getContentModel — LLM sends project and modelSlug", async () => {
    const queryMock = vi.fn().mockResolvedValue(MOCK_MODEL);
    const client = createMockClient({
      mcpContent: { getContentModel: { query: queryMock } },
    });

    const result = await getContentModel.execute(client, {
      project: PROJECT,
      modelSlug: "changelog",
    });

    expect(result.isError).toBeUndefined();
    expect(queryMock).toHaveBeenCalledOnce();
  });

  it("listContentEntries — LLM uses all filter options", async () => {
    const queryMock = vi.fn().mockResolvedValue({ items: [], tot: 0, more: false });
    const client = createMockClient({
      mcpContent: { listContentEntries: { query: queryMock } },
    });

    const result = await listContentEntries.execute(client, {
      project: PROJECT,
      modelSlug: "blog-posts",
      status: "published",
      search: "react",
      language: "tr",
      page: 1,
      limit: 20,
    });

    expect(result.isError).toBeUndefined();
    expect(queryMock).toHaveBeenCalledOnce();
  });

  it("getContentEntry — LLM sends entryId UUID", async () => {
    const queryMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
    const client = createMockClient({
      mcpContent: { getContentEntry: { query: queryMock } },
    });

    const result = await getContentEntry.execute(client, {
      project: PROJECT,
      entryId: VALID_UUID,
    });

    expect(result.isError).toBeUndefined();
    expect(queryMock).toHaveBeenCalledOnce();
  });

  it("getContentEntry — LLM sends expand for relations", async () => {
    const queryMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
    const client = createMockClient({
      mcpContent: { getContentEntry: { query: queryMock } },
    });

    const result = await getContentEntry.execute(client, {
      project: PROJECT,
      entryId: VALID_UUID,
      expand: ["author", "category"],
    });

    expect(result.isError).toBeUndefined();
    const apiArgs = queryMock.mock.calls[0][0];
    expect(apiArgs.expand).toEqual(["author", "category"]);
  });

  it("updateField — LLM updates display name and helpText", async () => {
    const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
    const client = createMockClient({
      mcpContent: { updateField: { mutate: mutateMock } },
    });

    const result = await updateField.execute(client, {
      project: PROJECT,
      modelSlug: "blog-posts",
      fieldName: "status",
      displayName: "Publication Status",
      helpText: "The current publication state of the entry",
    });

    expect(result.isError).toBeUndefined();
    expect(mutateMock).toHaveBeenCalledOnce();
  });

  it("removeField — LLM sends modelSlug and fieldName", async () => {
    const mutateMock = vi.fn().mockResolvedValue({ ok: true });
    const client = createMockClient({
      mcpContent: { removeField: { mutate: mutateMock } },
    });

    const result = await removeField.execute(client, {
      project: PROJECT,
      modelSlug: "blog-posts",
      fieldName: "deprecated_field",
    });

    expect(result.isError).toBeUndefined();
    expect(mutateMock).toHaveBeenCalledOnce();
  });

  it("reorderFields — LLM sends ordered fieldNames", async () => {
    const mutateMock = vi.fn().mockResolvedValue({ ok: true });
    const client = createMockClient({
      mcpContent: { reorderFields: { mutate: mutateMock } },
    });

    const result = await reorderFields.execute(client, {
      project: PROJECT,
      modelSlug: "blog-posts",
      fieldNames: ["title", "author", "status_field", "published_at"],
    });

    expect(result.isError).toBeUndefined();
    expect(mutateMock).toHaveBeenCalledOnce();
  });
});

// ===========================================================================
// 3. Negative Contract: Invalid args rejected by tool
// ===========================================================================

describe("negative contract: invalid args rejected by tool Zod schema", () => {
  // slug validation
  it("createContentModel rejects slug with uppercase characters", async () => {
    const client = createMockClient();
    const result = await createContentModel.execute(client, {
      project: PROJECT,
      slug: "Blog-Posts", // uppercase B
      displayName: "Blog",
    });
    expect(result.isError).toBe(true);
  });

  it("createContentModel rejects slug with underscores", async () => {
    const client = createMockClient();
    const result = await createContentModel.execute(client, {
      project: PROJECT,
      slug: "blog_posts", // underscores not allowed (must be hyphens)
      displayName: "Blog",
    });
    expect(result.isError).toBe(true);
  });

  it("createContentModel rejects empty slug", async () => {
    const client = createMockClient();
    const result = await createContentModel.execute(client, {
      project: PROJECT,
      slug: "",
      displayName: "Blog",
    });
    expect(result.isError).toBe(true);
  });

  it("createContentModel rejects invalid kind value", async () => {
    const client = createMockClient();
    const result = await createContentModel.execute(client, {
      project: PROJECT,
      slug: "blog",
      displayName: "Blog",
      kind: "list" as "collection", // invalid enum value
    });
    expect(result.isError).toBe(true);
  });

  // field name validation
  it("addField rejects field name with uppercase characters", async () => {
    const client = createMockClient();
    const result = await addField.execute(client, {
      project: PROJECT,
      modelSlug: "blog",
      name: "AuthorName", // camelCase not allowed
      displayName: "Author",
    });
    expect(result.isError).toBe(true);
  });

  it("addField rejects field name starting with a number", async () => {
    const client = createMockClient();
    const result = await addField.execute(client, {
      project: PROJECT,
      modelSlug: "blog",
      name: "2bad_name",
      displayName: "Bad Field",
    });
    expect(result.isError).toBe(true);
  });

  it("addField rejects field name with hyphens", async () => {
    const client = createMockClient();
    const result = await addField.execute(client, {
      project: PROJECT,
      modelSlug: "blog",
      name: "has-hyphen",
      displayName: "Hyphenated",
    });
    expect(result.isError).toBe(true);
  });

  it("addField rejects invalid type value", async () => {
    const client = createMockClient();
    const result = await addField.execute(client, {
      project: PROJECT,
      modelSlug: "blog",
      name: "my_field",
      displayName: "My Field",
      type: "json" as "text", // not in enum
    });
    expect(result.isError).toBe(true);
  });

  // UUID validation
  it("deleteContentEntry rejects non-UUID entryId", async () => {
    const client = createMockClient();
    const result = await deleteContentEntry.execute(client, {
      project: PROJECT,
      entryId: "not-a-uuid",
    });
    expect(result.isError).toBe(true);
  });

  it("publishContentEntry rejects non-UUID entryId", async () => {
    const client = createMockClient();
    const result = await publishContentEntry.execute(client, {
      project: PROJECT,
      entryId: "12345",
    });
    expect(result.isError).toBe(true);
  });

  it("getContentEntry rejects non-UUID entryId", async () => {
    const client = createMockClient();
    const result = await getContentEntry.execute(client, {
      project: PROJECT,
      entryId: "blog-posts/hello-world", // slug instead of UUID
    });
    expect(result.isError).toBe(true);
  });

  it("updateContentEntry rejects non-UUID entryId", async () => {
    const client = createMockClient();
    const result = await updateContentEntry.execute(client, {
      project: PROJECT,
      entryId: "INVALID",
    });
    expect(result.isError).toBe(true);
  });

  it("duplicateContentEntry rejects non-UUID entryId", async () => {
    const client = createMockClient();
    const result = await duplicateContentEntry.execute(client, {
      project: PROJECT,
      entryId: "not-a-uuid",
    });
    expect(result.isError).toBe(true);
  });

  it("duplicateContentEntry rejects newSlug with uppercase characters", async () => {
    const client = createMockClient();
    const result = await duplicateContentEntry.execute(client, {
      project: PROJECT,
      entryId: VALID_UUID,
      newSlug: "My-Post", // uppercase M
    });
    expect(result.isError).toBe(true);
  });

  it("duplicateContentEntry rejects newSlug with underscores", async () => {
    const client = createMockClient();
    const result = await duplicateContentEntry.execute(client, {
      project: PROJECT,
      entryId: VALID_UUID,
      newSlug: "my_post_copy",
    });
    expect(result.isError).toBe(true);
  });

  // bulkPublishEntries limits
  it("bulkPublishEntries rejects empty entryIds array", async () => {
    const client = createMockClient();
    const result = await bulkPublishEntries.execute(client, {
      project: PROJECT,
      entryIds: [],
    });
    expect(result.isError).toBe(true);
  });

  it("bulkPublishEntries rejects > 50 entries", async () => {
    const client = createMockClient();
    const uuids = Array.from(
      { length: 51 },
      (_, i) => `550e8400-e29b-41d4-a716-${String(i).padStart(12, "0")}`,
    );
    const result = await bulkPublishEntries.execute(client, {
      project: PROJECT,
      entryIds: uuids,
    });
    expect(result.isError).toBe(true);
  });

  it("bulkPublishEntries rejects non-UUID entries in the array", async () => {
    const client = createMockClient();
    const result = await bulkPublishEntries.execute(client, {
      project: PROJECT,
      entryIds: [VALID_UUID, "not-a-uuid"],
    });
    expect(result.isError).toBe(true);
  });

  // bulkCreateEntries limits
  it("bulkCreateEntries rejects empty entries array", async () => {
    const client = createMockClient();
    const result = await bulkCreateEntries.execute(client, {
      project: PROJECT,
      modelSlug: "blog-posts",
      entries: [],
    });
    expect(result.isError).toBe(true);
  });

  it("bulkCreateEntries rejects > 20 entries", async () => {
    const client = createMockClient();
    const entries = Array.from({ length: 21 }, (_, i) => ({
      title: `Post ${i}`,
      slug: `post-${i}`,
    }));
    const result = await bulkCreateEntries.execute(client, {
      project: PROJECT,
      modelSlug: "blog-posts",
      entries,
    });
    expect(result.isError).toBe(true);
  });

  // reorderFields
  it("reorderFields rejects empty fieldNames array", async () => {
    const client = createMockClient();
    const result = await reorderFields.execute(client, {
      project: PROJECT,
      modelSlug: "blog",
      fieldNames: [],
    });
    expect(result.isError).toBe(true);
  });

  // listContentEntries pagination limits
  it("listContentEntries rejects limit > 50", async () => {
    const client = createMockClient();
    const result = await listContentEntries.execute(client, {
      project: PROJECT,
      limit: 51,
    });
    expect(result.isError).toBe(true);
  });

  it("listContentEntries rejects page < 1", async () => {
    const client = createMockClient();
    const result = await listContentEntries.execute(client, {
      project: PROJECT,
      page: 0,
    });
    expect(result.isError).toBe(true);
  });

  // createContentEntry status validation
  it("createContentEntry rejects invalid status value", async () => {
    const client = createMockClient();
    const result = await createContentEntry.execute(client, {
      project: PROJECT,
      modelSlug: "blog-posts",
      title: "Test",
      slug: "test",
      status: "archived" as "draft", // not allowed on create
    });
    expect(result.isError).toBe(true);
  });

  // missing required fields
  it("createContentModel rejects missing project", async () => {
    const client = createMockClient();
    const result = await createContentModel.execute(client, {
      slug: "blog",
      displayName: "Blog",
    } as { project: string; slug: string; displayName: string });
    expect(result.isError).toBe(true);
  });

  it("addField rejects missing name", async () => {
    const client = createMockClient();
    const result = await addField.execute(client, {
      project: PROJECT,
      modelSlug: "blog",
      displayName: "Author",
    } as { project: string; modelSlug: string; name: string; displayName: string });
    expect(result.isError).toBe(true);
  });

  it("createContentEntry rejects missing title", async () => {
    const client = createMockClient();
    const result = await createContentEntry.execute(client, {
      project: PROJECT,
      modelSlug: "blog-posts",
      slug: "hello",
    } as { project: string; modelSlug: string; title: string; slug: string });
    expect(result.isError).toBe(true);
  });
});
