import type { FormatDefinition, FormatPair } from "./types";

export const FORMATS: readonly FormatDefinition[] = [
  { id: "json", name: "JSON", extension: ".json", description: "JavaScript Object Notation — the most common i18n format for web apps", mimeType: "application/json" },
  { id: "po", name: "PO (gettext)", extension: ".po", description: "GNU gettext Portable Object — standard for C/C++, PHP, Python, Ruby", mimeType: "text/x-gettext-translation" },
  { id: "xliff", name: "XLIFF", extension: ".xliff", description: "XML Localization Interchange File Format — industry standard for CAT tools", mimeType: "application/xliff+xml" },
  { id: "arb", name: "ARB", extension: ".arb", description: "Application Resource Bundle — Flutter/Dart standard format", mimeType: "application/json" },
  { id: "yaml", name: "YAML", extension: ".yml", description: "YAML Ain't Markup Language — popular for Ruby on Rails i18n", mimeType: "text/yaml" },
  { id: "csv", name: "CSV", extension: ".csv", description: "Comma-Separated Values — spreadsheet-friendly translation format", mimeType: "text/csv" },
  { id: "android-xml", name: "Android XML", extension: ".xml", description: "Android strings.xml — native Android localization format", mimeType: "application/xml" },
  { id: "ios-strings", name: "iOS Strings", extension: ".strings", description: "Apple .strings — native iOS/macOS localization format", mimeType: "text/plain" },
  { id: "properties", name: "Java Properties", extension: ".properties", description: "Java .properties — key=value pairs for JVM applications", mimeType: "text/x-java-properties" },
] as const;

export function getFormatById(id: string): FormatDefinition | undefined {
  return FORMATS.find((f) => f.id === id);
}

/** All format pairs with JSON as hub (8 other formats × 2 directions = 16 pairs) */
export const FORMAT_PAIRS: readonly FormatPair[] = FORMATS
  .filter((f) => f.id !== "json")
  .flatMap((format): readonly FormatPair[] => {
    const json = FORMATS[0];
    return [
      { slug: `json-to-${format.id}`, source: json, target: format },
      { slug: `${format.id}-to-json`, source: format, target: json },
    ];
  });

export const ALL_FORMAT_PAIR_SLUGS: readonly string[] = FORMAT_PAIRS.map((p) => p.slug);

export function getFormatPairBySlug(slug: string): FormatPair | undefined {
  return FORMAT_PAIRS.find((p) => p.slug === slug);
}
