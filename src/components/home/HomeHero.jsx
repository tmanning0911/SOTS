import { Link } from 'react-router-dom';
import { site } from '@/content/site';
import { seasonVoice, homeCopy } from '@/content/voice';
import { images } from '@/content/images';
import OptimizedImage from '../OptimizedImage';
import { ShakespeareWatermark } from '../decor';

/** Homepage hero — stacked poster on mobile, cinematic gradient overlay on desktop. */
export default function HomeHero() {
  return (
    <section data-nav-zone="dark" className="home-hero bg-navy-deep">
      <div className="home-hero__media">
        <OptimizedImage
          src={images.heroMuchAdo}
          webp={images.heroMuchAdoWebp}
          alt="Illustration of masked dancers at a Sicilian masquerade for Much Ado About Nothing"
          priority
          decorative
          className="absolute inset-0 w-full h-full object-cover object-[center_42%] lg:object-[58%_58%] lg:scale-105"
          wrapperClassName="absolute inset-0 w-full h-full"
        />
        <div className="home-hero__scrim home-hero__scrim--desktop" aria-hidden />
        <ShakespeareWatermark
          variant="folio"
          tone="dark"
          position="right"
          className="z-[1] hidden lg:block"
        />
      </div>

      <div className="home-hero__panel">
        <div className="site-container home-hero__inner">
          <p className="home-hero__eyebrow">
            {seasonVoice.runDates}, {seasonVoice.year} · Pinkney Park
          </p>
          <h1 className="home-hero__title">{seasonVoice.mainStage}</h1>
          <p className="home-hero__setting">{seasonVoice.setting}</p>
          <p className="home-hero__meta home-hero__meta--mobile">
            Gates {seasonVoice.parkOpens} · Show {seasonVoice.showTime}
          </p>
          <p className="home-hero__description lg:hidden">{homeCopy.heroMain.description}</p>
          <div className="home-hero__actions">
            <a href={site.ticketsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Book tickets
            </a>
            <Link to="/plays" className="btn-ghost-light">
              Season details
            </Link>
          </div>
          <p className="home-hero__meta home-hero__meta--desktop">
            Directed by {seasonVoice.director} · Gates {seasonVoice.parkOpens} · Show{' '}
            {seasonVoice.showTime}
          </p>
        </div>
      </div>
    </section>
  );
}
