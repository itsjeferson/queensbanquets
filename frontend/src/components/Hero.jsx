import { highlights } from '../data/siteContent.js';

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-content">
        <p className="eyebrow">Wedding banquets and luxury celebrations</p>
        <h1>Where royal wedding moments become timeless celebrations.</h1>
        <p className="hero-copy">
          Queens Banquet blends grand reception styling, graceful hospitality,
          and refined planning for couples who want every detail to feel elegant,
          personal, and unforgettable.
        </p>

        <div className="hero-actions">
          <a className="button button-primary" href="#packages">
            Explore Packages
          </a>
          <a className="button button-secondary" href="#gallery">
            View Gallery
          </a>
        </div>

        <dl className="hero-highlights" aria-label="Venue highlights">
          {highlights.map((item) => (
            <div key={item.label}>
              <dt>{item.value}</dt>
              <dd>{item.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="hero-card" aria-label="Elegant wedding table arrangement">
        <div className="arch arch-large" />
        <div className="arch arch-small" />
        <div className="table-setting">
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}

export default Hero;
