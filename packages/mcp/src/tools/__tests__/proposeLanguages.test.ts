import { describe, it, expect, vi } from "vitest";
import { proposeLanguages } from "../proposeLanguages.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectSuccess, expectError, isErrorResult } from "../../__tests__/helpers.js";

const mockAddLanguagesResult = {
  success: true,
  added: ["fr"],
  skipped: [],
  results: [{ languageCode: "fr", added: true }],
};

describe("proposeLanguages", () => {
  it("rejects missing project → isError", async () => {
    const client = createMockClient();
    const result = await proposeLanguages.execute(client, {
      languages: [{ languageCode: "fr" }],
    });
    expect(isErrorResult(result)).toBe(true);
  });

  it("rejects missing languages array → isError", async () => {
    const client = createMockClient();
    const result = await proposeLanguages.execute(client, {
      project: "my-org/my-project",
    });
    expect(isErrorResult(result)).toBe(true);
  });

  it("rejects empty languages array (min 1) → isError", async () => {
    const client = createMockClient();
    const result = await proposeLanguages.execute(client, {
      project: "my-org/my-project",
      languages: [],
    });
    expect(isErrorResult(result)).toBe(true);
  });

  it("rejects languageCode shorter than 2 chars → isError", async () => {
    const client = createMockClient();
    const result = await proposeLanguages.execute(client, {
      project: "my-org/my-project",
      languages: [{ languageCode: "f" }],
    });
    expect(isErrorResult(result)).toBe(true);
  });

  it("normalizes languageCode to lowercase — 'FR' → client receives 'fr'", async () => {
    const mutateFn = vi.fn().mockResolvedValue(mockAddLanguagesResult);
    const client = createMockClient({ mcp: { addLanguages: { mutate: mutateFn } } });

    await proposeLanguages.execute(client, {
      project: "my-org/my-project",
      languages: [{ languageCode: "FR" }],
    });

    expect(mutateFn).toHaveBeenCalledWith(
      expect.objectContaining({
        languages: expect.arrayContaining([
          expect.objectContaining({ languageCode: "fr" }),
        ]),
      }),
    );
  });

  it("omits status when not provided (uses API default)", async () => {
    const mutateFn = vi.fn().mockResolvedValue(mockAddLanguagesResult);
    const client = createMockClient({ mcp: { addLanguages: { mutate: mutateFn } } });

    await proposeLanguages.execute(client, {
      project: "my-org/my-project",
      languages: [{ languageCode: "fr" }],
    });

    expect(mutateFn).toHaveBeenCalledWith(
      expect.objectContaining({
        languages: expect.arrayContaining([
          expect.objectContaining({ languageCode: "fr" }),
        ]),
      }),
    );
  });

  it("passes through explicit status 'draft'", async () => {
    const mutateFn = vi.fn().mockResolvedValue({
      ...mockAddLanguagesResult,
      added: ["de"],
      results: [{ languageCode: "de", added: true }],
    });
    const client = createMockClient({ mcp: { addLanguages: { mutate: mutateFn } } });

    await proposeLanguages.execute(client, {
      project: "my-org/my-project",
      languages: [{ languageCode: "de", status: "draft" }],
    });

    expect(mutateFn).toHaveBeenCalledWith(
      expect.objectContaining({
        languages: expect.arrayContaining([
          expect.objectContaining({ languageCode: "de", status: "draft" }),
        ]),
      }),
    );
  });

  it("wraps response with success/added/skipped/project fields", async () => {
    const mutateFn = vi.fn().mockResolvedValue(mockAddLanguagesResult);
    const client = createMockClient({ mcp: { addLanguages: { mutate: mutateFn } } });

    const result = await proposeLanguages.execute(client, {
      project: "my-org/my-project",
      languages: [{ languageCode: "fr" }],
    });

    const data = expectSuccess(result) as Record<string, unknown>;
    expect(data).toHaveProperty("success", true);
    expect(data).toHaveProperty("added");
    expect(data).toHaveProperty("skipped");
    expect(data).toHaveProperty("project", "my-org/my-project");
  });

  it("returns isError when API throws", async () => {
    const mutateFn = vi.fn().mockRejectedValue(new Error("Language limit exceeded"));
    const client = createMockClient({ mcp: { addLanguages: { mutate: mutateFn } } });

    const result = await proposeLanguages.execute(client, {
      project: "my-org/my-project",
      languages: [{ languageCode: "fr" }],
    });

    expect(isErrorResult(result)).toBe(true);
    expect(expectError(result)).toContain("Language limit exceeded");
  });
});
