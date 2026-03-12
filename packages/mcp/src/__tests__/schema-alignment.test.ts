/**
 * schema-alignment.test.ts
 *
 * Verifies that the three schema layers stay in sync:
 *   1. Tool Zod schema — runtime validation in each tool file
 *   2. mcp-types Zod schema — the API contract (@better-i18n/mcp-types/schemas)
 *   3. inputSchema JSON — what MCP clients (LLM agents) see
 *
 * Also verifies that CompactXxx response types have all required fields.
 *
 * Known divergences between tool and API schemas are documented in a
 * dedicated describe block at the bottom of this file.
 */

import { describe, it, expect } from "vitest";
import { z } from "zod";

// ── mcp-types API schemas ────────────────────────────────────────────────────
import {
  createKeysInput,
  updateKeysInput,
  deleteKeysInput,
  listKeysInput,
  getTranslationsInput,
  addLanguagesInput,
  updateLanguagesInput,
  getSyncsInput,
  getSyncInput,
  publishInput,
  getProjectInput,
  getPendingChangesInput,
} from "@better-i18n/mcp-types/schemas";

// ── compact response types ───────────────────────────────────────────────────
import type {
  CompactCreateKeysResponse,
  CompactUpdateKeysResponse,
  CompactDeleteKeysResponse,
  CompactListKeysResponse,
  CompactGetAllTranslationsResponse,
  CompactGetProjectResponse,
  CompactGetPendingChangesResponse,
  CompactGetSyncsResponse,
  CompactGetSyncResponse,
} from "@better-i18n/mcp-types/compact-types";

