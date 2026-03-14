/** Accordion FAQ section for tool pages with optional FAQPage JSON-LD schema. */

import { useState } from "react";

interface FAQItem {
  readonly question: string;
  readonly answer: string;
}

interface ToolFAQProps {
  readonly items: readonly FAQItem[];
  readonly title?: string;
  readonly includeSchema?: boolean;
}

export function ToolFAQ({
  items,
  title = "Frequently Asked Questions",
  includeSchema = true,
}: ToolFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {includeSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        )}

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          <div className="lg:w-[38%] lg:flex-shrink-0 lg:pt-2">
            <div className="inline-flex items-center rounded-full border border-mist-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-mist-600">
              FAQ
            </div>
            <h2 className="mt-4 font-display text-3xl/[1.08] font-medium tracking-[-0.03em] text-mist-950 sm:text-4xl/[1.04]">
              {title}
            </h2>
          </div>

          <div className="flex-1">
            <dl className="divide-y divide-mist-100 overflow-hidden rounded-[1.75rem] border border-mist-200 bg-white shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)]">
              {items.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={index} className={isOpen ? "bg-mist-50/50" : ""}>
                    <dt>
                      <button
                        type="button"
                        className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left"
                        aria-expanded={isOpen}
                        onClick={() => handleToggle(index)}
                      >
                        <span className="text-base font-medium text-mist-950">
                          {item.question}
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
                      <dd className="px-6 pb-5 text-sm/6 text-mist-600">
                        {item.answer}
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
