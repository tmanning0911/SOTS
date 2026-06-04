import PageLayout from '../components/PageLayout';
import {
  HomeHero,
  HomeSeasonStrip,
  HomeUpcomingEvents,
  HomeVisitBar,
  HomeOurStory,
  HomeEducationTeaser,
  HomeEducationImpact,
  HomeSupportMission,
  HomeRecentNews,
} from '../components/home';
import Sponsors from '../components/Sponsors';

/**
 * Homepage — Orpheum 1:1 section order with SOTS content
 * https://www.orpheum-memphis.com/
 */
export default function Home() {
  return (
    <PageLayout>
      <HomeHero />
      <HomeSeasonStrip />
      <HomeUpcomingEvents />
      <HomeVisitBar />
      <HomeOurStory />
      <HomeEducationTeaser />
      <HomeEducationImpact />
      <HomeSupportMission />
      <HomeRecentNews />
      <Sponsors />
    </PageLayout>
  );
}
