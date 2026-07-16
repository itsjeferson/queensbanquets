import { useEffect, useState, useMemo } from 'react';
import { Menu, X } from 'lucide-react';
import { useLandingContent } from '../content/LandingContentContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';

function Header() {
  const {
    content: { navigationItems },
  } = useLandingContent();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState('');

  const navItems = useMemo(() => {
    const raw = navigationItems || [];
    const hasServices = raw.some((item) => (item.label || '').toUpperCase() === 'SERVICES');
    if (hasServices) return raw;

    const items = [...raw];
    const aboutIdx = items.findIndex((item) => (item.label || '').toUpperCase().includes('ABOUT'));
    if (aboutIdx !== -1) {
      items.splice(aboutIdx + 1, 0, { label: 'SERVICES', href: '#services' });
    } else {
      items.push({ label: 'SERVICES', href: '#services' });
    }
    return items;
  }, [navigationItems]);

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
    const sections = navItems
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
  }, [navItems]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header
        className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}
      >
        <div
          className="w-full flex items-center justify-between transition-all duration-300"
        >
          <a
            className="font-headline-md text-primary italic cursor-pointer active:scale-95 transition-all text-lg sm:text-headline-md min-w-0 shrink truncate pr-2"
            href="#top"
            onClick={closeMenu}
          >
            <span className="sm:hidden">Queen's Banquet</span>
            <span className="hidden sm:inline">Queen's Banquet Events</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-10 shrink-0">
            {navItems.map((item) => {
              const isActive = activeHref === item.href || (item.href === '#top' && activeHref === '#home');
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`font-label-md text-label-md uppercase tracking-widest pb-1 transition-all duration-300 whitespace-nowrap ${
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

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <ThemeToggle compact className="hidden sm:inline-flex" />
            <a
              href="#contact"
              className="hidden xl:block px-6 py-2 border border-primary text-primary font-label-md uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-300 active:scale-95"
            >
              Request a Meeting
            </a>

            {/* Tablet / Mobile Menu Button */}
            <button
              className="lg:hidden text-on-surface hover:text-primary transition-colors p-2 -mr-1"
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

      {/* Mobile / Tablet Slide-over Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-[min(20rem,88vw)] bg-surface z-50 flex flex-col p-6 gap-6 transform transition-transform duration-300 ease-in-out lg:hidden border-l border-outline-variant/20 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] ${
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
          {navItems.map((item) => {
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
          <div className="pt-2 sm:hidden">
            <ThemeToggle />
          </div>
        </nav>
      </div>

      {/* Mobile / Tablet Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default Header;
