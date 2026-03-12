import { describe, it, expect, vi } from "vitest";
import { listContentEntries } from "../listContentEntries.js";
import { createMockClient } from "../../__tests__/fixtures/mock-client.js";
import { expectError, expectSuccess } from "../../__tests__/helpers.js";

const MOCK_RESPONSE = {
  items: [
    { id: "entry-1", slug: "hello-world", title: "Hello World" },
    { id: "entry-2", slug: "second-post", title: "Second Post" },
  ],
  total: 2,
  page: 1,
};

describe("listContentEntries", () => {
  describe("input validation", () => {
    it("rejects missing project", async () => {
      const client = createMockClient();
      const result = await listContentEntries.execute(client, {
        modelSlug: "blog-posts",
      });
      expect(result.isError).toBe(true);
    });
  });

  describe("API call", () => {
    it("accepts project-only input", async () => {
      const queryMock = vi.fn().mockResolvedValue(MOCK_RESPONSE);
      const client = createMockClient({
        mcpContent: { listContentEntries: { query: queryMock } },
      });

      const result = await listContentEntries.execute(client, {
        project: "org/proj",
      });

      expect(result.isError).toBeUndefined();
      expect(queryMock).toHaveBeenCalledOnce();
    });

    it("passes modelSlug filter", async () => {
      const queryMock = vi.fn().mockResolvedValue(MOCK_RESPONSE);
      const client = createMockClient({
        mcpContent: { listContentEntries: { query: queryMock } },
      });

      await listContentEntries.execute(client, {
        project: "org/proj",
        modelSlug: "blog-posts",
      });

      const call = queryMock.mock.calls[0][0];
      expect(call.modelSlug).toBe("blog-posts");
    });

    it("passes search filter", async () => {
      const queryMock = vi.fn().mockResolvedValue(MOCK_RESPONSE);
      const client = createMockClient({
        mcpContent: { listContentEntries: { query: queryMock } },
      });

      await listContentEntries.execute(client, {
        project: "org/proj",
        search: "getting started",
      });

      const call = queryMock.mock.calls[0][0];
      expect(call.search).toBe("getting started");
    });

    it("passes status filter", async () => {
      const queryMock = vi.fn().mockResolvedValue(MOCK_RESPONSE);
      const client = createMockClient({
        mcpContent: { listContentEntries: { query: queryMock } },
      });

      await listContentEntries.execute(client, {
        project: "org/proj",
        status: "published",
      });

      const call = queryMock.mock.calls[0][0];
      expect(call.status).toBe("published");
    });

    it("passes language filter", async () => {
      const queryMock = vi.fn().mockResolvedValue(MOCK_RESPONSE);
      const client = createMockClient({
        mcpContent: { listContentEntries: { query: queryMock } },
      });

      await listContentEntries.execute(client, {
        project: "org/proj",
        language: "tr",
      });

      const call = queryMock.mock.calls[0][0];
      expect(call.language).toBe("tr");
    });

    it("passes pagination params", async () => {
      const queryMock = vi.fn().mockResolvedValue(MOCK_RESPONSE);
      const client = createMockClient({
        mcpContent: { listContentEntries: { query: queryMock } },
      });

      await listContentEntries.execute(client, {
        project: "org/proj",
        page: 2,
        limit: 10,
      });

      const call = queryMock.mock.calls[0][0];
      expect(call.page).toBe(2);
      expect(call.limit).toBe(10);
    });

    it("returns success with API response", async () => {
      const queryMock = vi.fn().mockResolvedValue(MOCK_RESPONSE);
      const client = createMockClient({
        mcpContent: { listContentEntries: { query: queryMock } },
      });

      const result = await listContentEntries.execute(client, {
        project: "org/proj",
      });

      const parsed = expectSuccess(result);
      expect(parsed).toEqual(MOCK_RESPONSE);
    });
  });

  describe("error handling", () => {
    it("returns isError when API throws", async () => {
      const queryMock = vi.fn().mockRejectedValue(new Error("Project not found"));
      const client = createMockClient({
        mcpContent: { listContentEntries: { query: queryMock } },
      });

      const result = await listContentEntries.execute(client, {
        project: "org/proj",
      });

      const msg = expectError(result);
      expect(msg).toContain("Project not found");
    });
  });
});
