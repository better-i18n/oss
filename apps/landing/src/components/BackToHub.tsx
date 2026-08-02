import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { IconArrowLeft } from "@central-icons-react/round-outlined-radius-2-stroke-2";

type Hub = "i18n" | "compare" | "features";

type HubConfig = {
  readonly route: "/$locale/i18n/" | "/$locale/compare/" | "/$locale/features/";
  readonly labelKey: string;
};

const HUB_CONFIGS: Record<Hub, HubConfig> = {
  i18n: {
    route: "/$locale/i18n/",
    labelKey: "backToI18nGuides",
  },
  compare: {
    route: "/$locale/compare/",
    labelKey: "backToComparisons",
  },
  features: {
    route: "/$locale/features/",
    labelKey: "backToFeatures",
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
    // A breadcrumb is not a section — `.section`'s 64px rhythm stacked on the
    // hero's own 56px top padding and left ~120px of dead space above the H1.
    // It belongs in the frame with a breadcrumb's own tight padding.
    <nav
      aria-label="Breadcrumb"
      className="frame"
      style={{ paddingTop: 24, paddingBottom: 4 }}
    >
      <Link
        to={config.route}
        params={{ locale }}
        className="inline-flex items-center gap-2 text-sm font-medium text-mist-600 hover:text-mist-950 transition-colors"
      >
        <IconArrowLeft className="w-4 h-4" aria-hidden="true" />
        {t(config.labelKey)}
      </Link>
    </nav>
  );
}
