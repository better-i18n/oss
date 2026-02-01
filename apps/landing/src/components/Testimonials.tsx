import { useTranslations } from "@better-i18n/use-intl";

const testimonialsData = [
  {
    name: "Sarah Chen",
    title: "Product Lead, TechCorp",
    gradient: "from-orange-400 to-pink-500",
  },
  {
    name: "Marcus Weber",
    title: "Senior Developer, Stripe",
    gradient: "from-blue-400 to-purple-500",
  },
  {
    name: "Nina Patel",
    title: "Engineering Manager, Notion",
    gradient: "from-emerald-400 to-cyan-500",
  },
];

export default function Testimonials() {
  const t = useTranslations("testimonials");

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-10 sm:gap-16">
          <div>
            <h2 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {testimonialsData.map((testimonial, index) => (
              <figure
                key={index}
                className="flex flex-col justify-between gap-8 rounded-xl bg-mist-950/[0.025] p-6 text-sm/7 text-mist-950"
              >
                <blockquote className="relative flex flex-col gap-4">
                  <p>"{t(`${index}.quote`)}"</p>
                </blockquote>
                <figcaption className="flex items-center gap-4">
                  <div className="flex w-10 h-10 overflow-hidden rounded-full outline outline-1 -outline-offset-1 outline-black/5">
                    <div
                      className={`w-full h-full bg-gradient-to-br ${testimonial.gradient}`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {t(`${index}.name`, { defaultValue: testimonial.name })}
                    </p>
                    <p className="text-mist-700 text-sm">
                      {t(`${index}.title`, { defaultValue: testimonial.title })}
                    </p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
