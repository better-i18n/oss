import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { IconArrowLeft } from "@central-icons-react/round-outlined-radius-2-stroke-2";

type Hub = "i18n" | "compare" | "features";

type HubConfig = {
  readonly route: "/$locale/i18n/" | "/$locale/compare/" | "/$locale/features/";
  readonly labelKey: string;
  readonly fallback: string;
};

const HUB_CONFIGS: Record<Hub, HubConfig> = {
  i18n: {
    route: "/$locale/i18n/",
    labelKey: "backToI18nGuides",
    fallback: "All i18n Guides",
  },
  compare: {
    route: "/$locale/compare/",
    labelKey: "backToComparisons",
    fallback: "All Comparisons",
  },
  features: {
    route: "/$locale/features/",
    labelKey: "backToFeatures",
    fallback: "All Features",
  },
};

interface BackToHubProps {
  readonly hub: Hub;
  readonly locale: string;
}

export function BackToHub({ hub, locale }: BackToHubProps) {
  const t = useT("navigation");
  const config = HUB_CONFIGS[hub];

  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 lg:px-10 pt-6">
      <Link
        to={config.route}
        params={{ locale }}
        className="inline-flex items-center gap-2 text-sm font-medium text-mist-600 hover:text-mist-950 transition-colors"
      >
        <IconArrowLeft className="w-4 h-4" aria-hidden="true" />
        {t(config.labelKey, config.fallback)}
      </Link>
    </nav>
  );
}
