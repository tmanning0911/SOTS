import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import OptimizedImage from './OptimizedImage';
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
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          productions.length > 2 ? 'lg:grid-cols-2' : ''
        }`}
      >
        {productions.map((prod, i) => (
          <Reveal key={prod.id} delay={i * 0.06} className="relative group overflow-hidden">
            <Link to="/plays" className="block">
              <div className="aspect-[16/10] sm:aspect-[3/2] overflow-hidden image-shine">
                <OptimizedImage
                  src={prod.image}
                  alt={prod.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105 brightness-[0.72] group-hover:brightness-90"
                  wrapperClassName="w-full h-full"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                {prod.status === 'Now On' && (
                  <span className="inline-block bg-gold text-navy-deep text-[10px] tracking-[0.2em] uppercase font-bold px-3 py-1 mb-3">
                    Now On
                  </span>
                )}
                <p className="font-display text-white text-2xl md:text-3xl font-semibold uppercase tracking-wide leading-tight">
                  {prod.title}
                </p>
                <p className="text-white/55 text-xs font-inter mt-2 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {prod.dates}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
