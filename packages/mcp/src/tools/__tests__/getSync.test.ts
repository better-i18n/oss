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

  it("forwards waitMs when provided (blocking wait opt-in)", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockSyncData);
    const client = createMockClient({ mcp: { getSync: { query: queryFn } } });

    await getSync.execute(client, { syncId: "sync-123", waitMs: 15000 });

    expect(queryFn).toHaveBeenCalledWith({
      syncId: "sync-123",
      waitMs: 15000,
    });
  });

  it("omits waitMs when not provided (instant snapshot — backward-compat)", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockSyncData);
    const client = createMockClient({ mcp: { getSync: { query: queryFn } } });

    await getSync.execute(client, { syncId: "sync-123" });

    const call = queryFn.mock.calls[0][0];
    expect(call).toEqual({ syncId: "sync-123" });
    expect(call).not.toHaveProperty("waitMs");
  });

  it("rejects waitMs beyond the 25000ms safety cap", async () => {
    const client = createMockClient();
    const result = await getSync.execute(client, {
      syncId: "sync-123",
      waitMs: 30000,
    });
    expect(isErrorResult(result)).toBe(true);
  });

  it("accepts waitMs=0 as explicit opt-out (equivalent to omit on server)", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockSyncData);
    const client = createMockClient({ mcp: { getSync: { query: queryFn } } });

    await getSync.execute(client, { syncId: "sync-123", waitMs: 0 });

    expect(queryFn).toHaveBeenCalledWith({ syncId: "sync-123", waitMs: 0 });
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
