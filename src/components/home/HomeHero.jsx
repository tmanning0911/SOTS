import { Link } from 'react-router-dom';
import { site } from '@/content/site';
import { seasonVoice, homeCopy } from '@/content/voice';
import { images } from '@/content/images';
import { ShakespeareWatermark } from '../decor';

/** Homepage hero — full-bleed animated poster with gradient overlay and bottom copy. */
export default function HomeHero() {
  return (
    <section data-nav-zone="dark" className="home-hero bg-navy-deep">
      <div className="home-hero__media" aria-hidden>
        <img
          src={images.heroMuchAdoGif}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="home-hero__image home-hero__image--gif"
        />
        <div className="home-hero__scrim" />
        <ShakespeareWatermark variant="folio" tone="dark" position="right" className="hidden lg:block" />
      </div>

      <div className="home-hero__panel">
        <div className="site-container home-hero__inner">
          <div className="home-hero__copy">
            <p className="home-hero__eyebrow">
              {seasonVoice.runDates}, {seasonVoice.year} · Pinkney Park
            </p>
            <h1 className="home-hero__title">{seasonVoice.mainStage}</h1>
            <p className="home-hero__setting">{seasonVoice.setting}</p>
            <div className="home-hero__actions">
              <a href={site.ticketsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Book tickets
              </a>
              <Link to="/plays" className="btn-ghost-light">
                Season details
              </Link>
            </div>
            <p className="home-hero__meta">
              Directed by {seasonVoice.director} · Gates {seasonVoice.parkOpens} · Show{' '}
              {seasonVoice.showTime}
            </p>
            <p className="home-hero__description">{homeCopy.heroMain.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
