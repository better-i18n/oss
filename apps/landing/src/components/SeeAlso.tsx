import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { getClusterSiblings } from "@/seo/topic-clusters";
import { SpriteIcon } from "@/components/SpriteIcon";

type SeeAlsoProps = {
  readonly currentSlug: string;
  readonly locale: string;
  readonly limit?: number;
};

export function SeeAlso({ currentSlug, locale, limit = 5 }: SeeAlsoProps) {
  const t = useT("seeAlso");
  const siblings = getClusterSiblings(currentSlug, limit);

  if (siblings.length === 0) return null;

  return (
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="mb-6 font-display text-lg font-medium text-mist-950">
          {t("heading", { defaultValue: "Related Guides" })}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {siblings.map((page) => (
            <Link
              key={page.slug}
              to={`/$locale/i18n/${page.slug}`}
              params={{ locale }}
              className="group flex flex-col justify-between rounded-2xl border border-mist-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-mist-300 hover:shadow-md"
            >
              <div>
                <h3 className="text-sm font-medium text-mist-950">
                  {page.titleFallback}
                </h3>
                <p className="mt-2 text-xs leading-5 text-mist-500">
                  {page.descFallback}
                </p>
              </div>
              <div className="mt-4 flex items-center text-sm font-medium text-mist-700">
                <span>{t("open", { defaultValue: "Read guide" })}</span>
                <SpriteIcon
                  name="arrow-right"
                  className="ml-2 h-4 w-4 text-mist-400 transition-all group-hover:translate-x-1 group-hover:text-mist-600"
                  aria-hidden="true"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
