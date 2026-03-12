import { describe, it, expect, vi } from "vitest";
import { bulkUpdateEntries } from "../bulkUpdateEntries.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectError, expectSuccess } from "../../__tests__/helpers.js";

describe("bulkUpdateEntries", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await bulkUpdateEntries.execute(client, {
        entries: [{ entryId: "00000000-0000-0000-0000-000000000001" }],
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing entries array", async () => {
      const client = createMockClient();
      const result = await bulkUpdateEntries.execute(client, {
        project: "org/proj",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects empty entries array", async () => {
      const client = createMockClient();
      const result = await bulkUpdateEntries.execute(client, {
        project: "org/proj",
        entries: [],
      });
      expect(result.isError).toBe(true);
    });

    it("rejects more than 20 entries", async () => {
      const client = createMockClient();
      const manyEntries = Array.from({ length: 21 }, (_, i) => ({
        entryId: `00000000-0000-0000-0000-${String(i + 1).padStart(12, "0")}`,
      }));
      const result = await bulkUpdateEntries.execute(client, {
        project: "org/proj",
        entries: manyEntries,
      });
      expect(result.isError).toBe(true);
    });

    it("rejects invalid UUID for entryId", async () => {
      const client = createMockClient();
      const result = await bulkUpdateEntries.execute(client, {
        project: "org/proj",
        entries: [{ entryId: "not-a-uuid" }],
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("data normalization", () => {
    it("normalizes translation keys to lowercase", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ updated: 1, entries: [], failed: [] });
      const client = createMockClient({
        mcpContent: { bulkUpdateEntries: { mutate: mutateMock } },
      });

      await bulkUpdateEntries.execute(client, {
        project: "org/proj",
        entries: [
          {
            entryId: "00000000-0000-0000-0000-000000000001",
            translations: {
              TR: { title: "Merhaba" },
              DE: { title: "Hallo" },
            },
          },
        ],
      });

      const call = mutateMock.mock.calls[0][0];
      const entryTranslations = call.entries[0].translations;
      expect(Object.keys(entryTranslations)).toContain("tr");
      expect(Object.keys(entryTranslations)).toContain("de");
      expect(Object.keys(entryTranslations)).not.toContain("TR");
      expect(Object.keys(entryTranslations)).not.toContain("DE");
    });

    it("normalizes top-level languageCode to lowercase", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ updated: 1, entries: [], failed: [] });
      const client = createMockClient({
        mcpContent: { bulkUpdateEntries: { mutate: mutateMock } },
      });

      await bulkUpdateEntries.execute(client, {
        project: "org/proj",
        entries: [
          {
            entryId: "00000000-0000-0000-0000-000000000001",
            languageCode: "TR",
            title: "Merhaba",
          },
        ],
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.entries[0].languageCode).toBe("tr");
    });
  });

  describe("API call", () => {
    it("calls API with correct params", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ updated: 2, entries: [], failed: [] });
      const client = createMockClient({
        mcpContent: { bulkUpdateEntries: { mutate: mutateMock } },
      });

      await bulkUpdateEntries.execute(client, {
        project: "my-org/my-proj",
        entries: [
          { entryId: "00000000-0000-0000-0000-000000000001", languageCode: "tr", title: "Başlık" },
          { entryId: "00000000-0000-0000-0000-000000000002", languageCode: "tr", title: "İkinci" },
        ],
      });

      expect(mutateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          orgSlug: "my-org",
          projectSlug: "my-proj",
        }),
      );

      const call = mutateMock.mock.calls[0][0];
      expect(call.entries).toHaveLength(2);
    });

    it("returns success with API response", async () => {
      const apiResponse = {
        updated: 2,
        entries: [
          { id: "00000000-0000-0000-0000-000000000001", st: "published" },
          { id: "00000000-0000-0000-0000-000000000002", st: "published" },
        ],
        failed: [],
      };
      const mutateMock = vi.fn().mockResolvedValue(apiResponse);
      const client = createMockClient({
        mcpContent: { bulkUpdateEntries: { mutate: mutateMock } },
      });

      const result = await bulkUpdateEntries.execute(client, {
        project: "org/proj",
        entries: [
          { entryId: "00000000-0000-0000-0000-000000000001", languageCode: "tr", title: "A" },
          { entryId: "00000000-0000-0000-0000-000000000002", languageCode: "tr", title: "B" },
        ],
      });

      const parsed = expectSuccess(result) as Record<string, unknown>;
      expect(parsed.updated).toBe(2);
      expect(parsed.failed).toEqual([]);
    });

    it("reflects partial success: failed array populated", async () => {
      const apiResponse = {
        updated: 1,
        entries: [{ id: "00000000-0000-0000-0000-000000000001", st: "published" }],
        failed: [{ idx: 1, id: "00000000-0000-0000-0000-000000000002", err: "Not found" }],
      };
      const mutateMock = vi.fn().mockResolvedValue(apiResponse);
      const client = createMockClient({
        mcpContent: { bulkUpdateEntries: { mutate: mutateMock } },
      });

      const result = await bulkUpdateEntries.execute(client, {
        project: "org/proj",
        entries: [
          { entryId: "00000000-0000-0000-0000-000000000001", languageCode: "tr", title: "A" },
          { entryId: "00000000-0000-0000-0000-000000000002", languageCode: "tr", title: "B" },
        ],
      });

      const parsed = expectSuccess(result) as Record<string, unknown>;
      expect(parsed.updated).toBe(1);
      expect((parsed.failed as unknown[]).length).toBe(1);
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const mutateMock = vi.fn().mockRejectedValue(new Error("Bulk update failed"));
      const client = createMockClient({
        mcpContent: { bulkUpdateEntries: { mutate: mutateMock } },
      });

      const result = await bulkUpdateEntries.execute(client, {
        project: "org/proj",
        entries: [{ entryId: "00000000-0000-0000-0000-000000000001" }],
      });

      const msg = expectError(result);
      expect(msg).toContain("Bulk update failed");
    });
  });
});
