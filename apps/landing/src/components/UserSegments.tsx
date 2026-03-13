import { Link, useParams } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import {
  IconArrowRight,
  IconCode,
  IconGlobe,
  IconGroup1,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import type { ComponentType } from "react";

type SegmentCardProps = {
  accentClassName: string;
  icon: ComponentType<{ className?: string }>;
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
  icon: Icon,
  id,
  locale,
  namespace,
  to,
}: SegmentCardProps) {
  const t = useT(namespace);

  const features = [
    t("feature1Title", { defaultValue: "Feature One" }),
    t("feature2Title", { defaultValue: "Feature Two" }),
  ];

  return (
    <Link
      id={id}
      to={to}
      params={{ locale }}
      className="group flex h-full scroll-mt-24 flex-col rounded-2xl border border-mist-200 bg-white p-5 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:border-mist-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-white shadow-sm ${accentClassName}`}
          >
            <Icon className="size-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-mist-500">
              {t("statusBadge", { defaultValue: "Team Workflow" })}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-mist-950">
              {t("title", { defaultValue: "For Teams" })}
            </h3>
          </div>
        </div>

        <div className="rounded-full border border-mist-200 bg-white p-2 text-mist-400 transition-colors group-hover:text-mist-700">
          <IconArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-mist-700">
        {t("description", {
          defaultValue: "Built to support your localization workflow.",
        })}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {features.map((feature) => (
          <span
            key={feature}
            className="inline-flex items-center rounded-full border border-mist-200 bg-white px-3 py-1 text-xs font-medium text-mist-700"
          >
            {feature}
          </span>
        ))}
      </div>

      <p className="mt-4 text-sm text-mist-500">
        {t("feature3Title", { defaultValue: "More workflow support" })}
      </p>
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
        <div className="space-y-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
                {t("title", {
                  defaultValue: "Built for Every Team",
                })}
              </h2>
              <p className="mt-4 text-lg text-mist-700">
                {t("subtitle", {
                  defaultValue:
                    "Whether you're translating, building, or managing - Better i18n adapts to your workflow.",
                })}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:max-w-xl lg:justify-end">
              <span className="inline-flex items-center rounded-full border border-mist-200 bg-mist-50/60 px-3 py-1.5 text-sm text-mist-700">
                {t("highlight1", {
                  defaultValue:
                    "AI assistance where translators still keep approval control.",
                })}
              </span>
              <span className="inline-flex items-center rounded-full border border-mist-200 bg-mist-50/60 px-3 py-1.5 text-sm text-mist-700">
                {t("highlight2", {
                  defaultValue:
                    "Git-native tooling that fits existing developer workflows.",
                })}
              </span>
              <span className="inline-flex items-center rounded-full border border-mist-200 bg-mist-50/60 px-3 py-1.5 text-sm text-mist-700">
                {t("highlight3", {
                  defaultValue:
                    "Shared visibility for product, engineering, and localization.",
                })}
              </span>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <SegmentCard
              id="for-translators"
              namespace="segments.translators"
              icon={IconGlobe}
              accentClassName="text-sky-700"
              to="/$locale/for-translators"
              locale={currentLocale}
            />
            <SegmentCard
              id="for-developers"
              namespace="segments.developers"
              icon={IconCode}
              accentClassName="text-indigo-700"
              to="/$locale/for-developers"
              locale={currentLocale}
            />
            <SegmentCard
              id="for-product-teams"
              namespace="segments.productTeams"
              icon={IconGroup1}
              accentClassName="text-amber-700"
              to="/$locale/for-product-teams"
              locale={currentLocale}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
