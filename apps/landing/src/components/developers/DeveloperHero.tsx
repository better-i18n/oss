import { useTranslations } from "@better-i18n/use-intl";
import { SpriteIcon } from "@/components/SpriteIcon";
import { ProcessCompare } from "@/components/visuals/ProcessCompare";
export default function DeveloperHero() {
  const t = useTranslations("developers");

  return (
    <section className="px-2 pt-8 pb-16 lg:pb-24">
      <div className="w-full mx-auto max-w-[1400px]">
        <div className="px-6 lg:px-10 py-12 lg:py-16">
          {/* Stacked layout: Text on top, Screenshot below */}
          <div className="flex flex-col gap-12 lg:gap-16">
            {/* Text Content - Left Aligned, Dark Text */}
            <div className="flex flex-col gap-6 max-w-3xl">
              {/* Badge */}
              <span className="inline-flex items-center gap-2 rounded-full bg-mist-200 px-3 py-1.5 text-sm text-mist-700 w-fit">
                <SpriteIcon name="code" className="size-4" />
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
                {t("hero.subtitle")}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <a
                  href="https://dash.better-i18n.com"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-mist-950 px-6 py-3 text-sm font-medium text-white hover:bg-mist-900 transition-colors"
                >
                  {t("hero.cta")}
                  <SpriteIcon name="arrow-right" className="size-4" />
                </a>
                <a
                  href="https://docs.better-i18n.com/frameworks/quick-start"
                  className="inline-flex items-center gap-2 text-sm font-medium text-mist-600 hover:text-mist-950 transition-colors"
                >
                  {t("hero.viewDocs")}
                  <SpriteIcon name="chevron-right" className="size-4" />
                </a>
              </div>
            </div>

            {/* The hero used to be a screenshot of our own docs on a matted
                canvas — a picture of a website, telling a developer nothing
                about their week. It is now the process itself: the manual lane
                with the steps that disappear struck through, and the same job
                below in four. Every label is a published key, and both lanes are
                copy we already shipped (`integration.steps.*` is literally the
                manual checklist this page was written against). */}
            <DeveloperProcess />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The manual lane is `developers.integration.steps.*` — the eight-step checklist
 * that section already lists — and the Better lane is the four
 * `developers.workflow.steps.*` titles. Nothing new was written for this figure;
 * the two lists were already on the page in prose form, so putting them side by
 * side is a presentation change, not a new claim.
 */
function DeveloperProcess() {
  const t = useTranslations("developers");
  const tc = useTranslations("common");

  return (
    <ProcessCompare
      pillar="ai"
      title={t("integration.tagline")}
      handledLabel={t("integration.stepsHandled")}
      manual={{
        label: tc("processCompare.manual"),
        steps: [
          { label: t("integration.steps.addKey"), meta: tc("processCompare.meta.byHand") },
          { label: t("integration.steps.createJson"), dropped: true },
          { label: t("integration.steps.copyKey"), dropped: true },
          {
            label: t("integration.steps.emailTranslator"),
            meta: tc("processCompare.meta.waiting"),
            dropped: true,
          },
          { label: t("integration.steps.waitTranslations"), dropped: true },
          { label: t("integration.steps.importFiles"), dropped: true },
          { label: t("integration.steps.pushGithub") },
        ],
      }}
      better={{
        label: tc("processCompare.better"),
        steps: [
          {
            label: t("workflow.steps.connect.title"),
            meta: tc("processCompare.meta.oneCommand"),
          },
          { label: t("workflow.steps.discover.title") },
          { label: t("workflow.steps.translate.title") },
          {
            label: t("workflow.steps.publish.title"),
            meta: tc("processCompare.meta.noDeploy"),
          },
        ],
      }}
    />
  );
}
