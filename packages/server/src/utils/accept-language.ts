/**
 * Parse an RFC 5646 Accept-Language header value into a prioritized list of language tags.
 *
 * @example
 * parseAcceptLanguage("tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7")
 * // → ["tr-TR", "tr", "en-US", "en"]
 *
 * parseAcceptLanguage("*")
 * // → []
 *
 * parseAcceptLanguage(null)
 * // → []
 */
export function parseAcceptLanguage(header: string | null | undefined): string[] {
  if (!header) return [];

  return (
    header
      .split(",")
      .map((entry) => {
        const [tag, qPart] = entry.trim().split(";");
        const language = tag?.trim();
        if (!language || language === "*") return null;

        const q = qPart ? parseFloat(qPart.trim().replace("q=", "")) : 1.0;
        const quality = Number.isNaN(q) ? 1.0 : q;

        return { language, quality };
      })
      .filter((item): item is { language: string; quality: number } => item !== null)
      // Stable sort: higher quality first; equal quality preserves original order
      .sort((a, b) => b.quality - a.quality)
      .map((item) => item.language)
  );
}

/**
 * Find the best matching locale from a parsed Accept-Language list against available locales.
 * Matching strategy (in order):
 * 1. Exact match: "tr-TR" → "tr-TR"
 * 2. Base language match: "tr-TR" → "tr"
 * 3. Region expansion: "tr" matches "tr-TR" (first available variant)
 *
 * Returns null if no match found.
 */
export function matchLocale(
  languages: string[],
  availableLocales: string[],
): string | null {
  for (const lang of languages) {
    // 1. Exact match
    if (availableLocales.includes(lang)) return lang;

    // 2. Base language match (strip region subtag)
    const base = lang.split("-")[0];
    if (base && availableLocales.includes(base)) return base;

    // 3. Region expansion: find first available locale that starts with base
    const expanded = availableLocales.find(
      (l) => l === base || l.startsWith(`${base}-`),
    );
    if (expanded) return expanded;
  }

  return null;
}
