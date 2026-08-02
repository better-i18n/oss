import { useTranslations } from "@better-i18n/use-intl";
import { Section, SectionHeader } from "@/components/ui/page";
import { FlowHero, FlowCard, FlowMono, FlowText } from "@/components/visuals/FlowHero";
import { LocaleFlag } from "@/components/ui/locale-flag";

/**
 * "How it works" for /for-product-teams/, as the converging flow diagram.
 *
 * It used to be a horizontal row of five emoji tiles joined by 2px grey bars,
 * inside a hand-rolled `max-w-[1400px]` wrapper, with a three-dot legend under a
 * `border-mist-100` rule. Emoji as product iconography, a centred header the rest
 * of the site left behind, and a container that broke the frame.
 *
 * Now it is `FlowHero` — the same shape the reference implementation uses for its
 * product heroes and the shape we standardised on: the inputs sit around the edge,
 * the platform sits in the middle, and one accent pulse runs edge → centre. Every
 * label is still a published key from `product-teams`, so no copy was invented
 * here; only the shape changed. (Decision 2026-08-01: "böyle döşeyelim her yere".)
 */
export default function ProductWorkflow() {
  const t = useTranslations("product-teams");

  return (
    <section id="workflow">
      <Section>
        <SectionHeader
          eyebrow={t("workflow.eyebrow")}
          title={t("workflow.title")}
          subtitle={t("workflow.description")}
        />

        <FlowHero
          pillar="sync"
          title={t("workflow.title")}
          center={{
            mark: (
              <img
                src="/brand/logo.svg"
                alt=""
                width={26}
                height={26}
                style={{ width: 26, height: 26 }}
              />
            ),
            label: "Better I18N",
            sublabel: t("workflow.legend.automated"),
          }}
          cards={[
            <FlowCard key="merged" eyebrow={t("workflow.steps.merged.title")}>
              <FlowMono>git merge → main</FlowMono>
              <div style={{ marginTop: 4 }}>
                <FlowText muted>{t("workflow.steps.merged.description")}</FlowText>
              </div>
            </FlowCard>,
            <FlowCard key="synced" eyebrow={t("workflow.steps.synced.title")}>
              <FlowText>{t("workflow.steps.synced.description")}</FlowText>
            </FlowCard>,
            <FlowCard key="translate" eyebrow={t("workflow.steps.translate.title")}>
              <FlowText>{t("workflow.steps.translate.description")}</FlowText>
            </FlowCard>,
            <FlowCard key="review" eyebrow={t("workflow.steps.review.title")}>
              <FlowText>{t("workflow.steps.review.description")}</FlowText>
            </FlowCard>,
            <FlowCard
              key="tr"
              eyebrow={t("workflow.steps.publish.title")}
              corner={<LocaleFlag locale="tr" size={14} />}
            >
              <FlowMono>tr · published</FlowMono>
            </FlowCard>,
            <FlowCard
              key="de"
              eyebrow={t("workflow.steps.publish.title")}
              corner={<LocaleFlag locale="de" size={14} />}
            >
              <FlowMono>de · published</FlowMono>
            </FlowCard>,
            <FlowCard
              key="ja"
              eyebrow={t("workflow.steps.publish.title")}
              corner={<LocaleFlag locale="ja" size={14} />}
            >
              <FlowMono>ja · published</FlowMono>
            </FlowCard>,
          ]}
        />
      </Section>
    </section>
  );
}
