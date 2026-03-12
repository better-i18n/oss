import { describe, it, expect, vi } from "vitest";
import { duplicateContentEntry } from "../duplicateContentEntry.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectError, expectSuccess } from "../../__tests__/helpers.js";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const MOCK_ENTRY = { id: "entry-copy-1", slug: "hello-world-copy", title: "Hello World" };

describe("duplicateContentEntry", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await duplicateContentEntry.execute(client, {
        entryId: VALID_UUID,
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing entryId", async () => {
      const client = createMockClient();
      const result = await duplicateContentEntry.execute(client, {
        project: "org/proj",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects invalid newSlug format (uppercase)", async () => {
      const client = createMockClient();
      const result = await duplicateContentEntry.execute(client, {
        project: "org/proj",
        entryId: VALID_UUID,
        newSlug: "Hello-World",
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("API call", () => {
    it("accepts without newSlug", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { duplicateContentEntry: { mutate: mutateMock } },
      });

      const result = await duplicateContentEntry.execute(client, {
        project: "org/proj",
        entryId: VALID_UUID,
      });

      expect(result.isError).toBeUndefined();
      expect(mutateMock).toHaveBeenCalledOnce();
    });

    it("passes newSlug through", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { duplicateContentEntry: { mutate: mutateMock } },
      });

      await duplicateContentEntry.execute(client, {
        project: "org/proj",
        entryId: VALID_UUID,
        newSlug: "hello-world-v2",
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.newSlug).toBe("hello-world-v2");
    });

    it("returns success with duplicated: true + entry", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { duplicateContentEntry: { mutate: mutateMock } },
      });

      const result = await duplicateContentEntry.execute(client, {
        project: "org/proj",
        entryId: VALID_UUID,
      });

      const parsed = expectSuccess(result) as Record<string, unknown>;
      expect(parsed.duplicated).toBe(true);
      expect(parsed.entry).toEqual(MOCK_ENTRY);
    });

    it("calls API with correct params", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { duplicateContentEntry: { mutate: mutateMock } },
      });

      await duplicateContentEntry.execute(client, {
        project: "my-org/my-proj",
        entryId: VALID_UUID,
        newSlug: "copy-slug",
      });

      expect(mutateMock).toHaveBeenCalledWith({
        orgSlug: "my-org",
        projectSlug: "my-proj",
        entryId: VALID_UUID,
        newSlug: "copy-slug",
      });
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const mutateMock = vi.fn().mockRejectedValue(new Error("Entry not found"));
      const client = createMockClient({
        mcpContent: { duplicateContentEntry: { mutate: mutateMock } },
      });

      const result = await duplicateContentEntry.execute(client, {
        project: "org/proj",
        entryId: VALID_UUID,
      });

      const msg = expectError(result);
      expect(msg).toContain("Entry not found");
    });
  });
});
