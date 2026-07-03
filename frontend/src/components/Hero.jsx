import { useEffect, useRef } from 'react';
import { CalendarCheck, HeartHandshake, MessageCircle } from 'lucide-react';
import { useLandingContent } from '../content/LandingContentContext.jsx';

function Hero() {
  const {
    content: { brand, heroContent, highlights },
  } = useLandingContent();

  const heroRef = useRef(null);
  const archLargeRef = useRef(null);
  const archSmallRef = useRef(null);
  const tableRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    let frameId = null;

    function applyParallax() {
      frameId = null;
      const section = heroRef.current;
      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / (rect.height || 1), 0), 1);

      if (archLargeRef.current) {
        archLargeRef.current.style.transform = `translateY(${progress * 46}px)`;
      }
      if (archSmallRef.current) {
        archSmallRef.current.style.transform = `translateY(${progress * -34}px)`;
      }
      if (tableRef.current) {
        tableRef.current.style.transform = `translateY(${progress * 58}px)`;
      }
      if (logoRef.current) {
        logoRef.current.style.transform = `translateX(-50%) translateY(${progress * -20}px)`;
      }
    }

    function handleScroll() {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(applyParallax);
      }
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section className="hero" ref={heroRef}>
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
          {highlights.map((item, index) => (
            <div key={item.label} style={{ '--pop-delay': `${520 + index * 140}ms` }}>
              <HeartHandshake aria-hidden="true" size={22} strokeWidth={1.6} />
              <dt>{item.value}</dt>
              <dd>{item.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="hero-card" aria-label="Queen's Banquet Events brand presentation">
        <img className="hero-logo" ref={logoRef} src={brand.logo} alt="Queen's Banquet Events" />
        <div className="arch arch-large" ref={archLargeRef} />
        <div className="arch arch-small" ref={archSmallRef} />
        <div className="table-setting" ref={tableRef}>
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}

export default Hero;
