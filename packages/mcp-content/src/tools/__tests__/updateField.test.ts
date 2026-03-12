import { describe, it, expect, vi } from "vitest";
import { updateField } from "../updateField.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectError, expectSuccess } from "../../__tests__/helpers.js";

const MOCK_FIELD = { name: "status", displayName: "Status", type: "enum" };

describe("updateField", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await updateField.execute(client, {
        modelSlug: "blog-posts",
        fieldName: "status",
        displayName: "Status",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing modelSlug", async () => {
      const client = createMockClient();
      const result = await updateField.execute(client, {
        project: "org/proj",
        fieldName: "status",
        displayName: "Updated Status",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing fieldName", async () => {
      const client = createMockClient();
      const result = await updateField.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        displayName: "Updated Status",
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("API call", () => {
    it("passes displayName update", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
      const client = createMockClient({
        mcpContent: { updateField: { mutate: mutateMock } },
      });

      await updateField.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        fieldName: "status",
        displayName: "Publication Status",
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.displayName).toBe("Publication Status");
    });

    it("passes type update", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
      const client = createMockClient({
        mcpContent: { updateField: { mutate: mutateMock } },
      });

      await updateField.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        fieldName: "author",
        type: "relation",
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.type).toBe("relation");
    });

    it("passes options with enumValues", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
      const client = createMockClient({
        mcpContent: { updateField: { mutate: mutateMock } },
      });

      const options = {
        enumValues: [
          { label: "Active", value: "active" },
          { label: "Archived", value: "archived" },
        ],
      };

      await updateField.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        fieldName: "status",
        options,
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.options).toEqual(options);
    });

    it("passes fieldConfig.targetModel", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
      const client = createMockClient({
        mcpContent: { updateField: { mutate: mutateMock } },
      });

      await updateField.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        fieldName: "author",
        type: "relation",
        fieldConfig: { targetModel: "users" },
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.fieldConfig).toEqual({ targetModel: "users" });
    });

    it("returns success with updated: true + field", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
      const client = createMockClient({
        mcpContent: { updateField: { mutate: mutateMock } },
      });

      const result = await updateField.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        fieldName: "status",
        displayName: "Updated Status",
      });

      const parsed = expectSuccess(result) as Record<string, unknown>;
      expect(parsed.updated).toBe(true);
      expect(parsed.field).toEqual(MOCK_FIELD);
    });

    it("calls API with correct orgSlug and projectSlug", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
      const client = createMockClient({
        mcpContent: { updateField: { mutate: mutateMock } },
      });

      await updateField.execute(client, {
        project: "my-org/my-proj",
        modelSlug: "blog-posts",
        fieldName: "status",
      });

      expect(mutateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          orgSlug: "my-org",
          projectSlug: "my-proj",
          modelSlug: "blog-posts",
          fieldName: "status",
        }),
      );
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const mutateMock = vi.fn().mockRejectedValue(new Error("Field not found"));
      const client = createMockClient({
        mcpContent: { updateField: { mutate: mutateMock } },
      });

      const result = await updateField.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        fieldName: "status",
      });

      const msg = expectError(result);
      expect(msg).toContain("Field not found");
    });
  });
});
