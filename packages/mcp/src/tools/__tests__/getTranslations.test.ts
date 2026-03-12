import { describe, it, expect, vi } from "vitest";
import { getTranslations } from "../getTranslations.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectSuccess, expectError, isErrorResult } from "../../__tests__/helpers.js";

const mockTranslationsData = {
  returned: 5,
  total: 100,
  hasMore: false,
  keys: [
    {
      id: "key-1",
      name: "auth.login.title",
      namespace: "auth",
      sourceText: "Login",
      translations: { tr: { text: "Giriş", status: "published" } },
    },
  ],
  namespaceDetails: {},
};

describe("getTranslations", () => {
  it("rejects missing project → isError", async () => {
    const client = createMockClient();
    const result = await getTranslations.execute(client, {});
    expect(isErrorResult(result)).toBe(true);
  });

  it("accepts project-only input → calls API with minimal params", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockTranslationsData);
    const client = createMockClient({ mcp: { getAllTranslations: { query: queryFn } } });

    const result = await getTranslations.execute(client, { project: "my-org/my-project" });

    expect(isErrorResult(result)).toBe(false);
    expect(queryFn).toHaveBeenCalledWith(
      expect.objectContaining({
        orgSlug: "my-org",
        projectSlug: "my-project",
      }),
    );
  });

  it("passes search filter (string)", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockTranslationsData);
    const client = createMockClient({ mcp: { getAllTranslations: { query: queryFn } } });

    await getTranslations.execute(client, {
      project: "my-org/my-project",
      search: "login",
    });

    expect(queryFn).toHaveBeenCalledWith(
      expect.objectContaining({ search: "login" }),
    );
  });

  it("passes search filter (array of strings)", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockTranslationsData);
    const client = createMockClient({ mcp: { getAllTranslations: { query: queryFn } } });

    await getTranslations.execute(client, {
      project: "my-org/my-project",
      search: ["login", "signup"],
    });

    expect(queryFn).toHaveBeenCalledWith(
      expect.objectContaining({ search: ["login", "signup"] }),
    );
  });

  it("passes languages filter", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockTranslationsData);
    const client = createMockClient({ mcp: { getAllTranslations: { query: queryFn } } });

    await getTranslations.execute(client, {
      project: "my-org/my-project",
      languages: ["tr", "de"],
    });

    expect(queryFn).toHaveBeenCalledWith(
      expect.objectContaining({ languages: ["tr", "de"] }),
    );
  });

  it("passes namespaces filter", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockTranslationsData);
    const client = createMockClient({ mcp: { getAllTranslations: { query: queryFn } } });

    await getTranslations.execute(client, {
      project: "my-org/my-project",
      namespaces: ["auth", "common"],
    });

    expect(queryFn).toHaveBeenCalledWith(
      expect.objectContaining({ namespaces: ["auth", "common"] }),
    );
  });

  it("passes keys filter", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockTranslationsData);
    const client = createMockClient({ mcp: { getAllTranslations: { query: queryFn } } });

    await getTranslations.execute(client, {
      project: "my-org/my-project",
      keys: ["auth.login.title", "auth.login.button"],
    });

    expect(queryFn).toHaveBeenCalledWith(
      expect.objectContaining({ keys: ["auth.login.title", "auth.login.button"] }),
    );
  });

  it("passes status filter", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockTranslationsData);
    const client = createMockClient({ mcp: { getAllTranslations: { query: queryFn } } });

    await getTranslations.execute(client, {
      project: "my-org/my-project",
      status: "missing",
    });

    expect(queryFn).toHaveBeenCalledWith(
      expect.objectContaining({ status: "missing" }),
    );
  });

  it("passes limit", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockTranslationsData);
    const client = createMockClient({ mcp: { getAllTranslations: { query: queryFn } } });

    await getTranslations.execute(client, {
      project: "my-org/my-project",
      limit: 50,
    });

    expect(queryFn).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 50 }),
    );
  });

  it("returns API response as success", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockTranslationsData);
    const client = createMockClient({ mcp: { getAllTranslations: { query: queryFn } } });

    const result = await getTranslations.execute(client, { project: "my-org/my-project" });

    const data = expectSuccess(result);
    expect(data).toMatchObject({ returned: 5, total: 100, hasMore: false });
  });

  it("returns isError when API throws", async () => {
    const queryFn = vi.fn().mockRejectedValue(new Error("Network error"));
    const client = createMockClient({ mcp: { getAllTranslations: { query: queryFn } } });

    const result = await getTranslations.execute(client, { project: "my-org/my-project" });

    expect(isErrorResult(result)).toBe(true);
    expect(expectError(result)).toContain("Network error");
  });
});
