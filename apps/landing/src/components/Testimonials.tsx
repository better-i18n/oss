import { useTranslations } from "@better-i18n/use-intl";

const testimonialsData = [
  {
    name: "Samet Selcuk",
    title: "Founder, Hellospace",
    image: "/comments/samet.jpeg",
  },
  {
    name: "Tevfik Can Karanfil",
    title: "Founder, Carna",
    image: "/comments/tcan.jpeg",
  },
  {
    name: "Mehmet Hanifi Şentürk",
    title: "AI Engineer, Enuygun",
    image: "/comments/mehmeth.jpeg",
  },
  {
    name: "Eray Gündoğmuş",
    title: "Software Engineer, Masraff",
    image: "/comments/eray.jpeg",
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

          <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
            {testimonialsData.map((testimonial, index) => (
              <figure
                key={index}
                className={`flex flex-col justify-between gap-8 rounded-xl bg-mist-950/[0.025] p-6 text-sm/7 text-mist-950${index === 3 ? ' lg:hidden' : ''}`}
              >
                <blockquote className="relative flex flex-col gap-4">
                  <p>"{t(`${index + 1}.quote`)}"</p>
                </blockquote>
                <figcaption className="flex items-center gap-4">
                  <div className="flex w-10 h-10 overflow-hidden rounded-full outline outline-1 -outline-offset-1 outline-black/5">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
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
