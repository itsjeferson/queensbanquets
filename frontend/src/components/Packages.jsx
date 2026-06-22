import { packages } from '../data/siteContent.js';
import SectionHeading from './SectionHeading.jsx';

function Packages() {
  return (
    <section className="section" id="packages">
      <SectionHeading eyebrow="Celebration tiers" title="Packages prepared for future booking workflows.">
        These cards can later map directly to API-provided package records and
        booking availability.
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
                <li key={feature}>{feature}</li>
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
