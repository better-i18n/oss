import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { checkForUpdate } from "../version-check.js";

describe("checkForUpdate", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.useRealTimers();
  });

  it("returns needsUpdate: true when registry has a newer version", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ version: "1.2.0" }),
    });

    const result = await checkForUpdate("@better-i18n/mcp", "1.0.0");

    expect(result).toEqual({
      needsUpdate: true,
      latest: "1.2.0",
      current: "1.0.0",
    });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://registry.npmjs.org/@better-i18n/mcp/latest",
      expect.objectContaining({
        headers: { Accept: "application/json" },
      }),
    );
  });

  it("returns needsUpdate: false when versions match", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ version: "1.0.0" }),
    });

    const result = await checkForUpdate("@better-i18n/mcp", "1.0.0");

    expect(result).toEqual({
      needsUpdate: false,
      latest: "1.0.0",
      current: "1.0.0",
    });
  });

  it("returns null when registry returns non-ok response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    const result = await checkForUpdate("@better-i18n/nonexistent", "1.0.0");
    expect(result).toBeNull();
  });

  it("returns null when registry response has no version field", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ name: "@better-i18n/mcp" }),
    });

    const result = await checkForUpdate("@better-i18n/mcp", "1.0.0");
    expect(result).toBeNull();
  });

  it("returns null on network error (silent fail)", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("ENOTFOUND"));

    const result = await checkForUpdate("@better-i18n/mcp", "1.0.0");
    expect(result).toBeNull();
  });

  it("returns null on fetch abort / timeout (silent fail)", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new DOMException("Aborted", "AbortError"));

    const result = await checkForUpdate("@better-i18n/mcp", "1.0.0");
    expect(result).toBeNull();
  });

  it("works with @better-i18n/mcp-content package name", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ version: "2.0.0" }),
    });

    const result = await checkForUpdate("@better-i18n/mcp-content", "0.6.0");

    expect(result).toEqual({
      needsUpdate: true,
      latest: "2.0.0",
      current: "0.6.0",
    });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://registry.npmjs.org/@better-i18n/mcp-content/latest",
      expect.anything(),
    );
  });

  it("passes AbortController signal to fetch for timeout support", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ version: "1.0.0" }),
    });

    await checkForUpdate("@better-i18n/mcp", "1.0.0");

    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const options = call[1] as RequestInit;
    expect(options.signal).toBeInstanceOf(AbortSignal);
  });
});
