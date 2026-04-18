import { describe, it, expect, vi } from "vitest";
import { cancelSync } from "../cancelSync.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import {
  expectSuccess,
  expectError,
  isErrorResult,
} from "../../__tests__/helpers.js";

const SYNC_ID = "sync-uuid-1";

describe("cancelSync", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await cancelSync.execute(client, { syncId: SYNC_ID });
      expect(isErrorResult(result)).toBe(true);
    });

    it("rejects invalid project format (no slash)", async () => {
      const client = createMockClient();
      const result = await cancelSync.execute(client, {
        project: "no-slash",
        syncId: SYNC_ID,
      });
      expect(isErrorResult(result)).toBe(true);
      expect(expectError(result)).toContain("Invalid project format");
    });

    it("rejects missing syncId", async () => {
      const client = createMockClient();
      const result = await cancelSync.execute(client, {
        project: "org/proj",
      });
      expect(isErrorResult(result)).toBe(true);
    });
  });

  describe("API call wiring", () => {
    it("calls mcp.cancelSync.mutate with org/project/syncId", async () => {
      const mutateFn = vi.fn().mockResolvedValue({
        id: SYNC_ID,
        can: true,
        prev: "pending",
        rsn: "cancelled",
        hint: "Sync cancelled before it started.",
      });
      const client = createMockClient({
        mcp: { cancelSync: { mutate: mutateFn } },
      });

      await cancelSync.execute(client, {
        project: "acme/dashboard",
        syncId: SYNC_ID,
      });

      expect(mutateFn).toHaveBeenCalledWith({
        orgSlug: "acme",
        projectSlug: "dashboard",
        syncId: SYNC_ID,
      });
    });

    it("returns compact response as success on successful cancel", async () => {
      const mutateFn = vi.fn().mockResolvedValue({
        id: SYNC_ID,
        can: true,
        prev: "pending",
        rsn: "cancelled",
      });
      const client = createMockClient({
        mcp: { cancelSync: { mutate: mutateFn } },
      });

      const result = await cancelSync.execute(client, {
        project: "acme/dashboard",
        syncId: SYNC_ID,
      });

      const data = expectSuccess(result);
      expect(data).toMatchObject({
        id: SYNC_ID,
        can: true,
        prev: "pending",
        rsn: "cancelled",
      });
    });

    it("returns success (not error) on no-op (already in_progress)", async () => {
      // No-op is NOT an error — the agent should see can=false + reason and
      // decide what to do next. isError=true would break the agent loop.
      const mutateFn = vi.fn().mockResolvedValue({
        id: SYNC_ID,
        can: false,
        prev: "in_progress",
        rsn: "already_in_progress",
        hint: "Too late — the worker already picked this job up.",
      });
      const client = createMockClient({
        mcp: { cancelSync: { mutate: mutateFn } },
      });

      const result = await cancelSync.execute(client, {
        project: "acme/dashboard",
        syncId: SYNC_ID,
      });

      expect(isErrorResult(result)).toBe(false);
      const data = expectSuccess(result);
      expect(data).toMatchObject({
        can: false,
        prev: "in_progress",
        rsn: "already_in_progress",
      });
    });

    it("returns success on no-op (terminal state)", async () => {
      const mutateFn = vi.fn().mockResolvedValue({
        id: SYNC_ID,
        can: false,
        prev: "completed",
        rsn: "terminal_state",
      });
      const client = createMockClient({
        mcp: { cancelSync: { mutate: mutateFn } },
      });

      const result = await cancelSync.execute(client, {
        project: "acme/dashboard",
        syncId: SYNC_ID,
      });

      expect(isErrorResult(result)).toBe(false);
      const data = expectSuccess(result);
      expect(data).toMatchObject({ can: false, prev: "completed" });
    });

    it("returns isError when API throws (e.g., NOT_FOUND)", async () => {
      const mutateFn = vi
        .fn()
        .mockRejectedValue(new Error("Sync job not found"));
      const client = createMockClient({
        mcp: { cancelSync: { mutate: mutateFn } },
      });

      const result = await cancelSync.execute(client, {
        project: "acme/dashboard",
        syncId: "nope",
      });

      expect(isErrorResult(result)).toBe(true);
      expect(expectError(result)).toContain("Sync job not found");
    });
  });
});
