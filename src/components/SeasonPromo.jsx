import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import OptimizedImage from './OptimizedImage';
import { site } from '@/content/site';

const promos = [
  { title: 'Much Ado About Nothing — 2026', image: '/images/hero-much-ado.png', href: '/plays' },
  { title: 'Shakespeare for Kids', image: '/images/shakespeare-for-everyone.webp', href: '/learning' },
  {
    title: site.gala.title,
    image: '/images/news/gala-2026.jpg',
    href: '/support',
  },
];

export default function SeasonPromo() {
  return (
    <section className="section-pad bg-cream">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {promos.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <Link to={p.href} className="group relative overflow-hidden block shadow-soft card-lift">
                <div className="aspect-[4/3] overflow-hidden image-shine">
                  <OptimizedImage
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105 brightness-[0.7] group-hover:brightness-85"
                    wrapperClassName="w-full h-full"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/30 to-transparent flex items-end p-6 md:p-8">
                  <h3 className="font-display text-white text-xl md:text-2xl font-semibold uppercase leading-tight tracking-wide">
                    {p.title}
                  </h3>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
