import { describe, it, expect, vi } from "vitest";
import { updateContentEntry } from "../updateContentEntry.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectError, expectSuccess } from "../../__tests__/helpers.js";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const MOCK_ENTRY = { id: VALID_UUID, slug: "hello-world", title: "Hello World" };

describe("updateContentEntry", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await updateContentEntry.execute(client, {
        entryId: VALID_UUID,
        title: "Updated Title",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing entryId", async () => {
      const client = createMockClient();
      const result = await updateContentEntry.execute(client, {
        project: "org/proj",
        title: "Updated Title",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects invalid entryId format (not UUID)", async () => {
      const client = createMockClient();
      const result = await updateContentEntry.execute(client, {
        project: "org/proj",
        entryId: "not-a-uuid",
        title: "Updated Title",
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("data normalization", () => {
    it("normalizes languageCode to lowercase", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { updateContentEntry: { mutate: mutateMock } },
      });

      await updateContentEntry.execute(client, {
        project: "org/proj",
        entryId: VALID_UUID,
        languageCode: "TR",
        title: "Merhaba Dünya",
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.languageCode).toBe("tr");
    });

    it("normalizes translations keys to lowercase", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { updateContentEntry: { mutate: mutateMock } },
      });

      await updateContentEntry.execute(client, {
        project: "org/proj",
        entryId: VALID_UUID,
        translations: {
          TR: { title: "Merhaba" },
          DE: { title: "Hallo" },
        },
      });

      const call = mutateMock.mock.calls[0][0];
      expect(Object.keys(call.translations)).toContain("tr");
      expect(Object.keys(call.translations)).toContain("de");
      expect(Object.keys(call.translations)).not.toContain("TR");
      expect(Object.keys(call.translations)).not.toContain("DE");
    });
  });

  describe("API call", () => {
    it("passes customFields through", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { updateContentEntry: { mutate: mutateMock } },
      });

      const customFields = { category: "tech", read_time: 5 };

      await updateContentEntry.execute(client, {
        project: "org/proj",
        entryId: VALID_UUID,
        customFields,
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.customFields).toEqual(customFields);
    });

    it("returns API response as success with entry", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { updateContentEntry: { mutate: mutateMock } },
      });

      const result = await updateContentEntry.execute(client, {
        project: "org/proj",
        entryId: VALID_UUID,
        title: "Updated Title",
      });

      const parsed = expectSuccess(result) as Record<string, unknown>;
      expect(parsed.updated).toBe(true);
      expect(parsed.entry).toEqual(MOCK_ENTRY);
    });

    it("calls API with correct orgSlug and projectSlug", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { updateContentEntry: { mutate: mutateMock } },
      });

      await updateContentEntry.execute(client, {
        project: "my-org/my-proj",
        entryId: VALID_UUID,
        title: "Updated",
      });

      expect(mutateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          orgSlug: "my-org",
          projectSlug: "my-proj",
          entryId: VALID_UUID,
        }),
      );
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const mutateMock = vi.fn().mockRejectedValue(new Error("Entry not found"));
      const client = createMockClient({
        mcpContent: { updateContentEntry: { mutate: mutateMock } },
      });

      const result = await updateContentEntry.execute(client, {
        project: "org/proj",
        entryId: VALID_UUID,
        title: "Updated",
      });

      const msg = expectError(result);
      expect(msg).toContain("Entry not found");
    });
  });
});
