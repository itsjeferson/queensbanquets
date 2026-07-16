import { Mail } from 'lucide-react';
import { useLandingContent } from '../content/LandingContentContext.jsx';
import ScrollReveal from './ScrollReveal.jsx';

const SOCIAL_ICON_CLASS =
  'text-tertiary hover:text-primary transition-colors duration-200 flex items-center justify-center w-10 h-10 border border-outline-variant/30 rounded-full hover:border-primary';

function findChannel(channels, ...labels) {
  const normalized = labels.map((label) => label.toLowerCase());
  return channels.find((channel) => normalized.includes((channel.label || '').toLowerCase()));
}

function digitsOnly(value = '') {
  return value.replace(/\D/g, '');
}

function resolveChannelHref(channel) {
  if (!channel) {
    return null;
  }

  if (channel.href?.trim()) {
    return channel.href.trim();
  }

  const label = (channel.label || '').toLowerCase();
  const value = (channel.value || '').trim();

  if (!value) {
    return null;
  }

  if (label === 'email') {
    return `mailto:${value}`;
  }

  if (label === 'viber') {
    const digits = digitsOnly(value);
    const normalized = digits.startsWith('63') ? digits : `63${digits.replace(/^0/, '')}`;
    return normalized ? `viber://chat?number=${normalized}` : null;
  }

  if (label === 'facebook') {
    if (/^https?:\/\//i.test(value)) {
      return value;
    }
    return `https://www.facebook.com/${encodeURIComponent(value.replace(/^@/, ''))}`;
  }

  if (label === 'mobile' || label === 'landline' || label === 'phone') {
    const digits = digitsOnly(value);
    return digits ? `tel:+${digits.startsWith('63') ? digits : `63${digits.replace(/^0/, '')}`}` : null;
  }

  return null;
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function ViberIcon() {
  return (
    <svg aria-hidden="true" className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 2.079.547 4.031 1.507 5.729L.028 24l6.437-1.508c1.658.914 3.561 1.436 5.551 1.436 6.62 0 11.987-5.367 11.987-11.987C23.991 5.367 18.624.001 12.017.001zm.015 2.166c5.321 0 9.66 4.339 9.66 9.66s-4.339 9.66-9.66 9.66a9.527 9.527 0 0 1-4.426-1.088l-.318-.168-3.838.896.908-3.744-.184-.306a9.618 9.618 0 0 1-1.49-5.25c0-5.321 4.339-9.66 9.66-9.66z" />
    </svg>
  );
}

function Footer() {
  const {
    content: { footerContent, contactChannels = [], brand },
  } = useLandingContent();
  const year = new Date().getFullYear();
  const brandName = brand?.name || "Queen's Banquet Events";

  const ownerChannel = findChannel(contactChannels, 'Owner');
  const ownerName = ownerChannel?.value?.trim() || brand?.owner?.trim() || 'Marou Madrid';

  const facebookChannel = findChannel(contactChannels, 'Facebook');
  const viberChannel = findChannel(contactChannels, 'Viber');
  const emailChannel = findChannel(contactChannels, 'Email');

  const facebookHref = resolveChannelHref(facebookChannel);
  const viberHref = resolveChannelHref(viberChannel);
  const emailHref = resolveChannelHref(emailChannel);

  const socialLinks = [
    facebookHref && {
      key: 'facebook',
      href: facebookHref,
      label: `Facebook — ${facebookChannel?.value || "Queen's Banquet Events"}`,
      icon: <FacebookIcon />,
    },
    viberHref && {
      key: 'viber',
      href: viberHref,
      label: `Viber — ${viberChannel?.value || 'Contact on Viber'}`,
      icon: <ViberIcon />,
    },
    emailHref && {
      key: 'email',
      href: emailHref,
      label: `Email — ${emailChannel?.value || 'queensbanquet07@gmail.com'}`,
      icon: <Mail size={18} strokeWidth={1.75} aria-hidden="true" />,
    },
  ].filter(Boolean);

  return (
    <footer className="w-full relative mt-12 sm:mt-20 bg-surface-container-lowest border-t border-outline-variant/10 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-container-max mx-auto px-page-x py-12 sm:py-16 lg:py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 lg:gap-gutter">
        
        {/* Brand & Info */}
        <ScrollReveal as="div" className="flex flex-col sm:col-span-2 md:col-span-1" variant="fade-up">
          <a
            href="#top"
            className="font-headline-lg text-[clamp(1.5rem,4vw,2rem)] md:text-headline-lg text-primary mb-4 italic text-balance w-fit hover:text-primary-container transition-colors"
          >
            {brandName}
          </a>
          <p className="font-body-md text-tertiary max-w-sm mb-4 leading-relaxed text-pretty">
            {footerContent.tagline ||
              "Curating the world's most exclusive celebrations with precision and artistic flair since 1994."}
          </p>
          <p className="font-body-md text-on-surface mb-8 leading-relaxed">
            <span className="text-on-surface-variant">Owner: </span>
            <span className="text-primary font-medium">{ownerName}</span>
          </p>
          {socialLinks.length > 0 ? (
            <div className="flex gap-4 sm:gap-6">
              {socialLinks.map((link) => (
                <a
                  key={link.key}
                  className={SOCIAL_ICON_CLASS}
                  href={link.href}
                  aria-label={link.label}
                  target={link.key === 'email' ? undefined : '_blank'}
                  rel={link.key === 'email' ? undefined : 'noopener noreferrer'}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          ) : null}
        </ScrollReveal>

        {/* Links */}
        <ScrollReveal as="div" className="grid grid-cols-2 gap-8" variant="fade-up" delay={100}>
          <div>
            <h4 className="font-label-md uppercase tracking-widest text-on-surface mb-6 text-[14px] font-semibold">
              Company
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  className="font-body-md text-tertiary hover:text-primary transition-colors hover:underline decoration-primary/30 underline-offset-8 text-[15px]"
                  href="#services"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  className="font-body-md text-tertiary hover:text-primary transition-colors hover:underline decoration-primary/30 underline-offset-8 text-[15px]"
                  href="#packages"
                >
                  Packages
                </a>
              </li>
              <li>
                <a
                  className="font-body-md text-tertiary hover:text-primary transition-colors hover:underline decoration-primary/30 underline-offset-8 text-[15px]"
                  href="#about"
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-md uppercase tracking-widest text-on-surface mb-6 text-[14px] font-semibold">
              Legal
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  className="font-body-md text-tertiary hover:text-primary transition-colors hover:underline decoration-primary/30 underline-offset-8 text-[15px]"
                  href="#"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  className="font-body-md text-tertiary hover:text-primary transition-colors hover:underline decoration-primary/30 underline-offset-8 text-[15px]"
                  href="#"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </ScrollReveal>

        {/* Newsletter */}
        <ScrollReveal as="div" className="flex flex-col sm:col-span-2 md:col-span-1" variant="fade-up" delay={200}>
          <h4 className="font-label-md uppercase tracking-widest text-on-surface mb-6 text-[14px] font-semibold">
            The Chronicle
          </h4>
          <p className="font-body-md text-tertiary mb-6 text-[15px] leading-relaxed text-pretty">
            Subscribe to our seasonal editorial on luxury trends and event artistry.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="relative">
            <input
              className="w-full bg-surface-container-high border-none py-4 px-6 pr-14 focus:ring-1 focus:ring-primary-container text-body-md text-on-surface text-[16px]"
              placeholder="Your email"
              type="email"
              required
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:scale-110 transition-all"
              aria-label="Subscribe"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>
        </ScrollReveal>

      </div>
      <div className="max-w-container-max mx-auto px-page-x py-6 sm:py-8 border-t border-outline-variant/10 text-center">
        <span className="font-body-md text-tertiary opacity-60 text-[13px] sm:text-[14px]">
          © {year} Queen's Banquet Events. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
