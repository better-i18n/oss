/** Cross-linking grid to related tools, filtered by current tool slug. */

import { Section, SectionHeader } from "@/components/ui/page";
import { useT } from "@/lib/i18n";
import { TOOL_REGISTRY } from "@/lib/tools/registry";
import { ToolCard } from "./ToolCard";

interface RelatedToolsProps {
  readonly currentSlug: string;
  readonly locale: string;
  readonly maxItems?: number;
}

/**
 * Opens with `<SectionHeader>` like every other block on the site, which is
 * also what fixes the alignment: this section used to build its own header out
 * of a centred pill, a `text-center` h2 and a `text-center` lede, so it was the
 * one left-aligned page's one centred block. `.eyebrow` sits in normal flow
 * inside `.section`, so its left edge is the page's left edge by construction
 * rather than by a matching padding value.
 *
 * The `border-t` it used to draw is gone too: `<ToolLayout>` now places a
 * `<Divider />` ahead of this section, so the two rules stacked into one
 * double line.
 *
 * The card grid stays a plain gapped grid on purpose. `<FeatureGrid>` requires
 * every child to carry `.feat-cell`, and `<ToolCard>` draws its own bordered box
 * with its own padding — putting a finished card in there shifts the grid and
 * clips the first column (what happened to the blog list's avatars).
 */
export function RelatedTools({ currentSlug, locale, maxItems = 4 }: RelatedToolsProps) {
  const t = useT("tools");
  const related = TOOL_REGISTRY.filter((tool) => tool.slug !== currentSlug).slice(
    0,
    maxItems,
  );

  if (related.length === 0) return null;

  return (
    <Section labelledBy="related-tools-title">
      {/* The heading text used to be a `title` prop defaulting to an English
          literal. No caller ever passed it, so the prop's only effect was to
          hide from the CDN a string that shipped in English on 21 locales
          (rule/no-inline-i18n-fallback). */}
      <SectionHeader
        id="related-tools-title"
        eyebrow={t("related.eyebrow")}
        title={t("related.title")}
        subtitle={t("related.subtitle")}
      />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {related.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} locale={locale} />
        ))}
      </div>
    </Section>
  );
}
