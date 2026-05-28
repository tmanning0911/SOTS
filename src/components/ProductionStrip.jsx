import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import OptimizedImage from './OptimizedImage';
import SectionHeader from './SectionHeader';
import { content } from '@/api/content';

export default function ProductionStrip() {
  const [productions, setProductions] = useState([]);

  useEffect(() => {
    content.entities.Play.list('sort_order')
      .then((data) => setProductions(data.filter((p) => p.status !== 'Archived')))
      .catch(() => setProductions([]));
  }, []);

  if (productions.length === 0) return null;

  return (
    <section className="bg-navy-deep">
      <div className="page-gutter pt-10 sm:pt-12 pb-2">
        <SectionHeader
          eyebrow="Coming Up Next"
          title="Performing Arts"
          description={`at Shakespeare on the Sound · ${productions.length} production${productions.length > 1 ? 's' : ''} this season`}
          align="center"
          light
          className="!mb-6 sm:!mb-8 !max-w-2xl"
        />
      </div>
      <div
        className={`grid grid-cols-1 ${
          productions.length >= 2 ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'
        }`}
      >
        {productions.map((prod, i) => (
          <Reveal
            key={prod.id}
            delay={i * 0.06}
            className="relative group overflow-hidden min-h-[220px] sm:min-h-[280px]"
          >
            <Link to="/plays" className="block relative h-full min-h-[inherit]">
              <div className="absolute inset-0">
                <OptimizedImage
                  src={prod.image}
                  alt={prod.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105 brightness-[0.72] group-hover:brightness-90 min-h-[220px] sm:min-h-[280px]"
                  wrapperClassName="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                {prod.status === 'Now On' && (
                  <span className="inline-block bg-gold text-navy-deep text-[10px] tracking-[0.2em] uppercase font-bold px-3 py-1 mb-3">
                    Now On
                  </span>
                )}
                {prod.status === 'Coming Soon' && (
                  <span className="inline-block border border-white/30 text-white text-[10px] tracking-[0.2em] uppercase font-semibold px-3 py-1 mb-3">
                    Coming Soon
                  </span>
                )}
                <p className="font-display text-white text-xl sm:text-2xl md:text-3xl font-semibold uppercase tracking-wide leading-tight">
                  {prod.title}
                </p>
                <p className="text-white/60 text-xs font-inter mt-2 tracking-wide">{prod.dates}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
