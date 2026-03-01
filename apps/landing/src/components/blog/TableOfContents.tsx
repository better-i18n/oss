import { slugify } from "./BlogContent";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  html: string;
}

/**
 * Extract h2 and h3 headings from raw HTML content.
 * Strips inner HTML tags to get plain text, then generates
 * matching slug ids via the shared slugify function.
 */
function extractHeadings(html: string): TocItem[] {
  const headingRegex = /<(h[23])[^>]*>(.*?)<\/\1>/gi;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = match[1].toLowerCase() === "h2" ? 2 : 3;
    // Strip HTML tags from heading text
    const text = match[2].replace(/<[^>]*>/g, "").trim();
    if (text) {
      items.push({ id: slugify(text), text, level });
    }
  }

  return items;
}

/**
 * Renders a table of contents navigation from blog post HTML.
 * Only displays when 3 or more headings are present.
 * h3 items are indented to show hierarchy.
 */
export default function TableOfContents({ html }: TableOfContentsProps) {
  const headings = extractHeadings(html);

  if (headings.length < 3) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <h2 className="font-medium text-mist-950 mb-3 text-xs uppercase tracking-wider">
        Contents
      </h2>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? "pl-4" : ""}>
            <a
              href={`#${heading.id}`}
              className="text-mist-500 hover:text-mist-900 transition-colors leading-snug block"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
