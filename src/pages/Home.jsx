import Navbar from '../components/Navbar';
import SkipLink from '../components/SkipLink';
import HeroSlider from '../components/HeroSlider';
import ProductionStrip from '../components/ProductionStrip';
import HomeCTA from '../components/HomeCTA';
import ShakespeareForEveryone from '../components/ShakespeareForEveryone';
import ShakespeareHub from '../components/ShakespeareHub';
import AboutBanner from '../components/AboutBanner';
import WatchOnline from '../components/WatchOnline';
import VisitPark from '../components/VisitPark';
import Sponsors from '../components/Sponsors';
import SeasonPromo from '../components/SeasonPromo';
import LatestNews from '../components/LatestNews';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <SkipLink />
      <Navbar />
      <main id="main-content">
      <HeroSlider />
      <ProductionStrip />
      <HomeCTA />
      <ShakespeareForEveryone />
      <ShakespeareHub />
      <AboutBanner />
      <WatchOnline />
      <VisitPark />
      <Sponsors />
      <SeasonPromo />
      <LatestNews />
      </main>
      <Footer />
    </div>
  );
}
