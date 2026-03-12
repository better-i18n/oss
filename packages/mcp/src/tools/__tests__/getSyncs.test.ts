import { describe, it, expect, vi } from "vitest";
import { getSyncs } from "../getSyncs.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectSuccess, expectError, isErrorResult } from "../../__tests__/helpers.js";

const mockSyncsData = {
  syncs: [
    {
      id: "sync-1",
      type: "source_sync",
      status: "completed",
      createdAt: "2024-01-01T00:00:00Z",
      completedAt: "2024-01-01T00:01:00Z",
    },
  ],
  total: 1,
};

describe("getSyncs", () => {
  it("rejects missing project → isError", async () => {
    const client = createMockClient();
    const result = await getSyncs.execute(client, {});
    expect(isErrorResult(result)).toBe(true);
  });

  it("accepts minimal input (project only)", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockSyncsData);
    const client = createMockClient({ mcp: { getSyncs: { query: queryFn } } });

    const result = await getSyncs.execute(client, { project: "my-org/my-project" });

    expect(isErrorResult(result)).toBe(false);
    expect(queryFn).toHaveBeenCalledWith(
      expect.objectContaining({
        orgSlug: "my-org",
        projectSlug: "my-project",
      }),
    );
  });

  it("passes optional limit filter", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockSyncsData);
    const client = createMockClient({ mcp: { getSyncs: { query: queryFn } } });

    await getSyncs.execute(client, { project: "my-org/my-project", limit: 10 });

    expect(queryFn).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 10 }),
    );
  });

  it("passes optional status filter", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockSyncsData);
    const client = createMockClient({ mcp: { getSyncs: { query: queryFn } } });

    await getSyncs.execute(client, { project: "my-org/my-project", status: "completed" });

    expect(queryFn).toHaveBeenCalledWith(
      expect.objectContaining({ status: "completed" }),
    );
  });

  it("passes optional type filter", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockSyncsData);
    const client = createMockClient({ mcp: { getSyncs: { query: queryFn } } });

    await getSyncs.execute(client, { project: "my-org/my-project", type: "source_sync" });

    expect(queryFn).toHaveBeenCalledWith(
      expect.objectContaining({ type: "source_sync" }),
    );
  });

  it("returns API response as success", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockSyncsData);
    const client = createMockClient({ mcp: { getSyncs: { query: queryFn } } });

    const result = await getSyncs.execute(client, { project: "my-org/my-project" });

    const data = expectSuccess(result);
    expect(data).toMatchObject({ total: 1 });
  });

  it("returns isError when API throws", async () => {
    const queryFn = vi.fn().mockRejectedValue(new Error("Timeout"));
    const client = createMockClient({ mcp: { getSyncs: { query: queryFn } } });

    const result = await getSyncs.execute(client, { project: "my-org/my-project" });

    expect(isErrorResult(result)).toBe(true);
    expect(expectError(result)).toContain("Timeout");
  });
});
