import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Experience from './components/Experience.jsx';
import Services from './components/Services.jsx';
import Gallery from './components/Gallery.jsx';
import Packages from './components/Packages.jsx';
import Testimonials from './components/Testimonials.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import BackToTop from './components/BackToTop.jsx';

function App() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <div className="landing-splash theme-dark" id="top">
        <Hero />
      </div>
      <main>
        <Experience />
        <Services />
        <Gallery />
        <Testimonials />
        <Packages />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

export default App;
