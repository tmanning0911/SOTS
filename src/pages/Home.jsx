import PageLayout from '../components/PageLayout';
import {
  HomeHero,
  HomeSeasonIntro,
  HomeComingUp,
  HomeWhatsOn,
  HomeOurStory,
  HomeSupportKids,
  HomeEducationImpact,
  HomeRecentNews,
} from '../components/home';
import Sponsors from '../components/Sponsors';

/** Homepage — photo hero, programme list, story, one dark band, news, partners. */
export default function Home() {
  return (
    <PageLayout preFooter>
      <HomeHero />
      <HomeSeasonIntro />
      <HomeComingUp />
      <HomeWhatsOn />
      <HomeOurStory />
      <HomeSupportKids />
      <HomeEducationImpact />
      <HomeRecentNews />
      <Sponsors />
    </PageLayout>
  );
}
