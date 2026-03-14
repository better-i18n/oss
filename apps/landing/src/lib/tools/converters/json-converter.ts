import type { FormatConverter } from "./types";

/** Flatten a nested object into dot-separated keys */
function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      const nested = flattenObject(value as Record<string, unknown>, fullKey);
      Object.assign(result, nested);
    } else if (typeof value === "string") {
      result[fullKey] = value;
    } else if (value !== null && value !== undefined) {
      result[fullKey] = String(value);
    }
  }
  return result;
}

/** Expand dot-separated keys back into a nested object */
function expandObject(flat: Record<string, string>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split(".");
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current) || typeof current[part] !== "object") {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = value;
  }
  return result;
}

export const jsonConverter: FormatConverter = {
  parse(input: string): Record<string, string> {
    const parsed = JSON.parse(input) as Record<string, unknown>;
    return flattenObject(parsed);
  },
  serialize(data: Record<string, string>): string {
    const hasNesting = Object.keys(data).some((k) => k.includes("."));
    const output = hasNesting ? expandObject(data) : data;
    return JSON.stringify(output, null, 2);
  },
};
