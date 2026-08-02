import { useState, useEffect, useMemo } from "react";
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
 * Extract h1, h2 and h3 headings from raw HTML content.
 * h1 headings are treated as h2 level since BlogContent downlevels them.
 * Strips inner HTML tags to get plain text, then generates
 * matching slug ids via the shared slugify function.
 */
function extractHeadings(html: string): TocItem[] {
  const headingRegex = /<(h[123])[^>]*>(.*?)<\/\1>/gi;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    // h1 is downleveled to h2 by BlogContent, so treat as level 2
    const level: 2 | 3 = tag === "h3" ? 3 : 2;
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
  // Parsing the body HTML with a regex on every render is wasted work, and an
  // unstable `headings` array is why the scroll-spy effect could not honestly
  // list its dependency. Memoising on `html` fixes both.
  const headings = useMemo(() => extractHeadings(html), [html]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length < 3) return;

    // flatMap instead of map().filter(Boolean): one pass, and it narrows the
    // type without a cast that would lie if an id ever went missing.
    const elements = headings.flatMap((h) => {
      const el = document.getElementById(h.id);
      return el ? [el] : [];
    });

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
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="eyebrow">{t("tableOfContents")}</p>
      {/* The active marker is a 1px rule on the left, not a filled chip: the rail
          sits beside the prose and a tinted background would read as a second
          content block competing with the article. */}
      <ul className="mt-3 border-l border-black/[0.06]">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`-ml-px block border-l leading-snug transition-colors ${
                  heading.level === 3 ? "py-1 pl-5 text-[12px]" : "py-1.5 pl-3.5 text-[13px]"
                } ${
                  isActive
                    ? "border-mist-900 font-medium text-mist-900"
                    : "border-transparent text-mist-500 hover:border-mist-300 hover:text-mist-900"
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
