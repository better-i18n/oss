/** Cross-linking grid to related tools, filtered by current tool slug. */

import { TOOL_REGISTRY } from "@/lib/tools/registry";
import { ToolCard } from "./ToolCard";

interface RelatedToolsProps {
  readonly currentSlug: string;
  readonly locale: string;
  readonly title?: string;
  readonly maxItems?: number;
}

export function RelatedTools({
  currentSlug,
  locale,
  title = "More Free Tools",
  maxItems = 4,
}: RelatedToolsProps) {
  const related = TOOL_REGISTRY.filter(
    (tool) => tool.slug !== currentSlug
  ).slice(0, maxItems);

  if (related.length === 0) return null;

  return (
    <section className="border-t border-mist-200 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-mist-500">
            Free Tools
          </p>
          <h2 className="mt-2 font-display text-2xl/[1.08] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.04]">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-mist-600">
            More free i18n tools to help you build and ship globally.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {related.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
