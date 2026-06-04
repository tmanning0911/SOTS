import { seasonVoice } from '@/content/voice';

/** Orpheum 1:1 — season announcement band (mirrors orpheum-memphis.com hero follow-up) */
export default function HomeSeasonStrip() {
  return (
    <section className="bg-white border-b border-navy/10" data-nav-zone="light">
      <div className="site-container py-10 sm:py-12 md:py-14 text-center">
        <p className="font-inter text-[11px] sm:text-xs tracking-[0.28em] uppercase font-bold text-navy/65 mb-3 sm:mb-4">
          {seasonVoice.year} Season Tickets Are On Sale Now
        </p>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-semibold leading-[1.12] max-w-4xl mx-auto text-navy text-balance">
          Pick Sixteen Nights of Laughter, Music, and Moonlight at Pinkney Park
        </h2>
      </div>
    </section>
  );
}
