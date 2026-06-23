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
    content: { brand, contactChannels, footerContent },
  } = useLandingContent();

  return (
    <ScrollReveal as="footer" className="site-footer" variant="fade-up">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <img className="site-footer-logo" src={brand.logo} alt="" />
          <p className="site-footer-title">{brand.name}</p>
          <p className="site-footer-tagline">{footerContent.tagline}</p>
        </div>

        <div className="site-footer-details">
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
    </ScrollReveal>
  );
}

export default Footer;
