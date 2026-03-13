import { useT } from "@/lib/i18n";

const testimonialsData = [
  {
    name: "Samet Selcuk",
    title: "Founder, Hellospace",
    image: "/comments/samet.jpeg",
    quote: "Better i18n completely changed how we handle localization. The AI translations are incredibly accurate and context-aware.",
  },
  {
    name: "Tevfik Can Karanfil",
    title: "Founder, Carna",
    image: "/comments/tcan.jpeg",
    quote: "The git-native workflow is a game changer. We went from manual JSON file management to fully automated translations.",
  },
  {
    name: "Mehmet Hanifi Şentürk",
    title: "AI Engineer, Enuygun",
    image: "/comments/mehmeth.jpeg",
    quote: "The MCP integration lets us use translations directly in our AI workflows. It's the most developer-friendly i18n tool I've used.",
  },
  {
    name: "Eray Gündoğmuş",
    title: "Software Engineer, Aceware",
    image: "/comments/eray.jpeg",
    quote: "Setting up took minutes, not days. The CDN delivery means our translations load instantly across all regions.",
  },
  {
    name: "Arhun Hınçalan",
    title: "Engineering Manager, Masraff",
    image: "/comments/arhun.png",
    quote: "Better i18n transformed our localization pipeline. We manage 20+ languages across our fintech products with zero friction — the AI understands financial terminology perfectly.",
  },
];

export default function Testimonials() {
  const t = useT("testimonials");

  return (
    <section id="testimonials" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-10">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl/[1.08] font-medium tracking-[-0.03em] text-mist-950 sm:text-4xl/[1.04]">
              {t("title", { defaultValue: "What people are saying" })}
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-mist-600">
              {t("subtitle", {
                defaultValue:
                  "Real teams using Better i18n across product, engineering, and AI-driven localization workflows.",
              })}
            </p>
          </div>

          <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {testimonialsData.map((testimonial, index) => (
              <figure
                key={index}
                className={`flex h-[240px] flex-col rounded-2xl border border-mist-200 bg-white p-6 text-sm/7 text-mist-950 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md${index === 4 ? " hidden xl:flex" : ""}`}
              >
                <blockquote className="relative flex flex-1 flex-col gap-4">
                  <p className="line-clamp-4 text-base leading-7 text-mist-800">
                    "{t(`${index + 1}.quote`, { defaultValue: testimonial.quote })}"
                  </p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-4 border-t border-mist-100 pt-5">
                  <div className="flex h-10 w-10 overflow-hidden rounded-full outline outline-1 -outline-offset-1 outline-black/5">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {t(`${index + 1}.name`, { defaultValue: testimonial.name })}
                    </p>
                    <p className="text-mist-700 text-sm">
                      {t(`${index + 1}.title`, { defaultValue: testimonial.title })}
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
