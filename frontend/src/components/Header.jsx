import { useEffect, useState } from 'react';
import { CalendarCheck, CalendarDays, Gift, Menu, MessageCircleHeart, Sparkles, SquareCheckBig, X } from 'lucide-react';
import { useLandingContent } from '../content/LandingContentContext.jsx';

const navIcons = {
  '#experience': Sparkles,
  '#services': SquareCheckBig,
  '#testimonials': MessageCircleHeart,
  '#packages': Gift,
  '#contact': CalendarCheck,
};

function Header() {
  const {
    content: { brand, navigationItems },
  } = useLandingContent();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState('');

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 24);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = navigationItems
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);

    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveHref(`#${visible.target.id}`);
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [navigationItems]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header
        className={`site-header${menuOpen ? ' site-header-menu-open' : ''}${isScrolled ? ' is-scrolled' : ''}`}
      >
        <a className="brand" href="#top" aria-label="Queen's Banquet Events home" onClick={closeMenu}>
          <img className="brand-logo" src={brand.logo} alt="" />
          <span>
            Queen's
            <strong>Banquet Events</strong>
          </span>
        </a>

        <button
          className="site-menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? (
            <X aria-hidden="true" size={20} strokeWidth={1.7} />
          ) : (
            <Menu aria-hidden="true" size={20} strokeWidth={1.7} />
          )}
        </button>

        <nav className={`site-nav${menuOpen ? ' is-open' : ''}`} id="site-menu" aria-label="Primary navigation">
          <span className="site-nav-label">Menu</span>
          {navigationItems.map((item) => {
            const Icon = navIcons[item.href];

            return (
              <a
                key={item.href}
                href={item.href}
                className={activeHref === item.href ? 'is-active' : ''}
                onClick={closeMenu}
              >
                {Icon ? (
                  <span className="nav-link-icon">
                    <Icon aria-hidden="true" size={18} strokeWidth={1.7} />
                  </span>
                ) : null}
                {item.label}
              </a>
            );
          })}
          <a className="nav-cta" href="#contact" onClick={closeMenu}>
            <CalendarDays aria-hidden="true" size={18} strokeWidth={1.7} />
            Reserve a Date
          </a>
        </nav>
      </header>

      {menuOpen ? (
        <button
          className="site-menu-backdrop"
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenu}
        />
      ) : null}
    </>
  );
}

export default Header;
