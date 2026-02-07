/**
 * Shared types for MCP server
 */

/**
 * MCP Tool definition
 */
/** JSON Schema property definition */
interface JsonSchemaProperty {
  type: string;
  description?: string;
  enum?: string[];
  items?: JsonSchemaProperty;
  properties?: Record<string, JsonSchemaProperty>;
  required?: string[];
  default?: unknown;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, JsonSchemaProperty>;
    required?: string[];
  };
}

/**
 * MCP Tool execution result - compatible with @modelcontextprotocol/sdk
 */
export interface ToolResult {
  content: Array<{
    type: "text" | "image" | "resource";
    text?: string;
    data?: string;
    uri?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
  // Allow additional properties for MCP SDK compatibility
  [key: string]: unknown;
}

/** API client type for MCP tools */
import type { BetterI18nClient } from "../client.js";

/**
 * MCP Tool implementation
 */
export interface Tool {
  definition: ToolDefinition;
  execute: (client: BetterI18nClient, args: unknown) => Promise<ToolResult>;
}
