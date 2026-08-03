import { Link, useParams } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { SpriteIcon } from "@/components/SpriteIcon";
import { CompetitorLandscape } from "@/components/CompetitorLandscape";

/* Six claims, not three: this list carries the section's whole argument, and
   three lines left the column visually short next to four competitor cells.
   Keys only — the copy lives on the CDN (no inline fallbacks). */
const benefits = [
  "benefit1",
  "benefit2",
  "benefit3",
  "benefit4",
  "benefit5",
  "benefit6",
] as const;

export default function Alternatives() {
  const t = useT("alternatives");
  const { locale } = useParams({ strict: false });
  const currentLocale = locale || "en";

  return (
    <section id="alternatives">
      <div className="section">
        <div className="mb-12 max-w-3xl">
          <div className="eyebrow">
            {t("vsLabel")}
          </div>
          <h2 className="section-h2">
            {t("title")}
          </h2>
          <p className="section-p mt-3">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          {/* Left: no card, no border — the numbered claims are separated by the
              same hairline the rest of the page uses. Numerals are 11px meta ink
              (mist-400), not filled circles, so they read as an index and not as
              three heavy bullets competing with the copy. */}
          <div className="flex flex-col">
            <p className="text-[11px] font-medium text-mist-400">
              {t("benefitsLabel")}
            </p>
            <ul className="mt-5 border-t border-black/[0.07]">
              {benefits.map((benefit, index) => (
                <li
                  key={benefit}
                  className="flex items-baseline gap-4 border-b border-black/[0.07] py-4"
                >
                  <span className="w-3 shrink-0 text-[11px] tabular-nums text-mist-400">
                    {index + 1}
                  </span>
                  <span className="text-[15px] leading-6 tracking-[-0.015em] text-mist-700">
                    {t(benefit)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Router is configured `trailingSlash: "always"` (src/router.tsx),
                so the generated `to` union carries the trailing slash. */}
            <Link
              to="/$locale/i18n/best-tms/"
              params={{ locale: currentLocale }}
              className="btn btn-dark btn-lg mt-8 w-fit"
            >
              {t("viewFullComparison")}
              <SpriteIcon name="arrow-right" className="size-4" />
            </Link>
          </div>

          {/* Right: the vendor columns, their descriptions and their verified
              entry prices now live in <CompetitorLandscape /> — the same block
              the positioning section on /about renders, so a price is fixed in
              one place. */}
          <CompetitorLandscape />
        </div>
      </div>
    </section>
  );
}
