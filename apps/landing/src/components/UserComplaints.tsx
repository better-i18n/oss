import { useT } from "@/lib/i18n";

interface Complaint {
  readonly source: "G2" | "Capterra";
  readonly quote: string;
  readonly category: string;
}

interface UserComplaintsProps {
  readonly competitor: string;
  readonly complaints: readonly Complaint[];
}

function SourceBadge({ source }: { readonly source: "G2" | "Capterra" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        source === "G2"
          ? "bg-orange-100 text-orange-700"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      {source}
    </span>
  );
}

export function UserComplaints({ competitor, complaints }: UserComplaintsProps) {
  const t = useT("marketing");

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1]">
          {t("compare.complaints.title", { competitor })}
        </h2>
        <p className="mt-3 text-base text-mist-600">
          {t("compare.complaints.subtitle", { competitor })}
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {complaints.map((complaint) => (
            <div
              key={complaint.quote}
              className="rounded-xl border border-mist-200 bg-white p-5 border-l-4 border-l-orange-400"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-mist-500 uppercase tracking-wide">
                  {complaint.category}
                </span>
                <SourceBadge source={complaint.source} />
              </div>
              <blockquote className="text-sm italic text-mist-700 leading-relaxed">
                &ldquo;{complaint.quote}&rdquo;
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
