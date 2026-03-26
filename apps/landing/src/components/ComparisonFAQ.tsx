import { useState } from "react";
import { useT } from "@/lib/i18n";

const faqKeys = ["faq1", "faq2", "faq3", "faq4"] as const;

export default function ComparisonFAQ() {
  const t = useT("alternatives");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">

          {/* Left: intro */}
          <div className="lg:w-[38%] lg:flex-shrink-0 lg:pt-2">
            <div className="inline-flex items-center rounded-full border border-mist-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-mist-600">
              {t("faqEyebrow", { defaultValue: "FAQ" })}
            </div>
            <h2 className="mt-4 font-display text-3xl/[1.08] font-medium tracking-[-0.03em] text-mist-950 sm:text-4xl/[1.04]">
              {t("faqTitle", { defaultValue: "Frequently Asked Questions" })}
            </h2>
            <p className="mt-4 text-base leading-7 text-mist-600">
              {t("faqSubtitle", {
                defaultValue: "Common questions about switching to Better i18n.",
              })}
            </p>
          </div>

          {/* Right: accordion card */}
          <div className="flex-1">
            <dl className="overflow-hidden rounded-[1.75rem] border border-mist-200 bg-white shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] divide-y divide-mist-100">
              {faqKeys.map((key, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={key} className={isOpen ? "bg-mist-50/50" : ""}>
                    <dt>
                      <button
                        type="button"
                        className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left"
                        aria-expanded={isOpen}
                        onClick={() => handleToggle(index)}
                      >
                        <span className="text-base font-medium text-mist-950">
                          {t(`${key}.question`, { defaultValue: "" })}
                        </span>
                        <span
                          className="ml-4 flex-shrink-0 text-mist-400 transition-transform duration-200"
                          style={{
                            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                          }}
                        >
                          <svg
                            className="size-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                          </svg>
                        </span>
                      </button>
                    </dt>
                    {isOpen && (
                      <dd className="px-6 pb-5 text-sm/6 text-mist-600 faq-answer">
                        {t(`${key}.answer`, { defaultValue: "" })}
                      </dd>
                    )}
                  </div>
                );
              })}
            </dl>
          </div>

        </div>
      </div>
    </section>
  );
}
