/**
 * FAQ Accordion component using native <details>/<summary>.
 *
 * Body HTML comes from the CMS (help-faq model) via marked.parse() —
 * same trusted source and rendering pipeline as ArticleBody.
 */
import type { HelpFaq, HelpCollection } from "@/lib/content";
import { IconChevronDownSmall } from "@central-icons-react/round-outlined-radius-2-stroke-2";

interface FaqGroup {
  collection: HelpCollection | null;
  faqs: HelpFaq[];
}

interface FaqAccordionProps {
  groups: FaqGroup[];
}

export function FaqAccordion({ groups }: FaqAccordionProps) {
  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.collection?.slug ?? "general"}>
          {group.collection && (
            <h2 className="mb-4 text-lg font-semibold text-mist-950">
              {group.collection.title}
            </h2>
          )}
          <div className="divide-y divide-mist-200 rounded-xl border border-mist-200">
            {group.faqs.map((faq) => (
              <FaqItem key={faq.slug} faq={faq} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function FaqItem({ faq }: { faq: HelpFaq }) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-mist-950 select-none hover:bg-mist-50 [&::-webkit-details-marker]:hidden list-none">
        {faq.title}
        <IconChevronDownSmall className="size-4 shrink-0 text-mist-400 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      {faq.bodyHtml && (
        <div
          className="help-prose px-5 pb-5 text-sm"
          // CMS content rendered via marked.parse() — same trusted pipeline as ArticleBody
          dangerouslySetInnerHTML={{ __html: faq.bodyHtml }}
        />
      )}
    </details>
  );
}
