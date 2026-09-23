import { describe, it, expect, vi } from "vitest";
import {
  scheduleContentEntryInput,
  unscheduleContentEntryInput,
} from "@better-i18n/mcp-types";
import { scheduleContentEntry } from "../scheduleContentEntry.js";
import { unscheduleContentEntry } from "../unscheduleContentEntry.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectError, expectSuccess } from "../../__tests__/helpers.js";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const PUBLISH_AT = "2026-10-01T09:00:00Z";
const MOCK_ENTRY = { id: VALID_UUID, sl: "hello-world", st: "draft", sch_at: "2026-10-01T09:00:00.000Z" };

describe("scheduleContentEntry", () => {
  describe("input validation", () => {
    it("rejects a missing publishAt", async () => {
      const result = await scheduleContentEntry.execute(createMockClient(), {
        project: "org/proj",
        entryId: VALID_UUID,
      });
      expect(result.isError).toBe(true);
    });

    it("rejects a publishAt that is not ISO 8601", async () => {
      const result = await scheduleContentEntry.execute(createMockClient(), {
        project: "org/proj",
        entryId: VALID_UUID,
        publishAt: "next tuesday",
      });
      expect(result.isError).toBe(true);
    });

    it("rejects an invalid entryId", async () => {
      const result = await scheduleContentEntry.execute(createMockClient(), {
        project: "org/proj",
        entryId: "not-a-uuid",
        publishAt: PUBLISH_AT,
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("API call", () => {
    it("sends a request the API schema accepts, without languages when omitted", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { scheduleContentEntry: { mutate: mutateMock } },
      });

      await scheduleContentEntry.execute(client, {
        project: "my-org/my-proj",
        entryId: VALID_UUID,
        publishAt: PUBLISH_AT,
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs).toEqual({
        orgSlug: "my-org",
        projectSlug: "my-proj",
        entryId: VALID_UUID,
        publishAt: PUBLISH_AT,
      });
      expect(scheduleContentEntryInput.safeParse(apiArgs).success).toBe(true);
    });

    it("passes languages and an offset time through", async () => {
      const mutateMock = vi.fn().mockResolvedValue(MOCK_ENTRY);
      const client = createMockClient({
        mcpContent: { scheduleContentEntry: { mutate: mutateMock } },
      });

      await scheduleContentEntry.execute(client, {
        project: "my-org/my-proj",
        entryId: VALID_UUID,
        publishAt: "2026-10-01T12:00:00+03:00",
        languages: ["tr", "de"],
      });

      const apiArgs = mutateMock.mock.calls[0][0];
      expect(apiArgs.languages).toEqual(["tr", "de"]);
      expect(scheduleContentEntryInput.safeParse(apiArgs).success).toBe(true);
    });

    it("returns scheduled: true with the entry", async () => {
      const client = createMockClient({
        mcpContent: { scheduleContentEntry: { mutate: vi.fn().mockResolvedValue(MOCK_ENTRY) } },
      });
      const result = await scheduleContentEntry.execute(client, {
        project: "my-org/my-proj",
        entryId: VALID_UUID,
        publishAt: PUBLISH_AT,
      });
      const data = expectSuccess(result) as { scheduled: boolean; entry: typeof MOCK_ENTRY };
      expect(data.scheduled).toBe(true);
      expect(data.entry).toEqual(MOCK_ENTRY);
    });

    it("surfaces an API rejection as an error", async () => {
      const client = createMockClient({
        mcpContent: {
          scheduleContentEntry: { mutate: vi.fn().mockRejectedValue(new Error("publishAt is in the past")) },
        },
      });
      const result = await scheduleContentEntry.execute(client, {
        project: "my-org/my-proj",
        entryId: VALID_UUID,
        publishAt: PUBLISH_AT,
      });
      expectError(result);
    });
  });
});

describe("unscheduleContentEntry", () => {
  it("rejects a missing entryId", async () => {
    const result = await unscheduleContentEntry.execute(createMockClient(), { project: "org/proj" });
    expect(result.isError).toBe(true);
  });

  it("sends a request the API schema accepts and returns unscheduled: true", async () => {
    const entry = { ...MOCK_ENTRY, sch_at: undefined };
    const mutateMock = vi.fn().mockResolvedValue(entry);
    const client = createMockClient({
      mcpContent: { unscheduleContentEntry: { mutate: mutateMock } },
    });

    const result = await unscheduleContentEntry.execute(client, {
      project: "my-org/my-proj",
      entryId: VALID_UUID,
    });

    const apiArgs = mutateMock.mock.calls[0][0];
    expect(apiArgs).toEqual({ orgSlug: "my-org", projectSlug: "my-proj", entryId: VALID_UUID });
    expect(unscheduleContentEntryInput.safeParse(apiArgs).success).toBe(true);
    const data = expectSuccess(result) as { unscheduled: boolean };
    expect(data.unscheduled).toBe(true);
  });
});
