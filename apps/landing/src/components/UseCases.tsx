import { useTranslations } from "@better-i18n/use-intl";
import {
  IconRocket,
  IconCodeBrackets,
  IconGlobe,
  IconBook,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

const useCases = [
  {
    key: "saas",
    icon: IconRocket,
  },
  {
    key: "mobile",
    icon: IconCodeBrackets,
  },
  {
    key: "website",
    icon: IconGlobe,
  },
  {
    key: "docs",
    icon: IconBook,
  },
];

export default function UseCases() {
  const t = useTranslations("useCases");

  return (
    <section className="py-20 bg-mist-950 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] sm:text-4xl/[1.1]">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((useCase) => {
            const Icon = useCase.icon;
            return (
              <div
                key={useCase.key}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                  <Icon className="size-5 text-white/80" />
                </div>
                <h3 className="text-base font-medium">
                  {t(`${useCase.key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-white/60">
                  {t(`${useCase.key}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
