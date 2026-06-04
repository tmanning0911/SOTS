import { Link } from 'react-router-dom';
import { seasonVoice } from '@/content/voice';
import { images } from '@/content/images';

const promoBadges = [
  { src: images.heroMuchAdo, alt: 'Much Ado About Nothing' },
  { src: images.parkPerformance, alt: 'Pinkney Park performances' },
  { src: images.news.kids, alt: 'Shakespeare for Kids' },
  { src: images.backgrounds.audience, alt: 'Audience at Pinkney Park' },
  { src: images.backgrounds.cast, alt: 'Much Ado cast' },
  { src: images.news.seasonMaanBanner, alt: '2026 season' },
];

/** Homepage hero — Orpheum-style dark split band + white promo strip. */
export default function HomeHero() {
  return (
    <>
      <section data-nav-zone="dark" className="home-hero">
        <div className="site-container home-hero__layout">
          <div className="home-hero__copy">
            <h1 className="home-hero__title">
              Experience the Magic of Shakespeare in Rowayton
            </h1>
            <Link to="/plays" className="home-hero__btn">
              View upcoming shows
            </Link>
          </div>
          <div className="home-hero__figure" aria-hidden>
            <img
              src={images.decor.shakespearePortraitTransparent}
              alt=""
              decoding="async"
              className="home-hero__portrait"
            />
          </div>
        </div>
      </section>

      <section data-nav-zone="light" className="home-hero-promo">
        <div className="home-hero-promo__layout">
          <div className="home-hero-promo__logos" aria-hidden>
            <div className="home-hero-promo__logos-bg" />
            <ul className="home-hero-promo__badges">
              {promoBadges.map((badge) => (
                <li key={badge.alt} className="home-hero-promo__badge">
                  <img src={badge.src} alt="" loading="lazy" decoding="async" />
                </li>
              ))}
            </ul>
          </div>
          <p className="home-hero-promo__text">
            Pick {seasonVoice.number} nights of laughter, music, and moonlight at Pinkney Park this
            summer
          </p>
        </div>
      </section>
    </>
  );
}
