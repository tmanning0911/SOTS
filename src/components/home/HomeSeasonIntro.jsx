import { homeCopy } from '@/content/voice';

/** Main-stage blurb — desktop only; mobile keeps a short version in the hero panel. */
export default function HomeSeasonIntro() {
  return (
    <section className="hidden lg:block bg-white border-b border-navy/10" data-nav-zone="light">
      <div className="site-container py-10 md:py-12">
        <p className="text-body-lg text-navy/80 max-w-3xl leading-relaxed">
          {homeCopy.heroMain.description}
        </p>
      </div>
    </section>
  );
}
