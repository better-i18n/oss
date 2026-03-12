import { describe, it, expect } from "vitest";
import { z } from "zod";
import { parseProject } from "../helpers.js";
import {
  success,
  error,
  executeTool,
  executeSimpleTool,
  projectSchema,
} from "../base-tool.js";
import { isErrorResult, expectSuccess, expectError } from "./helpers.js";

// ---------------------------------------------------------------------------
// parseProject
// ---------------------------------------------------------------------------

describe("parseProject", () => {
  it('parses "org/project" into workspaceId and projectSlug', () => {
    expect(parseProject("org/project")).toEqual({
      workspaceId: "org",
      projectSlug: "project",
    });
  });

  it("throws a descriptive error for a single-segment string", () => {
    expect(() => parseProject("invalid")).toThrow(
      /Invalid project format "invalid"/,
    );
  });

  it("throws for an empty string", () => {
    expect(() => parseProject("")).toThrow(/Invalid project format/);
  });

  it("throws when there are 3 segments (a/b/c)", () => {
    expect(() => parseProject("a/b/c")).toThrow(/Invalid project format "a\/b\/c"/);
  });

  it("throws when the slug part is empty (org/)", () => {
    expect(() => parseProject("org/")).toThrow(/Invalid project format "org\/"/);
  });

  it("throws when the org part is empty (/project)", () => {
    expect(() => parseProject("/project")).toThrow(
      /Invalid project format "\/project"/,
    );
  });

  it("handles hyphens in both org and slug", () => {
    expect(parseProject("org-with-hyphens/proj-123")).toEqual({
      workspaceId: "org-with-hyphens",
      projectSlug: "proj-123",
    });
  });
});

// ---------------------------------------------------------------------------
// projectSchema
// ---------------------------------------------------------------------------

describe("projectSchema", () => {
  it("accepts a non-empty project string", () => {
    expect(() => projectSchema.parse({ project: "org/slug" })).not.toThrow();
  });

  it("rejects an empty project string", () => {
    expect(() => projectSchema.parse({ project: "" })).toThrow();
  });

  it("rejects a missing project field", () => {
    expect(() => projectSchema.parse({})).toThrow();
  });
});

// ---------------------------------------------------------------------------
// success
// ---------------------------------------------------------------------------

