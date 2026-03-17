import { Link } from "@tanstack/react-router";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { useT } from "@/lib/i18n";
import type { HelpCollection } from "@/lib/content";

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  blue:    { bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-100" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  violet:  { bg: "bg-violet-50",  text: "text-violet-600",  border: "border-violet-100" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-100" },
  rose:    { bg: "bg-rose-50",    text: "text-rose-600",    border: "border-rose-100" },
  cyan:    { bg: "bg-cyan-50",    text: "text-cyan-600",    border: "border-cyan-100" },
};

const DEFAULT_COLOR = { bg: "bg-mist-50", text: "text-mist-700", border: "border-mist-100" };

interface CollectionCardProps {
  collection: HelpCollection;
  locale: string;
}

export function CollectionCard({ collection, locale }: CollectionCardProps) {
  const t = useT("home");
  const color = (collection.color && COLOR_MAP[collection.color]) || DEFAULT_COLOR;

  return (
    <Link
      to="/$locale/$collection"
      params={{ locale, collection: collection.slug }}
      className="group rounded-2xl border border-mist-200 bg-[var(--color-card)] p-6 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Icon */}
      <div className={`flex size-11 items-center justify-center rounded-xl border shadow-sm ${color.bg} ${color.border}`}>
        <DynamicIcon name={collection.icon} className={`size-5 ${color.text}`} />
      </div>

      {/* Title */}
      <h3 className="mt-4 text-base font-medium text-mist-950 group-hover:text-mist-700 transition-colors">
        {collection.title}
      </h3>

      {/* Description */}
      {collection.description && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mist-600">
          {collection.description}
        </p>
      )}

      {/* Article count */}
      <span className="mt-3 inline-flex items-center gap-1 text-xs text-mist-500">
        {collection.articleCount} {t("articles")}
      </span>
    </Link>
  );
}
