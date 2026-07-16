import { useEffect, useState } from 'react';

function PageLoader({
  visible = true,
  label = 'Loading',
  variant = 'fullscreen',
  brand = "Queen's Banquet",
}) {
  const [mounted, setMounted] = useState(visible);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      setLeaving(false);
      return undefined;
    }

    if (!mounted) {
      return undefined;
    }

    setLeaving(true);
    const timer = window.setTimeout(() => {
      setMounted(false);
      setLeaving(false);
    }, 320);

    return () => window.clearTimeout(timer);
  }, [visible, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`page-loader page-loader--${variant}${leaving ? ' is-leaving' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="page-loader__panel">
        <div className="page-loader__mark" aria-hidden="true">
          <span className="page-loader__ring" />
          <span className="page-loader__ring page-loader__ring--delay" />
          <span className="page-loader__diamond" />
        </div>
        <p className="page-loader__brand">{brand}</p>
        <p className="page-loader__label">{label}</p>
        <div className="page-loader__bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}

export default PageLoader;
