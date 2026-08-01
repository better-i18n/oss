import { useTranslations } from "@better-i18n/use-intl";
import { Section, SectionHeader } from "@/components/ui/page";
import { FlowHero, FlowCard, FlowMono, FlowText } from "@/components/visuals/FlowHero";
import { LocaleFlag } from "@/components/ui/locale-flag";

/**
 * "How it works" for /for-developers/, as the converging flow diagram.
 *
 * It used to be two hand-maintained timelines — a four-column horizontal one for
 * desktop and a vertical one for mobile — each drawing its own rail, its own
 * numbered node and its own chevrons. Two layouts, one meaning, and neither of
 * them said what the product does.
 *
 * `FlowHero` is now the standard answer to "how does this work"
 * (rule/how-it-works-is-a-converging-flow): the inputs sit around the edge, the
 * platform sits in the middle, one accent pulse runs edge to centre. Nothing was
 * invented here — every card is a published `developers.workflow.steps.*` key,
 * the same copy the timeline carried, and the three locale cards mirror what
 * `publish` actually produces.
 */
export default function DeveloperWorkflow() {
  const t = useTranslations("developers");

  return (
    <section id="workflow">
      <Section>
        <SectionHeader
          eyebrow={t("workflow.eyebrow")}
          title={t("workflow.title")}
          subtitle={t("workflow.subtitle")}
        />

        <FlowHero
          pillar="ai"
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
            <FlowCard key="connect" eyebrow={t("workflow.steps.connect.title")}>
              <FlowMono>github.com/your-org</FlowMono>
              <div style={{ marginTop: 4 }}>
                <FlowText muted>{t("workflow.steps.connect.description")}</FlowText>
              </div>
            </FlowCard>,
            <FlowCard key="discover" eyebrow={t("workflow.steps.discover.title")}>
              <FlowText>{t("workflow.steps.discover.description")}</FlowText>
            </FlowCard>,
            <FlowCard key="translate" eyebrow={t("workflow.steps.translate.title")}>
              <FlowText>{t("workflow.steps.translate.description")}</FlowText>
            </FlowCard>,
            <FlowCard key="publish" eyebrow={t("workflow.steps.publish.title")}>
              <FlowText>{t("workflow.steps.publish.description")}</FlowText>
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
