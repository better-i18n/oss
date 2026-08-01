import { useTranslations } from "@better-i18n/use-intl";
import { Section, SectionHeader } from "@/components/ui/page";
import { FlowHero, FlowCard, FlowMono, FlowText } from "@/components/visuals/FlowHero";
import { LocaleFlag } from "@/components/ui/locale-flag";

/**
 * What a translator actually works with, as the converging flow diagram.
 *
 * This section answers "how does translating here work", so it takes the
 * standard shape (rule/how-it-works-is-a-converging-flow) rather than a
 * centred two-column grid of icon tiles. Each input the translator relies on —
 * the model they pick, the glossary that constrains it, the mentions that
 * address a language or a namespace, and their own approval — sits on the edge
 * and converges on the editor.
 *
 * Copy is unchanged: every card is a published `translators.features.items.*`
 * key, the same title and description the grid rendered.
 */
export default function TranslatorFeatures() {
  const t = useTranslations("translators");

  return (
    <section id="features">
      <Section>
        <SectionHeader
          eyebrow={t("features.eyebrow")}
          title={t("features.title")}
          subtitle={t("features.subtitle")}
        />

        <FlowHero
          pillar="ai"
          title={t("features.title")}
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
            sublabel: t("features.legend.assisted"),
          }}
          cards={[
            <FlowCard key="multiModel" eyebrow={t("features.items.multiModel.title")}>
              <FlowMono>gpt · claude · gemini · deepl</FlowMono>
              <div style={{ marginTop: 4 }}>
                <FlowText muted>{t("features.items.multiModel.description")}</FlowText>
              </div>
            </FlowCard>,
            <FlowCard key="glossary" eyebrow={t("features.items.glossary.title")}>
              <FlowText>{t("features.items.glossary.description")}</FlowText>
            </FlowCard>,
            <FlowCard key="humanControl" eyebrow={t("features.items.humanControl.title")}>
              <FlowText>{t("features.items.humanControl.description")}</FlowText>
            </FlowCard>,
            <FlowCard key="mentions" eyebrow={t("features.items.mentions.title")}>
              <FlowMono>@Turkish · @auth</FlowMono>
              <div style={{ marginTop: 4 }}>
                <FlowText muted>{t("features.items.mentions.description")}</FlowText>
              </div>
            </FlowCard>,
            <FlowCard
              key="tr"
              eyebrow={t("workflow.steps.published.status")}
              corner={<LocaleFlag locale="tr" size={14} />}
            >
              <FlowMono>tr · published</FlowMono>
            </FlowCard>,
            <FlowCard
              key="de"
              eyebrow={t("workflow.steps.published.status")}
              corner={<LocaleFlag locale="de" size={14} />}
            >
              <FlowMono>de · published</FlowMono>
            </FlowCard>,
          ]}
        />
      </Section>
    </section>
  );
}
