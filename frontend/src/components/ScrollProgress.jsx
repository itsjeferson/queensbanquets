import { useEffect, useState } from 'react';

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const maxScroll = scrollHeight - clientHeight;
      setProgress(maxScroll > 0 ? Math.min(100, (scrollTop / maxScroll) * 100) : 0);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return <div className="scroll-progress" style={{ width: `${progress}%` }} aria-hidden="true" />;
}

export default ScrollProgress;
