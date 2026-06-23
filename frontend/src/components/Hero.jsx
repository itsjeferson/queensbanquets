import { CalendarCheck, HeartHandshake, MessageCircle } from 'lucide-react';
import { useLandingContent } from '../content/LandingContentContext.jsx';

function Hero() {
  const {
    content: { brand, heroContent, highlights },
  } = useLandingContent();

  return (
    <section className="hero" id="top">
      <div className="hero-content">
        <p className="eyebrow">{heroContent.eyebrow}</p>
        <h1>{heroContent.title}</h1>
        <p className="hero-copy">{heroContent.copy}</p>
        <p className="owner-line">Owned and managed by {brand.owner}</p>

        <div className="hero-actions">
          <a className="button button-primary" href="#contact">
            <CalendarCheck aria-hidden="true" size={19} strokeWidth={1.7} />
            {heroContent.primaryCta}
          </a>
          <a className="button button-secondary" href="#testimonials">
            <MessageCircle aria-hidden="true" size={19} strokeWidth={1.7} />
            {heroContent.secondaryCta}
          </a>
        </div>

        <dl className="hero-highlights" aria-label="Coordination highlights">
          {highlights.map((item) => (
            <div key={item.label}>
              <HeartHandshake aria-hidden="true" size={22} strokeWidth={1.6} />
              <dt>{item.value}</dt>
              <dd>{item.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="hero-card" aria-label="Queen's Banquet Events brand presentation">
        <img className="hero-logo" src={brand.logo} alt="Queen's Banquet Events" />
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
