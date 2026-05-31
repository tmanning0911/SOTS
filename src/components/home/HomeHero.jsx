import { Link } from 'react-router-dom';
import { site } from '@/content/site';
import { seasonVoice, homeCopy } from '@/content/voice';
import { images } from '@/content/images';
import OptimizedImage from '../OptimizedImage';
import { ShakespeareWatermark } from '../decor';

/** One strong hero — photo, type, tickets. Nothing else. */
export default function HomeHero() {
  return (
    <section
      data-nav-zone="dark"
      className="relative min-h-[88vh] max-h-[920px] flex items-end bg-navy-deep overflow-hidden"
    >
      <OptimizedImage
        src={images.heroMuchAdo}
        webp={images.heroMuchAdoWebp}
        alt=""
        priority
        className="absolute inset-0 w-full h-full object-cover object-[center_30%] brightness-[0.5]"
        wrapperClassName="absolute inset-0 w-full h-full"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-navy-deep/10"
        aria-hidden
      />
      <ShakespeareWatermark variant="folio" tone="dark" position="right" className="z-[1]" />

      <div className="relative z-10 w-full site-container pb-14 md:pb-20 pt-28 md:pt-36">
        <p className="text-sm text-white/50 mb-4">
          {seasonVoice.runDates}, {seasonVoice.year} · Pinkney Park, Rowayton
        </p>
        <h1 className="heading-display text-white text-balance max-w-4xl">
          {seasonVoice.mainStage}
        </h1>
        <p className="font-display text-xl md:text-2xl italic text-white/75 mt-3 mb-6">
          {seasonVoice.setting}
        </p>
        <p className="text-body-lg text-white/65 max-w-prose mb-8">{homeCopy.heroMain.description}</p>
        <div className="flex flex-wrap gap-3">
          <a href={site.ticketsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Book tickets
          </a>
          <Link to="/plays" className="btn-ghost-light">
            Season details
          </Link>
        </div>
        <p className="text-xs text-white/40 mt-8">
          Directed by {seasonVoice.director} · Gates {seasonVoice.parkOpens} · Show {seasonVoice.showTime}
        </p>
      </div>
    </section>
  );
}
