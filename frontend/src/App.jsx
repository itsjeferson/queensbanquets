import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Experience from './components/Experience.jsx';
import Services from './components/Services.jsx';
import Gallery from './components/Gallery.jsx';
import Packages from './components/Packages.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Experience />
        <Services />
        <Gallery />
        <Packages />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
