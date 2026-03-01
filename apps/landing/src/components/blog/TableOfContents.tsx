import { useState, useEffect } from "react";
import { slugify } from "./BlogContent";
import { useT } from "@/lib/i18n";

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
 * Active heading tracked via IntersectionObserver scroll-spy.
 */
export default function TableOfContents({ html }: TableOfContentsProps) {
  const t = useT("blog");
  const headings = extractHeadings(html);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length < 3) return;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings.length]);

  if (headings.length < 3) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <h2 className="font-medium text-mist-900 mb-4 text-xs uppercase tracking-wider">
        {t("tableOfContents", "Contents")}
      </h2>
      <ul className="space-y-1 border-l border-mist-100">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block py-1.5 transition-colors leading-snug border-l-2 -ml-px ${
                  heading.level === 3 ? "pl-6 text-[13px]" : "pl-4"
                } ${
                  isActive
                    ? "text-mist-950 border-mist-950 font-medium"
                    : "text-mist-500 border-transparent hover:text-mist-950 hover:border-mist-950"
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
