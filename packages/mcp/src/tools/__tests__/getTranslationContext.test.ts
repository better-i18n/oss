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

  describe("v2 RAG mode", () => {
    const KEY_A = "11111111-1111-4111-8111-111111111111";
    const KEY_B = "22222222-2222-4222-8222-222222222222";

    it("forwards keys + kPerKey when both are provided", async () => {
      const queryFn = vi.fn().mockResolvedValue({
        ...mockContextResponse,
        rules: [
          { id: KEY_A, k: "auth.login.title", sim: [] },
        ],
      });
      const client = createMockClient({
        mcp: { getTranslationContext: { query: queryFn } },
      });

      await getTranslationContext.execute(client, {
        project: "acme/dashboard",
        keys: [KEY_A, KEY_B],
        kPerKey: 8,
      });

      expect(queryFn).toHaveBeenCalledWith({
        orgSlug: "acme",
        projectSlug: "dashboard",
        keys: [KEY_A, KEY_B],
        kPerKey: 8,
      });
    });

    it("omits kPerKey when not supplied (server-side default applies)", async () => {
      const queryFn = vi.fn().mockResolvedValue(mockContextResponse);
      const client = createMockClient({
        mcp: { getTranslationContext: { query: queryFn } },
      });

      await getTranslationContext.execute(client, {
        project: "acme/dashboard",
        keys: [KEY_A],
      });

      const call = queryFn.mock.calls[0][0];
      expect(call).toMatchObject({
        orgSlug: "acme",
        projectSlug: "dashboard",
        keys: [KEY_A],
      });
      expect(call).not.toHaveProperty("kPerKey");
    });

    it("rejects kPerKey out of bounds (0)", async () => {
      const client = createMockClient();
      const result = await getTranslationContext.execute(client, {
        project: "acme/dashboard",
        keys: [KEY_A],
        kPerKey: 0,
      });
      expect(isErrorResult(result)).toBe(true);
    });

    it("rejects kPerKey out of bounds (21)", async () => {
      const client = createMockClient();
      const result = await getTranslationContext.execute(client, {
        project: "acme/dashboard",
        keys: [KEY_A],
        kPerKey: 21,
      });
      expect(isErrorResult(result)).toBe(true);
    });

    it("rejects keys array longer than 50 entries", async () => {
      const client = createMockClient();
      const tooMany = Array.from({ length: 51 }, (_, i) =>
        `${"0".repeat(8)}-${"0".repeat(4)}-4${"0".repeat(3)}-8${"0".repeat(3)}-${String(i).padStart(12, "0")}`,
      );
      const result = await getTranslationContext.execute(client, {
        project: "acme/dashboard",
        keys: tooMany,
      });
      expect(isErrorResult(result)).toBe(true);
    });

    it("returns rules[] when server responds with RAG data", async () => {
      const queryFn = vi.fn().mockResolvedValue({
        ...mockContextResponse,
        rules: [
          {
            id: KEY_A,
            k: "auth.login.title",
            sim: [
              {
                tp: "translation",
                c: "Hesabınıza giriş yapın",
                s: 0.87,
                l: "tr",
              },
            ],
          },
        ],
      });
      const client = createMockClient({
        mcp: { getTranslationContext: { query: queryFn } },
      });

      const result = await getTranslationContext.execute(client, {
        project: "acme/dashboard",
        keys: [KEY_A],
      });

      const data = expectSuccess(result) as typeof mockContextResponse & {
        rules: Array<{ id: string; k: string; sim: Array<{ s: number }> }>;
      };
      expect(data.rules).toHaveLength(1);
      expect(data.rules[0]).toMatchObject({ id: KEY_A, k: "auth.login.title" });
      expect(data.rules[0].sim[0].s).toBeGreaterThan(0.8);
    });

    it("still returns success when server omits rules (RAG degraded)", async () => {
      // Server-side degrade path: no rules field + hint explains why.
      const queryFn = vi.fn().mockResolvedValue({
        ...mockContextResponse,
        hint: "Embedding service temporarily unavailable (circuit breaker open). Project-wide context returned without per-key retrieval.",
      });
      const client = createMockClient({
        mcp: { getTranslationContext: { query: queryFn } },
      });

      const result = await getTranslationContext.execute(client, {
        project: "acme/dashboard",
        keys: [KEY_A],
      });

      expect(isErrorResult(result)).toBe(false);
      const data = expectSuccess(result) as typeof mockContextResponse & {
        hint?: string;
        rules?: unknown;
      };
      expect(data.rules).toBeUndefined();
      expect(data.hint).toContain("Embedding service");
    });
  });
});
