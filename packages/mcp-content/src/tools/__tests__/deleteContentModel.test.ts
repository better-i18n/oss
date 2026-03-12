import { describe, it, expect, vi } from "vitest";
import { deleteContentModel } from "../deleteContentModel.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectError, expectSuccess } from "../../__tests__/helpers.js";

describe("deleteContentModel", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await deleteContentModel.execute(client, {
        modelSlug: "blog-posts",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing modelSlug", async () => {
      const client = createMockClient();
      const result = await deleteContentModel.execute(client, {
        project: "org/proj",
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("API call", () => {
    it("calls API with correct params", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ modelSlug: "blog-posts" });
      const client = createMockClient({
        mcpContent: { deleteContentModel: { mutate: mutateMock } },
      });

      await deleteContentModel.execute(client, {
        project: "my-org/my-proj",
        modelSlug: "blog-posts",
      });

      expect(mutateMock).toHaveBeenCalledWith({
        orgSlug: "my-org",
        projectSlug: "my-proj",
        modelSlug: "blog-posts",
      });
    });

    it("returns success with deleted: true", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ modelSlug: "blog-posts" });
      const client = createMockClient({
        mcpContent: { deleteContentModel: { mutate: mutateMock } },
      });

      const result = await deleteContentModel.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
      });

      const parsed = expectSuccess(result) as Record<string, unknown>;
      expect(parsed.deleted).toBe(true);
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const mutateMock = vi.fn().mockRejectedValue(new Error("Model not found"));
      const client = createMockClient({
        mcpContent: { deleteContentModel: { mutate: mutateMock } },
      });

      const result = await deleteContentModel.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
      });

      const msg = expectError(result);
      expect(msg).toContain("Model not found");
    });
  });
});
