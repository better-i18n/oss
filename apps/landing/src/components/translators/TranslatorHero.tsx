import { useTranslations } from "@better-i18n/use-intl";
import { SpriteIcon } from "@/components/SpriteIcon";
import { ProcessCompare } from "@/components/visuals/ProcessCompare";

export default function TranslatorHero() {
  const t = useTranslations("translators");

  return (
    <section className="px-2 pt-8 pb-16 lg:pb-24">
      <div className="w-full mx-auto max-w-[1400px]">
        <div className="px-6 lg:px-10 py-12 lg:py-16">
          {/* Stacked layout: Text on top, Video below */}
          <div className="flex flex-col gap-12 lg:gap-16">
            {/* Text Content - Left Aligned, Dark Text */}
            <div className="flex flex-col gap-6 max-w-3xl">
              {/* Badge */}
              <span className="inline-flex items-center gap-2 rounded-full bg-mist-200 px-3 py-1.5 text-sm text-mist-700 w-fit">
                <SpriteIcon name="sparkles-soft" className="size-4" />
                {t("hero.badge")}
              </span>

              <h1
                className="text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1] lg:text-5xl/[1.1]"
                style={{ textWrap: "balance" }}
              >
                {t("hero.title")}
              </h1>

              <p
                className="text-base/7 text-mist-600 lg:text-lg/8"
                style={{ textWrap: "pretty" }}
              >
                {t("hero.description")}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <a
                  href="https://dash.better-i18n.com"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-mist-950 px-6 py-3 text-sm font-medium text-white hover:bg-mist-900 transition-colors"
                >
                  {t("hero.cta.primary")}
                  <SpriteIcon name="arrow-right" className="size-4" />
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 text-sm font-medium text-mist-600 hover:text-mist-950 transition-colors"
                >
                  {t("hero.cta.secondary")}
                  <SpriteIcon name="chevron-right" className="size-4" />
                </a>
              </div>
            </div>

            {/* Was a screenshot of the editor; now the translator's own process,
                before and after. */}
            <TranslatorProcess />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The Better lane is the four published `translators.workflow.steps.*` titles —
 * the same statuses the page explains below. The manual lane needed copy that did
 * not exist yet, so five keys were added under
 * `translators.processCompare.translators.*`; they describe the spreadsheet round
 * trip the page's own pain points already name (no context, inconsistent terms,
 * blind quality) rather than inventing a new grievance.
 */
function TranslatorProcess() {
  const t = useTranslations("translators");
  const tc = useTranslations("common");

  return (
    <ProcessCompare
      pillar="sync"
      title={t("workflow.title")}
      handledLabel={tc("processCompare.handled")}
      manual={{
        label: tc("processCompare.manual"),
        steps: [
          { label: t("processCompare.translators.brief") },
          { label: t("processCompare.translators.guess"), dropped: true },
          { label: t("processCompare.translators.terms"), dropped: true },
          {
            label: t("processCompare.translators.send"),
            meta: tc("processCompare.meta.waiting"),
            dropped: true,
          },
          { label: t("processCompare.translators.rebuild"), dropped: true },
        ],
      }}
      better={{
        label: tc("processCompare.better"),
        steps: [
          { label: t("workflow.steps.missing.title") },
          { label: t("workflow.steps.draft.title") },
          { label: t("workflow.steps.approved.title") },
          {
            label: t("workflow.steps.published.title"),
            meta: tc("processCompare.meta.noDeploy"),
          },
        ],
      }}
    />
  );
}
