import type { FormatConverter } from "./types";

/**
 * ARB (Application Resource Bundle) converter.
 * Like JSON but with @key metadata entries that must be skipped during parse
 * and preserved during serialize.
 */
export const arbConverter: FormatConverter = {
  parse(input: string): Record<string, string> {
    const parsed = JSON.parse(input) as Record<string, unknown>;
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(parsed)) {
      // Skip metadata keys starting with @
      if (key.startsWith("@")) continue;
      if (typeof value === "string") {
        result[key] = value;
      }
    }

    return result;
  },

  serialize(data: Record<string, string>): string {
    const output: Record<string, unknown> = {
      "@@locale": "en",
      "@@last_modified": new Date().toISOString(),
    };

    for (const [key, value] of Object.entries(data)) {
      output[key] = value;
      // Add empty metadata placeholder for each string
      output[`@${key}`] = {
        description: "",
        placeholders: {},
      };
    }

    return JSON.stringify(output, null, 2);
  },
};
