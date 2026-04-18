import { describe, it, expect, vi } from "vitest";
import { getTranslationContext } from "../getTranslationContext.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import {
  expectSuccess,
  expectError,
  isErrorResult,
} from "../../__tests__/helpers.js";

const mockContextResponse = {
  prj: "acme/dashboard",
  src: "en",
  tgt: ["tr", "de"],
  inst: "Be concise; use product names verbatim.",
  ctx: {
    d: "Developer platform for localization",
    tone: { f: "professional", v: ["direct"] },
  },
  gl: [
    { t: "Better i18n", tp: "brand", d: "Product name", mnt: true, tr: {} },
  ],
  glt: 1,
};

describe("getTranslationContext", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await getTranslationContext.execute(client, {});
      expect(isErrorResult(result)).toBe(true);
    });

    it("rejects invalid project format", async () => {
      const client = createMockClient();
      const result = await getTranslationContext.execute(client, {
        project: "no-slash",
      });
      expect(isErrorResult(result)).toBe(true);
      expect(expectError(result)).toContain("Invalid project format");
    });

    it("rejects non-UUID keys entries", async () => {
      const client = createMockClient();
      const result = await getTranslationContext.execute(client, {
        project: "acme/dashboard",
        keys: ["not-a-uuid"],
      });
      expect(isErrorResult(result)).toBe(true);
    });
  });

  describe("API wiring", () => {
    it("forwards org + project on the minimal call", async () => {
      const queryFn = vi.fn().mockResolvedValue(mockContextResponse);
      const client = createMockClient({
        mcp: { getTranslationContext: { query: queryFn } },
      });

      await getTranslationContext.execute(client, {
        project: "acme/dashboard",
      });

      expect(queryFn).toHaveBeenCalledWith({
        orgSlug: "acme",
        projectSlug: "dashboard",
      });
    });

    it("forwards optional languages filter when provided", async () => {
      const queryFn = vi.fn().mockResolvedValue(mockContextResponse);
      const client = createMockClient({
        mcp: { getTranslationContext: { query: queryFn } },
      });

      await getTranslationContext.execute(client, {
        project: "acme/dashboard",
        languages: ["tr", "de"],
      });

      expect(queryFn).toHaveBeenCalledWith({
        orgSlug: "acme",
        projectSlug: "dashboard",
        languages: ["tr", "de"],
      });
    });

    it("forwards the v2-reserved keys param so callers can wire it today", async () => {
      const queryFn = vi.fn().mockResolvedValue(mockContextResponse);
      const client = createMockClient({
        mcp: { getTranslationContext: { query: queryFn } },
      });

      const uuid = "11111111-1111-4111-8111-111111111111";
      await getTranslationContext.execute(client, {
        project: "acme/dashboard",
        keys: [uuid],
      });

      expect(queryFn).toHaveBeenCalledWith({
        orgSlug: "acme",
        projectSlug: "dashboard",
        keys: [uuid],
      });
    });

    it("returns the compact payload as success", async () => {
      const queryFn = vi.fn().mockResolvedValue(mockContextResponse);
      const client = createMockClient({
        mcp: { getTranslationContext: { query: queryFn } },
      });

      const result = await getTranslationContext.execute(client, {
        project: "acme/dashboard",
      });

      const data = expectSuccess(result) as typeof mockContextResponse;
      expect(data).toMatchObject({
        prj: "acme/dashboard",
        src: "en",
        glt: 1,
      });
      expect(data.gl[0].mnt).toBe(true);
    });

    it("returns isError when API throws (e.g., project not found)", async () => {
      const queryFn = vi
        .fn()
        .mockRejectedValue(new Error("Project not found"));
      const client = createMockClient({
        mcp: { getTranslationContext: { query: queryFn } },
      });

      const result = await getTranslationContext.execute(client, {
        project: "acme/missing",
      });

      expect(isErrorResult(result)).toBe(true);
      expect(expectError(result)).toContain("Project not found");
    });
  });
});
