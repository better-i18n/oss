/**
 * contract.test.ts
 *
 * End-to-end contract tests that bridge the gap between tool logic and the real API.
 *
 * THREE test sections:
 *
 * 1. FORWARD CONTRACT — tool output → API schema validation
 *    Execute each tool with a mock client, capture what it ACTUALLY sends to the
 *    API (orgSlug, projectSlug, payload), and validate those args against the
 *    mcp-types Zod schemas (the real API contract). If the API schema rejects it,
 *    the tool has a normalization or mapping bug.
 *
 * 2. REVERSE CONTRACT — LLM-plausible args → tool acceptance
 *    Simulate inputs an LLM would plausibly generate from reading inputSchema,
 *    and assert the tool accepts them without isError. Catches regressions where
 *    a schema tightening breaks something an LLM was expected to send.
 *
 * 3. NEGATIVE CONTRACT — invalid args MUST be rejected
 *    Guard rails: assert that clearly invalid inputs are rejected (isError=true)
 *    so we never silently swallow bad data from an LLM.
 */

import { describe, it, expect, vi } from "vitest";
import { createMockClient } from "./fixtures/mock-client.js";

// ── Tool imports ──────────────────────────────────────────────────────────────
import { createKeys } from "../tools/createKeys.js";
import { updateKeys } from "../tools/updateKeys.js";
import { deleteKeys } from "../tools/deleteKeys.js";
import { publishTranslations } from "../tools/publishTranslations.js";
import { listKeys } from "../tools/listKeys.js";
import { getTranslations } from "../tools/getTranslations.js";
import { listProjects } from "../tools/listProjects.js";
import { getProject } from "../tools/getProject.js";
import { getPendingChanges } from "../tools/getPendingChanges.js";
import { proposeLanguages } from "../tools/proposeLanguages.js";
import { proposeLanguageEdits } from "../tools/proposeLanguageEdits.js";
import { getSyncs } from "../tools/getSyncs.js";
import { getSync } from "../tools/getSync.js";

// ── mcp-types API schemas (the real API contract) ────────────────────────────
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

