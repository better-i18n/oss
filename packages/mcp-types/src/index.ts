/**
 * @better-i18n/mcp-types
 *
 * Type definitions and Zod schemas for the Better i18n MCP API.
 *
 * This package is the SINGLE SOURCE OF TRUTH for the MCP API contract.
 * - The platform API imports schemas from here for tRPC input validation
 * - The MCP client package imports types from here for type-safe API calls
 */

// Re-export all schemas
export * from "./schemas";

// Re-export all types
export * from "./types";

// Re-export compact types
export * from "./compact-types";

// Re-export client types
export * from "./client-types";

// Re-export content schemas
export * from "./content-schemas";

// Re-export content types
export * from "./content-types";

// Re-export content compact types
export * from "./content-compact-types";
