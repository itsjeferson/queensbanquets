import { useLandingContent } from '../content/LandingContentContext.jsx';
import ScrollReveal from './ScrollReveal.jsx';

const pillarImages = [
  '/pillar_wedding.png',
  '/pillar_design.png',
  '/pillar_logistics.png',
  '/pillar_venues.png',
];

function Services() {
  const {
    content: { services },
  } = useLandingContent();

  return (
    <section className="py-section-y bg-surface-container-low" id="services">
      <div className="max-w-container-max mx-auto px-page-x">
        <div className="text-center mb-12 sm:mb-16 lg:mb-24">
          <span className="text-primary font-label-sm uppercase tracking-widest mb-4 block">
            THE FOUR PILLARS
          </span>
          <h2 className="font-headline-lg text-[clamp(1.65rem,4vw,2rem)] md:text-headline-lg text-center mx-auto text-balance">
            Signature Excellence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 h-auto lg:h-[800px]">
          {services.map((service, index) => {
            const isLarge = index === 0 || index === 3;
            const colSpanClass = isLarge ? 'md:col-span-8' : 'md:col-span-4';
            const bgImage = pillarImages[index] || '/queens-banquet-logo.svg';

            return (
              <ScrollReveal
                as="div"
                className={`${colSpanClass} group relative overflow-hidden bg-surface-container aspect-[4/3] sm:aspect-video md:aspect-auto min-h-[240px] md:min-h-0`}
                delay={index * 120}
                key={service.title}
                variant="fade-up"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${bgImage}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-12 text-white">
                  <span className="font-label-sm uppercase tracking-widest mb-2 opacity-80">
                    Pillar {['I', 'II', 'III', 'IV'][index]}
                  </span>
                  <h3 className="font-headline-md text-headline-md mb-2 sm:mb-4 text-[20px] sm:text-[24px] font-semibold text-balance">
                    {service.title}
                  </h3>
                  <p className="font-body-md max-w-md opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 leading-relaxed text-[14px] sm:text-[15px] line-clamp-4 md:line-clamp-none">
                    {service.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Services;
