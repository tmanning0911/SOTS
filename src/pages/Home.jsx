import PageLayout from '../components/PageLayout';
import HeroSlider from '../components/HeroSlider';
import ProductionStrip from '../components/ProductionStrip';
import HomeCTA from '../components/HomeCTA';
import Sponsors from '../components/Sponsors';
import ShakespeareHub from '../components/ShakespeareHub';
import VisitTeaser from '../components/VisitTeaser';
import LatestNews from '../components/LatestNews';
/**
 * Homepage: Hero → Productions → Give → Sponsors → Education → Visit teaser → News
 */
export default function Home() {
  return (
    <PageLayout>
      <HeroSlider />
      <ProductionStrip />
      <HomeCTA />
      <Sponsors />
      <ShakespeareHub />
      <VisitTeaser />
      <LatestNews />
    </PageLayout>
  );
}
