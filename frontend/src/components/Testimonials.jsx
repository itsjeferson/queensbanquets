import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useLandingContent } from '../content/LandingContentContext.jsx';
import SectionHeading from './SectionHeading.jsx';

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function Testimonials() {
  const {
    content: { testimonials },
  } = useLandingContent();
  const [activeIndex, setActiveIndex] = useState(0);
  const [brokenPhotos, setBrokenPhotos] = useState({});

  if (!testimonials.length) {
    return null;
  }

  const activeTestimonial = testimonials[activeIndex] ?? testimonials[0];

  function goToPrevious() {
    setActiveIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1));
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  }

  return (
    <section className="section testimonials-section" id="testimonials">
      <SectionHeading eyebrow="Client testimonials" title="Words from couples and families.">
        A coordination service is trusted in the small details: timing,
        communication, supplier alignment, and calm guidance on the day itself.
      </SectionHeading>

      <div className="carousel-shell testimonial-carousel" aria-live="polite">
        <button className="carousel-button" type="button" onClick={goToPrevious} aria-label="Previous testimonial">
          <ChevronLeft aria-hidden="true" size={22} strokeWidth={1.6} />
        </button>

        <article className="testimonial-card testimonial-card-active">
          <div className="testimonial-photo">
            {activeTestimonial.photoUrl && !brokenPhotos[activeIndex] ? (
              <img
                src={activeTestimonial.photoUrl}
                alt={`${activeTestimonial.author} testimonial`}
                onError={() => setBrokenPhotos((current) => ({ ...current, [activeIndex]: true }))}
              />
            ) : (
              <span>{getInitials(activeTestimonial.author)}</span>
            )}
          </div>

          <div className="testimonial-copy">
            <Quote aria-hidden="true" size={24} strokeWidth={1.5} />
            <p>&ldquo;{activeTestimonial.quote}&rdquo;</p>
            <div>
              <strong>{activeTestimonial.author}</strong>
              <span>{activeTestimonial.event}</span>
            </div>
          </div>
        </article>

        <button className="carousel-button" type="button" onClick={goToNext} aria-label="Next testimonial">
          <ChevronRight aria-hidden="true" size={22} strokeWidth={1.6} />
        </button>
      </div>

      <div className="carousel-dots" aria-label="Choose testimonial">
        {testimonials.map((testimonial, index) => (
          <button
            className={index === activeIndex ? 'active' : ''}
            key={`${testimonial.author}-${testimonial.event}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Show testimonial ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
