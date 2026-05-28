import { useState, useEffect } from 'react';
import { content } from '@/api/content';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import OptimizedImage from '../components/OptimizedImage';
import CtaLink from '../components/CtaLink';
import LoadingSpinner from '../components/LoadingSpinner';
import TicketBanner from '../components/TicketBanner';
import VisitCallout from '../components/VisitCallout';
import { pageHeroImages } from '@/content/images';

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
    <PageLayout>
      <PageHero
        eyebrow="Pinkney Park · Rowayton, CT"
        title="Productions"
        description="Professional Shakespeare under the summer sky — affordable tickets, unforgettable nights."
        image={pageHeroImages.plays}
      />

      <div className="max-w-6xl mx-auto section-pad !pt-14 sm:!pt-16 bg-section-pattern">
        {loading ? (
          <LoadingSpinner label="Loading productions" />
        ) : productions.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display text-navy text-2xl font-semibold uppercase mb-4">Season details coming soon</p>
            <p className="font-inter text-navy/60 text-sm max-w-md mx-auto">
              Check back for our summer lineup, or contact us for the latest schedule.
            </p>
          </div>
        ) : (
          <div className="space-y-14 md:space-y-20">
            {productions.map((prod, i) => (
              <Reveal key={prod.id} delay={i * 0.05}>
                <article className="group grid md:grid-cols-2 gap-0 bg-white shadow-soft overflow-hidden card-lift border border-navy/5">
                  <div className="overflow-hidden aspect-video md:aspect-auto md:min-h-[340px] image-shine relative">
                    <OptimizedImage
                      src={prod.image}
                      alt={prod.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105 brightness-[0.82]"
                      wrapperClassName="w-full h-full min-h-[260px]"
                    />
                    {prod.featured && (
                      <div className="absolute top-4 left-4 bg-navy-deep/90 backdrop-blur-sm px-3 py-1.5 border border-gold/30">
                        <span className="text-gold text-[9px] tracking-[0.25em] uppercase font-semibold">Main Stage</span>
                      </div>
                    )}
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
                    <div className="font-inter text-navy/80 text-sm md:text-base leading-relaxed mb-6 space-y-3">
                      {prod.description.split('\n\n').map((para) => (
                        <p key={para.slice(0, 40)}>{para}</p>
                      ))}
                    </div>
                    {prod.ticketDetails?.length > 0 && (
                      <ul className="mb-6 space-y-2 border-l-2 border-gold/40 pl-4">
                        {prod.ticketDetails.map((line) => (
                          <li key={line} className="font-inter text-navy/70 text-xs leading-relaxed">
                            {line}
                          </li>
                        ))}
                      </ul>
                    )}
                    {prod.specialEvents?.length > 0 && (
                      <div className="mb-6">
                        <p className="font-inter text-navy font-semibold text-xs uppercase tracking-widest mb-2">
                          Special Events
                        </p>
                        <ul className="space-y-1">
                          {prod.specialEvents.map((ev) => (
                            <li key={ev} className="font-inter text-navy/65 text-xs leading-relaxed">
                              {ev}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {prod.creativeTeam?.length > 0 && (
                      <p className="font-inter text-navy/50 text-[10px] leading-relaxed mb-6">
                        {prod.creativeTeam.join(' · ')}
                      </p>
                    )}
                    <div className="btn-stack-mobile mt-auto">
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

      <VisitCallout />
      <TicketBanner />
    </PageLayout>
  );
}
