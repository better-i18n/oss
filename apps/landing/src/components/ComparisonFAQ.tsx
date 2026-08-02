import { useT } from "@/lib/i18n";
import { FaqSection } from "@/components/ui/page";

const faqKeys = ["faq1", "faq2", "faq3", "faq4"] as const;

/**
 * Home-page FAQ. All of the layout and disclosure behaviour lives in
 * <FaqSection> (ui/page.tsx) so the pricing page's FAQ is literally the same
 * component — this file only supplies copy.
 */
export default function ComparisonFAQ() {
  const t = useT("alternatives");

  return (
    <FaqSection
      eyebrow={t("faqEyebrow")}
      title={t("faqTitle")}
      subtitle={t("faqSubtitle")}
      items={faqKeys.map((key) => ({
        id: key,
        question: t(`${key}.question`),
        answer: t(`${key}.answer`),
      }))}
    />
  );
}
