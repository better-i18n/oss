import { describe, it, expect, vi } from "vitest";
import { deleteKeys } from "../deleteKeys.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("deleteKeys", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await deleteKeys.execute(client, { keyIds: [VALID_UUID] });
      expect(result.isError).toBe(true);
    });

    it("rejects missing keyIds", async () => {
      const client = createMockClient();
      const result = await deleteKeys.execute(client, { project: "org/proj" });
      expect(result.isError).toBe(true);
    });

    it("rejects empty keyIds array", async () => {
      const client = createMockClient();
      const result = await deleteKeys.execute(client, {
        project: "org/proj",
        keyIds: [],
      });
      expect(result.isError).toBe(true);
    });

    it("rejects non-UUID strings", async () => {
      const client = createMockClient();
      const result = await deleteKeys.execute(client, {
        project: "org/proj",
        keyIds: ["not-a-uuid"],
      });
      expect(result.isError).toBe(true);
    });

    it("rejects more than 100 items", async () => {
      const client = createMockClient();
      // Generate 101 valid-looking UUIDs
      const tooMany = Array.from(
        { length: 101 },
        (_, i) => `550e8400-e29b-41d4-a716-${String(i).padStart(12, "0")}`,
      );
      const result = await deleteKeys.execute(client, {
        project: "org/proj",
        keyIds: tooMany,
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("API call", () => {
    it("calls client.mcp.deleteKeys.mutate with correct params", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ deleted: 1 });
      const client = createMockClient({
        mcp: { deleteKeys: { mutate: mutateMock } },
      });

      await deleteKeys.execute(client, {
        project: "my-org/my-proj",
        keyIds: [VALID_UUID],
      });

      expect(mutateMock).toHaveBeenCalledWith({
        orgSlug: "my-org",
        projectSlug: "my-proj",
        keyIds: [VALID_UUID],
      });
    });

    it("returns API response as success", async () => {
      const apiResponse = { deleted: 2 };
      const mutateMock = vi.fn().mockResolvedValue(apiResponse);
      const client = createMockClient({
        mcp: { deleteKeys: { mutate: mutateMock } },
      });

      const uuid2 = "660e8400-e29b-41d4-a716-446655440001";
      const result = await deleteKeys.execute(client, {
        project: "org/proj",
        keyIds: [VALID_UUID, uuid2],
      });

      expect(result.isError).toBeUndefined();
      const parsed = JSON.parse(result.content[0].text!);
      expect(parsed).toEqual(apiResponse);
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const mutateMock = vi.fn().mockRejectedValue(new Error("Forbidden"));
      const client = createMockClient({
        mcp: { deleteKeys: { mutate: mutateMock } },
      });

      const result = await deleteKeys.execute(client, {
        project: "org/proj",
        keyIds: [VALID_UUID],
      });

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Forbidden");
    });
  });
});