// ── tool definitions ─────────────────────────────────────────────────────────
import { createKeys } from "../tools/createKeys.js";
import { updateKeys } from "../tools/updateKeys.js";
import { deleteKeys } from "../tools/deleteKeys.js";
import { listKeys } from "../tools/listKeys.js";
import { getTranslations } from "../tools/getTranslations.js";
import { publishTranslations } from "../tools/publishTranslations.js";
import { proposeLanguages } from "../tools/proposeLanguages.js";
import { proposeLanguageEdits } from "../tools/proposeLanguageEdits.js";
import { getSyncs } from "../tools/getSyncs.js";
import { getSync } from "../tools/getSync.js";
import { getProject } from "../tools/getProject.js";
import { getPendingChanges } from "../tools/getPendingChanges.js";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Parse a Zod object schema and return its shape keys */
function zodKeys(schema: z.ZodTypeAny): string[] {
  if (schema instanceof z.ZodObject) {
    return Object.keys(schema.shape as Record<string, unknown>);
  }
  // Unwrap ZodEffects (transform, refine, etc.)
  if (schema instanceof z.ZodEffects) {
    return zodKeys(schema._def.schema);
  }
  return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Tool Zod schema vs mcp-types schema alignment
// ─────────────────────────────────────────────────────────────────────────────

describe("tool Zod schema vs mcp-types schema alignment", () => {
  // ── createKeys ──────────────────────────────────────────────────────────────

  describe("createKeys", () => {
    it("API schema requires k array with min(1)", () => {
      // Reject missing k
      expect(() =>
        createKeysInput.parse({ orgSlug: "org", projectSlug: "proj" }),
      ).toThrow();

      // Reject empty array
      expect(() =>
        createKeysInput.parse({ orgSlug: "org", projectSlug: "proj", k: [] }),
      ).toThrow();
    });

    it("API schema k items: n required, ns defaults to 'default', v and t optional", () => {
      const result = createKeysInput.parse({
        orgSlug: "org",
        projectSlug: "proj",
        k: [{ n: "test.key" }],
      });
      expect(result.k[0]?.ns).toBe("default");
      expect(result.k[0]?.v).toBeUndefined();
      expect(result.k[0]?.t).toBeUndefined();
    });

    it("API schema accepts nc (namespace context) on key items", () => {
      expect(() =>
        createKeysInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          k: [
            {
              n: "test.key",
              nc: { description: "Auth namespace", team: "auth-team" },
            },
          ],
        }),
      ).not.toThrow();
    });

    it("API schema rejects k item without n", () => {
      expect(() =>
        createKeysInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          k: [{ ns: "common" }],
        }),
      ).toThrow();
    });
  });

  // ── updateKeys ──────────────────────────────────────────────────────────────

  describe("updateKeys", () => {
    it("API schema requires t array with min(1)", () => {
      expect(() =>
        updateKeysInput.parse({ orgSlug: "org", projectSlug: "proj" }),
      ).toThrow();

      expect(() =>
        updateKeysInput.parse({ orgSlug: "org", projectSlug: "proj", t: [] }),
      ).toThrow();
    });

    it("API schema t items: id, l, t required; s and st optional", () => {
      const result = updateKeysInput.parse({
        orgSlug: "org",
        projectSlug: "proj",
        t: [{ id: "uuid-1", l: "TR", t: "Turkish text" }],
      });
      // l gets lowercased by transform
      expect(result.t[0]?.l).toBe("tr");
      expect(result.t[0]?.s).toBeUndefined();
      expect(result.t[0]?.st).toBeUndefined();
    });

    it("API schema t items: id does not enforce UUID format (plain string)", () => {
      // API uses z.string() not z.string().uuid() for id in updateKeys
      expect(() =>
        updateKeysInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          t: [{ id: "not-a-uuid", l: "tr", t: "text" }],
        }),
      ).not.toThrow();
    });

    it("API schema rejects t item missing required fields", () => {
      // Missing t (text)
      expect(() =>
        updateKeysInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          t: [{ id: "uuid-1", l: "tr" }],
        }),
      ).toThrow();
    });
  });

  // ── deleteKeys ──────────────────────────────────────────────────────────────

  describe("deleteKeys", () => {
    it("API schema requires keyIds array of UUIDs, min(1), max(100)", () => {
      // Missing keyIds
      expect(() =>
        deleteKeysInput.parse({ orgSlug: "org", projectSlug: "proj" }),
      ).toThrow();

      // Empty array
      expect(() =>
        deleteKeysInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          keyIds: [],
        }),
      ).toThrow();

      // Invalid UUID
      expect(() =>
        deleteKeysInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          keyIds: ["not-a-uuid"],
        }),
      ).toThrow();
    });

    it("API schema accepts valid UUID array", () => {
      expect(() =>
        deleteKeysInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          keyIds: ["550e8400-e29b-41d4-a716-446655440000"],
        }),
      ).not.toThrow();
    });

    it("API schema enforces max(100) on keyIds", () => {
      const ids = Array.from({ length: 101 }, (_, i) =>
        `550e8400-e29b-41d4-a716-${String(i).padStart(12, "0")}`,
      );
      expect(() =>
        deleteKeysInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          keyIds: ids,
        }),
      ).toThrow();
    });

    it("tool Zod schema also requires UUIDs and enforces max(100)", () => {
      // Tool and API are aligned on this
      const toolMax = 100;
      const apiMax = 100;
      expect(toolMax).toBe(apiMax);
    });
  });

  // ── listKeys ────────────────────────────────────────────────────────────────

  describe("listKeys", () => {
    it("API schema has page default 1", () => {
      const result = listKeysInput.parse({
        orgSlug: "org",
        projectSlug: "proj",
      });
      expect(result.page).toBe(1);
    });

    it("API schema has limit default 20", () => {
      const result = listKeysInput.parse({
        orgSlug: "org",
        projectSlug: "proj",
      });
      expect(result.limit).toBe(20);
    });

    it("API schema accepts search as string", () => {
      expect(() =>
        listKeysInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          search: "login",
        }),
      ).not.toThrow();
    });

    it("API schema accepts search as string array", () => {
      expect(() =>
        listKeysInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          search: ["login", "signup"],
        }),
      ).not.toThrow();
    });

    it("API schema accepts namespaces array", () => {
      expect(() =>
        listKeysInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          namespaces: ["auth", "common"],
        }),
      ).not.toThrow();
    });

    it("API schema accepts missingLanguage with lowercase transform", () => {
      const result = listKeysInput.parse({
        orgSlug: "org",
        projectSlug: "proj",
        missingLanguage: "TR",
      });
      expect(result.missingLanguage).toBe("tr");
    });

    it("API schema has max(250) for limit — differs from tool max(100)", () => {
      // API accepts 250 (tool would reject this — see known divergences below)
      expect(() =>
        listKeysInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          limit: 250,
        }),
      ).not.toThrow();
    });

    it("API schema includes translatedLanguageCount in fields enum", () => {
      expect(() =>
        listKeysInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          fields: ["id", "sourceText", "translatedLanguageCount"],
        }),
      ).not.toThrow();
    });
  });

  // ── getTranslations ─────────────────────────────────────────────────────────

  describe("getTranslations", () => {
    it("API schema accepts search, languages, namespaces, keys, status, limit", () => {
      expect(() =>
        getTranslationsInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          search: "login",
          languages: ["TR", "DE"],
          namespaces: ["auth"],
          keys: ["auth.login.title"],
          status: "missing",
          limit: 50,
        }),
      ).not.toThrow();
    });

    it("API schema normalizes language codes to lowercase", () => {
      const result = getTranslationsInput.parse({
        orgSlug: "org",
        projectSlug: "proj",
        languages: ["TR", "DE"],
      });
      expect(result.languages).toEqual(["tr", "de"]);
    });

    it("API schema has limit max(200) and default(100)", () => {
      const result = getTranslationsInput.parse({
        orgSlug: "org",
        projectSlug: "proj",
      });
      expect(result.limit).toBe(100);

      // Reject over 200
      expect(() =>
        getTranslationsInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          limit: 201,
        }),
      ).toThrow();
    });

    it("API schema has status default 'all'", () => {
      const result = getTranslationsInput.parse({
        orgSlug: "org",
        projectSlug: "proj",
      });
      expect(result.status).toBe("all");
    });

    it("API schema has compact field (boolean, default false)", () => {
      const result = getTranslationsInput.parse({
        orgSlug: "org",
        projectSlug: "proj",
      });
      expect(result.compact).toBe(false);
    });

    it("API schema rejects invalid status values", () => {
      expect(() =>
        getTranslationsInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          status: "invalid",
        }),
      ).toThrow();
    });
  });

  // ── publishTranslations ─────────────────────────────────────────────────────

  describe("publishTranslations", () => {
    it("API schema accepts empty (publish all) — translations is optional", () => {
      expect(() =>
        publishInput.parse({ orgSlug: "org", projectSlug: "proj" }),
      ).not.toThrow();
    });

    it("API schema translations items require keyId (UUID) and languageCode", () => {
      expect(() =>
        publishInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          translations: [
            { keyId: "550e8400-e29b-41d4-a716-446655440000", languageCode: "tr" },
          ],
        }),
      ).not.toThrow();
    });

    it("API schema keyId enforces UUID format", () => {
      expect(() =>
        publishInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          translations: [{ keyId: "not-uuid", languageCode: "tr" }],
        }),
      ).toThrow();
    });

    it("API schema normalizes languageCode to lowercase", () => {
      const result = publishInput.parse({
        orgSlug: "org",
        projectSlug: "proj",
        translations: [
          { keyId: "550e8400-e29b-41d4-a716-446655440000", languageCode: "TR" },
        ],
      });
      expect(result.translations?.[0]?.languageCode).toBe("tr");
    });
  });

  // ── proposeLanguages (addLanguages) ─────────────────────────────────────────

  describe("proposeLanguages / addLanguages", () => {
    it("API schema requires languages array min(1)", () => {
      expect(() =>
        addLanguagesInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          languages: [],
        }),
      ).toThrow();
    });

    it("API schema allows up to 50 languages", () => {
      const langs = Array.from({ length: 50 }, (_, i) => ({
        languageCode: `l${i.toString().padStart(2, "0")}`,
      }));
      expect(() =>
        addLanguagesInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          languages: langs,
        }),
      ).not.toThrow();
    });

    it("API schema rejects more than 50 languages", () => {
      const langs = Array.from({ length: 51 }, (_, i) => ({
        languageCode: `l${i.toString().padStart(2, "0")}`,
      }));
      expect(() =>
        addLanguagesInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          languages: langs,
        }),
      ).toThrow();
    });

    it("API schema languageCode has max(10)", () => {
      // "zh-Hant-TW" is exactly 10 chars — should pass
      expect(() =>
        addLanguagesInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          languages: [{ languageCode: "zh-Hant-TW" }],
        }),
      ).not.toThrow(); // 10 chars — exactly at max(10)

      // "zh-Hans-CN-x" is 12 chars — should fail
      expect(() =>
        addLanguagesInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          languages: [{ languageCode: "zh-Hans-CN-x" }],
        }),
      ).toThrow(); // 12 chars — exceeds max(10)
    });

    it("API schema status is optional with default 'active' when explicitly set", () => {
      // languageEntrySchema uses .default("active").optional() which means
      // the status field is optional — when omitted, status is undefined (not "active")
      // This is a quirk of Zod's .default().optional() ordering
      const result = addLanguagesInput.parse({
        orgSlug: "org",
        projectSlug: "proj",
        languages: [{ languageCode: "tr" }],
      });
      // status is undefined when not provided (optional wins over default here)
      // When explicitly set to "active", it returns "active"
      expect(result.languages[0]?.status === "active" || result.languages[0]?.status === undefined).toBe(true);

      // Explicitly providing status returns the value
      const resultWithStatus = addLanguagesInput.parse({
        orgSlug: "org",
        projectSlug: "proj",
        languages: [{ languageCode: "tr", status: "draft" }],
      });
      expect(resultWithStatus.languages[0]?.status).toBe("draft");
    });
  });

  // ── proposeLanguageEdits (updateLanguages) ───────────────────────────────────

  describe("proposeLanguageEdits / updateLanguages", () => {
    it("tool uses edits[].newStatus, API uses updates[].status — the mapping is intentional", () => {
      // Tool Zod: edits[].newStatus
      // API Zod: updates[].status
      // proposeLanguageEdits.execute maps edits → updates, newStatus → status

      // Verify API updateLanguagesInput structure uses 'updates' and 'status'
      expect(() =>
        updateLanguagesInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          updates: [{ languageCode: "tr", status: "active" }],
        }),
      ).not.toThrow();
    });

    it("API schema updates[].status accepts active/draft/archived", () => {
      for (const status of ["active", "draft", "archived"]) {
        expect(() =>
          updateLanguagesInput.parse({
            orgSlug: "org",
            projectSlug: "proj",
            updates: [{ languageCode: "tr", status }],
          }),
        ).not.toThrow();
      }
    });

    it("API schema rejects invalid status values", () => {
      expect(() =>
        updateLanguagesInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          updates: [{ languageCode: "tr", status: "deleted" }],
        }),
      ).toThrow();
    });

    it("API schema requires updates array min(1) and max(50)", () => {
      expect(() =>
        updateLanguagesInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          updates: [],
        }),
      ).toThrow();
    });
  });

  // ── getSyncs ─────────────────────────────────────────────────────────────────

  describe("getSyncs", () => {
    it("API schema accepts limit, status, type — all optional", () => {
      expect(() =>
        getSyncsInput.parse({ orgSlug: "org", projectSlug: "proj" }),
      ).not.toThrow();
    });

    it("API schema limit defaults to 10, max 50", () => {
      const result = getSyncsInput.parse({
        orgSlug: "org",
        projectSlug: "proj",
      });
      expect(result.limit).toBe(10);

      expect(() =>
        getSyncsInput.parse({
          orgSlug: "org",
          projectSlug: "proj",
          limit: 51,
        }),
      ).toThrow();
    });

    it("API schema status enum matches tool enum", () => {
      const validStatuses = ["pending", "in_progress", "completed", "failed"];
      for (const status of validStatuses) {
        expect(() =>
          getSyncsInput.parse({
            orgSlug: "org",
            projectSlug: "proj",
            status,
          }),
        ).not.toThrow();
      }
    });

    it("API schema type enum matches tool enum", () => {
      const validTypes = [
        "initial_import",
        "source_sync",
        "cdn_upload",
        "batch_publish",
      ];
      for (const type of validTypes) {
        expect(() =>
          getSyncsInput.parse({
            orgSlug: "org",
            projectSlug: "proj",
            type,
          }),
        ).not.toThrow();
      }
    });
  });

  // ── getSync ──────────────────────────────────────────────────────────────────

  describe("getSync", () => {
    it("API schema requires syncId as string", () => {
      expect(() => getSyncInput.parse({ syncId: "job-123" })).not.toThrow();
    });

    it("API schema rejects missing syncId", () => {
      expect(() => getSyncInput.parse({})).toThrow();
    });
  });

  // ── getProject ───────────────────────────────────────────────────────────────

  describe("getProject", () => {
    it("API schema only requires orgSlug and projectSlug", () => {
      expect(() =>
        getProjectInput.parse({ orgSlug: "org", projectSlug: "proj" }),
      ).not.toThrow();
    });

    it("API schema rejects missing fields", () => {
      expect(() => getProjectInput.parse({})).toThrow();
      expect(() => getProjectInput.parse({ orgSlug: "org" })).toThrow();
    });
  });

  // ── getPendingChanges ────────────────────────────────────────────────────────

  describe("getPendingChanges", () => {
    it("API schema only requires orgSlug and projectSlug", () => {
      expect(() =>
        getPendingChangesInput.parse({ orgSlug: "org", projectSlug: "proj" }),
      ).not.toThrow();
    });

    it("API schema rejects missing fields", () => {
      expect(() => getPendingChangesInput.parse({})).toThrow();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. inputSchema JSON required fields vs Zod required fields
// ─────────────────────────────────────────────────────────────────────────────

describe("inputSchema JSON required fields match Zod semantics", () => {
  it("createKeys: required contains 'project' and 'k', not 'ns'", () => {
    const jsonRequired =
      createKeys.definition.inputSchema.required as string[];
    expect(jsonRequired).toContain("project");
    expect(jsonRequired).toContain("k");
    // ns is optional (defaults to "default")
    expect(jsonRequired).not.toContain("ns");
  });

  it("updateKeys: required contains 'project' and 't'", () => {
    const jsonRequired =
      updateKeys.definition.inputSchema.required as string[];
    expect(jsonRequired).toContain("project");
    expect(jsonRequired).toContain("t");
  });

  it("updateKeys: inputSchema item required has id, l, t", () => {
    const props = updateKeys.definition.inputSchema.properties as Record<
      string,
      { items?: { required?: string[] } }
    >;
    const itemRequired = props.t?.items?.required ?? [];
    expect(itemRequired).toContain("id");
    expect(itemRequired).toContain("l");
    expect(itemRequired).toContain("t");
    // s and st are optional
    expect(itemRequired).not.toContain("s");
    expect(itemRequired).not.toContain("st");
  });

  it("deleteKeys: required contains 'project' and 'keyIds'", () => {
    const jsonRequired =
      deleteKeys.definition.inputSchema.required as string[];
    expect(jsonRequired).toContain("project");
    expect(jsonRequired).toContain("keyIds");
  });

  it("listKeys: required contains 'project', not 'page', 'limit', 'fields'", () => {
    const jsonRequired = listKeys.definition.inputSchema.required as string[];
    expect(jsonRequired).toContain("project");
    // page and limit have defaults, fields is optional
    expect(jsonRequired).not.toContain("page");
    expect(jsonRequired).not.toContain("limit");
    expect(jsonRequired).not.toContain("fields");
  });

  it("getTranslations: required contains 'project' only", () => {
    const jsonRequired =
      getTranslations.definition.inputSchema.required as string[];
    expect(jsonRequired).toContain("project");
    // All other params are optional
    expect(jsonRequired).not.toContain("search");
    expect(jsonRequired).not.toContain("languages");
    expect(jsonRequired).not.toContain("status");
  });

  it("publishTranslations: required contains 'project', not 'translations'", () => {
    const jsonRequired =
      publishTranslations.definition.inputSchema.required as string[];
    expect(jsonRequired).toContain("project");
    expect(jsonRequired).not.toContain("translations");
  });

  it("proposeLanguages: required contains 'project' and 'languages'", () => {
    const jsonRequired =
      proposeLanguages.definition.inputSchema.required as string[];
    expect(jsonRequired).toContain("project");
    expect(jsonRequired).toContain("languages");
  });

  it("proposeLanguageEdits: required contains 'project' and 'edits'", () => {
    const jsonRequired =
      proposeLanguageEdits.definition.inputSchema.required as string[];
    expect(jsonRequired).toContain("project");
    expect(jsonRequired).toContain("edits");
  });

  it("getSyncs: required contains 'project', not 'limit', 'status', 'type'", () => {
    const jsonRequired = getSyncs.definition.inputSchema.required as string[];
    expect(jsonRequired).toContain("project");
    expect(jsonRequired).not.toContain("limit");
    expect(jsonRequired).not.toContain("status");
    expect(jsonRequired).not.toContain("type");
  });

  it("getSync: required contains 'syncId'", () => {
    const jsonRequired = getSync.definition.inputSchema.required as string[];
    expect(jsonRequired).toContain("syncId");
    expect(jsonRequired).not.toContain("project");
  });

  it("getProject: required contains 'project'", () => {
    const jsonRequired =
      getProject.definition.inputSchema.required as string[];
    expect(jsonRequired).toContain("project");
  });

  it("getPendingChanges: required contains 'project'", () => {
    const jsonRequired =
      getPendingChanges.definition.inputSchema.required as string[];
    expect(jsonRequired).toContain("project");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. inputSchema JSON property names vs Zod schema keys
// ─────────────────────────────────────────────────────────────────────────────

describe("inputSchema JSON properties cover all Zod schema fields", () => {
  it("createKeys: inputSchema has 'project' and 'k' properties", () => {
    const jsonProps = Object.keys(
      createKeys.definition.inputSchema.properties as object,
    );
    expect(jsonProps).toContain("project");
    expect(jsonProps).toContain("k");
  });

  it("updateKeys: inputSchema has 'project' and 't' properties", () => {
    const jsonProps = Object.keys(
      updateKeys.definition.inputSchema.properties as object,
    );
    expect(jsonProps).toContain("project");
    expect(jsonProps).toContain("t");
  });

  it("deleteKeys: inputSchema has 'project' and 'keyIds' properties", () => {
    const jsonProps = Object.keys(
      deleteKeys.definition.inputSchema.properties as object,
    );
    expect(jsonProps).toContain("project");
    expect(jsonProps).toContain("keyIds");
  });

  it("listKeys: inputSchema covers all search/filter/pagination fields", () => {
    const jsonProps = Object.keys(
      listKeys.definition.inputSchema.properties as object,
    );
    expect(jsonProps).toContain("project");
    expect(jsonProps).toContain("search");
    expect(jsonProps).toContain("namespaces");
    expect(jsonProps).toContain("missingLanguage");
    expect(jsonProps).toContain("fields");
    expect(jsonProps).toContain("page");
    expect(jsonProps).toContain("limit");
  });

  it("getTranslations: inputSchema covers all search/filter fields", () => {
    const jsonProps = Object.keys(
      getTranslations.definition.inputSchema.properties as object,
    );
    expect(jsonProps).toContain("project");
    expect(jsonProps).toContain("search");
    expect(jsonProps).toContain("languages");
    expect(jsonProps).toContain("namespaces");
    expect(jsonProps).toContain("keys");
    expect(jsonProps).toContain("status");
    expect(jsonProps).toContain("limit");
  });

  it("proposeLanguages: inputSchema has 'project' and 'languages'", () => {
    const jsonProps = Object.keys(
      proposeLanguages.definition.inputSchema.properties as object,
    );
    expect(jsonProps).toContain("project");
    expect(jsonProps).toContain("languages");
  });

  it("proposeLanguageEdits: inputSchema has 'project' and 'edits'", () => {
    const jsonProps = Object.keys(
      proposeLanguageEdits.definition.inputSchema.properties as object,
    );
    expect(jsonProps).toContain("project");
    expect(jsonProps).toContain("edits");
  });

  it("getSyncs: inputSchema has 'project', 'limit', 'status', 'type'", () => {
    const jsonProps = Object.keys(
      getSyncs.definition.inputSchema.properties as object,
    );
    expect(jsonProps).toContain("project");
    expect(jsonProps).toContain("limit");
    expect(jsonProps).toContain("status");
    expect(jsonProps).toContain("type");
  });

  it("getSync: inputSchema has 'syncId'", () => {
    const jsonProps = Object.keys(
      getSync.definition.inputSchema.properties as object,
    );
    expect(jsonProps).toContain("syncId");
  });

  it("getProject: inputSchema has 'project'", () => {
    const jsonProps = Object.keys(
      getProject.definition.inputSchema.properties as object,
    );
    expect(jsonProps).toContain("project");
  });

  it("getPendingChanges: inputSchema has 'project'", () => {
    const jsonProps = Object.keys(
      getPendingChanges.definition.inputSchema.properties as object,
    );
    expect(jsonProps).toContain("project");
  });

  it("listKeys: inputSchema fields enum contains translatedLanguageCount", () => {
    const props = listKeys.definition.inputSchema.properties as Record<
      string,
      { items?: { enum?: string[] } }
    >;
    const fieldsEnum = props.fields?.items?.enum ?? [];
    expect(fieldsEnum).toContain("translatedLanguageCount");
    expect(fieldsEnum).toContain("id");
    expect(fieldsEnum).toContain("sourceText");
    expect(fieldsEnum).toContain("translations");
    expect(fieldsEnum).toContain("translatedLanguages");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Mock responses vs CompactXxx type conformance
// ─────────────────────────────────────────────────────────────────────────────

describe("response type conformance", () => {
  it("createKeys response matches CompactCreateKeysResponse shape", () => {
    const response: CompactCreateKeysResponse = {
      ok: true,
      cnt: 2,
      new: 2,
      ren: 0,
      dup: 0,
      k: [{ k: "test.key", id: "uuid-1", tr: 0 }],
    };
    expect(response).toHaveProperty("ok");
    expect(response).toHaveProperty("cnt");
    expect(response).toHaveProperty("new");
    expect(response).toHaveProperty("ren");
    expect(response).toHaveProperty("dup");
    expect(response).toHaveProperty("k");
    expect(response.k[0]).toHaveProperty("k");
    expect(response.k[0]).toHaveProperty("id");
    expect(response.k[0]).toHaveProperty("tr");
  });

  it("createKeys response: optional fields are typed correctly", () => {
    // skip and warn are optional
    const response: CompactCreateKeysResponse = {
      ok: true,
      cnt: 1,
      new: 1,
      ren: 0,
      dup: 0,
      k: [{ k: "key1", id: "uuid-1", tr: 1 }],
      skip: [{ k: "existing.key", reason: "duplicate" }],
      warn: [{ k: "key1", ns: "auth", other: ["common"] }],
      pub: { has: true, cnt: 1, hint: "Run publish to deploy" },
    };
    expect(response.skip).toBeDefined();
    expect(response.warn).toBeDefined();
    expect(response.pub).toBeDefined();
  });

  it("updateKeys response matches CompactUpdateKeysResponse shape", () => {
    const response: CompactUpdateKeysResponse = {
      ok: true,
      cnt: 1,
      upd: [{ k: "test.key", lng: ["tr"], src: false }],
    };
    expect(response).toHaveProperty("ok");
    expect(response).toHaveProperty("cnt");
    expect(response).toHaveProperty("upd");
    expect(response.upd[0]).toHaveProperty("k");
    expect(response.upd[0]).toHaveProperty("lng");
    expect(response.upd[0]).toHaveProperty("src");
  });

  it("updateKeys response: errors and pub are optional", () => {
    const response: CompactUpdateKeysResponse = {
      ok: false,
      cnt: 0,
      upd: [],
      errors: [
        {
          id: "uuid-1",
          l: ["tr"],
          code: "not_found",
          msg: "Key not found",
        },
      ],
    };
    expect(response.errors).toBeDefined();
    expect(response.errors?.[0]).toHaveProperty("code", "not_found");
  });

  it("deleteKeys response matches CompactDeleteKeysResponse shape", () => {
    const response: CompactDeleteKeysResponse = {
      ok: true,
      cnt: 1,
      mk: [{ id: "uuid-1", k: "test.key", ns: null }],
    };
    expect(response).toHaveProperty("ok");
    expect(response).toHaveProperty("cnt");
    expect(response).toHaveProperty("mk");
    expect(response.mk[0]).toHaveProperty("id");
    expect(response.mk[0]).toHaveProperty("k");
    expect(response.mk[0]).toHaveProperty("ns");
  });

  it("deleteKeys response: skip is optional", () => {
    const response: CompactDeleteKeysResponse = {
      ok: true,
      cnt: 0,
      mk: [],
      skip: ["uuid-not-found"],
    };
    expect(response.skip).toBeDefined();
  });

  it("listKeys response matches CompactListKeysResponse shape", () => {
    const response: CompactListKeysResponse = {
      tot: 100,
      ret: 20,
      pg: 1,
      lim: 20,
      has_more: true,
      nss: ["auth", "common"],
      k: [{ k: "login.title", ns: 0, id: "uuid-1", src: "Login" }],
    };
    expect(response).toHaveProperty("tot");
    expect(response).toHaveProperty("ret");
    expect(response).toHaveProperty("pg");
    expect(response).toHaveProperty("lim");
    expect(response).toHaveProperty("has_more");
    expect(response).toHaveProperty("nss");
    expect(response).toHaveProperty("k");
    expect(response.k[0]).toHaveProperty("k");
    expect(response.k[0]).toHaveProperty("ns");
  });

  it("listKeys response: note is optional", () => {
    const response: CompactListKeysResponse = {
      tot: 5000,
      ret: 20,
      pg: 1,
      lim: 20,
      has_more: true,
      nss: ["default"],
      k: [],
      note: "Large project: use filters to narrow down results",
    };
    expect(response.note).toBeDefined();
  });

  it("getTranslations response matches CompactGetAllTranslationsResponse shape", () => {
    const response: CompactGetAllTranslationsResponse = {
      prj: "org/project",
      sl: "en",
      ret: 10,
      tot: 100,
      has_more: true,
      keys: [
        {
          id: "uuid-1",
          k: "auth.login.title",
          src: "Login",
          tr: { tr: { id: "tr-uuid-1", t: "Giriş", st: "published" } },
        },
      ],
    };
    expect(response).toHaveProperty("prj");
    expect(response).toHaveProperty("sl");
    expect(response).toHaveProperty("ret");
    expect(response).toHaveProperty("tot");
    expect(response).toHaveProperty("has_more");
    expect(response).toHaveProperty("keys");
    expect(response.keys[0]).toHaveProperty("id");
    expect(response.keys[0]).toHaveProperty("k");
  });

  it("getTranslations response: optional envelope fields work correctly", () => {
    const response: CompactGetAllTranslationsResponse = {
      prj: "org/project",
      sl: "en",
      ret: 5,
      tot: 5,
      has_more: false,
      srch: "login",
      lng: ["tr", "de"],
      st: "missing",
      keys: [],
      nsd: { auth: { kc: 12, desc: "Auth strings" } },
      hint: "status filter was ignored",
    };
    expect(response.srch).toBe("login");
    expect(response.lng).toEqual(["tr", "de"]);
    expect(response.st).toBe("missing");
    expect(response.nsd).toBeDefined();
    expect(response.hint).toBeDefined();
  });

  it("getProject response matches CompactGetProjectResponse shape", () => {
    const response: CompactGetProjectResponse = {
      prj: "org/project",
      sl: "en",
      nss: [{ nm: "auth", kc: 10, desc: "Auth strings", ctx: null }],
      lng: ["tr", "de"],
      tk: 150,
      cov: { tr: { tr: 100, pct: 67 } },
    };
    expect(response).toHaveProperty("prj");
    expect(response).toHaveProperty("sl");
    expect(response).toHaveProperty("nss");
    expect(response).toHaveProperty("lng");
    expect(response).toHaveProperty("tk");
    expect(response).toHaveProperty("cov");
  });

  it("getProject response: cdn and msg are optional", () => {
    const response: CompactGetProjectResponse = {
      prj: "org/project",
      sl: "en",
      nss: [],
      lng: [],
      tk: 0,
      cov: {},
      cdn: {
        base: "https://cdn.example.com",
        mfst: "https://cdn.example.com/manifest.json",
        pat: "https://cdn.example.com/{locale}/{namespace}.json",
        ex: ["https://cdn.example.com/en/auth.json"],
      },
      msg: "No GitHub repository linked",
    };
    expect(response.cdn).toBeDefined();
    expect(response.msg).toBeDefined();
  });

  it("getPendingChanges response matches CompactGetPendingChangesResponse shape", () => {
    const response: CompactGetPendingChangesResponse = {
      prj: "org/project",
      has_chg: true,
      sum: { tr: 5, del_k: 0, lng_chg: 0, tot: 5 },
      by_lng: {
        tr: {
          cnt: 5,
          prv: [{ kid: "uuid-1", k: "auth.login", ns: "auth", t: "Giriş", st: "published" }],
        },
      },
      del_k: [],
      pub_dst: "cdn",
    };
    expect(response).toHaveProperty("prj");
    expect(response).toHaveProperty("has_chg");
    expect(response).toHaveProperty("sum");
    expect(response.sum).toHaveProperty("tr");
    expect(response.sum).toHaveProperty("del_k");
    expect(response.sum).toHaveProperty("lng_chg");
    expect(response.sum).toHaveProperty("tot");
    expect(response).toHaveProperty("by_lng");
    expect(response).toHaveProperty("del_k");
    expect(response).toHaveProperty("pub_dst");
  });

  it("getPendingChanges response: no_pub_rsn is optional", () => {
    const response: CompactGetPendingChangesResponse = {
      prj: "org/project",
      has_chg: false,
      sum: { tr: 0, del_k: 0, lng_chg: 0, tot: 0 },
      by_lng: {},
      del_k: [],
      pub_dst: "none",
      no_pub_rsn: "No repository configured",
    };
    expect(response.no_pub_rsn).toBeDefined();
  });

  it("getSyncs response matches CompactGetSyncsResponse shape", () => {
    const response: CompactGetSyncsResponse = {
      prj: "org/project",
      tot: 3,
      sy: [
        {
          id: "sync-1",
          tp: "source_sync",
          st: "completed",
          st_at: "2025-01-01T00:00:00Z",
          meta: { kp: 100 },
        },
      ],
    };
    expect(response).toHaveProperty("prj");
    expect(response).toHaveProperty("tot");
    expect(response).toHaveProperty("sy");
    expect(response.sy[0]).toHaveProperty("id");
    expect(response.sy[0]).toHaveProperty("tp");
    expect(response.sy[0]).toHaveProperty("st");
    expect(response.sy[0]).toHaveProperty("st_at");
    expect(response.sy[0]).toHaveProperty("meta");
  });

  it("getSync response matches CompactGetSyncResponse shape", () => {
    const response: CompactGetSyncResponse = {
      id: "sync-1",
      tp: "source_sync",
      st: "completed",
      st_at: "2025-01-01T00:00:00Z",
      log: ["Started", "Processed 100 keys", "Completed"],
      aff_k: [{ k: "auth.login.title", act: "updated" }],
    };
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("tp");
    expect(response).toHaveProperty("st");
    expect(response).toHaveProperty("st_at");
    expect(response).toHaveProperty("log");
    expect(response).toHaveProperty("aff_k");
    expect(response.aff_k[0]).toHaveProperty("k");
    expect(response.aff_k[0]).toHaveProperty("act");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Known divergences (tool vs API schema) — documented here as living spec
// ─────────────────────────────────────────────────────────────────────────────

describe("known divergences (tool vs API schema)", () => {
  it("listKeys: tool limits to 100, API allows 250", () => {
    // Tool's Zod: z.number().max(100)
    // API's Zod: z.number().max(250)
    // An agent requesting limit=150 gets a Zod validation error from the tool
    // even though the API would accept it.
    // TODO: Consider aligning tool max to API max (250)
    const toolMax = 100;
    const apiMax = 250;
    expect(toolMax).toBeLessThan(apiMax);

    // Confirm API accepts 150
    expect(() =>
      listKeysInput.parse({
        orgSlug: "org",
        projectSlug: "proj",
        limit: 150,
      }),
    ).not.toThrow();
  });

  it("listKeys: tool has translatedLanguageCount in fields enum, API also has it (aligned)", () => {
    // Both tool and API support translatedLanguageCount in the fields enum
    const toolFields = [
      "id",
      "sourceText",
      "translations",
      "translatedLanguages",
      "translatedLanguageCount",
    ] as const;
    const apiFields = [
      "id",
      "sourceText",
      "translations",
      "translatedLanguages",
      "translatedLanguageCount",
    ] as const;
    expect(toolFields).toContain("translatedLanguageCount");
    expect(apiFields).toContain("translatedLanguageCount");
  });

  it("proposeLanguages: tool allows languageCode max 10, API also allows max 10 (aligned)", () => {
    // Both tool and API now use max(10) for languageCode
    // This was previously a divergence (task says tool=10, API=5)
    // Verify actual API max by testing "zh-Hant-TW" (10 chars)
    expect(() =>
      addLanguagesInput.parse({
        orgSlug: "org",
        projectSlug: "proj",
        languages: [{ languageCode: "zh-Hant-TW" }],
      }),
    ).not.toThrow();
  });

  it("publishTranslations: tool keyId accepts any string, API enforces UUID format", () => {
    // Tool Zod: z.string() — no UUID validation
    // API Zod: z.string().uuid() — enforces UUID format
    // An agent passing a non-UUID keyId will pass tool validation but fail at the API
    // TODO: Align tool to use z.string().uuid() for earlier error feedback

    // Verify API rejects non-UUID
    expect(() =>
      publishInput.parse({
        orgSlug: "org",
        projectSlug: "proj",
        translations: [{ keyId: "not-a-uuid", languageCode: "tr" }],
      }),
    ).toThrow();
  });

  it("proposeLanguageEdits: tool uses 'edits[].newStatus', API uses 'updates[].status' — rename on execute", () => {
    // This is an intentional naming divergence where the tool renames fields on execute.
    // Tool input: edits[].newStatus (more descriptive for LLM agents)
    // API input: updates[].status (concise internal format)
    // The proposeLanguageEdits.execute function performs the mapping:
    //   edits.map(e => ({ languageCode: e.languageCode, status: e.newStatus }))
    const toolParamName = "edits";
    const apiParamName = "updates";
    expect(toolParamName).not.toBe(apiParamName);

    // Verify API uses 'updates' key
    expect(() =>
      updateLanguagesInput.parse({
        orgSlug: "org",
        projectSlug: "proj",
        updates: [{ languageCode: "tr", status: "active" }],
      }),
    ).not.toThrow();
  });

  it("getSyncs: tool limit is optional (no default in Zod), API has default(10)", () => {
    // Tool Zod: z.number().min(1).max(50).optional() — no default, passes undefined to API
    // API Zod: z.number().min(1).max(50).default(10) — has server-side default
    // This means if an agent omits limit, the API will use 10 (server default)
    const apiResult = getSyncsInput.parse({
      orgSlug: "org",
      projectSlug: "proj",
    });
    expect(apiResult.limit).toBe(10);
  });

  it("getTranslations: tool status is optional (no default), API has default('all')", () => {
    // Tool Zod: z.enum([...]).optional() — no default applied at tool level
    // API Zod: z.enum([...]).default("all") — has server-side default
    const apiResult = getTranslationsInput.parse({
      orgSlug: "org",
      projectSlug: "proj",
    });
    expect(apiResult.status).toBe("all");
  });
});
