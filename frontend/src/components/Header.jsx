import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLandingContent } from '../content/LandingContentContext.jsx';

function Header() {
  const {
    content: { navigationItems },
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
      setIsScrolled(window.scrollY > 50);
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
        className={`w-full top-0 sticky z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 transition-all duration-300 ${
          isScrolled ? 'shadow-xl bg-surface/95' : 'shadow-sm'
        }`}
      >
        <div
          className={`max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex items-center justify-between transition-all duration-300 ${
            isScrolled ? 'h-20' : 'h-24'
          }`}
        >
          <a
            className="font-headline-md text-headline-md text-primary italic cursor-pointer active:scale-95 transition-all"
            href="#top"
            onClick={closeMenu}
          >
            Queen's Banquet Events
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navigationItems.map((item) => {
              const isActive = activeHref === item.href || (item.href === '#top' && activeHref === '#home');
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`font-label-md text-label-md uppercase tracking-widest pb-1 transition-all duration-300 ${
                    isActive
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-on-surface-variant hover:text-primary border-b-2 border-transparent'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className="hidden lg:block px-6 py-2 border border-primary text-primary font-label-md uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-300 active:scale-95"
            >
              Request a Meeting
            </a>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-on-surface hover:text-primary transition-colors p-2"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setMenuOpen((current) => !current)}
            >
              {menuOpen ? (
                <X aria-hidden="true" size={24} strokeWidth={1.5} />
              ) : (
                <Menu aria-hidden="true" size={24} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-over Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-surface z-50 flex flex-col p-6 gap-6 transform transition-transform duration-300 ease-in-out md:hidden border-l border-outline-variant/20 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        id="site-menu"
      >
        <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
          <span className="font-headline-md text-primary italic">Menu</span>
          <button
            onClick={closeMenu}
            aria-label="Close navigation menu"
            className="p-1 text-on-surface-variant hover:text-primary"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>
        <nav className="flex flex-col gap-6" aria-label="Mobile navigation">
          {navigationItems.map((item) => {
            const isActive = activeHref === item.href || (item.href === '#top' && activeHref === '#home');
            return (
              <a
                key={item.href}
                href={item.href}
                className={`font-label-md text-label-md uppercase tracking-widest py-2 transition-all ${
                  isActive ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'
                }`}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            );
          })}
          <a
            href="#contact"
            className="mt-4 w-full py-3 text-center border border-primary text-primary font-label-md uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all active:scale-95"
            onClick={closeMenu}
          >
            Request a Meeting
          </a>
        </nav>
      </div>

      {/* Mobile Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default Header;
