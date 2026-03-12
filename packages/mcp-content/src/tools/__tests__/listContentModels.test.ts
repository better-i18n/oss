import { describe, it, expect, vi } from "vitest";
import { listContentModels } from "../listContentModels.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectError, expectSuccess } from "../../__tests__/helpers.js";

const MOCK_MODELS = [
  { id: "model-1", slug: "blog-posts", displayName: "Blog Posts", entryCount: 10 },
  { id: "model-2", slug: "changelog", displayName: "Changelog", entryCount: 5 },
];

describe("listContentModels", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await listContentModels.execute(client, {});
      expect(result.isError).toBe(true);
    });

    it("rejects invalid project format", async () => {
      const client = createMockClient();
      const result = await listContentModels.execute(client, {
        project: "invalid-no-slash",
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("API call", () => {
    it("calls API with correct params", async () => {
      const queryMock = vi.fn().mockResolvedValue(MOCK_MODELS);
      const client = createMockClient({
        mcpContent: { listContentModels: { query: queryMock } },
      });

      await listContentModels.execute(client, {
        project: "my-org/my-proj",
      });

      expect(queryMock).toHaveBeenCalledWith({
        orgSlug: "my-org",
        projectSlug: "my-proj",
      });
    });

    it("returns success with API response", async () => {
      const queryMock = vi.fn().mockResolvedValue(MOCK_MODELS);
      const client = createMockClient({
        mcpContent: { listContentModels: { query: queryMock } },
      });

      const result = await listContentModels.execute(client, {
        project: "org/proj",
      });

      const parsed = expectSuccess(result);
      expect(parsed).toEqual(MOCK_MODELS);
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const queryMock = vi.fn().mockRejectedValue(new Error("Unauthorized"));
      const client = createMockClient({
        mcpContent: { listContentModels: { query: queryMock } },
      });

      const result = await listContentModels.execute(client, {
        project: "org/proj",
      });

      const msg = expectError(result);
      expect(msg).toContain("Unauthorized");
    });
  });
});
