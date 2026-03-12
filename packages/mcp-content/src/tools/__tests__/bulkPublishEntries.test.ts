import { describe, it, expect, vi } from "vitest";
import { bulkPublishEntries } from "../bulkPublishEntries.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectError, expectSuccess } from "../../__tests__/helpers.js";

const UUID_1 = "550e8400-e29b-41d4-a716-446655440000";
const UUID_2 = "550e8400-e29b-41d4-a716-446655440001";
const UUID_3 = "550e8400-e29b-41d4-a716-446655440002";

describe("bulkPublishEntries", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await bulkPublishEntries.execute(client, {
        entryIds: [UUID_1],
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing entryIds", async () => {
      const client = createMockClient();
      const result = await bulkPublishEntries.execute(client, {
        project: "org/proj",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects empty entryIds array", async () => {
      const client = createMockClient();
      const result = await bulkPublishEntries.execute(client, {
        project: "org/proj",
        entryIds: [],
      });
      expect(result.isError).toBe(true);
    });

    it("rejects more than 50 entryIds", async () => {
      const client = createMockClient();
      const manyIds = Array.from({ length: 51 }, (_, i) =>
        `550e8400-e29b-41d4-a716-4466554400${String(i).padStart(2, "0")}`,
      );
      const result = await bulkPublishEntries.execute(client, {
        project: "org/proj",
        entryIds: manyIds,
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("API call", () => {
    it("calls API with correct params", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ published: 2, failed: [] });
      const client = createMockClient({
        mcpContent: { bulkPublishEntries: { mutate: mutateMock } },
      });

      await bulkPublishEntries.execute(client, {
        project: "my-org/my-proj",
        entryIds: [UUID_1, UUID_2],
      });

      expect(mutateMock).toHaveBeenCalledWith({
        orgSlug: "my-org",
        projectSlug: "my-proj",
        entryIds: [UUID_1, UUID_2],
      });
    });

    it("returns success with API response", async () => {
      const apiResponse = { published: 3, failed: [] };
      const mutateMock = vi.fn().mockResolvedValue(apiResponse);
      const client = createMockClient({
        mcpContent: { bulkPublishEntries: { mutate: mutateMock } },
      });

      const result = await bulkPublishEntries.execute(client, {
        project: "org/proj",
        entryIds: [UUID_1, UUID_2, UUID_3],
      });

      const parsed = expectSuccess(result) as Record<string, unknown>;
      expect(parsed.published).toBe(3);
      expect(parsed.failed).toEqual([]);
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const mutateMock = vi.fn().mockRejectedValue(new Error("Bulk publish failed"));
      const client = createMockClient({
        mcpContent: { bulkPublishEntries: { mutate: mutateMock } },
      });

      const result = await bulkPublishEntries.execute(client, {
        project: "org/proj",
        entryIds: [UUID_1],
      });

      const msg = expectError(result);
      expect(msg).toContain("Bulk publish failed");
    });
  });
});
