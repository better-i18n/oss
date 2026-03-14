import type { FormatConverter } from "./types";

/** Parse a simple YAML string into a flat key/value map.
 *  Handles nested structures via indentation (spaces only).
 *  Does NOT support anchors, aliases, multi-line strings, or complex YAML features.
 */
function parseYaml(input: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = input.split("\n");
  // Stack to track current nesting: each entry is [indent, keyPrefix]
  const stack: Array<{ indent: number; prefix: string }> = [];

  for (const line of lines) {
    // Skip comments and blank lines
    if (line.trimStart().startsWith("#") || !line.trim()) continue;

    const indentMatch = line.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1].length : 0;
    const content = line.trim();

    // Pop stack entries with indent >= current
    while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const colonIdx = content.indexOf(":");
    if (colonIdx === -1) continue;

    const key = content.slice(0, colonIdx).trim();
    const rest = content.slice(colonIdx + 1).trim();
    const prefix = stack.length > 0 ? `${stack[stack.length - 1].prefix}.${key}` : key;

    if (rest === "" || rest === "~" || rest === "null") {
      // This is a parent key — push to stack
      stack.push({ indent, prefix });
    } else {
      // Leaf value — strip optional quotes
      let value = rest;
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      result[prefix] = value;
    }
  }

  return result;
}

/** Serialize a flat key/value map to simple YAML.
 *  Nested keys (dot-separated) are expanded to proper YAML nesting.
 */
function serializeYaml(data: Record<string, string>): string {
  // Build nested object from flat keys
  const nested: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    const parts = key.split(".");
    let current = nested;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current) || typeof current[part] !== "object") {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = value;
  }

  function renderNode(node: Record<string, unknown>, depth: number): string {
    const indent = "  ".repeat(depth);
    const lines: string[] = [];

    for (const [key, value] of Object.entries(node)) {
      if (typeof value === "string") {
        // Quote values that could be misinterpreted
        const needsQuotes = /[:#{}&*!|>'"%@`]/.test(value) || value.trim() !== value;
        lines.push(`${indent}${key}: ${needsQuotes ? `"${value.replace(/"/g, '\\"')}"` : value}`);
      } else if (value !== null && typeof value === "object") {
        lines.push(`${indent}${key}:`);
        lines.push(renderNode(value as Record<string, unknown>, depth + 1));
      }
    }

    return lines.join("\n");
  }

  return renderNode(nested, 0) + "\n";
}

export const yamlConverter: FormatConverter = {
  parse: parseYaml,
  serialize(data: Record<string, string>): string {
    return serializeYaml(data);
  },
};
