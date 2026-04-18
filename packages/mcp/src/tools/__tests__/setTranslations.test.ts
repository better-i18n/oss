import { describe, it, expect, vi } from "vitest";
import { setTranslations } from "../setTranslations.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";

const UUID_A = "11111111-1111-4111-8111-111111111111";
const UUID_B = "22222222-2222-4222-8222-222222222222";

describe("setTranslations", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await setTranslations.execute(client, {
        t: [{ id: UUID_A, t: { tr: "hi" } }],
      });
      expect(result.isError).toBe(true);
    });

    it("rejects invalid project format", async () => {
      const client = createMockClient();
      const result = await setTranslations.execute(client, {
        project: "no-slash",
        t: [{ id: UUID_A, t: { tr: "hi" } }],
      });
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Invalid project format");
    });

    it("rejects empty t array", async () => {
      const client = createMockClient();
      const result = await setTranslations.execute(client, {
        project: "org/proj",
        t: [],
      });
      expect(result.isError).toBe(true);
    });

    it("rejects non-UUID id", async () => {
      const client = createMockClient();
      const result = await setTranslations.execute(client, {
        project: "org/proj",
        t: [{ id: "not-a-uuid", t: { tr: "hi" } }],
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("data normalization", () => {
    it("lowercases language codes (BCP 47 with hyphens)", async () => {
      const mutateMock = vi.fn().mockResolvedValue({
        ok: true,
        cnt: 1,
        wrote: 3,
        upd: [{ id: UUID_A, k: "k1", lng: ["tr", "zh-hans", "pt-br"] }],
      });
      const client = createMockClient({
        mcp: { setTranslations: { mutate: mutateMock } },
      });

      await setTranslations.execute(client, {
        project: "org/proj",
        t: [
          {
            id: UUID_A,
            t: { TR: "Merhaba", "zh-Hans": "你好", "PT-BR": "Olá" },
          },
        ],
      });

      expect(mutateMock).toHaveBeenCalledOnce();
      const call = mutateMock.mock.calls[0][0];
      expect(call.t[0].t).toEqual({
        tr: "Merhaba",
        "zh-hans": "你好",
        "pt-br": "Olá",
      });
    });

    it("preserves UTF-8 characters verbatim", async () => {
      const mutateMock = vi.fn().mockResolvedValue({
        ok: true,
        cnt: 1,
        wrote: 2,
        upd: [{ id: UUID_A, k: "k1", lng: ["tr", "de"] }],
      });
      const client = createMockClient({
        mcp: { setTranslations: { mutate: mutateMock } },
      });

      await setTranslations.execute(client, {
        project: "org/proj",
        t: [{ id: UUID_A, t: { tr: "Öğretmen Başlığı", de: "München" } }],
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.t[0].t.tr).toBe("Öğretmen Başlığı");
      expect(call.t[0].t.de).toBe("München");
    });
  });

  describe("API call", () => {
    it("splits project into orgSlug/projectSlug and forwards t array", async () => {
      const mutateMock = vi.fn().mockResolvedValue({
        ok: true,
        cnt: 2,
        wrote: 3,
        upd: [
          { id: UUID_A, k: "k1", lng: ["tr", "de"] },
          { id: UUID_B, k: "k2", lng: ["tr"] },
        ],
      });
      const client = createMockClient({
        mcp: { setTranslations: { mutate: mutateMock } },
      });

      await setTranslations.execute(client, {
        project: "my-org/my-proj",
        t: [
          { id: UUID_A, t: { tr: "a", de: "b" } },
          { id: UUID_B, t: { tr: "c" } },
        ],
      });

      expect(mutateMock).toHaveBeenCalledWith({
        orgSlug: "my-org",
        projectSlug: "my-proj",
        t: [
          { id: UUID_A, t: { tr: "a", de: "b" } },
          { id: UUID_B, t: { tr: "c" } },
        ],
      });
    });

    it("returns the compact response as success content", async () => {
      const response = {
        ok: true,
        cnt: 1,
        wrote: 2,
        upd: [{ id: UUID_A, k: "btn.submit", lng: ["tr", "de"] }],
      };
      const mutateMock = vi.fn().mockResolvedValue(response);
      const client = createMockClient({
        mcp: { setTranslations: { mutate: mutateMock } },
      });

      const result = await setTranslations.execute(client, {
        project: "org/proj",
        t: [{ id: UUID_A, t: { tr: "Gönder", de: "Absenden" } }],
      });

      expect(result.isError).toBeFalsy();
      expect(result.content[0].text).toContain("btn.submit");
      expect(result.content[0].text).toMatch(/"wrote":\s*2/);
    });
  });
});
