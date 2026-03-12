import { describe, it, expect, vi } from "vitest";
import { reorderFields } from "../reorderFields.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectError, expectSuccess } from "../../__tests__/helpers.js";

describe("reorderFields", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await reorderFields.execute(client, {
        modelSlug: "blog-posts",
        fieldNames: ["title", "status", "author"],
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing modelSlug", async () => {
      const client = createMockClient();
      const result = await reorderFields.execute(client, {
        project: "org/proj",
        fieldNames: ["title", "status", "author"],
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing fieldNames", async () => {
      const client = createMockClient();
      const result = await reorderFields.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects empty fieldNames array", async () => {
      const client = createMockClient();
      const result = await reorderFields.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        fieldNames: [],
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("API call", () => {
    it("calls API with correct params", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ reordered: true });
      const client = createMockClient({
        mcpContent: { reorderFields: { mutate: mutateMock } },
      });

      const fieldNames = ["title", "status", "author", "category"];

      await reorderFields.execute(client, {
        project: "my-org/my-proj",
        modelSlug: "blog-posts",
        fieldNames,
      });

      expect(mutateMock).toHaveBeenCalledWith({
        orgSlug: "my-org",
        projectSlug: "my-proj",
        modelSlug: "blog-posts",
        fieldNames,
      });
    });

    it("returns success with reordered: true", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ order: ["title", "status"] });
      const client = createMockClient({
        mcpContent: { reorderFields: { mutate: mutateMock } },
      });

      const result = await reorderFields.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        fieldNames: ["title", "status"],
      });

      const parsed = expectSuccess(result) as Record<string, unknown>;
      expect(parsed.reordered).toBe(true);
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const mutateMock = vi.fn().mockRejectedValue(new Error("Model not found"));
      const client = createMockClient({
        mcpContent: { reorderFields: { mutate: mutateMock } },
      });

      const result = await reorderFields.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        fieldNames: ["title", "status"],
      });

      const msg = expectError(result);
      expect(msg).toContain("Model not found");
    });
  });
});
