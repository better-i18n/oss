import { describe, it, expect, vi } from "vitest";
import { createContentModel } from "../createContentModel.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectError, expectSuccess } from "../../__tests__/helpers.js";

const MOCK_MODEL = { id: "model-1", slug: "blog-posts", displayName: "Blog Posts" };

describe("createContentModel", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await createContentModel.execute(client, {
        slug: "blog-posts",
        displayName: "Blog Posts",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing slug", async () => {
      const client = createMockClient();
      const result = await createContentModel.execute(client, {
        project: "org/proj",
        displayName: "Blog Posts",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing displayName", async () => {
      const client = createMockClient();
      const result = await createContentModel.execute(client, {
        project: "org/proj",
        slug: "blog-posts",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects invalid slug format (uppercase)", async () => {
      const client = createMockClient();
      const result = await createContentModel.execute(client, {
        project: "org/proj",
        slug: "BlogPosts",
        displayName: "Blog Posts",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects slug with underscores", async () => {
      const client = createMockClient();
      const result = await createContentModel.execute(client, {
        project: "org/proj",
        slug: "blog_posts",
        displayName: "Blog Posts",
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("defaults", () => {
    it("defaults kind to 'collection'", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { createContentModel: { mutate: mutateMock } },
      });

      await createContentModel.execute(client, {
        project: "org/proj",
        slug: "blog-posts",
        displayName: "Blog Posts",
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.kind).toBe("collection");
    });

    it("defaults includeBody to true", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { createContentModel: { mutate: mutateMock } },
      });

      await createContentModel.execute(client, {
        project: "org/proj",
        slug: "blog-posts",
        displayName: "Blog Posts",
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.includeBody).toBe(true);
    });

    it("defaults enableVersionHistory to true", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { createContentModel: { mutate: mutateMock } },
      });

      await createContentModel.execute(client, {
        project: "org/proj",
        slug: "blog-posts",
        displayName: "Blog Posts",
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.enableVersionHistory).toBe(true);
    });

    it("defaults fields to empty array", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { createContentModel: { mutate: mutateMock } },
      });

      await createContentModel.execute(client, {
        project: "org/proj",
        slug: "blog-posts",
        displayName: "Blog Posts",
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.fields).toEqual([]);
    });
  });

  describe("API call", () => {
    it("passes through field definitions", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { createContentModel: { mutate: mutateMock } },
      });

      const fields = [
        { name: "author_name", displayName: "Author Name", type: "text" as const },
        { name: "status", displayName: "Status", type: "enum" as const, options: { enumValues: [{ label: "Draft", value: "draft" }] } },
      ];

      await createContentModel.execute(client, {
        project: "my-org/my-proj",
        slug: "blog-posts",
        displayName: "Blog Posts",
        fields,
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.fields).toHaveLength(2);
      expect(call.fields[0].name).toBe("author_name");
      expect(call.fields[1].name).toBe("status");
    });

    it("field name must be snake_case (rejects uppercase)", async () => {
      const client = createMockClient();
      const result = await createContentModel.execute(client, {
        project: "org/proj",
        slug: "blog-posts",
        displayName: "Blog Posts",
        fields: [{ name: "AuthorName", displayName: "Author Name" }],
      });
      expect(result.isError).toBe(true);
    });

    it("returns created: true + model on success", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { createContentModel: { mutate: mutateMock } },
      });

      const result = await createContentModel.execute(client, {
        project: "org/proj",
        slug: "blog-posts",
        displayName: "Blog Posts",
      });

      const parsed = expectSuccess(result) as Record<string, unknown>;
      expect(parsed.created).toBe(true);
      expect(parsed.model).toEqual(MOCK_MODEL);
    });

    it("calls API with correct orgSlug and projectSlug", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { createContentModel: { mutate: mutateMock } },
      });

      await createContentModel.execute(client, {
        project: "my-org/my-proj",
        slug: "changelog",
        displayName: "Changelog",
        kind: "collection",
      });

      expect(mutateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          orgSlug: "my-org",
          projectSlug: "my-proj",
          slug: "changelog",
          displayName: "Changelog",
        }),
      );
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const mutateMock = vi.fn().mockRejectedValue(new Error("API unavailable"));
      const client = createMockClient({
        mcpContent: { createContentModel: { mutate: mutateMock } },
      });

      const result = await createContentModel.execute(client, {
        project: "org/proj",
        slug: "blog-posts",
        displayName: "Blog Posts",
      });

      const msg = expectError(result);
      expect(msg).toContain("API unavailable");
    });
  });
});
