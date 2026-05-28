import { useState, useEffect } from 'react';
import { content } from '@/api/content';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import OptimizedImage from '../components/OptimizedImage';
import CtaLink from '../components/CtaLink';

export default function Plays() {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    content.entities.Play.list('sort_order').then((data) => {
      setProductions(data.filter((p) => p.status !== 'Archived'));
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <PageHero
        eyebrow="Pinkney Park · Rowayton, CT"
        title="Productions"
        description="Professional Shakespeare under the summer sky — affordable tickets, unforgettable nights."
        image="/images/park-performance.jpg"
      />

      <div className="max-w-6xl mx-auto section-pad !pt-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-16 md:space-y-20">
            {productions.map((prod, i) => (
              <Reveal key={prod.id} delay={i * 0.05}>
                <article className="group grid md:grid-cols-2 gap-0 bg-white shadow-soft overflow-hidden card-lift">
                  <div className="overflow-hidden aspect-video md:aspect-auto md:min-h-[320px] image-shine">
                    <OptimizedImage
                      src={prod.image}
                      alt={prod.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105 brightness-[0.85]"
                      wrapperClassName="w-full h-full min-h-[240px]"
                    />
                  </div>
                  <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                    {prod.status === 'Now On' && (
                      <span className="inline-block bg-gold text-navy-deep text-[10px] tracking-[0.2em] uppercase font-bold px-3 py-1 mb-4 w-fit">
                        Now On
                      </span>
                    )}
                    {prod.status === 'Coming Soon' && (
                      <span className="inline-block border border-navy/20 text-navy text-[10px] tracking-[0.2em] uppercase font-semibold px-3 py-1 mb-4 w-fit">
                        Coming Soon
                      </span>
                    )}
                    <p className="section-eyebrow !text-gold-muted mb-2">{prod.subtitle}</p>
                    <h2 className="font-display text-navy text-2xl sm:text-3xl md:text-4xl font-semibold uppercase mb-3 leading-tight">
                      {prod.title}
                    </h2>
                    <p className="font-inter text-gold-muted text-xs tracking-widest uppercase mb-1">{prod.dates}</p>
                    <p className="font-inter text-navy/50 text-xs tracking-widest uppercase mb-5">{prod.location}</p>
                    <p className="font-inter text-navy/80 text-sm md:text-base leading-relaxed mb-8">{prod.description}</p>
                    <div className="btn-stack-mobile">
                      <CtaLink href={prod.ticketUrl} className="btn-primary">
                        {prod.tag ||
                          (prod.ticketUrl?.startsWith('http') ? 'Get Tickets' : 'Learn More')}
                      </CtaLink>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
