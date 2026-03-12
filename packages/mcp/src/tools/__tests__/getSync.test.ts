import { describe, it, expect, vi } from "vitest";
import { getSync } from "../getSync.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectSuccess, expectError, isErrorResult } from "../../__tests__/helpers.js";

const mockSyncData = {
  id: "sync-123",
  type: "source_sync",
  status: "completed",
  projectId: "proj-1",
  createdAt: "2024-01-01T00:00:00Z",
  completedAt: "2024-01-01T00:01:00Z",
  logs: ["Imported 15 keys", "Sync completed successfully"],
  affectedKeys: ["auth.login.title", "auth.logout.button"],
};

describe("getSync", () => {
  it("rejects missing syncId → isError", async () => {
    const client = createMockClient();
    const result = await getSync.execute(client, {});
    expect(isErrorResult(result)).toBe(true);
  });

  it("calls API with correct syncId", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockSyncData);
    const client = createMockClient({ mcp: { getSync: { query: queryFn } } });

    await getSync.execute(client, { syncId: "sync-123" });

    expect(queryFn).toHaveBeenCalledWith({ syncId: "sync-123" });
  });

  it("returns API response as success", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockSyncData);
    const client = createMockClient({ mcp: { getSync: { query: queryFn } } });

    const result = await getSync.execute(client, { syncId: "sync-123" });

    const data = expectSuccess(result);
    expect(data).toMatchObject({ id: "sync-123", type: "source_sync", status: "completed" });
  });

  it("returns isError when API throws", async () => {
    const queryFn = vi.fn().mockRejectedValue(new Error("Sync not found"));
    const client = createMockClient({ mcp: { getSync: { query: queryFn } } });

    const result = await getSync.execute(client, { syncId: "sync-999" });

    expect(isErrorResult(result)).toBe(true);
    expect(expectError(result)).toContain("Sync not found");
  });
});
