import { describe, it, expect, vi } from "vitest";
import { bulkCreateEntries } from "../bulkCreateEntries.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectError, expectSuccess } from "../../__tests__/helpers.js";

describe("bulkCreateEntries", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await bulkCreateEntries.execute(client, {
        modelSlug: "blog-posts",
        entries: [{ title: "Post 1", slug: "post-1" }],
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing modelSlug", async () => {
      const client = createMockClient();
      const result = await bulkCreateEntries.execute(client, {
        project: "org/proj",
        entries: [{ title: "Post 1", slug: "post-1" }],
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing entries array", async () => {
      const client = createMockClient();
      const result = await bulkCreateEntries.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects empty entries array", async () => {
      const client = createMockClient();
      const result = await bulkCreateEntries.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        entries: [],
      });
      expect(result.isError).toBe(true);
    });

    it("rejects more than 20 entries", async () => {
      const client = createMockClient();
      const manyEntries = Array.from({ length: 21 }, (_, i) => ({
        title: `Post ${i}`,
        slug: `post-${i}`,
      }));
      const result = await bulkCreateEntries.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        entries: manyEntries,
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("data normalization", () => {
    it("normalizes translation keys to lowercase in entries", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ created: 1, failed: [] });
      const client = createMockClient({
        mcpContent: { bulkCreateEntries: { mutate: mutateMock } },
      });

      await bulkCreateEntries.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        entries: [
          {
            title: "Merhaba",
            slug: "merhaba",
            translations: {
              EN: { title: "Hello" },
              DE: { title: "Hallo" },
            },
          },
        ],
      });

      const call = mutateMock.mock.calls[0][0];
      const entryTranslations = call.entries[0].translations;
      expect(Object.keys(entryTranslations)).toContain("en");
      expect(Object.keys(entryTranslations)).toContain("de");
      expect(Object.keys(entryTranslations)).not.toContain("EN");
      expect(Object.keys(entryTranslations)).not.toContain("DE");
    });
  });

  describe("API call", () => {
    it("calls API with correct params", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ created: 2, failed: [] });
      const client = createMockClient({
        mcpContent: { bulkCreateEntries: { mutate: mutateMock } },
      });

      await bulkCreateEntries.execute(client, {
        project: "my-org/my-proj",
        modelSlug: "blog-posts",
        entries: [
          { title: "Post 1", slug: "post-1" },
          { title: "Post 2", slug: "post-2" },
        ],
      });

      expect(mutateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          orgSlug: "my-org",
          projectSlug: "my-proj",
          modelSlug: "blog-posts",
        }),
      );

      const call = mutateMock.mock.calls[0][0];
      expect(call.entries).toHaveLength(2);
    });

    it("returns success with API response", async () => {
      const apiResponse = { created: 2, failed: [] };
      const mutateMock = vi.fn().mockResolvedValue(apiResponse);
      const client = createMockClient({
        mcpContent: { bulkCreateEntries: { mutate: mutateMock } },
      });

      const result = await bulkCreateEntries.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        entries: [
          { title: "Post 1", slug: "post-1" },
          { title: "Post 2", slug: "post-2" },
        ],
      });

      const parsed = expectSuccess(result) as Record<string, unknown>;
      expect(parsed.created).toBe(2);
      expect(parsed.failed).toEqual([]);
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const mutateMock = vi.fn().mockRejectedValue(new Error("Bulk create failed"));
      const client = createMockClient({
        mcpContent: { bulkCreateEntries: { mutate: mutateMock } },
      });

      const result = await bulkCreateEntries.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        entries: [{ title: "Post 1", slug: "post-1" }],
      });

      const msg = expectError(result);
      expect(msg).toContain("Bulk create failed");
    });
  });
});
