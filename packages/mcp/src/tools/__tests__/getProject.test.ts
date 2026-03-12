import { describe, it, expect, vi } from "vitest";
import { getProject } from "../getProject.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectSuccess, expectError, isErrorResult } from "../../__tests__/helpers.js";

const mockProjectData = {
  id: "proj-1",
  slug: "my-project",
  name: "My Project",
  orgSlug: "my-org",
  namespaces: [{ name: "auth", keyCount: 10 }],
  languages: [{ code: "tr", status: "active" }],
  keyCount: 42,
  cdn: {
    baseUrl: "https://cdn.better-i18n.com/my-org/my-project",
    pattern: "https://cdn.better-i18n.com/my-org/my-project/{locale}/{namespace}.json",
  },
};

describe("getProject", () => {
  it("rejects missing project → isError", async () => {
    const client = createMockClient();
    const result = await getProject.execute(client, {});
    expect(isErrorResult(result)).toBe(true);
  });

  it("rejects invalid project format → isError", async () => {
    const client = createMockClient();
    const result = await getProject.execute(client, { project: "no-slash" });
    expect(isErrorResult(result)).toBe(true);
    const msg = expectError(result);
    expect(msg).toContain("Invalid project format");
  });

  it("calls API with correct orgSlug and projectSlug", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockProjectData);
    const client = createMockClient({ mcp: { getProject: { query: queryFn } } });

    await getProject.execute(client, { project: "my-org/my-project" });

    expect(queryFn).toHaveBeenCalledWith({
      orgSlug: "my-org",
      projectSlug: "my-project",
    });
  });

  it("returns API response as success", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockProjectData);
    const client = createMockClient({ mcp: { getProject: { query: queryFn } } });

    const result = await getProject.execute(client, { project: "my-org/my-project" });

    const data = expectSuccess(result);
    expect(data).toMatchObject({ slug: "my-project", keyCount: 42 });
  });

  it("returns isError when API throws", async () => {
    const queryFn = vi.fn().mockRejectedValue(new Error("Project not found"));
    const client = createMockClient({ mcp: { getProject: { query: queryFn } } });

    const result = await getProject.execute(client, { project: "my-org/my-project" });

    expect(isErrorResult(result)).toBe(true);
    expect(expectError(result)).toContain("Project not found");
  });
});
