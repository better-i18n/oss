import { describe, it, expect, vi } from "vitest";
import { listProjects } from "../listProjects.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectSuccess, expectError, isErrorResult } from "../../__tests__/helpers.js";

const mockProjectsData = {
  projects: [
    {
      id: "proj-1",
      slug: "my-project",
      name: "My Project",
      orgSlug: "my-org",
    },
  ],
};

describe("listProjects", () => {
  it("accepts empty object args → calls API", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockProjectsData);
    const client = createMockClient({ mcp: { listProjects: { query: queryFn } } });

    const result = await listProjects.execute(client, {});

    expect(isErrorResult(result)).toBe(false);
    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it("accepts {} → calls API", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockProjectsData);
    const client = createMockClient({ mcp: { listProjects: { query: queryFn } } });

    const result = await listProjects.execute(client, {});

    expect(isErrorResult(result)).toBe(false);
    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it("returns API response as success", async () => {
    const queryFn = vi.fn().mockResolvedValue(mockProjectsData);
    const client = createMockClient({ mcp: { listProjects: { query: queryFn } } });

    const result = await listProjects.execute(client, {});

    const data = expectSuccess(result);
    expect(data).toMatchObject({ projects: expect.arrayContaining([expect.objectContaining({ slug: "my-project" })]) });
  });

  it("returns isError when API throws", async () => {
    const queryFn = vi.fn().mockRejectedValue(new Error("Unauthorized"));
    const client = createMockClient({ mcp: { listProjects: { query: queryFn } } });

    const result = await listProjects.execute(client, {});

    expect(isErrorResult(result)).toBe(true);
    expect(expectError(result)).toContain("Unauthorized");
  });
});
