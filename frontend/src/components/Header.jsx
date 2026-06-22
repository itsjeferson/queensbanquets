import { navigationItems } from '../data/siteContent.js';

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Queens Banquet home">
        <span className="brand-mark">QB</span>
        <span>
          Queens
          <strong>Banquet</strong>
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
        Reserve a Date
      </a>
    </header>
  );
}

export default Header;
