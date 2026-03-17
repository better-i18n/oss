/**
 * Format a date string for display in the help center.
 */
export function formatDate(dateString: string, locale: string): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Extract headings from HTML for table of contents.
 */
export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractTocFromHtml(html: string): TocItem[] {
  const headingRegex = /<h([2-3])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[2-3]>/gi;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    items.push({
      level: parseInt(match[1], 10),
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, ""),
    });
  }

  return items;
}

/**
 * Strip the first H1 from HTML to avoid title duplication.
 * CMS markdown often starts with `# Title` which duplicates the page header.
 */
export function stripFirstH1(html: string): string {
  return html.replace(/^\s*<h1[^>]*>.*?<\/h1>\s*/i, "");
}

/**
 * Add IDs to headings in HTML for anchor linking.
 */
export function addHeadingIds(html: string): string {
  return html.replace(
    /<h([2-3])([^>]*)>(.*?)<\/h[2-3]>/gi,
    (_match, level, attrs, content) => {
      const text = content.replace(/<[^>]*>/g, "");
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      return `<h${level}${attrs} id="${id}">${content}</h${level}>`;
    },
  );
}

/**
 * Estimate reading time from markdown body.
 */
export function estimateReadingTime(body: string | null): number {
  if (!body) return 1;
  const words = body.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
