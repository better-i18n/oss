import type { FormatConverter } from "./types";

/** Parse a single CSV row respecting double-quoted fields */
function parseCsvRow(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        // Escaped quote inside quoted field
        current += '"';
        i += 2;
      } else if (ch === '"') {
        inQuotes = false;
        i++;
      } else {
        current += ch;
        i++;
      }
    } else if (ch === '"') {
      inQuotes = true;
      i++;
    } else if (ch === ",") {
      fields.push(current);
      current = "";
      i++;
    } else {
      current += ch;
      i++;
    }
  }

  fields.push(current);
  return fields;
}

/** Escape a value for CSV — wrap in quotes if needed */
function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export const csvConverter: FormatConverter = {
  parse(input: string): Record<string, string> {
    const result: Record<string, string> = {};
    const lines = input.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const fields = parseCsvRow(trimmed);
      if (fields.length >= 2) {
        const key = fields[0].trim();
        const value = fields[1]; // preserve inner spacing
        if (key) {
          result[key] = value;
        }
      }
    }

    return result;
  },

  serialize(data: Record<string, string>): string {
    const header = "key,value";
    const rows = Object.entries(data).map(([key, value]) => `${csvEscape(key)},${csvEscape(value)}`);
    return [header, ...rows].join("\n") + "\n";
  },
};
