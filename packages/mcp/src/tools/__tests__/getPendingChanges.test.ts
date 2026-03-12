import { describe, it, expect, vi } from "vitest";
import { getPendingChanges } from "../getPendingChanges.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectSuccess, expectError, isErrorResult } from "../../__tests__/helpers.js";

const mockPendingChangesData = {
  hasPendingChanges: true,
  summary: {
    translations: 5,
    deletedKeys: 0,
    languageChanges: 1,
    total: 6,
  },
  byLanguage: {
    tr: { count: 5, samples: ["auth.login.title"] },
  },
  deletedKeys: [],
  publishDestination: "cdn",
  cannotPublishReason: null,
};

describe("getPendingChanges", () => {
  it("rejects missing project → isError", async () => {
    const client = createMockClient();
    const result = await getPendingChanges.execute(client, {});
    expect(isErrorResult(result)).toBe(true);
  });

  it("calls API with correct orgSlug and projectSlug", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockPendingChangesData);
    const client = createMockClient({ mcp: { getPendingChanges: { query: queryFn } } });

    await getPendingChanges.execute(client, { project: "my-org/my-project" });

    expect(queryFn).toHaveBeenCalledWith({
      orgSlug: "my-org",
      projectSlug: "my-project",
    });
  });

  it("returns API response as success", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockPendingChangesData);
    const client = createMockClient({ mcp: { getPendingChanges: { query: queryFn } } });

    const result = await getPendingChanges.execute(client, { project: "my-org/my-project" });

    const data = expectSuccess(result);
    expect(data).toMatchObject({ hasPendingChanges: true, publishDestination: "cdn" });
  });

  it("returns isError when API throws", async () => {
    const queryFn = vi.fn().mockRejectedValue(new Error("Forbidden"));
    const client = createMockClient({ mcp: { getPendingChanges: { query: queryFn } } });

    const result = await getPendingChanges.execute(client, { project: "my-org/my-project" });

    expect(isErrorResult(result)).toBe(true);
    expect(expectError(result)).toContain("Forbidden");
  });
});
