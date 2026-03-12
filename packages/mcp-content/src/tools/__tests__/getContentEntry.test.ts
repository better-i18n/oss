import { describe, it, expect, vi } from "vitest";
import { getContentEntry } from "../getContentEntry.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectError, expectSuccess } from "../../__tests__/helpers.js";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const MOCK_ENTRY = {
  id: VALID_UUID,
  slug: "hello-world",
  title: "Hello World",
  slang: "en",
  tr: { en: { title: "Hello World" }, de: { title: "Hallo Welt" } },
};

describe("getContentEntry", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await getContentEntry.execute(client, {
        entryId: VALID_UUID,
      });
      expect(result.isError).toBe(true);
    });

    it("rejects missing entryId", async () => {
      const client = createMockClient();
      const result = await getContentEntry.execute(client, {
        project: "org/proj",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects invalid entryId (not UUID)", async () => {
      const client = createMockClient();
      const result = await getContentEntry.execute(client, {
        project: "org/proj",
        entryId: "not-a-uuid",
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("API call", () => {
    it("passes expand param", async () => {
      const queryMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { getContentEntry: { query: queryMock } },
      });

      await getContentEntry.execute(client, {
        project: "org/proj",
        entryId: VALID_UUID,
        expand: ["author", "category"],
      });

      const call = queryMock.mock.calls[0][0];
      expect(call.expand).toEqual(["author", "category"]);
    });

    it("calls API with correct params", async () => {
      const queryMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { getContentEntry: { query: queryMock } },
      });

      await getContentEntry.execute(client, {
        project: "my-org/my-proj",
        entryId: VALID_UUID,
      });

      expect(queryMock).toHaveBeenCalledWith(
        expect.objectContaining({
          orgSlug: "my-org",
          projectSlug: "my-proj",
          entryId: VALID_UUID,
        }),
      );
    });

    it("returns success with API response", async () => {
      const queryMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { getContentEntry: { query: queryMock } },
      });

      const result = await getContentEntry.execute(client, {
        project: "org/proj",
        entryId: VALID_UUID,
      });

      const parsed = expectSuccess(result);
      expect(parsed).toEqual(MOCK_ENTRY);
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const queryMock = vi.fn().mockRejectedValue(new Error("Entry not found"));
      const client = createMockClient({
        mcpContent: { getContentEntry: { query: queryMock } },
      });

      const result = await getContentEntry.execute(client, {
        project: "org/proj",
        entryId: VALID_UUID,
      });

      const msg = expectError(result);
      expect(msg).toContain("Entry not found");
    });
  });
});
