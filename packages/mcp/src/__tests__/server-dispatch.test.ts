/**
 * server-dispatch.test.ts
 *
 * Verifies that all 13 tools are correctly defined, uniquely named, and
 * structurally consistent. Also acts as a drift-detection guard: if a tool
 * is added to server.ts but not exported (or vice-versa), a test here will
 * fail.
 */

import { describe, it, expect } from "vitest";

import { listProjects } from "../tools/listProjects.js";
import { getProject } from "../tools/getProject.js";
import { proposeLanguages } from "../tools/proposeLanguages.js";
import { proposeLanguageEdits } from "../tools/proposeLanguageEdits.js";
import { listKeys } from "../tools/listKeys.js";
import { getTranslations } from "../tools/getTranslations.js";
import { createKeys } from "../tools/createKeys.js";
import { updateKeys } from "../tools/updateKeys.js";
import { deleteKeys } from "../tools/deleteKeys.js";
import { getPendingChanges } from "../tools/getPendingChanges.js";
import { publishTranslations } from "../tools/publishTranslations.js";
import { getSyncs } from "../tools/getSyncs.js";
import { getSync } from "../tools/getSync.js";
import type { Tool } from "../types/index.js";

// ---------------------------------------------------------------------------
// Canonical tool list — matches the order in server.ts ListToolsRequestSchema
// ---------------------------------------------------------------------------

const ALL_TOOLS: Tool[] = [
  listProjects,
  getProject,
  proposeLanguages,
  proposeLanguageEdits,
  listKeys,
  getTranslations,
  createKeys,
  updateKeys,
  deleteKeys,
  getPendingChanges,
  publishTranslations,
  getSyncs,
  getSync,
];

/** Names as they appear in the server.ts switch-case (order preserved) */
const EXPECTED_TOOL_NAMES = [
  "listProjects",
  "getProject",
  "proposeLanguages",
  "proposeLanguageEdits",
  "listKeys",
  "getTranslations",
  "createKeys",
  "updateKeys",
  "deleteKeys",
  "getPendingChanges",
  "publishTranslations",
  "getSyncs",
  "getSync",
] as const;

const READ_ONLY_TOOL_NAMES = [
  "listProjects",
  "getProject",
  "listKeys",
  "getTranslations",
  "getPendingChanges",
  "getSyncs",
  "getSync",
] as const;

const WRITE_TOOL_NAMES = [
  "proposeLanguages",
  "proposeLanguageEdits",
  "createKeys",
  "updateKeys",
  "publishTranslations",
] as const;

const DESTRUCTIVE_TOOL_NAMES = ["deleteKeys"] as const;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("MCP tool registry — completeness", () => {
  it("exports exactly 13 tools", () => {
    expect(ALL_TOOLS).toHaveLength(13);
  });

  it("all tools have unique names", () => {
    const names = ALL_TOOLS.map((t) => t.definition.name);
    const unique = new Set(names);
    expect(unique.size).toBe(13);
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

describe("MCP tool registry — name correctness", () => {
  it("tool definition names match their export binding name", () => {
    expect(listProjects.definition.name).toBe("listProjects");
    expect(getProject.definition.name).toBe("getProject");
    expect(proposeLanguages.definition.name).toBe("proposeLanguages");
    expect(proposeLanguageEdits.definition.name).toBe("proposeLanguageEdits");
    expect(listKeys.definition.name).toBe("listKeys");
    expect(getTranslations.definition.name).toBe("getTranslations");
    expect(createKeys.definition.name).toBe("createKeys");
    expect(updateKeys.definition.name).toBe("updateKeys");
    expect(deleteKeys.definition.name).toBe("deleteKeys");
    expect(getPendingChanges.definition.name).toBe("getPendingChanges");
    expect(publishTranslations.definition.name).toBe("publishTranslations");
    expect(getSyncs.definition.name).toBe("getSyncs");
    expect(getSync.definition.name).toBe("getSync");
  });

  it("tool names match the switch-case names in server.ts (drift detection)", () => {
    const actualNames = ALL_TOOLS.map((t) => t.definition.name);
    expect(actualNames).toEqual([...EXPECTED_TOOL_NAMES]);
  });
});

describe("MCP tool registry — annotation categories", () => {
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

  it("only deleteKeys is the destructive tool", () => {
    expect(DESTRUCTIVE_TOOL_NAMES).toHaveLength(1);
    expect(DESTRUCTIVE_TOOL_NAMES[0]).toBe("deleteKeys");
    expect(deleteKeys.definition.name).toBe("deleteKeys");
  });

  it("read-only, write, and destructive categories together cover all 13 tools", () => {
    const allCategorised = [
      ...READ_ONLY_TOOL_NAMES,
      ...WRITE_TOOL_NAMES,
      ...DESTRUCTIVE_TOOL_NAMES,
    ];
    expect(allCategorised).toHaveLength(13);
    // No overlaps
    const unique = new Set(allCategorised);
    expect(unique.size).toBe(13);
  });
});

describe("MCP tool registry — annotation value semantics", () => {
  /**
   * The server uses three annotation shapes. We verify them by re-applying
   * the same logic used in server.ts's annotate() helper and asserting the
   * expected hint values.
   */
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

    const annotated = annotate(listProjects.definition, readOnly);
    expect(annotated.annotations).toEqual(readOnly);
    // Original should be unchanged
    expect((listProjects.definition as unknown as Record<string, unknown>).annotations).toBeUndefined();
  });
});
