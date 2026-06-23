import { CalendarDays } from 'lucide-react';
import { useLandingContent } from '../content/LandingContentContext.jsx';

function Header() {
  const {
    content: { brand, navigationItems },
  } = useLandingContent();

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Queen's Banquet Events home">
        <img className="brand-logo" src={brand.logo} alt="" />
        <span>
          Queen's
          <strong>Banquet Events</strong>
        </span>
      </a>

      <nav className="site-nav" aria-label="Primary navigation">
        {navigationItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <a className="nav-cta" href="#contact">
        <CalendarDays aria-hidden="true" size={18} strokeWidth={1.7} />
        Reserve a Date
      </a>
    </header>
  );
}

export default Header;
