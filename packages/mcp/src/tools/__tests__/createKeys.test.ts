import { describe, it, expect, vi } from "vitest";
import { createKeys } from "../createKeys.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";

describe("createKeys", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await createKeys.execute(client, { k: [{ n: "test" }] });
      expect(result.isError).toBe(true);
    });

    it("rejects invalid project format", async () => {
      const client = createMockClient();
      const result = await createKeys.execute(client, {
        project: "invalid",
        k: [{ n: "test" }],
      });
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Invalid project format");
    });

    it("rejects missing k array", async () => {
      const client = createMockClient();
      const result = await createKeys.execute(client, { project: "org/proj" });
      expect(result.isError).toBe(true);
    });

    it("rejects empty k array", async () => {
      const client = createMockClient();
      const result = await createKeys.execute(client, {
        project: "org/proj",
        k: [],
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("data normalization", () => {
    it("normalizes language codes to lowercase in translations", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ created: 1, dup: [], warn: [] });
      const client = createMockClient({
        mcp: { createKeys: { mutate: mutateMock } },
      });

      await createKeys.execute(client, {
        project: "org/proj",
        k: [{ n: "greeting", t: { TR: "merhaba", DE: "hallo" } }],
      });

      expect(mutateMock).toHaveBeenCalledOnce();
      const call = mutateMock.mock.calls[0][0];
      expect(call.k[0].t).toEqual({ tr: "merhaba", de: "hallo" });
    });

    it("defaults namespace to 'default'", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ created: 1, dup: [], warn: [] });
      const client = createMockClient({
        mcp: { createKeys: { mutate: mutateMock } },
      });

      await createKeys.execute(client, {
        project: "org/proj",
        k: [{ n: "test" }],
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.k[0].ns).toBe("default");
    });

    it("passes through namespace context", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ created: 1, dup: [], warn: [] });
      const client = createMockClient({
        mcp: { createKeys: { mutate: mutateMock } },
      });

      const nc = { description: "Auth namespace", team: "auth-team" };
      await createKeys.execute(client, {
        project: "org/proj",
        k: [{ n: "auth.title", nc }],
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.k[0].nc).toEqual(nc);
    });
  });

  describe("API call", () => {
    it("calls client.mcp.createKeys.mutate with correct params", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ created: 2, dup: [], warn: [] });
      const client = createMockClient({
        mcp: { createKeys: { mutate: mutateMock } },
      });

      await createKeys.execute(client, {
        project: "my-org/my-proj",
        k: [
          { n: "btn.submit", v: "Submit" },
          { n: "btn.cancel", ns: "ui", v: "Cancel" },
        ],
      });

      expect(mutateMock).toHaveBeenCalledWith({
        orgSlug: "my-org",
        projectSlug: "my-proj",
        k: [
          { n: "btn.submit", ns: "default", v: "Submit" },
          { n: "btn.cancel", ns: "ui", v: "Cancel" },
        ],
      });
    });

    it("returns API response as success", async () => {
      const apiResponse = { created: 3, dup: ["existing.key"], warn: [] };
      const mutateMock = vi.fn().mockResolvedValue(apiResponse);
      const client = createMockClient({
        mcp: { createKeys: { mutate: mutateMock } },
      });

      const result = await createKeys.execute(client, {
        project: "org/proj",
        k: [{ n: "test" }],
      });

      expect(result.isError).toBeUndefined();
      const parsed = JSON.parse(result.content[0].text!);
      expect(parsed).toEqual(apiResponse);
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const mutateMock = vi.fn().mockRejectedValue(new Error("API unavailable"));
      const client = createMockClient({
        mcp: { createKeys: { mutate: mutateMock } },
      });

      const result = await createKeys.execute(client, {
        project: "org/proj",
        k: [{ n: "test" }],
      });

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("API unavailable");
    });

    it("passes keys without translations unchanged", async () => {
      const mutateMock = vi.fn().mockResolvedValue({ created: 1, dup: [], warn: [] });
      const client = createMockClient({
        mcp: { createKeys: { mutate: mutateMock } },
      });

      await createKeys.execute(client, {
        project: "org/proj",
        k: [{ n: "test", v: "Test value" }],
      });

      const call = mutateMock.mock.calls[0][0];
      expect(call.k[0].t).toBeUndefined();
      expect(call.k[0].v).toBe("Test value");
    });
  });
});
