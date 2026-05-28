import PageLayout from '../components/PageLayout';
import HeroSlider from '../components/HeroSlider';
import ProductionStrip from '../components/ProductionStrip';
import HomeCTA from '../components/HomeCTA';
import Sponsors from '../components/Sponsors';
import ShakespeareHub from '../components/ShakespeareHub';
import VisitPark from '../components/VisitPark';
import LatestNews from '../components/LatestNews';
/**
 * Homepage: Hero → Productions → Give → Sponsors → Education → Visit → News
 */
export default function Home() {
  return (
    <PageLayout>
      <HeroSlider />
      <ProductionStrip />
      <HomeCTA />
      <Sponsors />
      <ShakespeareHub />
      <VisitPark />
      <LatestNews />
    </PageLayout>
  );
}
