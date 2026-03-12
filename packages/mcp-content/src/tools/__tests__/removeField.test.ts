import { describe, it, expect, vi } from "vitest";
import { removeField } from "../removeField.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectError, expectSuccess } from "../../__tests__/helpers.js";

describe("removeField", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await removeField.execute(client, {
        modelSlug: "blog-posts",
        fieldName: "status",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing modelSlug", async () => {
      const client = createMockClient();
      const result = await removeField.execute(client, {
        project: "org/proj",
        fieldName: "status",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing fieldName", async () => {
      const client = createMockClient();
      const result = await removeField.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("API call", () => {
    it("calls API with correct params", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ fieldName: "status" });
      const client = createMockClient({
        mcpContent: { removeField: { mutate: mutateMock } },
      });

      await removeField.execute(client, {
        project: "my-org/my-proj",
        modelSlug: "blog-posts",
        fieldName: "status",
      });

      expect(mutateMock).toHaveBeenCalledWith({
        orgSlug: "my-org",
        projectSlug: "my-proj",
        modelSlug: "blog-posts",
        fieldName: "status",
      });
    });

    it("returns success with removed: true", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ fieldName: "status" });
      const client = createMockClient({
        mcpContent: { removeField: { mutate: mutateMock } },
      });

      const result = await removeField.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        fieldName: "status",
      });

      const parsed = expectSuccess(result) as Record<string, unknown>;
      expect(parsed.removed).toBe(true);
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const mutateMock = vi.fn().mockRejectedValue(new Error("Field not found"));
      const client = createMockClient({
        mcpContent: { removeField: { mutate: mutateMock } },
      });

      const result = await removeField.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        fieldName: "nonexistent",
      });

      const msg = expectError(result);
      expect(msg).toContain("Field not found");
    });
  });
});
