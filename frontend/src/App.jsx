import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Experience from './components/Experience.jsx';
import Services from './components/Services.jsx';
import Packages from './components/Packages.jsx';
import Testimonials from './components/Testimonials.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import BackToTop from './components/BackToTop.jsx';
import PageLoader from './components/PageLoader.jsx';
import { useLandingContent } from './content/LandingContentContext.jsx';

function App() {
  const { isHydrating } = useLandingContent();
  const [bootLoading, setBootLoading] = useState(true);

  useEffect(() => {
    const minimumMs = 700;
    const started = performance.now();

    function finishWhenReady() {
      const elapsed = performance.now() - started;
      const wait = Math.max(0, minimumMs - elapsed);
      window.setTimeout(() => setBootLoading(false), wait);
    }

    if (document.readyState === 'complete') {
      finishWhenReady();
      return undefined;
    }

    window.addEventListener('load', finishWhenReady, { once: true });
    const fallback = window.setTimeout(finishWhenReady, 1800);

    return () => {
      window.removeEventListener('load', finishWhenReady);
      window.clearTimeout(fallback);
    };
  }, []);

  const showLoader = bootLoading || isHydrating;

  return (
    <>
      <PageLoader
        visible={showLoader}
        label={isHydrating ? 'Preparing your experience' : 'Opening Queen\'s Banquet'}
      />
      {!showLoader ? (
        <>
          <ScrollProgress />
          <Header />
          <div className="landing-splash" id="top">
            <Hero />
          </div>
          <main>
            <Experience />
            <Services />
            <Packages />
            <Testimonials />
            <Contact />
          </main>
          <Footer />
          <BackToTop />
        </>
      ) : null}
    </>
  );
}

export default App;
