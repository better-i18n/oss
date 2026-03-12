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
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1] text-center">
          {t("faqTitle", { defaultValue: "Frequently Asked Questions" })}
        </h2>
        <p className="mt-4 text-lg text-mist-700 text-center">
          {t("faqSubtitle", {
            defaultValue: "Common questions about switching to Better i18n.",
          })}
        </p>

        <dl className="mt-10 divide-y divide-mist-200">
          {faqKeys.map((key, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={key} className="py-5">
                <dt>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between text-left"
                    aria-expanded={isOpen}
                    onClick={() => handleToggle(index)}
                  >
                    <span className="text-base font-medium text-mist-950">
                      {t(`${key}.question`)}
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
                  <dd className="mt-3 text-sm/6 text-mist-600 faq-answer">
                    {t(`${key}.answer`)}
                  </dd>
                )}
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
