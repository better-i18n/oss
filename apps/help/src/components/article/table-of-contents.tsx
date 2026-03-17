import { useEffect, useState } from "react";
import { cn } from "@better-i18n/ui/lib/utils";
import { useT } from "@/lib/i18n";
import type { TocItem } from "@/lib/utils";

interface TableOfContentsProps {
  items: TocItem[];
}

/**
 * Sticky table of contents with scroll-spy highlighting.
 * Tracks which heading is currently visible in the viewport.
 */
export function TableOfContents({ items }: TableOfContentsProps) {
  const t = useT("article");
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 },
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-20">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-mist-500">
        {t("toc")}
      </h4>
      <ul className="mt-3 space-y-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block text-sm leading-relaxed transition-colors",
                item.level === 3 && "pl-3",
                activeId === item.id
                  ? "font-medium text-mist-950"
                  : "text-mist-500 hover:text-mist-700",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
