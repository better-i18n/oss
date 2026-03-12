import { describe, it, expect, vi } from "vitest";
import { createContentEntry } from "../createContentEntry.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectError, expectSuccess } from "../../__tests__/helpers.js";

const MOCK_ENTRY = { id: "entry-1", slug: "hello-world", title: "Hello World" };

describe("createContentEntry", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await createContentEntry.execute(client, {
        modelSlug: "blog-posts",
        title: "Hello World",
        slug: "hello-world",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing modelSlug", async () => {
      const client = createMockClient();
      const result = await createContentEntry.execute(client, {
        project: "org/proj",
        title: "Hello World",
        slug: "hello-world",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing title", async () => {
      const client = createMockClient();
      const result = await createContentEntry.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        slug: "hello-world",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing slug", async () => {
      const client = createMockClient();
      const result = await createContentEntry.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        title: "Hello World",
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("data normalization", () => {
    it("normalizes translation keys to lowercase", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { createContentEntry: { mutate: mutateMock } },
      });

      await createContentEntry.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        title: "Merhaba Dünya",
        slug: "merhaba-dunya",
        translations: {
          EN: { title: "Hello World" },
          DE: { title: "Hallo Welt" },
        },
      });

      const call = mutateMock.mock.calls[0][0];
      expect(Object.keys(call.translations)).toContain("en");
      expect(Object.keys(call.translations)).toContain("de");
      expect(Object.keys(call.translations)).not.toContain("EN");
      expect(Object.keys(call.translations)).not.toContain("DE");
    });
  });

  describe("API call", () => {
    it("passes customFields through", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { createContentEntry: { mutate: mutateMock } },
      });

      const customFields = { subtitle: "A subtitle", category: "tech" };

      await createContentEntry.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        title: "Hello World",
        slug: "hello-world",
        customFields,
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.customFields).toEqual(customFields);
    });

    it("returns API response as success with entry", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { createContentEntry: { mutate: mutateMock } },
      });

      const result = await createContentEntry.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        title: "Hello World",
        slug: "hello-world",
      });

      const parsed = expectSuccess(result) as Record<string, unknown>;
      expect(parsed.created).toBe(true);
      expect(parsed.entry).toEqual(MOCK_ENTRY);
    });

    it("calls API with correct orgSlug and projectSlug", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { createContentEntry: { mutate: mutateMock } },
      });

      await createContentEntry.execute(client, {
        project: "my-org/my-proj",
        modelSlug: "blog-posts",
        title: "Test",
        slug: "test",
      });

      expect(mutateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          orgSlug: "my-org",
          projectSlug: "my-proj",
          modelSlug: "blog-posts",
          title: "Test",
          slug: "test",
        }),
      );
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const mutateMock = vi.fn().mockRejectedValue(new Error("Slug already exists"));
      const client = createMockClient({
        mcpContent: { createContentEntry: { mutate: mutateMock } },
      });

      const result = await createContentEntry.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        title: "Hello World",
        slug: "hello-world",
      });

      const msg = expectError(result);
      expect(msg).toContain("Slug already exists");
    });
  });
});
