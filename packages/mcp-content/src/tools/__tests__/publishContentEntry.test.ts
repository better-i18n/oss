import { describe, it, expect, vi } from "vitest";
import { publishContentEntry } from "../publishContentEntry.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectError, expectSuccess } from "../../__tests__/helpers.js";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const MOCK_ENTRY = { id: VALID_UUID, slug: "hello-world", status: "published" };

describe("publishContentEntry", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await publishContentEntry.execute(client, {
        entryId: VALID_UUID,
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing entryId", async () => {
      const client = createMockClient();
      const result = await publishContentEntry.execute(client, {
        project: "org/proj",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects invalid entryId (not UUID)", async () => {
      const client = createMockClient();
      const result = await publishContentEntry.execute(client, {
        project: "org/proj",
        entryId: "not-a-uuid",
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("API call", () => {
    it("calls API with correct params", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { publishContentEntry: { mutate: mutateMock } },
      });

      await publishContentEntry.execute(client, {
        project: "my-org/my-proj",
        entryId: VALID_UUID,
      });

      expect(mutateMock).toHaveBeenCalledWith({
        orgSlug: "my-org",
        projectSlug: "my-proj",
        entryId: VALID_UUID,
      });
    });

    it("returns success with published: true + entry", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { publishContentEntry: { mutate: mutateMock } },
      });

      const result = await publishContentEntry.execute(client, {
        project: "org/proj",
        entryId: VALID_UUID,
      });

      const parsed = expectSuccess(result) as Record<string, unknown>;
      expect(parsed.published).toBe(true);
      expect(parsed.entry).toEqual(MOCK_ENTRY);
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const mutateMock = vi.fn().mockRejectedValue(new Error("Publish failed"));
      const client = createMockClient({
        mcpContent: { publishContentEntry: { mutate: mutateMock } },
      });

      const result = await publishContentEntry.execute(client, {
        project: "org/proj",
        entryId: VALID_UUID,
      });

      const msg = expectError(result);
      expect(msg).toContain("Publish failed");
    });
  });
});
