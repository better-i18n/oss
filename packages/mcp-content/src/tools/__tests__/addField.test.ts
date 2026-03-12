import { describe, it, expect, vi } from "vitest";
import { addField } from "../addField.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectError, expectSuccess } from "../../__tests__/helpers.js";

const MOCK_FIELD = { id: "field-1", name: "author", displayName: "Author", type: "text" };

describe("addField", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await addField.execute(client, {
        modelSlug: "blog-posts",
        name: "author",
        displayName: "Author",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing modelSlug", async () => {
      const client = createMockClient();
      const result = await addField.execute(client, {
        project: "org/proj",
        name: "author",
        displayName: "Author",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing name", async () => {
      const client = createMockClient();
      const result = await addField.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        displayName: "Author",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing displayName", async () => {
      const client = createMockClient();
      const result = await addField.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        name: "author",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects invalid name format (uppercase)", async () => {
      const client = createMockClient();
      const result = await addField.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        name: "AuthorName",
        displayName: "Author Name",
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("defaults", () => {
    it("defaults type to 'text'", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
      const client = createMockClient({
        mcpContent: { addField: { mutate: mutateMock } },
      });

      await addField.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        name: "author",
        displayName: "Author",
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.type).toBe("text");
    });

    it("defaults localized to false", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
      const client = createMockClient({
        mcpContent: { addField: { mutate: mutateMock } },
      });

      await addField.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        name: "author",
        displayName: "Author",
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.localized).toBe(false);
    });

    it("defaults required to false", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
      const client = createMockClient({
        mcpContent: { addField: { mutate: mutateMock } },
      });

      await addField.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        name: "author",
        displayName: "Author",
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.required).toBe(false);
    });
  });

  describe("API call", () => {
    it("passes enum options through", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
      const client = createMockClient({
        mcpContent: { addField: { mutate: mutateMock } },
      });

      const options = {
        enumValues: [
          { label: "Draft", value: "draft" },
          { label: "Published", value: "published" },
        ],
        showInTable: true,
      };

      await addField.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        name: "status",
        displayName: "Status",
        type: "enum",
        options,
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.options).toEqual(options);
    });

    it("passes fieldConfig.targetModel through", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
      const client = createMockClient({
        mcpContent: { addField: { mutate: mutateMock } },
      });

      await addField.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        name: "category",
        displayName: "Category",
        type: "relation",
        fieldConfig: { targetModel: "categories" },
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.fieldConfig).toEqual({ targetModel: "categories" });
    });

    it("returns created: true + field on success", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
      const client = createMockClient({
        mcpContent: { addField: { mutate: mutateMock } },
      });

      const result = await addField.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        name: "author",
        displayName: "Author",
      });

      const parsed = expectSuccess(result) as Record<string, unknown>;
      expect(parsed.created).toBe(true);
      expect(parsed.field).toEqual(MOCK_FIELD);
    });

    it("calls API with correct params", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_FIELD);
      const client = createMockClient({
        mcpContent: { addField: { mutate: mutateMock } },
      });

      await addField.execute(client, {
        project: "my-org/my-proj",
        modelSlug: "blog-posts",
        name: "read_time",
        displayName: "Read Time",
        type: "number",
        required: true,
      });

      expect(mutateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          orgSlug: "my-org",
          projectSlug: "my-proj",
          modelSlug: "blog-posts",
          name: "read_time",
          displayName: "Read Time",
          type: "number",
          required: true,
        }),
      );
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const mutateMock = vi.fn().mockRejectedValue(new Error("Model not found"));
      const client = createMockClient({
        mcpContent: { addField: { mutate: mutateMock } },
      });

      const result = await addField.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
        name: "author",
        displayName: "Author",
      });

      const msg = expectError(result);
      expect(msg).toContain("Model not found");
    });
  });
});
