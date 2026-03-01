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
    title: "Software Engineer, Masraff",
    image: "/comments/eray.jpeg",
    quote: "Setting up took minutes, not days. The CDN delivery means our translations load instantly across all regions.",
  },
];

export default function Testimonials() {
  const t = useT("testimonials");

  return (
    <section id="testimonials" className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-10 sm:gap-16">
          <div>
            <h2 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("title", { defaultValue: "What people are saying" })}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
            {testimonialsData.map((testimonial, index) => (
              <figure
                key={index}
                className={`flex flex-col justify-between gap-8 rounded-xl bg-mist-950/[0.025] p-6 text-sm/7 text-mist-950${index === 3 ? ' lg:hidden' : ''}`}
              >
                <blockquote className="relative flex flex-col gap-4">
                  <p>"{t(`${index + 1}.quote`, { defaultValue: testimonial.quote })}"</p>
                </blockquote>
                <figcaption className="flex items-center gap-4">
                  <div className="flex w-10 h-10 overflow-hidden rounded-full outline outline-1 -outline-offset-1 outline-black/5">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
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
