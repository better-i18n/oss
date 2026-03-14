import type { FormatConverter } from "./types";

/** Unescape Android XML string values */
function unescapeAndroid(s: string): string {
  return s
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\\\/g, "\\")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

/** Escape a value for Android strings.xml */
function escapeAndroid(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export const androidXmlConverter: FormatConverter = {
  parse(input: string): Record<string, string> {
    const result: Record<string, string> = {};
    const pattern = /<string\s+name="([^"]+)"[^>]*>([\s\S]*?)<\/string>/gi;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(input)) !== null) {
      const key = match[1];
      const value = unescapeAndroid(match[2].trim());
      result[key] = value;
    }

    return result;
  },

  serialize(data: Record<string, string>): string {
    const entries = Object.entries(data)
      .map(([key, value]) => `    <string name="${key}">${escapeAndroid(value)}</string>`)
      .join("\n");

    return `<?xml version="1.0" encoding="utf-8"?>
<resources>
${entries}
</resources>
`;
  },
};
