import { useLandingContent } from '../content/LandingContentContext.jsx';
import ScrollReveal from './ScrollReveal.jsx';

function Testimonials() {
  const {
    content: { testimonials },
  } = useLandingContent();

  const backgroundUrl =
    'https://lh3.googleusercontent.com/aida/AP1WRLujnsmLns5rwFdqhowmKgvMfRuOE4a8ukJ-qBu5OLEQWYowinlozxK5MItuU_lSjnnccGj4DTSyLpl4wCmGLdufLjpuUTPtLI2Inwwwargsvgodg7iHiZecgbEVgkHUJ00y3RZ0yy9sYF8pjhcIjm8LfbwgyBvoE0wUp_cVZAWt8uTo6l9OscPnheLaQ-K7MQwkm7pkwnnCxALve8NJO63r4XtQVN4o_WcEU9eUJh4M0NIXATqKW8FxZds';

  if (!testimonials.length) {
    return null;
  }

  return (
    <section className="relative py-40 overflow-hidden" id="testimonials">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${backgroundUrl}')` }}
        />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
      </div>

      <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
        <div className="text-center mb-24">
          <span className="text-primary font-label-sm uppercase tracking-widest mb-4 block">
            Client Reflections
          </span>
          <h2 className="font-headline-lg text-headline-lg mb-8 text-center mx-auto">
            Praise from the Discerning
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal
              as="div"
              className="bg-surface-container/30 backdrop-blur-md border border-outline-variant/20 shadow-md p-12 flex flex-col items-center text-center"
              delay={index * 120}
              key={index}
              variant="fade-up"
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-primary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>

              <p className="font-body-lg italic text-on-surface mb-8 leading-relaxed">
                "{testimonial.quote}"
              </p>

              <div className="mt-auto">
                <div className="font-label-md uppercase tracking-widest text-primary font-medium text-[14px]">
                  {testimonial.author}
                </div>
                <div className="font-label-sm opacity-60 text-[12px] mt-1">
                  {testimonial.event}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
