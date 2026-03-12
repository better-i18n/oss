import { describe, it, expect, vi } from "vitest";
import { proposeLanguageEdits } from "../proposeLanguageEdits.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectSuccess, expectError, isErrorResult } from "../../__tests__/helpers.js";

const mockUpdateLanguagesResult = {
  success: true,
  results: [{ languageCode: "tr", updated: true, status: "archived" }],
  notFound: [],
};

describe("proposeLanguageEdits", () => {
  it("rejects missing project → isError", async () => {
    const client = createMockClient();
    const result = await proposeLanguageEdits.execute(client, {
      edits: [{ languageCode: "tr", newStatus: "archived" }],
    });
    expect(isErrorResult(result)).toBe(true);
  });

  it("rejects missing edits array → isError", async () => {
    const client = createMockClient();
    const result = await proposeLanguageEdits.execute(client, {
      project: "my-org/my-project",
    });
    expect(isErrorResult(result)).toBe(true);
  });

  it("rejects empty edits array → isError", async () => {
    const client = createMockClient();
    const result = await proposeLanguageEdits.execute(client, {
      project: "my-org/my-project",
      edits: [],
    });
    expect(isErrorResult(result)).toBe(true);
  });

  it("normalizes languageCode to lowercase", async () => {
    const mutateFn = vi.fn().mockResolvedValue(mockUpdateLanguagesResult);
    const client = createMockClient({ mcp: { updateLanguages: { mutate: mutateFn } } });

    await proposeLanguageEdits.execute(client, {
      project: "my-org/my-project",
      edits: [{ languageCode: "TR", newStatus: "archived" }],
    });

    expect(mutateFn).toHaveBeenCalledWith(
      expect.objectContaining({
        updates: expect.arrayContaining([
          expect.objectContaining({ languageCode: "tr" }),
        ]),
      }),
    );
  });

  it("maps edits[].newStatus → updates[].status (field rename)", async () => {
    const mutateFn = vi.fn().mockResolvedValue(mockUpdateLanguagesResult);
    const client = createMockClient({ mcp: { updateLanguages: { mutate: mutateFn } } });

    await proposeLanguageEdits.execute(client, {
      project: "my-org/my-project",
      edits: [{ languageCode: "tr", newStatus: "draft" }],
    });

    expect(mutateFn).toHaveBeenCalledWith(
      expect.objectContaining({
        updates: expect.arrayContaining([
          expect.objectContaining({ languageCode: "tr", status: "draft" }),
        ]),
      }),
    );
    // Ensure the API is NOT called with the input field name "newStatus"
    const callArg = mutateFn.mock.calls[0][0] as { updates: unknown[] };
    const update = callArg.updates[0] as Record<string, unknown>;
    expect(update).not.toHaveProperty("newStatus");
  });

  it("wraps response with success/results/notFound/project fields", async () => {
    const mutateFn = vi.fn().mockResolvedValue(mockUpdateLanguagesResult);
    const client = createMockClient({ mcp: { updateLanguages: { mutate: mutateFn } } });

    const result = await proposeLanguageEdits.execute(client, {
      project: "my-org/my-project",
      edits: [{ languageCode: "tr", newStatus: "archived" }],
    });

    const data = expectSuccess(result) as Record<string, unknown>;
    expect(data).toHaveProperty("success", true);
    expect(data).toHaveProperty("results");
    expect(data).toHaveProperty("notFound");
    expect(data).toHaveProperty("project", "my-org/my-project");
  });

  it("returns isError when API throws", async () => {
    const mutateFn = vi.fn().mockRejectedValue(new Error("Language not found"));
    const client = createMockClient({ mcp: { updateLanguages: { mutate: mutateFn } } });

    const result = await proposeLanguageEdits.execute(client, {
      project: "my-org/my-project",
      edits: [{ languageCode: "tr", newStatus: "archived" }],
    });

    expect(isErrorResult(result)).toBe(true);
    expect(expectError(result)).toContain("Language not found");
  });
});
