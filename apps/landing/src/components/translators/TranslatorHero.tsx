import { useTranslations } from "@better-i18n/use-intl";
import { SpriteIcon } from "@/components/SpriteIcon";
import { ProcessCompare } from "@/components/visuals/ProcessCompare";

export default function TranslatorHero() {
  const t = useTranslations("translators");

  return (
    <section>
      <div className="section">
          {/* Stacked layout: Text on top, Video below */}
          <div className="flex flex-col gap-12 lg:gap-16">
            {/* Text Content - Left Aligned, Dark Text */}
            <div className="flex flex-col gap-6 max-w-3xl">
              {/* Badge */}
              <span className="inline-flex w-fit items-center gap-x-2.5 rounded-sm border border-black/[0.06] bg-mist-50 px-2.5 py-1 text-xs text-mist-600 transition-colors hover:border-black/[0.1]">
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
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <a
                  href="https://dash.better-i18n.com"
                  className="btn btn-dark btn-lg"
                >
                  {t("hero.cta.primary")}
                  <SpriteIcon name="arrow-right" className="size-4" />
                </a>
                <a
                  href="#features"
                  className="btn btn-outline btn-lg"
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
