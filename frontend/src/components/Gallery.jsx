import { galleryMoments } from '../data/siteContent.js';
import SectionHeading from './SectionHeading.jsx';

function Gallery() {
  return (
    <section className="section gallery-section" id="gallery">
      <SectionHeading eyebrow="Portfolio" title="A glimpse into the Queens Banquet atmosphere.">
        The visual system uses layered black, antique gold, and warm ivory to
        evoke a luxury wedding venue without relying on stock photography.
      </SectionHeading>

      <div className="gallery-grid">
        {galleryMoments.map((moment, index) => (
          <article className={`gallery-card gallery-card-${index + 1}`} key={moment}>
            <span>{moment}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Gallery;
