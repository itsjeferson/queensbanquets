import { useLandingContent } from '../content/LandingContentContext.jsx';
import ScrollReveal from './ScrollReveal.jsx';

function Footer() {
  const {
    content: { footerContent },
  } = useLandingContent();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full relative mt-12 sm:mt-20 bg-surface-container-lowest border-t border-outline-variant/10 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-container-max mx-auto px-page-x py-12 sm:py-16 lg:py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 lg:gap-gutter">
        
        {/* Brand & Info */}
        <ScrollReveal as="div" className="flex flex-col sm:col-span-2 md:col-span-1" variant="fade-up">
          <div className="font-headline-lg text-[clamp(1.5rem,4vw,2rem)] md:text-headline-lg text-primary mb-4 italic text-balance">
            Queen's Banquet Events
          </div>
          <p className="font-body-md text-tertiary max-w-sm mb-8 leading-relaxed text-pretty">
            {footerContent.tagline ||
              "Curating the world's most exclusive celebrations with precision and artistic flair since 1994."}
          </p>
          <div className="flex gap-4 sm:gap-6">
            <a
              className="text-tertiary hover:text-primary transition-colors duration-200 flex items-center justify-center w-10 h-10 border border-outline-variant/30 rounded-full hover:border-primary"
              href="#"
              aria-label="Instagram"
            >
              <span className="material-symbols-outlined text-[20px]">camera</span>
            </a>
            <a
              className="text-tertiary hover:text-primary transition-colors duration-200 flex items-center justify-center w-10 h-10 border border-outline-variant/30 rounded-full hover:border-primary"
              href="#"
              aria-label="Website"
            >
              <span className="material-symbols-outlined text-[20px]">public</span>
            </a>
            <a
              className="text-tertiary hover:text-primary transition-colors duration-200 flex items-center justify-center w-10 h-10 border border-outline-variant/30 rounded-full hover:border-primary"
              href="mailto:queensbanquet07@gmail.com"
              aria-label="Email"
            >
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </a>
          </div>
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
