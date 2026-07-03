import { CheckCircle2 } from 'lucide-react';
import { useLandingContent } from '../content/LandingContentContext.jsx';
import ScrollReveal from './ScrollReveal.jsx';
import SectionHeading from './SectionHeading.jsx';

function Packages() {
  const {
    content: { packages },
  } = useLandingContent();

  return (
    <section className="section" id="packages">
      <div className="section-inner">
        <SectionHeading eyebrow="Coordination packages" title="Choose the level of guidance you need.">
          Start with a planning consultation, book coordination for the wedding
          day, or request fuller support for meetings, timelines, and program flow.
        </SectionHeading>

        <div className="package-grid">
          {packages.map((eventPackage, index) => (
            <ScrollReveal
              as="article"
              className={`package-card${eventPackage.featured ? ' package-card-featured theme-dark' : ''}`}
              delay={index * 120}
              key={eventPackage.name}
              variant="fade-up"
            >
              <p>{eventPackage.price}</p>
              <h3>{eventPackage.name}</h3>
              <ul>
                {eventPackage.features.map((feature) => (
                  <li key={feature}>
                    <CheckCircle2 aria-hidden="true" size={17} strokeWidth={1.7} />
                    {feature}
                  </li>
                ))}
              </ul>
              <a href="#contact">Request details</a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Packages;
