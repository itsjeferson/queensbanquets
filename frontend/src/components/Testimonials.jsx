import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLandingContent } from '../content/LandingContentContext.jsx';
import ScrollReveal from './ScrollReveal.jsx';

function getInitials(author) {
  return (author || 'Client')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function TestimonialCard({ testimonial }) {
  const rating = Math.min(5, Math.max(1, Number(testimonial.rating) || 5));
  const initials = getInitials(testimonial.author);

  return (
    <article className="bg-surface-container/30 backdrop-blur-md border border-outline-variant/20 shadow-md p-6 sm:p-8 lg:p-10 flex flex-col items-center text-center h-full">
      <div className="mb-4 sm:mb-5">
        {testimonial.photoUrl ? (
          <img
            src={testimonial.photoUrl}
            alt={testimonial.author || 'Client portrait'}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-outline-variant/40 shadow-md"
          />
        ) : (
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-surface-container-highest border border-outline-variant/40 flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="font-headline-md text-primary text-lg sm:text-xl font-semibold">
              {initials || 'QB'}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-1 mb-4 sm:mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="material-symbols-outlined text-primary-container text-[18px] sm:text-[24px]"
            style={{ fontVariationSettings: i < rating ? "'FILL' 1" : "'FILL' 0" }}
          >
            star
          </span>
        ))}
      </div>

      <p className="font-body-lg italic text-on-surface mb-6 sm:mb-8 leading-relaxed text-[1rem] sm:text-body-lg text-pretty flex-1">
        "{testimonial.quote}"
      </p>

      <div className="mt-auto">
        <div className="font-label-md uppercase tracking-widest text-primary font-medium text-[13px] sm:text-[14px]">
          {testimonial.author}
        </div>
        <div className="font-label-sm opacity-60 text-[11px] sm:text-[12px] mt-1">
          {testimonial.event}
        </div>
      </div>
    </article>
  );
}

function Testimonials() {
  const {
    content: { testimonials },
  } = useLandingContent();
  const scrollerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const backgroundUrl =
    'https://lh3.googleusercontent.com/aida/AP1WRLujnsmLns5rwFdqhowmKgvMfRuOE4a8ukJ-qBu5OLEQWYowinlozxK5MItuU_lSjnnccGj4DTSyLpl4wCmGLdufLjpuUTPtLI2Inwwwargsvgodg7iHiZecgbEVgkHUJ00y3RZ0yy9sYF8pjhcIjm8LfbwgyBvoE0wUp_cVZAWt8uTo6l9OscPnheLaQ-K7MQwkm7pkwnnCxALve8NJO63r4XtQVN4o_WcEU9eUJh4M0NIXATqKW8FxZds';

  const useSideScroll = testimonials.length >= 3;

  function updateScrollState() {
    const node = scrollerRef.current;
    if (!node) {
      return;
    }

    const maxScrollLeft = node.scrollWidth - node.clientWidth;
    setCanScrollLeft(node.scrollLeft > 8);
    setCanScrollRight(node.scrollLeft < maxScrollLeft - 8);
  }

  useEffect(() => {
    if (!useSideScroll) {
      return undefined;
    }

    const node = scrollerRef.current;
    if (!node) {
      return undefined;
    }

    updateScrollState();
    node.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      node.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [useSideScroll, testimonials.length]);

  function scrollByCard(direction) {
    const node = scrollerRef.current;
    if (!node) {
      return;
    }

    const card = node.querySelector('[data-testimonial-card]');
    const gap = 24;
    const amount = (card?.getBoundingClientRect().width || 320) + gap;
    node.scrollBy({ left: direction * amount, behavior: 'smooth' });
  }

  if (!testimonials.length) {
    return null;
  }

  return (
    <section className="relative py-section-y overflow-hidden" id="testimonials">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${backgroundUrl}')` }}
        />
        <div className="absolute inset-0 bg-background/55 dark:bg-background/70 backdrop-blur-sm" />
      </div>

      <div className="max-w-container-max mx-auto px-page-x relative z-10">
        <div className="text-center mb-10 sm:mb-14 lg:mb-20">
          <span className="text-primary font-label-sm uppercase tracking-widest mb-4 block">
            Client Reflections
          </span>
          <h2 className="font-headline-lg text-[clamp(1.65rem,4vw,2rem)] md:text-headline-lg mb-4 sm:mb-6 text-center mx-auto text-balance">
            Praise from the Discerning
          </h2>
          {useSideScroll ? (
            <p className="font-body-md text-on-surface-variant text-sm max-w-xl mx-auto">
              Swipe or use the arrows to browse every client reflection.
            </p>
          ) : null}
        </div>

        {useSideScroll ? (
          <div className="relative">
            <button
              type="button"
              className="absolute left-0 top-1/2 z-20 -translate-y-1/2 -translate-x-1 sm:-translate-x-3 hidden sm:grid place-items-center w-10 h-10 rounded-full border border-outline-variant/40 bg-surface/90 text-on-surface shadow-md backdrop-blur-md transition disabled:opacity-30 disabled:pointer-events-none hover:border-primary hover:text-primary"
              aria-label="Previous testimonials"
              disabled={!canScrollLeft}
              onClick={() => scrollByCard(-1)}
            >
              <ChevronLeft size={20} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              className="absolute right-0 top-1/2 z-20 -translate-y-1/2 translate-x-1 sm:translate-x-3 hidden sm:grid place-items-center w-10 h-10 rounded-full border border-outline-variant/40 bg-surface/90 text-on-surface shadow-md backdrop-blur-md transition disabled:opacity-30 disabled:pointer-events-none hover:border-primary hover:text-primary"
              aria-label="Next testimonials"
              disabled={!canScrollRight}
              onClick={() => scrollByCard(1)}
            >
              <ChevronRight size={20} strokeWidth={1.75} />
            </button>

            <div
              ref={scrollerRef}
              className="testimonials-scroller flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 -mx-1 px-1"
              aria-label="Client testimonials"
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={`${testimonial.author}-${index}`}
                  data-testimonial-card
                  className="snap-start shrink-0 w-[min(85vw,19.5rem)] sm:w-[21.5rem] lg:w-[23rem]"
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${testimonials.length === 1 ? 'max-w-md mx-auto grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {testimonials.map((testimonial, index) => (
              <ScrollReveal
                as="div"
                delay={index * 120}
                key={`${testimonial.author}-${index}`}
                variant="fade-up"
              >
                <TestimonialCard testimonial={testimonial} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Testimonials;
