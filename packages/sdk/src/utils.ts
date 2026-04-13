/**
 * Extract language codes from the `availableLanguages` field of a content entry.
 *
 * The content API returns `availableLanguages` as `ContentEntryLanguage[]` objects
 * (with `code`, `name`, `countryCode`), but the SDK type allows both strings and
 * objects for backward compatibility. This helper normalizes both shapes to `string[]`.
 *
 * @example
 * ```typescript
 * const entry = await client.from("blog").single("hello-world");
 * const codes = extractLanguageCodes(entry.data.availableLanguages);
 * // ["en", "fr", "tr"]
 * ```
 */
export function extractLanguageCodes(
  langs: readonly unknown[] | null | undefined,
): string[] {
  if (!Array.isArray(langs)) return [];
  return (langs as unknown[]).flatMap((v): string[] => {
    if (typeof v === "string") return [v];
    if (v !== null && typeof v === "object") {
      const code = (v as Record<string, unknown>).code;
      if (typeof code === "string") return [code];
    }
    return [];
  });
}

/**
 * Check whether a raw content entry has a translation for the given locale.
 * Handles both string[] and ContentEntryLanguage[] shapes.
 */
export function hasLanguage(
  item: Record<string, unknown>,
  locale: string,
): boolean {
  const langs = item.availableLanguages ?? item.langs;
  if (!Array.isArray(langs)) return true;
  return (langs as unknown[]).some((v) => {
    if (typeof v === "string") return v === locale;
    if (v !== null && typeof v === "object") {
      return (v as Record<string, unknown>).code === locale;
    }
    return false;
  });
}
