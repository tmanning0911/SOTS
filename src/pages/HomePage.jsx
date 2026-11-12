import { useEffect } from "react";
import { Hero } from "../components/home/Hero.jsx";
import { SeasonPromo } from "../components/home/SeasonPromo.jsx";
import { EducationBlock } from "../components/home/EducationBlock.jsx";
import { StoryCtas } from "../components/home/StoryCtas.jsx";
import { Newsletter } from "../components/home/Newsletter.jsx";
import { Sponsors } from "../components/home/Sponsors.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";
import { refreshScroll, initHomePageMotion, resetHomePageMotion } from "../polish.js";

export function HomePage() {
  usePageMeta("/");

  useEffect(() => {
    resetHomePageMotion();
    initHomePageMotion();
    requestAnimationFrame(() => setTimeout(refreshScroll, 80));
    return () => resetHomePageMotion();
  }, []);

  return (
    <div className="home home--collage">
      <Hero />
      <SeasonPromo />
      <EducationBlock />
      <StoryCtas />
      <Newsletter />
      <Sponsors />
    </div>
  );
}
