import type { FormatConverter } from "./types";

/** Extract text between XML tags */
function extractTagContent(xml: string, tag: string): string | null {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\s\S]*?)<\/${tag}>`, "i"));
  return match ? match[1] : null;
}

/** Unescape XML entities */
function unescapeXml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

/** Escape XML entities */
function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const xliffConverter: FormatConverter = {
  parse(input: string): Record<string, string> {
    const result: Record<string, string> = {};
    const unitPattern = /<trans-unit[^>]+id="([^"]+)"[^>]*>([\s\S]*?)<\/trans-unit>/gi;
    let match: RegExpExecArray | null;

    while ((match = unitPattern.exec(input)) !== null) {
      const id = match[1];
      const body = match[2];
      const target = extractTagContent(body, "target");
      const source = extractTagContent(body, "source");
      const value = target !== null ? target : source;
      if (value !== null) {
        result[id] = unescapeXml(value.trim());
      }
    }

    return result;
  },

  serialize(data: Record<string, string>): string {
    const units = Object.entries(data)
      .map(
        ([key, value]) =>
          `      <trans-unit id="${escapeXml(key)}">\n        <source>${escapeXml(key)}</source>\n        <target>${escapeXml(value)}</target>\n      </trans-unit>`,
      )
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="en" target-language="xx" datatype="plaintext">
    <body>
${units}
    </body>
  </file>
</xliff>
`;
  },
};
