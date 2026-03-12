import { describe, it, expect, vi } from "vitest";
import { getContentModel } from "../getContentModel.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectError, expectSuccess } from "../../__tests__/helpers.js";

const MOCK_MODEL = {
  id: "model-1",
  slug: "blog-posts",
  displayName: "Blog Posts",
  fields: [{ name: "author", displayName: "Author", type: "text" }],
};

describe("getContentModel", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await getContentModel.execute(client, {
        modelSlug: "blog-posts",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing modelSlug", async () => {
      const client = createMockClient();
      const result = await getContentModel.execute(client, {
        project: "org/proj",
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("API call", () => {
    it("calls API with correct params", async () => {
      const queryMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { getContentModel: { query: queryMock } },
      });

      await getContentModel.execute(client, {
        project: "my-org/my-proj",
        modelSlug: "blog-posts",
      });

      expect(queryMock).toHaveBeenCalledWith({
        orgSlug: "my-org",
        projectSlug: "my-proj",
        modelSlug: "blog-posts",
      });
    });

    it("returns success with API response", async () => {
      const queryMock = vi.fn().mockResolvedValue(MOCK_MODEL);
      const client = createMockClient({
        mcpContent: { getContentModel: { query: queryMock } },
      });

      const result = await getContentModel.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
      });

      const parsed = expectSuccess(result);
      expect(parsed).toEqual(MOCK_MODEL);
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const queryMock = vi.fn().mockRejectedValue(new Error("Model not found"));
      const client = createMockClient({
        mcpContent: { getContentModel: { query: queryMock } },
      });

      const result = await getContentModel.execute(client, {
        project: "org/proj",
        modelSlug: "nonexistent",
      });

      const msg = expectError(result);
      expect(msg).toContain("Model not found");
    });
  });
});
