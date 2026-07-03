import { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useLandingContent } from '../content/LandingContentContext.jsx';
import ScrollReveal from './ScrollReveal.jsx';
import SectionHeading from './SectionHeading.jsx';

function Gallery() {
  const {
    content: { galleryMoments },
  } = useLandingContent();
  const [activeIndex, setActiveIndex] = useState(0);

  if (!galleryMoments.length) {
    return null;
  }

  const activeMoment = galleryMoments[activeIndex] ?? galleryMoments[0];

  function goToPrevious() {
    setActiveIndex((current) => (current === 0 ? galleryMoments.length - 1 : current - 1));
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % galleryMoments.length);
  }

  return (
    <section className="section section-dark gallery-section" id="gallery">
      <div className="section-inner">
        <SectionHeading eyebrow="Coordination moments" title="The quiet details that make events feel effortless.">
          From supplier briefing to ceremony cues, coordination keeps each moment
          clear while the couple and guests enjoy the celebration.
        </SectionHeading>

        <ScrollReveal variant="fade-up">
          <div className="carousel-shell gallery-carousel" aria-live="polite">
            <button className="carousel-button" type="button" onClick={goToPrevious} aria-label="Previous moment">
              <ChevronLeft aria-hidden="true" size={22} strokeWidth={1.6} />
            </button>

            <article className="gallery-card gallery-card-active" key={activeIndex}>
              <Sparkles aria-hidden="true" size={28} strokeWidth={1.5} />
              <span>{activeMoment}</span>
              <p>
                {activeMoment} is prepared with clear timing, supplier communication,
                and calm guidance from Queen&apos;s Banquet Events.
              </p>
            </article>

            <button className="carousel-button" type="button" onClick={goToNext} aria-label="Next moment">
              <ChevronRight aria-hidden="true" size={22} strokeWidth={1.6} />
            </button>
          </div>

          <div className="carousel-dots" aria-label="Choose coordination moment">
            {galleryMoments.map((moment, index) => (
              <button
                className={index === activeIndex ? 'active' : ''}
                key={moment}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show ${moment}`}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default Gallery;
