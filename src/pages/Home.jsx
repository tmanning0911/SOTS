import Navbar from '../components/Navbar';
import SkipLink from '../components/SkipLink';
import HeroSlider from '../components/HeroSlider';
import ProductionStrip from '../components/ProductionStrip';
import HomeCTA from '../components/HomeCTA';
import Sponsors from '../components/Sponsors';
import ShakespeareHub from '../components/ShakespeareHub';
import VisitPark from '../components/VisitPark';
import LatestNews from '../components/LatestNews';
import HomeContact from '../components/HomeContact';
import Footer from '../components/Footer';

/**
 * Homepage section order mirrors shakespeareonthesound.org:
 * Hero → Productions → Gala/Donate/Kids → Sponsors → Education → Visit → News → Contact
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-cream overflow-x-clip">
      <SkipLink />
      <Navbar />
      <main id="main-content" className="flex-1 w-full">
        <HeroSlider />
        <ProductionStrip />
        <HomeCTA />
        <Sponsors />
        <ShakespeareHub />
        <VisitPark />
        <LatestNews />
        <HomeContact />
      </main>
      <Footer />
    </div>
  );
}
