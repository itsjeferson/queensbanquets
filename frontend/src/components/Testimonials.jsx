import { Quote } from 'lucide-react';
import { useLandingContent } from '../content/LandingContentContext.jsx';
import SectionHeading from './SectionHeading.jsx';

function Testimonials() {
  const {
    content: { testimonials },
  } = useLandingContent();

  return (
    <section className="section testimonials-section" id="testimonials">
      <SectionHeading eyebrow="Client testimonials" title="Words from couples and families.">
        A coordination service is trusted in the small details: timing,
        communication, supplier alignment, and calm guidance on the day itself.
      </SectionHeading>

      <div className="testimonial-grid">
        {testimonials.map((testimonial) => (
          <article className="testimonial-card" key={testimonial.quote}>
            <Quote aria-hidden="true" size={24} strokeWidth={1.5} />
            <p>&ldquo;{testimonial.quote}&rdquo;</p>
            <div>
              <strong>{testimonial.author}</strong>
              <span>{testimonial.event}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
