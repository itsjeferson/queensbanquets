import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > window.innerHeight * 0.6);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <button
      className={`back-to-top${isVisible ? ' is-visible' : ''}`}
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      tabIndex={isVisible ? 0 : -1}
    >
      <ArrowUp aria-hidden="true" size={20} strokeWidth={2} />
    </button>
  );
}

export default BackToTop;
