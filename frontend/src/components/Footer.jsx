import { CalendarClock, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import { useLandingContent } from '../content/LandingContentContext.jsx';
import ScrollReveal from './ScrollReveal.jsx';

const contactIcons = {
  Owner: UserRound,
  Viber: Phone,
  Mobile: Phone,
  Landline: Phone,
  Email: Mail,
};

function Footer() {
  const {
    content: { brand, navigationItems, contactChannels, footerContent },
  } = useLandingContent();
  const year = new Date().getFullYear();

  return (
    <ScrollReveal as="footer" className="site-footer theme-dark" variant="fade-up">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <img className="site-footer-logo" src={brand.logo} alt="" />
          <p className="site-footer-title">{brand.name}</p>
          <p className="site-footer-tagline">{footerContent.tagline}</p>
        </div>

        <nav className="site-footer-nav" aria-label="Footer navigation">
          <span className="site-footer-heading">Explore</span>
          <ul>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer-details">
          <span className="site-footer-heading">Get in touch</span>
          <ul className="footer-contact-list">
            {contactChannels.map((channel) => {
              const Icon = contactIcons[channel.label] ?? CalendarClock;

              return (
                <li key={channel.label}>
                  <span>
                    <Icon aria-hidden="true" size={18} strokeWidth={1.6} />
                    {channel.label}
                  </span>
                  {channel.href ? (
                    <a href={channel.href}>{channel.value}</a>
                  ) : (
                    <strong>{channel.value}</strong>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="site-footer-address">
            <span>
              <MapPin aria-hidden="true" size={18} strokeWidth={1.6} />
              Address
            </span>
            <address>
              <a href={footerContent.mapsUrl} target="_blank" rel="noreferrer">
                {footerContent.address}
              </a>
            </address>
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <p>&copy; {year} {brand.name}. All rights reserved.</p>
      </div>
    </ScrollReveal>
  );
}

export default Footer;
