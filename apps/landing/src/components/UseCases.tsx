import { useTranslations } from "@better-i18n/use-intl";
import {
  IconCodeBrackets,
  IconGlobe,
  IconGithub,
  IconScript,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

const features = [
  {
    key: "typescript",
    icon: IconCodeBrackets,
  },
  {
    key: "cli",
    icon: IconScript,
  },
  {
    key: "git",
    icon: IconGithub,
  },
  {
    key: "cdn",
    icon: IconGlobe,
  },
];

export default function UseCases() {
  const t = useTranslations("developerFeatures");

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-mist-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.key}
                className="p-6 rounded-xl bg-white border border-mist-200 hover:border-mist-300 transition-colors"
              >
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center mb-4">
                  <Icon className="size-5 text-mist-700" />
                </div>
                <h3 className="text-base font-medium text-mist-950">
                  {t(`${feature.key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-mist-600">
                  {t(`${feature.key}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
