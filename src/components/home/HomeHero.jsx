import { useState } from 'react';
import { Link } from 'react-router-dom';
import { site } from '@/content/site';
import { seasonVoice } from '@/content/voice';
import { images } from '@/content/images';

const ticketBadges = [
  { src: images.heroMuchAdo, alt: 'Much Ado About Nothing' },
  { src: images.parkPerformance, alt: 'Pinkney Park performances' },
  { src: images.news.kids, alt: 'Shakespeare for Kids' },
  { src: images.backgrounds.audience, alt: 'Audience at Pinkney Park' },
  { src: images.backgrounds.cast, alt: 'Much Ado cast' },
  { src: images.news.seasonMaanBanner, alt: '2026 season' },
];

/** Homepage hero — Broadway-style cinematic poster with overlapping season ticket. */
export default function HomeHero() {
  const [motionOn, setMotionOn] = useState(true);
  const [muted, setMuted] = useState(true);

  return (
    <section data-nav-zone="dark" className="home-hero bg-navy-deep">
      <div className="home-hero__media" aria-hidden>
        <img
          src={motionOn ? images.heroMuchAdoGif : images.heroMuchAdo}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="home-hero__image"
        />
        <div className="home-hero__scrim" />
      </div>

      <div className="home-hero__content">
        <div className="site-container home-hero__content-inner">
          <div className="home-hero__copy">
            <h1 className="home-hero__title">
              Experience the Magic of Shakespeare in Rowayton
            </h1>
            <div className="home-hero__actions">
              <a
                href={site.ticketsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary home-hero__cta"
              >
                Get your summer tickets
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="home-hero__controls" aria-label="Hero media controls">
        <button
          type="button"
          className="home-hero__control-btn"
          onClick={() => setMotionOn((on) => !on)}
          aria-label={motionOn ? 'Pause animated hero image' : 'Play animated hero image'}
          aria-pressed={motionOn}
        >
          {motionOn ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <rect x="6" y="5" width="4" height="14" rx="0.5" />
              <rect x="14" y="5" width="4" height="14" rx="0.5" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l10.26-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14Z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="home-hero__control-btn"
          onClick={() => setMuted((on) => !on)}
          aria-label={muted ? 'Unmute hero media' : 'Mute hero media'}
          aria-pressed={!muted}
        >
          {muted ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m22 9-6 6M16 9l6 6" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      <div className="home-hero__ticket-wrap">
        <div className="site-container">
          <article className="home-hero-ticket">
            <div className="home-hero-ticket__art" aria-hidden>
              <div className="home-hero-ticket__curtain" />
              <ul className="home-hero-ticket__badges">
                {ticketBadges.map((badge) => (
                  <li key={badge.alt} className="home-hero-ticket__badge">
                    <img src={badge.src} alt="" loading="lazy" decoding="async" />
                  </li>
                ))}
              </ul>
            </div>
            <div className="home-hero-ticket__body">
              <p className="home-hero-ticket__eyebrow">
                {seasonVoice.year} summer tickets are on sale now
              </p>
              <h2 className="home-hero-ticket__title">
                Sixteen nights of laughter, music, and moonlight at Pinkney Park
              </h2>
              <Link to="/plays" className="home-hero-ticket__link">
                Explore the season
                <span aria-hidden>&gt;</span>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
