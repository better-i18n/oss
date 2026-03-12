import { describe, it, expect, vi } from "vitest";
import { listKeys } from "../listKeys.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectSuccess, expectError, isErrorResult } from "../../__tests__/helpers.js";

const mockListKeysData = {
  tot: 42,
  ret: 20,
  has_more: true,
  nss: ["auth", "common"],
  k: [
    { k: "login.title", ns: 0, id: "key-1", src: "Login" },
    { k: "button.ok", ns: 1, id: "key-2", src: "OK" },
  ],
};

describe("listKeys", () => {
  it("rejects missing project → isError", async () => {
    const client = createMockClient();
    const result = await listKeys.execute(client, {});
    expect(isErrorResult(result)).toBe(true);
  });

  it("rejects invalid project format → isError", async () => {
    const client = createMockClient();
    const result = await listKeys.execute(client, { project: "invalid-no-slash" });
    expect(isErrorResult(result)).toBe(true);
    const msg = expectError(result);
    expect(msg).toContain("Invalid project format");
  });

  it("accepts minimal input (project only) → calls API with defaults", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockListKeysData);
    const client = createMockClient({ mcp: { listKeys: { query: queryFn } } });

    const result = await listKeys.execute(client, { project: "my-org/my-project" });

    expect(isErrorResult(result)).toBe(false);
    expect(queryFn).toHaveBeenCalledWith(
      expect.objectContaining({
        orgSlug: "my-org",
        projectSlug: "my-project",
        page: 1,
        limit: 20,
      }),
    );
  });

  it("passes search filter → API receives search", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockListKeysData);
    const client = createMockClient({ mcp: { listKeys: { query: queryFn } } });

    await listKeys.execute(client, { project: "my-org/my-project", search: "login" });

    expect(queryFn).toHaveBeenCalledWith(
      expect.objectContaining({ search: "login" }),
    );
  });

  it("passes namespaces filter → API receives namespaces", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockListKeysData);
    const client = createMockClient({ mcp: { listKeys: { query: queryFn } } });

    await listKeys.execute(client, {
      project: "my-org/my-project",
      namespaces: ["auth", "common"],
    });

    expect(queryFn).toHaveBeenCalledWith(
      expect.objectContaining({ namespaces: ["auth", "common"] }),
    );
  });

  it("passes missingLanguage filter → API receives missingLanguage", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockListKeysData);
    const client = createMockClient({ mcp: { listKeys: { query: queryFn } } });

    await listKeys.execute(client, {
      project: "my-org/my-project",
      missingLanguage: "tr",
    });

    expect(queryFn).toHaveBeenCalledWith(
      expect.objectContaining({ missingLanguage: "tr" }),
    );
  });

  it("passes fields filter → API receives fields", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockListKeysData);
    const client = createMockClient({ mcp: { listKeys: { query: queryFn } } });

    await listKeys.execute(client, {
      project: "my-org/my-project",
      fields: ["id", "translatedLanguageCount"],
    });

    expect(queryFn).toHaveBeenCalledWith(
      expect.objectContaining({ fields: ["id", "translatedLanguageCount"] }),
    );
  });

  it("passes pagination params → page:2, limit:50 → API receives them", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockListKeysData);
    const client = createMockClient({ mcp: { listKeys: { query: queryFn } } });

    await listKeys.execute(client, {
      project: "my-org/my-project",
      page: 2,
      limit: 50,
    });

    expect(queryFn).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2, limit: 50 }),
    );
  });

  it("returns API response as success", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockListKeysData);
    const client = createMockClient({ mcp: { listKeys: { query: queryFn } } });

    const result = await listKeys.execute(client, { project: "my-org/my-project" });

    const data = expectSuccess(result);
    expect(data).toMatchObject({ tot: 42, ret: 20, has_more: true });
  });

  it("returns isError when API throws", async () => {
    const queryFn = vi.fn().mockRejectedValue(new Error("API unavailable"));
    const client = createMockClient({ mcp: { listKeys: { query: queryFn } } });

    const result = await listKeys.execute(client, { project: "my-org/my-project" });

    expect(isErrorResult(result)).toBe(true);
    expect(expectError(result)).toContain("API unavailable");
  });
});
