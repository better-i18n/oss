import { describe, it, expect, vi } from "vitest";
import { updateContentModel } from "../updateContentModel.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectError, expectSuccess } from "../../__tests__/helpers.js";

const MOCK_MODEL = { id: "model-1", slug: "blog-posts", displayName: "Blog Posts" };

describe("updateContentModel", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await updateContentModel.execute(client, {
        modelSlug: "blog-posts",
        displayName: "Updated Name",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing modelSlug", async () => {
      const client = createMockClient();
      const result = await updateContentModel.execute(client, {
        project: "org/proj",
        displayName: "Updated Name",
      });
      expect(result.isError).toBe(true);
    });

    it("accepts just project + modelSlug (no updates)", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { updateContentModel: { mutate: mutateMock } },
      });

      const result = await updateContentModel.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
      });

      expect(result.isError).toBeUndefined();
      expect(mutateMock).toHaveBeenCalledOnce();
    });
  });

  describe("API call", () => {
    it("passes displayName update", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { updateContentModel: { mutate: mutateMock } },
      });

      await updateContentModel.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        displayName: "Updated Blog Posts",
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.displayName).toBe("Updated Blog Posts");
    });

    it("passes description update", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { updateContentModel: { mutate: mutateMock } },
      });

      await updateContentModel.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        description: "A blog post collection",
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.description).toBe("A blog post collection");
    });

    it("passes kind update", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { updateContentModel: { mutate: mutateMock } },
      });

      await updateContentModel.execute(client, {
        project: "org/proj",
        modelSlug: "about-page",
        kind: "single",
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.kind).toBe("single");
    });

    it("passes includeBody update", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { updateContentModel: { mutate: mutateMock } },
      });

      await updateContentModel.execute(client, {
        project: "org/proj",
        modelSlug: "categories",
        includeBody: false,
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.includeBody).toBe(false);
    });

    it("returns updated: true + model on success", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { updateContentModel: { mutate: mutateMock } },
      });

      const result = await updateContentModel.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        displayName: "Updated Name",
      });

      const parsed = expectSuccess(result) as Record<string, unknown>;
      expect(parsed.updated).toBe(true);
      expect(parsed.model).toEqual(MOCK_MODEL);
    });

    it("calls API with correct orgSlug and projectSlug", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { updateContentModel: { mutate: mutateMock } },
      });

      await updateContentModel.execute(client, {
        project: "my-org/my-proj",
        modelSlug: "blog-posts",
        displayName: "My Blog",
      });

      expect(mutateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          orgSlug: "my-org",
          projectSlug: "my-proj",
          modelSlug: "blog-posts",
        }),
      );
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const mutateMock = vi.fn().mockRejectedValue(new Error("Model not found"));
      const client = createMockClient({
        mcpContent: { updateContentModel: { mutate: mutateMock } },
      });

      const result = await updateContentModel.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
      });

      const msg = expectError(result);
      expect(msg).toContain("Model not found");
    });
  });
});
