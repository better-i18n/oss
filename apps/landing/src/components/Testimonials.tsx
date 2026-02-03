import { useTranslations } from "@better-i18n/use-intl";

const testimonialsData = [
  {
    name: "Eray Gündoğmuş",
    title: "Software Engineer, Masraff",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQE4tAgXhARBpw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1718267370776?e=1771459200&v=beta&t=xwSXKZhDWNEGrP0m40m9tsPTs0YFwpO7RsVr5h0eTVQ",
  },
  {
    name: "Tevfik Can Karanfil",
    title: "Founder, Carna",
    image:
      "https://media.licdn.com/dms/image/v2/C5603AQHBw0V8PnHrPg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1612295592429?e=1771459200&v=beta&t=_kMklQoZd4r16mC2et2Dztps4WTWvZelnHpckmlszbU",
  },
  {
    name: "Mehmet Hanifi Şentürk",
    title: "AI Engineer, Enuygun",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQFRnF6DlMSPww/profile-displayphoto-shrink_800_800/B4DZbahcvIHEAg-/0/1747422924230?e=1771459200&v=beta&t=6hO0RCV_MGmJg-K1JluwnAraxlViZKXAGMbopDrIb4s",
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
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
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