describe("success", () => {
  it("produces a result with type=text content", () => {
    const result = success({ data: 1 });
    expect(result.content).toHaveLength(1);
    expect(result.content[0]?.type).toBe("text");
  });

  it("serialises the payload as valid JSON", () => {
    const result = success({ hello: "world", count: 42 });
    const text = result.content[0]?.text;
    expect(text).toBeDefined();
    expect(() => JSON.parse(text!)).not.toThrow();
    expect(JSON.parse(text!)).toEqual({ hello: "world", count: 42 });
  });

  it("does not set isError", () => {
    const result = success({ ok: true });
    expect(result.isError).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// error
// ---------------------------------------------------------------------------

describe("error", () => {
  it("sets isError: true", () => {
    const result = error("something went wrong");
    expect(result.isError).toBe(true);
  });

  it("includes the message in the text content", () => {
    const msg = "something went wrong";
    const result = error(msg);
    expect(result.content[0]?.text).toBe(msg);
  });

  it("produces exactly one content entry", () => {
    const result = error("oops");
    expect(result.content).toHaveLength(1);
    expect(result.content[0]?.type).toBe("text");
  });
});

// ---------------------------------------------------------------------------
// executeTool
// ---------------------------------------------------------------------------

describe("executeTool", () => {
  const schema = z.object({ project: z.string().min(1), value: z.string() });

  it("calls the handler with parsed input and ParsedProject on success", async () => {
    const result = await executeTool(
      { project: "acme/website", value: "hello" },
      schema,
      async (input, parsed) => {
        return success({
          value: input.value,
          workspaceId: parsed.workspaceId,
          projectSlug: parsed.projectSlug,
        });
      },
    );

    const data = expectSuccess(result) as {
      value: string;
      workspaceId: string;
      projectSlug: string;
    };
    expect(data.value).toBe("hello");
    expect(data.workspaceId).toBe("acme");
    expect(data.projectSlug).toBe("website");
  });

  it("returns isError: true with 'Validation error' on Zod failure", async () => {
    const result = await executeTool(
      { project: "valid/project" /* missing required `value` */ },
      schema,
      async () => success({}),
    );

    expect(isErrorResult(result)).toBe(true);
    const msg = expectError(result);
    expect(msg).toMatch(/Validation error/i);
  });

  it("returns isError: true when the handler throws", async () => {
    const result = await executeTool(
      { project: "acme/website", value: "x" },
      schema,
      async () => {
        throw new Error("handler blew up");
      },
    );

    expect(isErrorResult(result)).toBe(true);
    expect(expectError(result)).toContain("handler blew up");
  });

  it("returns isError: true for invalid project format", async () => {
    const result = await executeTool(
      { project: "not-a-valid-format", value: "x" },
      schema,
      async () => success({}),
    );

    expect(isErrorResult(result)).toBe(true);
    expect(expectError(result)).toMatch(/Invalid project format/i);
  });

  it("returns isError: true when args fail schema type coercion", async () => {
    const result = await executeTool(
      null, // completely invalid args
      schema,
      async () => success({}),
    );

    expect(isErrorResult(result)).toBe(true);
  });

  it("passes the full parsed project to the handler", async () => {
    let capturedParsed: { workspaceId: string; projectSlug: string } | null =
      null;

    await executeTool(
      { project: "my-org/my-slug", value: "test" },
      schema,
      async (_input, parsed) => {
        capturedParsed = parsed;
        return success({});
      },
    );

    expect(capturedParsed).toEqual({
      workspaceId: "my-org",
      projectSlug: "my-slug",
    });
  });

  it("surfaces non-Error throws as string messages", async () => {
    const result = await executeTool(
      { project: "acme/website", value: "x" },
      schema,
      async () => {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw "string error";
      },
    );

    expect(isErrorResult(result)).toBe(true);
    expect(expectError(result)).toBe("string error");
  });
});

// ---------------------------------------------------------------------------
// executeSimpleTool
// ---------------------------------------------------------------------------

describe("executeSimpleTool", () => {
  const schema = z.object({ name: z.string().min(1), count: z.number() });

  it("calls the handler with parsed input and returns its result", async () => {
    const result = await executeSimpleTool(
      { name: "test", count: 5 },
      schema,
      async (input) => success({ echo: input.name, times: input.count }),
    );

    const data = expectSuccess(result) as { echo: string; times: number };
    expect(data.echo).toBe("test");
    expect(data.times).toBe(5);
  });

  it("returns isError: true with 'Validation error' on Zod failure", async () => {
    const result = await executeSimpleTool(
      { name: "" /* fails min(1) */, count: 3 },
      schema,
      async () => success({}),
    );

    expect(isErrorResult(result)).toBe(true);
    expect(expectError(result)).toMatch(/Validation error/i);
  });

  it("returns isError: true when the handler throws an Error", async () => {
    const result = await executeSimpleTool(
      { name: "good", count: 1 },
      schema,
      async () => {
        throw new Error("simple handler failed");
      },
    );

    expect(isErrorResult(result)).toBe(true);
    expect(expectError(result)).toContain("simple handler failed");
  });

  it("returns isError: true when the handler throws a non-Error value", async () => {
    const result = await executeSimpleTool(
      { name: "good", count: 1 },
      schema,
      async () => {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw 42;
      },
    );

    expect(isErrorResult(result)).toBe(true);
    expect(expectError(result)).toBe("42");
  });

  it("returns isError: true when args are completely invalid", async () => {
    const result = await executeSimpleTool(
      undefined,
      schema,
      async () => success({}),
    );

    expect(isErrorResult(result)).toBe(true);
  });

  it("does not include isError on a successful result", async () => {
    const result = await executeSimpleTool(
      { name: "ok", count: 0 },
      schema,
      async () => success({ ok: true }),
    );

    expect(result.isError).toBeUndefined();
  });
});
