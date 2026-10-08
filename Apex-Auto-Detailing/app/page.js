import { getSiteMarkup } from '../lib/site-markup';
import SiteInteractions from '../components/SiteInteractions';
import Loader from '../components/Loader';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Process from '../components/Process';
import Packages from '../components/Packages';
import Gallery from '../components/Gallery';
import Reviews from '../components/Reviews';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <SiteInteractions>
      <Loader markup={getSiteMarkup('#wx-loader')} />
      <Header markup={getSiteMarkup('#site-header')} />
      <Hero markup={getSiteMarkup('#hero')} />
      <About markup={getSiteMarkup('#about')} />
      <Services
        markup={getSiteMarkup('#services')}
        cursorMarkup={getSiteMarkup('#service-cursor-preview')}
      />
      <Process markup={getSiteMarkup('#process')} />
      <Packages markup={getSiteMarkup('#packages')} />
      <Gallery markup={getSiteMarkup('#gallery')} />
      <Reviews
        markup={getSiteMarkup('#reviews')}
        modalMarkup={getSiteMarkup('#review-video-modal')}
      />
      <Contact />
      <Footer markup={getSiteMarkup('footer.site-footer')} />
    </SiteInteractions>
  );
}