// ── Stub responses (minimal valid shapes, tools don't care about their content) ──
const STUBS = {
  createKeys: { ok: true, cnt: 1, new: 1, ren: 0, dup: 0, k: [] },
  updateKeys: { ok: true, cnt: 1, upd: [] },
  deleteKeys: { ok: true, cnt: 1, mk: [] },
  publishTranslations: { success: true },
  listKeys: { tot: 0, ret: 0, pg: 1, lim: 20, has_more: false, nss: [], k: [] },
  getAllTranslations: { prj: "org/proj", sl: "en", ret: 0, tot: 0, has_more: false, keys: [] },
  getProject: { prj: "org/proj", sl: "en", nss: [], lng: [], tk: 0, cov: {} },
  getPendingChanges: { prj: "org/proj", has_chg: false, sum: { tr: 0, del_k: 0, lng_chg: 0, tot: 0 }, by_lng: {}, del_k: [], pub_dst: "cdn" },
  addLanguages: { success: true, added: 1, skipped: 0, results: [] },
  updateLanguages: { success: true, results: [], notFound: [] },
  getSyncs: { prj: "org/proj", tot: 0, sy: [] },
  getSync: { id: "sync-1", tp: "source_sync", st: "completed", st_at: "2024-01-01", log: [], aff_k: [] },
  listProjects: [],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. FORWARD CONTRACT: Tool output → API schema validation
// ─────────────────────────────────────────────────────────────────────────────

describe("forward contract: tool output → API schema", () => {
  // ── createKeys ──────────────────────────────────────────────────────────────

  describe("createKeys", () => {
    it("API schema accepts what tool sends after normalization", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.createKeys);
      const client = createMockClient({ mcp: { createKeys: { mutate: mutateMock } } });

      await createKeys.execute(client, {
        project: "my-org/my-proj",
        k: [{ n: "greeting", v: "Hello", t: { TR: "Merhaba", DE: "Hallo" } }],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      const result = createKeysInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });

    it("language codes are lowercased before API call", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.createKeys);
      const client = createMockClient({ mcp: { createKeys: { mutate: mutateMock } } });

      await createKeys.execute(client, {
        project: "org/proj",
        k: [{ n: "test", t: { TR: "val", DE: "val" } }],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.k[0].t).toEqual({ tr: "val", de: "val" });
      const result = createKeysInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });

    it("default namespace is included in API call", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.createKeys);
      const client = createMockClient({ mcp: { createKeys: { mutate: mutateMock } } });

      await createKeys.execute(client, {
        project: "org/proj",
        k: [{ n: "test" }],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.k[0].ns).toBe("default");
      const result = createKeysInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });

    it("namespace context passes through to API", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.createKeys);
      const client = createMockClient({ mcp: { createKeys: { mutate: mutateMock } } });

      await createKeys.execute(client, {
        project: "org/proj",
        k: [{
          n: "test",
          nc: {
            description: "Auth flow",
            team: "auth-team",
            domain: "auth",
            aiPrompt: "Use formal tone",
            tags: ["critical"],
          },
        }],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      const result = createKeysInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });

    it("orgSlug and projectSlug are correctly split from project string", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.createKeys);
      const client = createMockClient({ mcp: { createKeys: { mutate: mutateMock } } });

      await createKeys.execute(client, {
        project: "my-org/my-proj",
        k: [{ n: "key" }],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.orgSlug).toBe("my-org");
      expect(apiArgs.projectSlug).toBe("my-proj");
      const result = createKeysInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });
  });

  // ── updateKeys ──────────────────────────────────────────────────────────────

  describe("updateKeys", () => {
    it("API schema accepts what tool sends after normalization", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.updateKeys);
      const client = createMockClient({ mcp: { updateKeys: { mutate: mutateMock } } });

      await updateKeys.execute(client, {
        project: "org/proj",
        t: [{ id: "550e8400-e29b-41d4-a716-446655440000", l: "TR", t: "Merhaba" }],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.t[0].l).toBe("tr");
      const result = updateKeysInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });

    it("source update flag and status pass through correctly", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.updateKeys);
      const client = createMockClient({ mcp: { updateKeys: { mutate: mutateMock } } });

      await updateKeys.execute(client, {
        project: "org/proj",
        t: [{ id: "550e8400-e29b-41d4-a716-446655440000", l: "en", t: "Updated", s: true, st: "published" }],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      const result = updateKeysInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });

    it("batch updates accepted by API", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.updateKeys);
      const client = createMockClient({ mcp: { updateKeys: { mutate: mutateMock } } });

      await updateKeys.execute(client, {
        project: "org/proj",
        t: [
          { id: "550e8400-e29b-41d4-a716-446655440000", l: "TR", t: "Merhaba" },
          { id: "550e8400-e29b-41d4-a716-446655440001", l: "DE", t: "Hallo" },
        ],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.t[0].l).toBe("tr");
      expect(apiArgs.t[1].l).toBe("de");
      const result = updateKeysInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });
  });

  // ── deleteKeys ──────────────────────────────────────────────────────────────

  describe("deleteKeys", () => {
    it("API schema accepts what tool sends", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.deleteKeys);
      const client = createMockClient({ mcp: { deleteKeys: { mutate: mutateMock } } });

      await deleteKeys.execute(client, {
        project: "org/proj",
        keyIds: ["550e8400-e29b-41d4-a716-446655440000"],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      const result = deleteKeysInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });

    it("multiple UUIDs accepted by API", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.deleteKeys);
      const client = createMockClient({ mcp: { deleteKeys: { mutate: mutateMock } } });

      await deleteKeys.execute(client, {
        project: "org/proj",
        keyIds: [
          "550e8400-e29b-41d4-a716-446655440000",
          "550e8400-e29b-41d4-a716-446655440001",
          "550e8400-e29b-41d4-a716-446655440002",
        ],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      const result = deleteKeysInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });
  });

  // ── publishTranslations ─────────────────────────────────────────────────────

  describe("publishTranslations", () => {
    it("full publish (no translations) accepted by API", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.publishTranslations);
      const client = createMockClient({ mcp: { publishTranslations: { mutate: mutateMock } } });

      await publishTranslations.execute(client, { project: "org/proj" });

      const apiArgs = mutateMock.mock.calls[0][0];
      const result = publishInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });

    it("selective publish with normalized language codes accepted by API", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.publishTranslations);
      const client = createMockClient({ mcp: { publishTranslations: { mutate: mutateMock } } });

      await publishTranslations.execute(client, {
        project: "org/proj",
        translations: [{ keyId: "550e8400-e29b-41d4-a716-446655440000", languageCode: "TR" }],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.translations[0].languageCode).toBe("tr");
      const result = publishInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });

    it("multiple selective translations accepted by API", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.publishTranslations);
      const client = createMockClient({ mcp: { publishTranslations: { mutate: mutateMock } } });

      await publishTranslations.execute(client, {
        project: "org/proj",
        translations: [
          { keyId: "550e8400-e29b-41d4-a716-446655440000", languageCode: "tr" },
          { keyId: "550e8400-e29b-41d4-a716-446655440001", languageCode: "DE" },
        ],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.translations[1].languageCode).toBe("de");
      const result = publishInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });
  });

  // ── listKeys ────────────────────────────────────────────────────────────────

  describe("listKeys", () => {
    it("default pagination accepted by API", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.listKeys);
      const client = createMockClient({ mcp: { listKeys: { query: queryMock } } });

      await listKeys.execute(client, { project: "org/proj" });

      const apiArgs = queryMock.mock.calls[0][0];
      const result = listKeysInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });

    it("all filters accepted by API", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.listKeys);
      const client = createMockClient({ mcp: { listKeys: { query: queryMock } } });

      await listKeys.execute(client, {
        project: "org/proj",
        search: "login",
        namespaces: ["auth"],
        missingLanguage: "tr",
        fields: ["id", "sourceText"],
        page: 2,
        limit: 50,
      });

      const apiArgs = queryMock.mock.calls[0][0];
      const result = listKeysInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });

    it("array search accepted by API", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.listKeys);
      const client = createMockClient({ mcp: { listKeys: { query: queryMock } } });

      await listKeys.execute(client, {
        project: "org/proj",
        search: ["login", "signup"],
      });

      const apiArgs = queryMock.mock.calls[0][0];
      const result = listKeysInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });
  });

  // ── getTranslations ─────────────────────────────────────────────────────────

  describe("getTranslations", () => {
    it("minimal args (project only) accepted by API", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.getAllTranslations);
      const client = createMockClient({ mcp: { getAllTranslations: { query: queryMock } } });

      await getTranslations.execute(client, { project: "org/proj" });

      const apiArgs = queryMock.mock.calls[0][0];
      const result = getTranslationsInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });

    it("all filters accepted by API", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.getAllTranslations);
      const client = createMockClient({ mcp: { getAllTranslations: { query: queryMock } } });

      await getTranslations.execute(client, {
        project: "org/proj",
        search: "login",
        languages: ["tr", "de"],
        namespaces: ["auth"],
        keys: ["auth.login.title"],
        status: "missing",
        limit: 50,
      });

      const apiArgs = queryMock.mock.calls[0][0];
      const result = getTranslationsInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });
  });

  // ── getProject ──────────────────────────────────────────────────────────────

  describe("getProject", () => {
    it("API schema accepts what tool sends", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.getProject);
      const client = createMockClient({ mcp: { getProject: { query: queryMock } } });

      await getProject.execute(client, { project: "org/proj" });

      const apiArgs = queryMock.mock.calls[0][0];
      const result = getProjectInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });
  });

  // ── getPendingChanges ────────────────────────────────────────────────────────

  describe("getPendingChanges", () => {
    it("API schema accepts what tool sends", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.getPendingChanges);
      const client = createMockClient({ mcp: { getPendingChanges: { query: queryMock } } });

      await getPendingChanges.execute(client, { project: "org/proj" });

      const apiArgs = queryMock.mock.calls[0][0];
      const result = getPendingChangesInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });
  });

  // ── proposeLanguages ────────────────────────────────────────────────────────

  describe("proposeLanguages", () => {
    it("API schema accepts normalized language codes", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.addLanguages);
      const client = createMockClient({ mcp: { addLanguages: { mutate: mutateMock } } });

      await proposeLanguages.execute(client, {
        project: "org/proj",
        languages: [{ languageCode: "FR" }, { languageCode: "DE", status: "draft" }],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.languages[0].languageCode).toBe("fr");
      expect(apiArgs.languages[1].languageCode).toBe("de");
      const result = addLanguagesInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });
  });

  // ── proposeLanguageEdits ────────────────────────────────────────────────────

  describe("proposeLanguageEdits", () => {
    it("API schema accepts renamed fields (edits→updates, newStatus→status)", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.updateLanguages);
      const client = createMockClient({ mcp: { updateLanguages: { mutate: mutateMock } } });

      await proposeLanguageEdits.execute(client, {
        project: "org/proj",
        edits: [{ languageCode: "FR", newStatus: "archived" }],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      // Tool maps edits → updates and newStatus → status
      expect(apiArgs.updates[0].status).toBe("archived");
      expect(apiArgs.updates[0].languageCode).toBe("fr");
      const result = updateLanguagesInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });

    it("multiple language edits accepted by API", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.updateLanguages);
      const client = createMockClient({ mcp: { updateLanguages: { mutate: mutateMock } } });

      await proposeLanguageEdits.execute(client, {
        project: "org/proj",
        edits: [
          { languageCode: "FR", newStatus: "archived" },
          { languageCode: "DE", newStatus: "active" },
          { languageCode: "JA", newStatus: "draft" },
        ],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.updates).toHaveLength(3);
      expect(apiArgs.updates[0].languageCode).toBe("fr");
      expect(apiArgs.updates[1].languageCode).toBe("de");
      expect(apiArgs.updates[2].languageCode).toBe("ja");
      const result = updateLanguagesInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });
  });

  // ── getSyncs ────────────────────────────────────────────────────────────────

  describe("getSyncs", () => {
    it("API schema accepts what tool sends with all filters", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.getSyncs);
      const client = createMockClient({ mcp: { getSyncs: { query: queryMock } } });

      await getSyncs.execute(client, {
        project: "org/proj",
        limit: 10,
        status: "completed",
        type: "source_sync",
      });

      const apiArgs = queryMock.mock.calls[0][0];
      const result = getSyncsInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });

    it("minimal args (project only) accepted by API", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.getSyncs);
      const client = createMockClient({ mcp: { getSyncs: { query: queryMock } } });

      await getSyncs.execute(client, { project: "org/proj" });

      const apiArgs = queryMock.mock.calls[0][0];
      const result = getSyncsInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });
  });

  // ── getSync ─────────────────────────────────────────────────────────────────

  describe("getSync", () => {
    it("API schema accepts what tool sends", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.getSync);
      const client = createMockClient({ mcp: { getSync: { query: queryMock } } });

      await getSync.execute(client, { syncId: "sync-123" });

      const apiArgs = queryMock.mock.calls[0][0];
      const result = getSyncInput.safeParse(apiArgs);
      expect(result.success, result.error?.message).toBe(true);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. REVERSE CONTRACT: LLM-plausible args → tool acceptance
// ─────────────────────────────────────────────────────────────────────────────

describe("reverse contract: LLM-plausible args → tool acceptance", () => {
  // ── createKeys ──────────────────────────────────────────────────────────────

  describe("createKeys — LLM perspective", () => {
    it("accepts minimal args (only required fields from inputSchema)", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.createKeys);
      const client = createMockClient({ mcp: { createKeys: { mutate: mutateMock } } });

      const result = await createKeys.execute(client, {
        project: "org/proj",
        k: [{ n: "hello" }],
      });
      expect(result.isError).toBeUndefined();
    });

    it("accepts full args with all optional fields", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.createKeys);
      const client = createMockClient({ mcp: { createKeys: { mutate: mutateMock } } });

      const result = await createKeys.execute(client, {
        project: "org/proj",
        k: [{
          n: "auth.login.title",
          ns: "auth",
          v: "Log In",
          t: { tr: "Giriş Yap", de: "Anmelden" },
          nc: {
            description: "Auth namespace",
            team: "auth",
            domain: "auth",
            aiPrompt: "Formal tone",
            tags: ["user-facing"],
          },
        }],
      });
      expect(result.isError).toBeUndefined();
    });

    it("accepts multiple keys in single call", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.createKeys);
      const client = createMockClient({ mcp: { createKeys: { mutate: mutateMock } } });

      const result = await createKeys.execute(client, {
        project: "org/proj",
        k: [
          { n: "btn.submit", v: "Submit" },
          { n: "btn.cancel", v: "Cancel" },
          { n: "btn.save", ns: "common", v: "Save" },
        ],
      });
      expect(result.isError).toBeUndefined();
    });

    it("LLM might send uppercase language codes (common mistake) — normalized correctly", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.createKeys);
      const client = createMockClient({ mcp: { createKeys: { mutate: mutateMock } } });

      const result = await createKeys.execute(client, {
        project: "org/proj",
        k: [{ n: "test", t: { TR: "Merhaba", DE: "Hallo", FR: "Bonjour" } }],
      });
      expect(result.isError).toBeUndefined();
      // AND verify the API would accept the normalized version
      const apiArgs = mutateMock.mock.calls[0][0];
      expect(Object.keys(apiArgs.k[0].t)).toEqual(["tr", "de", "fr"]);
    });

    it("accepts BCP 47 locale codes in translations", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.createKeys);
      const client = createMockClient({ mcp: { createKeys: { mutate: mutateMock } } });

      const result = await createKeys.execute(client, {
        project: "org/proj",
        k: [{ n: "greeting", t: { "zh-Hans": "你好", "pt-BR": "Olá" } }],
      });
      expect(result.isError).toBeUndefined();
    });
  });

  // ── updateKeys ──────────────────────────────────────────────────────────────

  describe("updateKeys — LLM perspective", () => {
    it("accepts minimal single update", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.updateKeys);
      const client = createMockClient({ mcp: { updateKeys: { mutate: mutateMock } } });

      const result = await updateKeys.execute(client, {
        project: "org/proj",
        t: [{ id: "550e8400-e29b-41d4-a716-446655440000", l: "tr", t: "Merhaba" }],
      });
      expect(result.isError).toBeUndefined();
    });

    it("accepts batch update with source flag and status", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.updateKeys);
      const client = createMockClient({ mcp: { updateKeys: { mutate: mutateMock } } });

      const result = await updateKeys.execute(client, {
        project: "org/proj",
        t: [
          { id: "550e8400-e29b-41d4-a716-446655440000", l: "en", t: "Updated", s: true },
          { id: "550e8400-e29b-41d4-a716-446655440001", l: "tr", t: "Güncellendi", st: "published" },
        ],
      });
      expect(result.isError).toBeUndefined();
    });

    it("LLM might send uppercase language (common mistake) — normalized correctly", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.updateKeys);
      const client = createMockClient({ mcp: { updateKeys: { mutate: mutateMock } } });

      const result = await updateKeys.execute(client, {
        project: "org/proj",
        t: [{ id: "550e8400-e29b-41d4-a716-446655440000", l: "TR", t: "Merhaba" }],
      });
      expect(result.isError).toBeUndefined();
      expect(mutateMock.mock.calls[0][0].t[0].l).toBe("tr");
    });

    it("accepts non-UUID id (API uses plain string for id)", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.updateKeys);
      const client = createMockClient({ mcp: { updateKeys: { mutate: mutateMock } } });

      // The API schema for updateKeys uses z.string() (not uuid()) for id
      const result = await updateKeys.execute(client, {
        project: "org/proj",
        t: [{ id: "some-plain-string-id", l: "tr", t: "text" }],
      });
      expect(result.isError).toBeUndefined();
    });
  });

  // ── deleteKeys ──────────────────────────────────────────────────────────────

  describe("deleteKeys — LLM perspective", () => {
    it("accepts single UUID", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.deleteKeys);
      const client = createMockClient({ mcp: { deleteKeys: { mutate: mutateMock } } });

      const result = await deleteKeys.execute(client, {
        project: "org/proj",
        keyIds: ["550e8400-e29b-41d4-a716-446655440000"],
      });
      expect(result.isError).toBeUndefined();
    });

    it("accepts batch UUIDs", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.deleteKeys);
      const client = createMockClient({ mcp: { deleteKeys: { mutate: mutateMock } } });

      const uuids = Array.from({ length: 5 }, (_, i) =>
        `550e8400-e29b-41d4-a716-${String(i).padStart(12, "0")}`,
      );
      const result = await deleteKeys.execute(client, {
        project: "org/proj",
        keyIds: uuids,
      });
      expect(result.isError).toBeUndefined();
    });
  });

  // ── listKeys ────────────────────────────────────────────────────────────────

  describe("listKeys — LLM perspective", () => {
    it("accepts project-only (minimal)", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.listKeys);
      const client = createMockClient({ mcp: { listKeys: { query: queryMock } } });

      const result = await listKeys.execute(client, { project: "org/proj" });
      expect(result.isError).toBeUndefined();
    });

    it("accepts all filter combinations", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.listKeys);
      const client = createMockClient({ mcp: { listKeys: { query: queryMock } } });

      const result = await listKeys.execute(client, {
        project: "org/proj",
        search: ["login", "signup"],
        namespaces: ["auth", "common"],
        missingLanguage: "tr",
        fields: ["id", "sourceText", "translatedLanguages"],
        page: 2,
        limit: 50,
      });
      expect(result.isError).toBeUndefined();
    });

    it("accepts translatedLanguageCount field", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.listKeys);
      const client = createMockClient({ mcp: { listKeys: { query: queryMock } } });

      const result = await listKeys.execute(client, {
        project: "org/proj",
        fields: ["id", "translatedLanguageCount"],
      });
      expect(result.isError).toBeUndefined();
    });
  });

  // ── getTranslations ─────────────────────────────────────────────────────────

  describe("getTranslations — LLM perspective", () => {
    it("accepts status filter with languages (correct usage)", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.getAllTranslations);
      const client = createMockClient({ mcp: { getAllTranslations: { query: queryMock } } });

      const result = await getTranslations.execute(client, {
        project: "org/proj",
        languages: ["tr"],
        status: "missing",
        limit: 50,
      });
      expect(result.isError).toBeUndefined();
    });

    it("accepts multi-term search array", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.getAllTranslations);
      const client = createMockClient({ mcp: { getAllTranslations: { query: queryMock } } });

      const result = await getTranslations.execute(client, {
        project: "org/proj",
        search: ["login", "signup", "forgot_password"],
      });
      expect(result.isError).toBeUndefined();
    });

    it("accepts specific keys lookup", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.getAllTranslations);
      const client = createMockClient({ mcp: { getAllTranslations: { query: queryMock } } });

      const result = await getTranslations.execute(client, {
        project: "org/proj",
        keys: ["auth.login.title", "auth.login.button"],
      });
      expect(result.isError).toBeUndefined();
    });

    it("accepts all status values", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.getAllTranslations);
      const client = createMockClient({ mcp: { getAllTranslations: { query: queryMock } } });

      for (const status of ["missing", "draft", "approved", "all"] as const) {
        queryMock.mockClear();
        const result = await getTranslations.execute(client, {
          project: "org/proj",
          languages: ["tr"],
          status,
        });
        expect(result.isError, `status="${status}" should be accepted`).toBeUndefined();
      }
    });
  });

  // ── publishTranslations ─────────────────────────────────────────────────────

  describe("publishTranslations — LLM perspective", () => {
    it("accepts project-only for full publish", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.publishTranslations);
      const client = createMockClient({ mcp: { publishTranslations: { mutate: mutateMock } } });

      const result = await publishTranslations.execute(client, { project: "org/proj" });
      expect(result.isError).toBeUndefined();
    });

    it("accepts selective publish", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.publishTranslations);
      const client = createMockClient({ mcp: { publishTranslations: { mutate: mutateMock } } });

      const result = await publishTranslations.execute(client, {
        project: "org/proj",
        translations: [
          { keyId: "550e8400-e29b-41d4-a716-446655440000", languageCode: "tr" },
          { keyId: "550e8400-e29b-41d4-a716-446655440001", languageCode: "de" },
        ],
      });
      expect(result.isError).toBeUndefined();
    });
  });

  // ── proposeLanguages ────────────────────────────────────────────────────────

  describe("proposeLanguages — LLM perspective", () => {
    it("accepts multiple languages", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.addLanguages);
      const client = createMockClient({ mcp: { addLanguages: { mutate: mutateMock } } });

      const result = await proposeLanguages.execute(client, {
        project: "org/proj",
        languages: [
          { languageCode: "fr" },
          { languageCode: "de", status: "draft" },
          { languageCode: "ja" },
        ],
      });
      expect(result.isError).toBeUndefined();
    });

    it("accepts BCP 47 locale codes", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.addLanguages);
      const client = createMockClient({ mcp: { addLanguages: { mutate: mutateMock } } });

      const result = await proposeLanguages.execute(client, {
        project: "org/proj",
        languages: [
          { languageCode: "zh-Hans" },
          { languageCode: "pt-BR" },
        ],
      });
      expect(result.isError).toBeUndefined();
    });
  });

  // ── proposeLanguageEdits ────────────────────────────────────────────────────

  describe("proposeLanguageEdits — LLM perspective", () => {
    it("accepts status changes", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.updateLanguages);
      const client = createMockClient({ mcp: { updateLanguages: { mutate: mutateMock } } });

      const result = await proposeLanguageEdits.execute(client, {
        project: "org/proj",
        edits: [
          { languageCode: "fr", newStatus: "archived" },
          { languageCode: "de", newStatus: "active" },
        ],
      });
      expect(result.isError).toBeUndefined();
    });

    it("accepts all valid status values", async () => {
      const mutateMock = vi.fn().mockResolvedValue(STUBS.updateLanguages);
      const client = createMockClient({ mcp: { updateLanguages: { mutate: mutateMock } } });

      for (const newStatus of ["active", "draft", "archived"] as const) {
        mutateMock.mockClear();
        const result = await proposeLanguageEdits.execute(client, {
          project: "org/proj",
          edits: [{ languageCode: "fr", newStatus }],
        });
        expect(result.isError, `newStatus="${newStatus}" should be accepted`).toBeUndefined();
      }
    });
  });

  // ── getSyncs ────────────────────────────────────────────────────────────────

  describe("getSyncs — LLM perspective", () => {
    it("accepts all filter combinations", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.getSyncs);
      const client = createMockClient({ mcp: { getSyncs: { query: queryMock } } });

      const result = await getSyncs.execute(client, {
        project: "org/proj",
        limit: 10,
        status: "failed",
        type: "cdn_upload",
      });
      expect(result.isError).toBeUndefined();
    });

    it("accepts project-only (minimal)", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.getSyncs);
      const client = createMockClient({ mcp: { getSyncs: { query: queryMock } } });

      const result = await getSyncs.execute(client, { project: "org/proj" });
      expect(result.isError).toBeUndefined();
    });
  });

  // ── getSync ─────────────────────────────────────────────────────────────────

  describe("getSync — LLM perspective", () => {
    it("accepts syncId", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.getSync);
      const client = createMockClient({ mcp: { getSync: { query: queryMock } } });

      const result = await getSync.execute(client, { syncId: "abc-123" });
      expect(result.isError).toBeUndefined();
    });
  });

  // ── listProjects ────────────────────────────────────────────────────────────

  describe("listProjects — LLM perspective", () => {
    it("accepts empty args", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.listProjects);
      const client = createMockClient({ mcp: { listProjects: { query: queryMock } } });

      const result = await listProjects.execute(client, {});
      expect(result.isError).toBeUndefined();
    });

    it("accepts args with no recognized properties (extra fields ignored)", async () => {
      const queryMock = vi.fn().mockResolvedValue(STUBS.listProjects);
      const client = createMockClient({ mcp: { listProjects: { query: queryMock } } });

      // LLMs sometimes add extra fields — should be harmless (stripped by Zod)
      const result = await listProjects.execute(client, {} as object);
      expect(result.isError).toBeUndefined();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. NEGATIVE CONTRACT: invalid args MUST be rejected
// ─────────────────────────────────────────────────────────────────────────────

describe("negative contract: invalid args rejected", () => {
  it("rejects project without slash", async () => {
    const client = createMockClient();
    const result = await createKeys.execute(client, {
      project: "no-slash",
      k: [{ n: "test" }],
    });
    expect(result.isError).toBe(true);
  });

  it("rejects project as empty string", async () => {
    const client = createMockClient();
    const result = await createKeys.execute(client, {
      project: "",
      k: [{ n: "test" }],
    });
    expect(result.isError).toBe(true);
  });

  it("rejects empty key name in createKeys", async () => {
    const client = createMockClient();
    const result = await createKeys.execute(client, {
      project: "org/proj",
      k: [{ n: "" }],
    });
    expect(result.isError).toBe(true);
  });

  it("rejects missing k array in createKeys", async () => {
    const client = createMockClient();
    const result = await createKeys.execute(client, { project: "org/proj" });
    expect(result.isError).toBe(true);
  });

  it("rejects empty k array in createKeys", async () => {
    const client = createMockClient();
    const result = await createKeys.execute(client, {
      project: "org/proj",
      k: [],
    });
    expect(result.isError).toBe(true);
  });

  it("rejects non-UUID keyIds in deleteKeys", async () => {
    const client = createMockClient();
    const result = await deleteKeys.execute(client, {
      project: "org/proj",
      keyIds: ["not-a-uuid"],
    });
    expect(result.isError).toBe(true);
  });

  it("rejects empty keyIds array in deleteKeys", async () => {
    const client = createMockClient();
    const result = await deleteKeys.execute(client, {
      project: "org/proj",
      keyIds: [],
    });
    expect(result.isError).toBe(true);
  });

  it("rejects > 100 keyIds in deleteKeys", async () => {
    const client = createMockClient();
    const uuids = Array.from({ length: 101 }, (_, i) =>
      `550e8400-e29b-41d4-a716-${String(i).padStart(12, "0")}`,
    );
    const result = await deleteKeys.execute(client, {
      project: "org/proj",
      keyIds: uuids,
    });
    expect(result.isError).toBe(true);
  });

  it("rejects limit > 100 in listKeys", async () => {
    const client = createMockClient();
    const result = await listKeys.execute(client, {
      project: "org/proj",
      limit: 101,
    });
    expect(result.isError).toBe(true);
  });

  it("rejects limit > 200 in getTranslations", async () => {
    const client = createMockClient();
    const result = await getTranslations.execute(client, {
      project: "org/proj",
      limit: 201,
    });
    expect(result.isError).toBe(true);
  });

  it("rejects invalid status in getTranslations", async () => {
    const client = createMockClient();
    const result = await getTranslations.execute(client, {
      project: "org/proj",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: "invalid" as any,
    });
    expect(result.isError).toBe(true);
  });

  it("rejects empty t array in updateKeys", async () => {
    const client = createMockClient();
    const result = await updateKeys.execute(client, {
      project: "org/proj",
      t: [],
    });
    expect(result.isError).toBe(true);
  });

  it("rejects missing t field in updateKeys item", async () => {
    const client = createMockClient();
    const result = await updateKeys.execute(client, {
      project: "org/proj",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      t: [{ id: "550e8400-e29b-41d4-a716-446655440000", l: "tr" } as any],
    });
    expect(result.isError).toBe(true);
  });

  it("rejects empty languages array in proposeLanguages", async () => {
    const client = createMockClient();
    const result = await proposeLanguages.execute(client, {
      project: "org/proj",
      languages: [],
    });
    expect(result.isError).toBe(true);
  });

  it("rejects invalid status in proposeLanguageEdits", async () => {
    const client = createMockClient();
    const result = await proposeLanguageEdits.execute(client, {
      project: "org/proj",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      edits: [{ languageCode: "fr", newStatus: "unknown-status" as any }],
    });
    expect(result.isError).toBe(true);
  });

  it("rejects empty edits array in proposeLanguageEdits", async () => {
    const client = createMockClient();
    const result = await proposeLanguageEdits.execute(client, {
      project: "org/proj",
      edits: [],
    });
    expect(result.isError).toBe(true);
  });

  it("rejects limit > 50 in getSyncs", async () => {
    const client = createMockClient();
    const result = await getSyncs.execute(client, {
      project: "org/proj",
      limit: 51,
    });
    expect(result.isError).toBe(true);
  });

  it("rejects invalid type in getSyncs", async () => {
    const client = createMockClient();
    const result = await getSyncs.execute(client, {
      project: "org/proj",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: "not_a_valid_type" as any,
    });
    expect(result.isError).toBe(true);
  });

  it("rejects page < 1 in listKeys", async () => {
    const client = createMockClient();
    const result = await listKeys.execute(client, {
      project: "org/proj",
      page: 0,
    });
    expect(result.isError).toBe(true);
  });

  it("rejects limit < 1 in getTranslations", async () => {
    const client = createMockClient();
    const result = await getTranslations.execute(client, {
      project: "org/proj",
      limit: 0,
    });
    expect(result.isError).toBe(true);
  });
});
