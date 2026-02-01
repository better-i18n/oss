/**
 * @better-i18n/mcp-types
 *
 * Type definitions and Zod schemas for the Better i18n MCP API.
 *
 * This package defines the contract between:
 * - The Better i18n API (platform)
 * - The MCP server package (@better-i18n/mcp)
 * - Any other clients that want type-safe API access
 *
 * @example
 * ```typescript
 * import { createTRPCClient } from "@trpc/client";
 * import type { AppRouter } from "@better-i18n/mcp-types";
 *
 * const client = createTRPCClient<AppRouter>({
 *   links: [httpBatchLink({ url: "https://api.better-i18n.com/api/trpc" })],
 * });
 *
 * // Type-safe API calls
 * const projects = await client.mcp.listProjects.query();
 * ```
 */

// Re-export all schemas
export * from "./schemas";

// Re-export all types
export * from "./types";

// Re-export client types
export * from "./client-types";
