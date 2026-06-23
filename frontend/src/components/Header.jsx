import { useEffect, useState } from 'react';
import { CalendarDays, Menu, X } from 'lucide-react';
import { useLandingContent } from '../content/LandingContentContext.jsx';

function Header() {
  const {
    content: { brand, navigationItems },
  } = useLandingContent();
  const [menuOpen, setMenuOpen] = useState(false);

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

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className={`site-header${menuOpen ? ' site-header-menu-open' : ''}`}>
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
          {navigationItems.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <a className="nav-cta nav-cta-mobile" href="#contact" onClick={closeMenu}>
            <CalendarDays aria-hidden="true" size={18} strokeWidth={1.7} />
            Reserve a Date
          </a>
        </nav>

        <a className="nav-cta nav-cta-desktop" href="#contact">
          <CalendarDays aria-hidden="true" size={18} strokeWidth={1.7} />
          Reserve a Date
        </a>
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
