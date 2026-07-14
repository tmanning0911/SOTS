import { useEffect } from "react";
import { Hero } from "../components/home/Hero.jsx";
import { SeasonPromo } from "../components/home/SeasonPromo.jsx";
import { UpcomingEvents } from "../components/home/UpcomingEvents.jsx";
import { PlanVisitBar } from "../components/home/PlanVisitBar.jsx";
import { OurStorySection } from "../components/home/OurStorySection.jsx";
import { ImpactSection } from "../components/home/ImpactSection.jsx";
import { SupportMission } from "../components/home/SupportMission.jsx";
import { RecentNews } from "../components/home/RecentNews.jsx";
import { Sponsors } from "../components/home/Sponsors.jsx";
import { Newsletter } from "../components/home/Newsletter.jsx";
import { refreshScroll, initHomePageMotion, resetHomePageMotion } from "../polish.js";

export function HomePage() {
  useEffect(() => {
    document.title = "Shakespeare on the Sound | Free Outdoor Shakespeare in Rowayton, CT";
  }, []);

  useEffect(() => {
    resetHomePageMotion();
    initHomePageMotion();
    requestAnimationFrame(() => setTimeout(refreshScroll, 80));
    return () => resetHomePageMotion();
  }, []);

  return (
    <div className="home home--orpheum">
      <Hero />
      <SeasonPromo />
      <UpcomingEvents />
      <PlanVisitBar />
      <OurStorySection />
      <ImpactSection />
      <SupportMission />
      <RecentNews />
      <Newsletter />
      <Sponsors />
    </div>
  );
}
