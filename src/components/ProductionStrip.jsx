import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import OptimizedImage from './OptimizedImage';
import SectionHeader from './SectionHeader';
import ProductionStatusBadge from './ProductionStatusBadge';
import { cms } from '@/lib/cms';
import { seedPlays } from '@/lib/contentSeed';
import { homeCopy, seasonVoice } from '@/content/voice';
import PullQuote from './PullQuote';

export default function ProductionStrip() {
  const [productions, setProductions] = useState(seedPlays);

  useEffect(() => {
    cms.plays
      .list('sort_order')
      .then((data) => setProductions(data.filter((p) => p.status !== 'Archived')))
      .catch(() => {});
  }, []);

  if (productions.length === 0) return null;

  return (
    <section className="bg-navy-deep grain-overlay relative overflow-hidden accent-top-dark" data-nav-zone="dark">
      <div className="page-container page-gutter pt-10 sm:pt-12 pb-2 relative z-[1]">
        <SectionHeader
          eyebrow={`${seasonVoice.number}th Summer Season`}
          title="On Stage This Summer"
          description={homeCopy.productionsIntro}
          align="center"
          light
          className="!mb-6 sm:!mb-8 !max-w-2xl"
        />
        <div className="flex justify-center mb-6 sm:mb-8">
          <PullQuote cite={homeCopy.productionsQuote.source} light className="text-center sm:text-left">
            {homeCopy.productionsQuote.text}
          </PullQuote>
        </div>
      </div>
      <div
        className={`grid grid-cols-1 gap-1 pb-10 sm:pb-12 page-gutter ${
          productions.length >= 2 ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'
        }`}
      >
        {productions.map((prod, i) => (
          <Reveal
            key={prod.id}
            delay={i * 0.06}
            className="relative group overflow-hidden min-h-[220px] sm:min-h-[280px]"
          >
            <Link to={`/plays#${prod.id}`} className="block relative h-full min-h-[inherit]">
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
                <ProductionStatusBadge status={prod.status} dark className="!mb-3" />
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
