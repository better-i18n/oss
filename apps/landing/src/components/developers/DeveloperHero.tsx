import { useTranslations } from "@better-i18n/use-intl";
import { SpriteIcon } from "@/components/SpriteIcon";
import { ProcessCompare } from "@/components/visuals/ProcessCompare";
export default function DeveloperHero() {
  const t = useTranslations("developers");

  return (
    <section>
      <div className="section">
          {/* Stacked layout: Text on top, Screenshot below */}
          <div className="flex flex-col gap-12 lg:gap-16">
            {/* Text Content - Left Aligned, Dark Text */}
            <div className="flex flex-col gap-6 max-w-3xl">
              {/* Badge */}
              <span className="inline-flex w-fit items-center gap-x-2.5 rounded-sm border border-black/[0.06] bg-mist-50 px-2.5 py-1 text-xs text-mist-600 transition-colors hover:border-black/[0.1]">
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
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <a
                  href="https://dash.better-i18n.com"
                  className="btn btn-dark btn-lg"
                >
                  {t("hero.cta")}
                  <SpriteIcon name="arrow-right" className="size-4" />
                </a>
                <a
                  href="https://docs.better-i18n.com/frameworks/quick-start"
                  className="btn btn-outline btn-lg"
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
    </section>
  );
}

/**
 * The developer's actual week, both ways.
 *
 * The manual lane is the process a team without this platform really runs, in
 * order: edit the source JSON by hand, copy the key into every locale file, watch
 * one slip through review, mail the translator, wait, import what comes back,
 * resolve the conflicts that import causes, push, and wait for a deploy before
 * anyone sees the copy. Seven of those nine are `developers.integration.steps.*`,
 * which this page already listed as prose; the three that were missing — the key
 * that slips through review, the merge conflict, the wait for a deploy — are new
 * keys under `developers.processCompare.manual.*`.
 *
 * The Better lane is the same job: write the feature, let the CLI find the key,
 * let AI translate it against the glossary, approve, and it is on the CDN. Three
 * of those five are the published `workflow.steps.*` titles; "write the feature"
 * and "approve in the editor" are new keys under
 * `developers.processCompare.better.*`.
 *
 * `meta` carries effort, not invented numbers. "once per locale", "days of
 * waiting", "every release" are claims about the SHAPE of the manual process and
 * are defensible; "~2h" or "3 days" would be a measurement of someone else's team
 * that we have not taken. All of them are `common.processCompare.meta.*` keys.
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
          {
            label: t("integration.steps.copyKey"),
            meta: tc("processCompare.meta.perLocale"),
            dropped: true,
          },
          { label: t("processCompare.manual.missedInReview"), dropped: true },
          {
            label: t("integration.steps.emailTranslator"),
            meta: tc("processCompare.meta.daysOfWaiting"),
            dropped: true,
          },
          { label: t("integration.steps.waitTranslations"), dropped: true },
          { label: t("integration.steps.importFiles"), dropped: true },
          { label: t("processCompare.manual.mergeConflict"), dropped: true },
          { label: t("integration.steps.pushGithub") },
          {
            label: t("processCompare.manual.waitDeploy"),
            meta: tc("processCompare.meta.everyRelease"),
            dropped: true,
          },
        ],
      }}
      better={{
        label: tc("processCompare.better"),
        steps: [
          { label: t("processCompare.better.writeCode") },
          {
            label: t("workflow.steps.discover.title"),
            meta: tc("processCompare.meta.oneCommand"),
          },
          { label: t("workflow.steps.translate.title") },
          {
            label: t("processCompare.better.approve"),
            meta: tc("processCompare.meta.inTheEditor"),
          },
          {
            label: t("workflow.steps.publish.title"),
            meta: tc("processCompare.meta.noDeploy"),
          },
        ],
      }}
    />
  );
}
