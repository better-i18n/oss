import { useT } from "@/lib/i18n";
import { TESTIMONIAL_PEOPLE } from "@/lib/testimonials";


export default function Testimonials() {
  const t = useT("testimonials");

  return (
    <section id="testimonials">
      <div className="section">
        <div className="flex flex-col gap-10">
          <div className="max-w-3xl">
            <h2 className="section-h2">
              {t("title")}
            </h2>
            <p className="section-p mt-3">
              {t("subtitle")}
            </p>
          </div>

          {/* Bare columns, separated by gap alone — the Pricing/RelatedPosts
              shape. The cells used to draw their own hairlines AND carry px-6
              py-6, which put a second frame and a second inset inside `.section`
              (which already frames and pads the block). A quote is text, not a
              card: nothing here needs a container.
              Two columns keeps 4 quotes on full rows — 3 would leave a ragged
              half-empty last row. */}
          <div>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-16">
              {TESTIMONIAL_PEOPLE.map((testimonial, index) => (
                <figure
                  key={testimonial.name}
                  className="flex flex-col justify-between gap-6"
                >
                  <blockquote className="text-[15px] leading-[1.6] tracking-[-0.01em] text-mist-800">
                    &ldquo;{t(`${index + 1}.quote`)}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center gap-3">
                    <img
                      src={testimonial.image}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                      className="block size-10 shrink-0 rounded-sm border border-black/[0.06] object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-mist-900">
                        {t(`${index + 1}.name`)}
                      </p>
                      <div className="flex items-center gap-1">
                        <p className="truncate text-xs text-mist-400">
                          {t(`${index + 1}.title`)}
                        </p>
                        {testimonial.url && (
                          <a
                            href={testimonial.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            // The role comes from the CDN, not the person list —
                            // it is translated, and a screen-reader label should
                            // be in the reader's language like the text above it.
                            aria-label={`${t(`${index + 1}.name`)} — ${t(`${index + 1}.title`)}`}
                            className="shrink-0 text-mist-400 transition-colors hover:text-mist-700"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
