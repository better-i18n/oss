import { useTranslations } from "@better-i18n/use-intl";
import PainPromiseProof from "@/components/PainPromiseProof";

export default function DeveloperPainPromiseProof() {
  const t = useTranslations("developers");

  return (
    <PainPromiseProof
      title={t("painPromiseProof.title")}
      subtitle={t("painPromiseProof.subtitle")}
      pain={{
        label: t("painPromiseProof.pain.label"),
        text: t("painPromiseProof.pain.text"),
      }}
      promise={{
        label: t("painPromiseProof.promise.label"),
        text: t("painPromiseProof.promise.text"),
      }}
      proof={{
        label: t("painPromiseProof.proof.label"),
        text: t("painPromiseProof.proof.text"),
      }}
    />
  );
}
