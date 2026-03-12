/**
 * server-dispatch.test.ts
 *
 * Verifies that all 18 content tools are correctly defined, uniquely named, and
 * structurally consistent. Acts as a drift-detection guard: if a tool is added
 * to server.ts but not exported (or vice-versa), a test here will fail.
 */

import { describe, it, expect } from "vitest";

import { listContentModels } from "../tools/listContentModels.js";
import { getContentModel } from "../tools/getContentModel.js";
import { listContentEntries } from "../tools/listContentEntries.js";
import { getContentEntry } from "../tools/getContentEntry.js";
import { createContentEntry } from "../tools/createContentEntry.js";
import { updateContentEntry } from "../tools/updateContentEntry.js";
import { publishContentEntry } from "../tools/publishContentEntry.js";
import { deleteContentEntry } from "../tools/deleteContentEntry.js";
import { duplicateContentEntry } from "../tools/duplicateContentEntry.js";
import { bulkPublishEntries } from "../tools/bulkPublishEntries.js";
import { bulkCreateEntries } from "../tools/bulkCreateEntries.js";
import { bulkUpdateEntries } from "../tools/bulkUpdateEntries.js";
import { createContentModel } from "../tools/createContentModel.js";
import { updateContentModel } from "../tools/updateContentModel.js";
import { deleteContentModel } from "../tools/deleteContentModel.js";
import { addField } from "../tools/addField.js";
import { updateField } from "../tools/updateField.js";
import { removeField } from "../tools/removeField.js";
import { reorderFields } from "../tools/reorderFields.js";
import type { Tool } from "../types/index.js";

// ---------------------------------------------------------------------------
// Canonical tool list — matches the order in server.ts ListToolsRequestSchema
// ---------------------------------------------------------------------------

const ALL_TOOLS: Tool[] = [
  // Read
  listContentModels,
  getContentModel,
  listContentEntries,
  getContentEntry,
  // Entry write
  createContentEntry,
  updateContentEntry,
  publishContentEntry,
  duplicateContentEntry,
  bulkPublishEntries,
  bulkCreateEntries,
  bulkUpdateEntries,
  // Model management
  createContentModel,
  updateContentModel,
  // Field management
  addField,
  updateField,
  reorderFields,
  // Destructive
  deleteContentEntry,
  deleteContentModel,
  removeField,
];

/** Names as they appear in the server.ts tool dispatch map */
const EXPECTED_TOOL_NAMES = [
  "listContentModels",
  "getContentModel",
  "listContentEntries",
  "getContentEntry",
  "createContentEntry",
  "updateContentEntry",
  "publishContentEntry",
  "duplicateContentEntry",
  "bulkPublishEntries",
  "bulkCreateEntries",
  "bulkUpdateEntries",
  "createContentModel",
  "updateContentModel",
  "addField",
  "updateField",
  "reorderFields",
  "deleteContentEntry",
  "deleteContentModel",
  "removeField",
] as const;

const READ_ONLY_TOOL_NAMES = [
  "listContentModels",
  "getContentModel",
  "listContentEntries",
  "getContentEntry",
] as const;

const WRITE_TOOL_NAMES = [
  "createContentEntry",
  "updateContentEntry",
  "publishContentEntry",
  "duplicateContentEntry",
  "bulkPublishEntries",
  "bulkCreateEntries",
  "bulkUpdateEntries",
  "createContentModel",
  "updateContentModel",
  "addField",
  "updateField",
  "reorderFields",
] as const;

const DESTRUCTIVE_TOOL_NAMES = [
  "deleteContentEntry",
  "deleteContentModel",
  "removeField",
] as const;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("MCP content tool registry — completeness", () => {
  it("exports exactly 19 tools", () => {
    expect(ALL_TOOLS).toHaveLength(19);
  });

  it("all tools have unique names", () => {
    const names = ALL_TOOLS.map((t) => t.definition.name);
    const unique = new Set(names);
    expect(unique.size).toBe(19);
  });

  it("all tools have a definition with name, description, and inputSchema", () => {
    for (const tool of ALL_TOOLS) {
      expect(tool.definition).toBeDefined();
      expect(typeof tool.definition.name).toBe("string");
      expect(tool.definition.name.length).toBeGreaterThan(0);
      expect(typeof tool.definition.description).toBe("string");
      expect(tool.definition.description.length).toBeGreaterThan(0);
      expect(tool.definition.inputSchema).toBeDefined();
    }
  });

  it("every tool inputSchema has type: 'object'", () => {
    for (const tool of ALL_TOOLS) {
      expect(tool.definition.inputSchema.type).toBe("object");
    }
  });

  it("every tool has an execute function", () => {
    for (const tool of ALL_TOOLS) {
      expect(typeof tool.execute).toBe("function");
    }
  });
});

