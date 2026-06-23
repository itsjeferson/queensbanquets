import { ClipboardCheck } from 'lucide-react';
import { useLandingContent } from '../content/LandingContentContext.jsx';
import SectionHeading from './SectionHeading.jsx';

function Services() {
  const {
    content: { services },
  } = useLandingContent();

  return (
    <section className="section" id="services">
      <SectionHeading eyebrow="Coordination services" title="Support for the flow of your celebration.">
        Choose consultation, on-the-day coordination, or fuller planning support
        depending on what your wedding or event still needs.
      </SectionHeading>

      <div className="card-grid">
        {services.map((service, index) => (
          <article className="service-card" key={service.title}>
            <span>
              <ClipboardCheck aria-hidden="true" size={22} strokeWidth={1.6} />
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Services;
