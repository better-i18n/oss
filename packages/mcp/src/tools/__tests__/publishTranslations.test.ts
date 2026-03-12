import { describe, it, expect, vi } from "vitest";
import { publishTranslations } from "../publishTranslations.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";

const VALID_KEY_ID = "550e8400-e29b-41d4-a716-446655440000";

describe("publishTranslations", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await publishTranslations.execute(client, {
        translations: [{ keyId: VALID_KEY_ID, languageCode: "tr" }],
      });
      expect(result.isError).toBe(true);
    });

    it("accepts project-only input (publish all)", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ syncJobIds: ["job-1"] });
      const client = createMockClient({
        mcp: { publishTranslations: { mutate: mutateMock } },
      });

      const result = await publishTranslations.execute(client, {
        project: "org/proj",
      });

      expect(result.isError).toBeUndefined();
      const call = mutateMock.mock.calls[0][0];
      expect(call.translations).toBeUndefined();
    });
  });

  describe("data normalization", () => {
    it("normalizes languageCode to lowercase", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ syncJobIds: ["job-1"] });
      const client = createMockClient({
        mcp: { publishTranslations: { mutate: mutateMock } },
      });

      await publishTranslations.execute(client, {
        project: "org/proj",
        translations: [{ keyId: VALID_KEY_ID, languageCode: "TR" }],
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.translations[0].languageCode).toBe("tr");
    });

    it("passes keyId through unchanged", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ syncJobIds: ["job-1"] });
      const client = createMockClient({
        mcp: { publishTranslations: { mutate: mutateMock } },
      });

      await publishTranslations.execute(client, {
        project: "org/proj",
        translations: [{ keyId: VALID_KEY_ID, languageCode: "de" }],
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.translations[0].keyId).toBe(VALID_KEY_ID);
    });
  });

  describe("API call", () => {
    it("sends undefined translations for full publish", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ syncJobIds: ["job-1"] });
      const client = createMockClient({
        mcp: { publishTranslations: { mutate: mutateMock } },
      });

      await publishTranslations.execute(client, { project: "org/proj" });

      expect(mutateMock).toHaveBeenCalledWith({
        orgSlug: "org",
        projectSlug: "proj",
        translations: undefined,
      });
    });

    it("sends specific translations for selective publish", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ syncJobIds: ["job-1"] });
      const client = createMockClient({
        mcp: { publishTranslations: { mutate: mutateMock } },
      });

      const uuid2 = "660e8400-e29b-41d4-a716-446655440001";
      await publishTranslations.execute(client, {
        project: "org/proj",
        translations: [
          { keyId: VALID_KEY_ID, languageCode: "tr" },
          { keyId: uuid2, languageCode: "de" },
        ],
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.translations).toHaveLength(2);
      expect(call.translations[0]).toEqual({ keyId: VALID_KEY_ID, languageCode: "tr" });
      expect(call.translations[1]).toEqual({ keyId: uuid2, languageCode: "de" });
    });

    it("calls client.mcp.publishTranslations.mutate with correct params", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ syncJobIds: ["job-42"] });
      const client = createMockClient({
        mcp: { publishTranslations: { mutate: mutateMock } },
      });

      await publishTranslations.execute(client, {
        project: "my-org/my-proj",
        translations: [{ keyId: VALID_KEY_ID, languageCode: "fr" }],
      });

      expect(mutateMock).toHaveBeenCalledWith({
        orgSlug: "my-org",
        projectSlug: "my-proj",
        translations: [{ keyId: VALID_KEY_ID, languageCode: "fr" }],
      });
    });

    it("returns API response as success", async () => {
      const apiResponse = { syncJobIds: ["job-1", "job-2"] };
      const mutateMock = vi.fn().mockResolvedValue(apiResponse);
      const client = createMockClient({
        mcp: { publishTranslations: { mutate: mutateMock } },
      });

      const result = await publishTranslations.execute(client, {
        project: "org/proj",
      });

      expect(result.isError).toBeUndefined();
      const parsed = JSON.parse(result.content[0].text!);
      expect(parsed).toEqual(apiResponse);
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const mutateMock = vi.fn().mockRejectedValue(new Error("Publish failed"));
      const client = createMockClient({
        mcp: { publishTranslations: { mutate: mutateMock } },
      });

      const result = await publishTranslations.execute(client, {
        project: "org/proj",
      });

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Publish failed");
    });
  });
});
