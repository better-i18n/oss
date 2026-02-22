import { useTranslations } from "@better-i18n/use-intl";
import {
  IconGithub,
  IconGlobe,
  IconApiConnection,
  IconRobot,
  IconZap,
  IconCodeBrackets,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

const integrations = [
  {
    key: "git",
    icon: IconGithub,
  },
  {
    key: "cdn",
    icon: IconGlobe,
  },
  {
    key: "api",
    icon: IconApiConnection,
  },
  {
    key: "mcp",
    icon: IconRobot,
  },
  {
    key: "cicd",
    icon: IconZap,
  },
  {
    key: "cli",
    icon: IconCodeBrackets,
  },
];

export default function Integrations() {
  const t = useTranslations("integrations");

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-mist-700 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <div
                key={integration.key}
                className="flex items-start gap-4 p-6 rounded-xl border border-mist-200 bg-white"
              >
                <div className="flex-shrink-0 size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-mist-950">
                    {t(`${integration.key}.title`)}
                  </h3>
                  <p className="mt-1 text-sm text-mist-600">
                    {t(`${integration.key}.description`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