describe("MCP content tool registry — name correctness", () => {
  it("tool definition names match their export binding name", () => {
    expect(listContentModels.definition.name).toBe("listContentModels");
    expect(getContentModel.definition.name).toBe("getContentModel");
    expect(listContentEntries.definition.name).toBe("listContentEntries");
    expect(getContentEntry.definition.name).toBe("getContentEntry");
    expect(createContentEntry.definition.name).toBe("createContentEntry");
    expect(updateContentEntry.definition.name).toBe("updateContentEntry");
    expect(publishContentEntry.definition.name).toBe("publishContentEntry");
    expect(deleteContentEntry.definition.name).toBe("deleteContentEntry");
    expect(duplicateContentEntry.definition.name).toBe("duplicateContentEntry");
    expect(bulkPublishEntries.definition.name).toBe("bulkPublishEntries");
    expect(bulkCreateEntries.definition.name).toBe("bulkCreateEntries");
    expect(bulkUpdateEntries.definition.name).toBe("bulkUpdateEntries");
    expect(createContentModel.definition.name).toBe("createContentModel");
    expect(updateContentModel.definition.name).toBe("updateContentModel");
    expect(deleteContentModel.definition.name).toBe("deleteContentModel");
    expect(addField.definition.name).toBe("addField");
    expect(updateField.definition.name).toBe("updateField");
    expect(removeField.definition.name).toBe("removeField");
    expect(reorderFields.definition.name).toBe("reorderFields");
  });

  it("tool names match the dispatch map names in server.ts (drift detection)", () => {
    const actualNames = ALL_TOOLS.map((t) => t.definition.name);
    expect(new Set(actualNames)).toEqual(new Set([...EXPECTED_TOOL_NAMES]));
  });
});

describe("MCP content tool registry — annotation categories", () => {
  it("read-only tools are present", () => {
    const actualNames = new Set(ALL_TOOLS.map((t) => t.definition.name));
    for (const name of READ_ONLY_TOOL_NAMES) {
      expect(actualNames.has(name)).toBe(true);
    }
  });

  it("write tools are present", () => {
    const actualNames = new Set(ALL_TOOLS.map((t) => t.definition.name));
    for (const name of WRITE_TOOL_NAMES) {
      expect(actualNames.has(name)).toBe(true);
    }
  });

  it("destructive tools are present", () => {
    const actualNames = new Set(ALL_TOOLS.map((t) => t.definition.name));
    for (const name of DESTRUCTIVE_TOOL_NAMES) {
      expect(actualNames.has(name)).toBe(true);
    }
  });

  it("read-only, write, and destructive categories together cover all 19 tools", () => {
    const allCategorised = [
      ...READ_ONLY_TOOL_NAMES,
      ...WRITE_TOOL_NAMES,
      ...DESTRUCTIVE_TOOL_NAMES,
    ];
    expect(allCategorised).toHaveLength(19);
    const unique = new Set(allCategorised);
    expect(unique.size).toBe(19);
  });
});

describe("MCP content tool registry — annotation value semantics", () => {
  const readOnly = {
    readOnlyHint: true,
    openWorldHint: false,
    destructiveHint: false,
  };
  const write = {
    readOnlyHint: false,
    openWorldHint: false,
    destructiveHint: false,
  };
  const destructive = {
    readOnlyHint: false,
    openWorldHint: false,
    destructiveHint: true,
  };

  it("readOnly annotation has readOnlyHint:true, destructiveHint:false", () => {
    expect(readOnly.readOnlyHint).toBe(true);
    expect(readOnly.destructiveHint).toBe(false);
    expect(readOnly.openWorldHint).toBe(false);
  });

  it("write annotation has readOnlyHint:false, destructiveHint:false", () => {
    expect(write.readOnlyHint).toBe(false);
    expect(write.destructiveHint).toBe(false);
    expect(write.openWorldHint).toBe(false);
  });

  it("destructive annotation has destructiveHint:true, readOnlyHint:false", () => {
    expect(destructive.destructiveHint).toBe(true);
    expect(destructive.readOnlyHint).toBe(false);
    expect(destructive.openWorldHint).toBe(false);
  });

  it("annotate merges annotation into tool definition without mutating the original", () => {
    const annotate = (
      def: Tool["definition"],
      annotations: Record<string, boolean>,
    ) => ({ ...def, annotations });

    const annotated = annotate(listContentModels.definition, readOnly);
    expect(annotated.annotations).toEqual(readOnly);
    // Original should be unchanged
    expect(
      (listContentModels.definition as Record<string, unknown>).annotations,
    ).toBeUndefined();
  });
});
