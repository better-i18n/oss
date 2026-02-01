import { useTranslations } from "@better-i18n/use-intl";
import {
  IconCheckmark1,
  IconCrossMedium,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

const workflowStepKeys = [
  { key: "addKey", kept: true },
  { key: "createJson", kept: false },
  { key: "copyKey", kept: false },
  { key: "emailTranslator", kept: false },
  { key: "waitTranslations", kept: false },
  { key: "importFiles", kept: false },
  { key: "pushGithub", kept: true },
  { key: "done", kept: true },
];

const eliminatedCount = workflowStepKeys.filter((step) => !step.kept).length;

export default function DeveloperRoleIntegration() {
  const t = useTranslations("developers");

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12 items-start">
          {/* Left: Title (sticky on desktop) */}
          <div className="lg:sticky lg:top-24">
            <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
              {t("integration.title")}
            </h2>
            <p className="mt-4 text-lg text-mist-600">
              {t("integration.subtitle")}
            </p>
          </div>

          {/* Right: Workflow Card */}
          <div>
            {/* Single unified workflow card */}
            <div className="rounded-2xl bg-white border border-mist-200 p-6 lg:p-8 shadow-sm">
              <ol className="space-y-1">
                {workflowStepKeys.map((step, index) => {
                  const isFirstEliminated =
                    !step.kept &&
                    (index === 0 || workflowStepKeys[index - 1].kept);
                  const isLastEliminated =
                    !step.kept &&
                    (index === workflowStepKeys.length - 1 ||
                      workflowStepKeys[index + 1].kept);

                  return (
                    <div key={index}>
                      {/* Dashed separator before eliminated section */}
                      {isFirstEliminated && (
                        <div className="flex items-center gap-3 py-3">
                          <div className="flex-1 border-t border-dashed border-mist-300" />
                        </div>
                      )}

                      <li
                        className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors ${
                          step.kept
                            ? ""
                            : "bg-mist-50/70"
                        }`}
                      >
                        {step.kept ? (
                          <span className="shrink-0 size-6 rounded-full bg-mist-900 text-white flex items-center justify-center">
                            <IconCheckmark1 className="size-3.5" />
                          </span>
                        ) : (
                          <span className="shrink-0 size-6 rounded-full bg-mist-200 text-mist-400 flex items-center justify-center">
                            <IconCrossMedium className="size-3.5" />
                          </span>
                        )}
                        <span
                          className={
                            step.kept
                              ? "text-mist-950 font-medium"
                              : "text-mist-400 line-through"
                          }
                        >
                          {t(`integration.steps.${step.key}`)}
                        </span>
                      </li>

                      {/* Dashed separator after eliminated section */}
                      {isLastEliminated && (
                        <div className="flex items-center gap-3 py-3">
                          <div className="flex-1 border-t border-dashed border-mist-300" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </ol>

              {/* Badge showing eliminated count */}
              <div className="mt-6 pt-4 border-t border-mist-100">
                <div className="flex items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-mist-100 px-3 py-1.5 text-sm text-mist-600">
                    <span className="font-semibold text-mist-900">{eliminatedCount} steps</span>
                    <span>{t("integration.stepsHandled")}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom tagline */}
            <p className="mt-8 text-mist-600">
              {t("integration.tagline")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
