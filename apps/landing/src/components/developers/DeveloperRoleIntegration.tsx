import { useTranslations } from "@better-i18n/use-intl";
import { SupportMark, useMarkLabels } from "@/components/ui/support-mark";

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
  /* The mark's accessible name comes from the hook that ships with the mark, so
     a screen reader hears one vocabulary for "we have this" / "we do not"
     across the whole site — it used to re-read the same `compare.marks.*` keys
     itself. */
  const markLabels = useMarkLabels();

  return (
    <section>
      <div className="section">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12 items-start">
          {/* Left: Title (sticky on desktop) */}
          <div className="lg:sticky lg:top-24">
            <h2 className="section-h2">
              {t("integration.title")}
            </h2>
            <p className="section-p mt-3">
              {t("integration.subtitle")}
            </p>
          </div>

          {/* Right: the step list, bare.
              It was one `rounded-xl border shadow-sm p-8` card wrapping rows that
              each had their own `rounded-lg` tint, a filled dark disc or a grey
              disc per row, and a `rounded-full` pill counting the eliminated
              steps. That is three nested boxes inside a frame that already draws
              one (rule/listed-items-are-not-cards). Now: hairline rows, the same
              18px yes/no tile the comparison tables use — so a "we handle this"
              mark means the same thing on every page — and the count as plain
              text. */}
          <div>
            <ol>
              {workflowStepKeys.map((step) => (
                <li
                  key={step.key}
                  className="flex items-center gap-3 border-t border-black/[0.05] py-3 first:border-t-0 first:pt-0"
                >
                  <SupportMark
                    state={step.kept ? "yes" : "no"}
                    label={step.kept ? markLabels.yes : markLabels.no}
                  />
                  <span
                    className={
                      step.kept
                        ? "text-[13px] font-medium text-mist-900"
                        : "text-[13px] text-mist-400 line-through decoration-mist-300"
                    }
                  >
                    {t(`integration.steps.${step.key}`)}
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-6 text-[13px] leading-relaxed text-mist-600">
              <span className="font-medium text-mist-900">{eliminatedCount}</span>{" "}
              {t("integration.stepsHandled")} · {t("integration.tagline")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
