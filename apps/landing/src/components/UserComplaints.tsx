import { useT } from "@/lib/i18n";
import { CompetitorMark, type CompetitorKey } from "@/components/icons/CompetitorMarks";

/**
 * Vendors we ship a mark for. A name outside this list still renders — as text —
 * instead of crashing the section or inventing a logo for a product we have no
 * asset for (rule/name-a-thing-with-its-mark).
 */
const MARKED_VENDORS = [
  "crowdin",
  "lokalise",
  "phrase",
  "transifex",
  "smartling",
  "xtm",
] as const;

function vendorKey(name: string): CompetitorKey | undefined {
  const slug = name.toLowerCase().replace(/\s+/g, "");
  return (MARKED_VENDORS as readonly string[]).includes(slug)
    ? (slug as CompetitorKey)
    : undefined;
}

/**
 * `source` is gone on purpose, and it is the important thing about this file.
 *
 * Each quote used to carry a `"G2" | "Capterra"` badge, rendered as that review
 * site's verdict on a named competitor. Nobody collected those quotes — the
 * strings were authored in-house, so the badge presented our own summary as a
 * third party's published review. That is a data-integrity problem and a legal
 * one. It was already removed from the Crowdin page for exactly this reason; it
 * survived here because Smartling and XTM were rewired separately.
 *
 * The copy stays — it is a fair statement of the friction teams hit, and every
 * compare page carries `compare.disclaimer` saying the comparison is ours. What
 * is gone is the borrowed authority. A real attributed quote needs a URL and a
 * date, not a badge.
 */
interface Complaint {
  readonly quote: string;
  readonly category: string;
}

interface UserComplaintsProps {
  readonly competitor: string;
  readonly complaints: readonly Complaint[];
}

export function UserComplaints({ competitor, complaints }: UserComplaintsProps) {
  const t = useT("marketing");

  return (
    <section>
      <div className="section">
        {/* The vendor is named here, so its mark travels with the name — one
            size, one tile, the same as in the matrix. */}
        {vendorKey(competitor) && (
          <div className="mb-4">
            <CompetitorMark competitor={vendorKey(competitor)!} size={22} />
          </div>
        )}
        {/* The eyebrow was missing, so this was the one section on the page that
            opened at h2 with no label above it (rule/section-opens-with-header). */}
        <div className="eyebrow">{t("compare.complaints.eyebrow")}</div>
        <h2 className="section-h2">
          {t("compare.complaints.title", { competitor })}
        </h2>
        <p className="section-p mt-3">
          {t("compare.complaints.subtitle", { competitor })}
        </p>
        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {complaints.map((complaint) => (
            <div
              key={complaint.quote}
              className="flex flex-col"
            >
              <span className="mb-3 text-[11px] font-medium text-mist-400">
                {complaint.category}
              </span>
              <blockquote className="text-[13px] leading-relaxed text-mist-700">
                &ldquo;{complaint.quote}&rdquo;
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
