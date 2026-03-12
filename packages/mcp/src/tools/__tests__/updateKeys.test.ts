import { describe, it, expect, vi } from "vitest";
import { updateKeys } from "../updateKeys.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("updateKeys", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await updateKeys.execute(client, {
        t: [{ id: VALID_UUID, l: "tr", t: "Merhaba" }],
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing t array", async () => {
      const client = createMockClient();
      const result = await updateKeys.execute(client, { project: "org/proj" });
      expect(result.isError).toBe(true);
    });

    it("rejects empty t array", async () => {
      const client = createMockClient();
      const result = await updateKeys.execute(client, {
        project: "org/proj",
        t: [],
      });
      expect(result.isError).toBe(true);
    });

    it("rejects items missing required fields", async () => {
      const client = createMockClient();
      // Missing l and t fields
      const result = await updateKeys.execute(client, {
        project: "org/proj",
        t: [{ id: VALID_UUID }],
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("data normalization", () => {
    it("normalizes language code to lowercase", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ updated: 1 });
      const client = createMockClient({
        mcp: { updateKeys: { mutate: mutateMock } },
      });

      await updateKeys.execute(client, {
        project: "org/proj",
        t: [{ id: VALID_UUID, l: "TR", t: "Merhaba" }],
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.t[0].l).toBe("tr");
    });

    it("preserves other fields", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ updated: 1 });
      const client = createMockClient({
        mcp: { updateKeys: { mutate: mutateMock } },
      });

      await updateKeys.execute(client, {
        project: "org/proj",
        t: [{ id: VALID_UUID, l: "de", t: "Guten Tag", s: true, st: "approved" }],
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.t[0]).toMatchObject({
        id: VALID_UUID,
        l: "de",
        t: "Guten Tag",
        s: true,
        st: "approved",
      });
    });
  });

  describe("API call", () => {
    it("calls client.mcp.updateKeys.mutate with correct params", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ updated: 2 });
      const client = createMockClient({
        mcp: { updateKeys: { mutate: mutateMock } },
      });

      const uuid2 = "660e8400-e29b-41d4-a716-446655440001";
      await updateKeys.execute(client, {
        project: "my-org/my-proj",
        t: [
          { id: VALID_UUID, l: "tr", t: "Merhaba" },
          { id: uuid2, l: "fr", t: "Bonjour" },
        ],
      });

      expect(mutateMock).toHaveBeenCalledWith({
        orgSlug: "my-org",
        projectSlug: "my-proj",
        t: [
          { id: VALID_UUID, l: "tr", t: "Merhaba" },
          { id: uuid2, l: "fr", t: "Bonjour" },
        ],
      });
    });

    it("returns API response as success", async () => {
      const apiResponse = { updated: 1 };
      const mutateMock = vi.fn().mockResolvedValue(apiResponse);
      const client = createMockClient({
        mcp: { updateKeys: { mutate: mutateMock } },
      });

      const result = await updateKeys.execute(client, {
        project: "org/proj",
        t: [{ id: VALID_UUID, l: "tr", t: "Merhaba" }],
      });

      expect(result.isError).toBeUndefined();
      const parsed = JSON.parse(result.content[0].text!);
      expect(parsed).toEqual(apiResponse);
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const mutateMock = vi.fn().mockRejectedValue(new Error("Network error"));
      const client = createMockClient({
        mcp: { updateKeys: { mutate: mutateMock } },
      });

      const result = await updateKeys.execute(client, {
        project: "org/proj",
        t: [{ id: VALID_UUID, l: "tr", t: "Merhaba" }],
      });

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Network error");
    });
  });
});
