import { Link, useParams } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";

type SegmentCardProps = {
  accentClassName: string;
  accentBarClassName: string;
  accentCheckClassName: string;
  iconName: SpriteIconName;
  id: string;
  namespace: string;
  to:
    | "/$locale/for-developers"
    | "/$locale/for-product-teams"
    | "/$locale/for-translators";
  locale: string;
};

function SegmentCard({
  accentClassName,
  accentBarClassName,
  accentCheckClassName,
  iconName,
  id,
  locale,
  namespace,
  to,
}: SegmentCardProps) {
  const t = useT(namespace);

  const features = [
    t("feature1Title", { defaultValue: "Feature One" }),
    t("feature2Title", { defaultValue: "Feature Two" }),
    t("feature3Title", { defaultValue: "Feature Three" }),
  ];

  return (
    <Link
      id={id}
      to={to}
      params={{ locale }}
      className="group flex h-full scroll-mt-24 flex-col rounded-2xl border border-mist-200 bg-white shadow-[0_18px_50px_-40px_rgba(15,23,42,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:border-mist-300 hover:shadow-md overflow-hidden"
    >
      {/* Colored top accent bar */}
      <div className={`h-1 w-full ${accentBarClassName}`} />

      <div className="flex flex-1 flex-col p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-white shadow-sm ${accentClassName}`}
          >
            <SpriteIcon name={iconName} className="size-5" />
          </div>
          <div className="mt-0.5 rounded-full border border-mist-200 bg-white p-2 text-mist-400 transition-colors group-hover:text-mist-700">
            <SpriteIcon
              name="arrow-right"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </div>
        </div>

        {/* Title block */}
        <div className="mt-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-mist-500">
            {t("statusBadge", { defaultValue: "Team Workflow" })}
          </p>
          <h3 className="mt-1.5 text-xl font-semibold text-mist-950">
            {t("title", { defaultValue: "For Teams" })}
          </h3>
          <p className="mt-3 text-sm leading-6 text-mist-600">
            {t("description", {
              defaultValue: "Built to support your localization workflow.",
            })}
          </p>
        </div>

        {/* Feature list */}
        <ul className="mt-5 space-y-2.5 border-t border-mist-100 pt-5">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5">
              <div
                className={`flex size-4 shrink-0 items-center justify-center rounded-full ${accentCheckClassName}`}
              >
                <SpriteIcon name="checkmark" className="size-2.5" />
              </div>
              <span className="text-sm text-mist-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}

export default function UserSegments() {
  const t = useT("userSegments");
  const { locale } = useParams({ strict: false });
  const currentLocale = locale || "en";

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="space-y-12">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl/[1.08] font-medium tracking-[-0.03em] text-mist-950 sm:text-4xl/[1.04]">
              {t("title", {
                defaultValue: "Built for Every Team",
              })}
            </h2>
            <p className="mt-4 text-lg text-mist-600">
              {t("subtitle", {
                defaultValue:
                  "Whether you're translating, building, or managing - Better i18n adapts to your workflow.",
              })}
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <SegmentCard
              id="for-translators"
              namespace="segments.translators"
              iconName="globe"
              accentClassName="text-sky-700"
              accentBarClassName="bg-sky-500"
              accentCheckClassName="bg-sky-100 text-sky-600"
              to="/$locale/for-translators"
              locale={currentLocale}
            />
            <SegmentCard
              id="for-developers"
              namespace="segments.developers"
              iconName="code"
              accentClassName="text-indigo-700"
              accentBarClassName="bg-indigo-500"
              accentCheckClassName="bg-indigo-100 text-indigo-600"
              to="/$locale/for-developers"
              locale={currentLocale}
            />
            <SegmentCard
              id="for-product-teams"
              namespace="segments.productTeams"
              iconName="group"
              accentClassName="text-amber-700"
              accentBarClassName="bg-amber-500"
              accentCheckClassName="bg-amber-100 text-amber-700"
              to="/$locale/for-product-teams"
              locale={currentLocale}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
