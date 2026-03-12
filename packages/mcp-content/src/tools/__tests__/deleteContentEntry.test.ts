import { describe, it, expect, vi } from "vitest";
import { deleteContentEntry } from "../deleteContentEntry.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectError, expectSuccess } from "../../__tests__/helpers.js";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("deleteContentEntry", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await deleteContentEntry.execute(client, {
        entryId: VALID_UUID,
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing entryId", async () => {
      const client = createMockClient();
      const result = await deleteContentEntry.execute(client, {
        project: "org/proj",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects invalid entryId (not UUID)", async () => {
      const client = createMockClient();
      const result = await deleteContentEntry.execute(client, {
        project: "org/proj",
        entryId: "not-a-valid-uuid",
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("API call", () => {
    it("calls API with correct params", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ entryId: VALID_UUID });
      const client = createMockClient({
        mcpContent: { deleteContentEntry: { mutate: mutateMock } },
      });

      await deleteContentEntry.execute(client, {
        project: "my-org/my-proj",
        entryId: VALID_UUID,
      });

      expect(mutateMock).toHaveBeenCalledWith({
        orgSlug: "my-org",
        projectSlug: "my-proj",
        entryId: VALID_UUID,
      });
    });

    it("returns success with deleted: true", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ entryId: VALID_UUID });
      const client = createMockClient({
        mcpContent: { deleteContentEntry: { mutate: mutateMock } },
      });

      const result = await deleteContentEntry.execute(client, {
        project: "org/proj",
        entryId: VALID_UUID,
      });

      const parsed = expectSuccess(result) as Record<string, unknown>;
      expect(parsed.deleted).toBe(true);
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const mutateMock = vi.fn().mockRejectedValue(new Error("Entry not found"));
      const client = createMockClient({
        mcpContent: { deleteContentEntry: { mutate: mutateMock } },
      });

      const result = await deleteContentEntry.execute(client, {
        project: "org/proj",
        entryId: VALID_UUID,
      });

      const msg = expectError(result);
      expect(msg).toContain("Entry not found");
    });
  });
});
