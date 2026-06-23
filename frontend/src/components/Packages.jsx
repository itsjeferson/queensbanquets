import { CheckCircle2 } from 'lucide-react';
import { useLandingContent } from '../content/LandingContentContext.jsx';
import SectionHeading from './SectionHeading.jsx';

function Packages() {
  const {
    content: { packages },
  } = useLandingContent();

  return (
    <section className="section" id="packages">
      <SectionHeading eyebrow="Coordination packages" title="Choose the level of guidance you need.">
        Start with a planning consultation, book coordination for the wedding
        day, or request fuller support for meetings, timelines, and program flow.
      </SectionHeading>

      <div className="package-grid">
        {packages.map((eventPackage) => (
          <article
            className={`package-card${eventPackage.featured ? ' package-card-featured' : ''}`}
            key={eventPackage.name}
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
          </article>
        ))}
      </div>
    </section>
  );
}

export default Packages;
