import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cms } from '@/lib/cms';
import { seedPlays } from '@/lib/contentSeed';
import PageLayout from '../components/PageLayout';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import OptimizedImage from '../components/OptimizedImage';
import CtaLink from '../components/CtaLink';
import ProductionStatusBadge from '../components/ProductionStatusBadge';
import { pageHeroImages } from '@/content/images';
import { TheatreBackdrop } from '../components/decor';

export default function Plays() {
  const [productions, setProductions] = useState(seedPlays);

  useEffect(() => {
    cms.plays
      .list('sort_order')
      .then((data) => setProductions(data.filter((p) => p.status !== 'Archived')))
      .catch(() => {});
  }, []);

  return (
    <PageLayout>
      <PageHero
        eyebrow="Pinkney Park · Rowayton, CT"
        title="Productions"
        description="Professional Shakespeare under the summer sky — affordable tickets, unforgettable nights."
        image={pageHeroImages.plays}
      />

      <TheatreBackdrop variant="cream" className="section-pad !pt-14 sm:!pt-16 pb-16 sm:pb-20">
        <div className="max-w-6xl mx-auto">
          {productions.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-display text-navy text-2xl font-semibold uppercase mb-4">
                Season details coming soon
              </p>
              <p className="font-inter text-navy/60 text-sm max-w-md mx-auto">
                Check back for our summer lineup, or contact us for the latest schedule.
              </p>
            </div>
          ) : (
            <div className="space-y-10 sm:space-y-14">
              {productions.map((prod, i) => {
                const isExternalTicket = prod.ticketUrl?.startsWith('http');
                const flipLayout = i % 2 === 1;

                return (
                  <Reveal key={prod.id} delay={i * 0.05}>
                    <article
                      id={prod.id}
                      className="group grid md:grid-cols-2 gap-0 bg-white shadow-soft overflow-hidden border border-navy/5 scroll-mt-28"
                    >
                      <div
                        className={`overflow-hidden aspect-[16/10] md:aspect-auto md:min-h-[360px] image-shine relative ${
                          flipLayout ? 'md:order-2' : ''
                        }`}
                      >
                        <OptimizedImage
                          src={prod.image}
                          alt={prod.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-105 brightness-[0.88]"
                          wrapperClassName="absolute inset-0 w-full h-full"
                        />
                        {prod.featured && (
                          <div className="absolute top-4 left-4 bg-navy-deep/90 backdrop-blur-sm px-3 py-1.5 border border-gold/30">
                            <span className="text-gold text-[9px] tracking-[0.25em] uppercase font-semibold">
                              Main Stage
                            </span>
                          </div>
                        )}
                      </div>

                      <div
                        className={`p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center ${
                          flipLayout ? 'md:order-1' : ''
                        }`}
                      >
                        <ProductionStatusBadge status={prod.status} className="mb-4" />
                        <p className="section-eyebrow !text-gold-muted mb-2">{prod.subtitle}</p>
                        <h2 className="font-display text-navy text-2xl sm:text-3xl md:text-4xl font-semibold uppercase mb-3 leading-tight">
                          {prod.title}
                        </h2>
                        <p className="font-inter text-gold-muted text-xs tracking-widest uppercase mb-1">
                          {prod.dates}
                        </p>
                        <p className="font-inter text-navy/50 text-xs tracking-widest uppercase mb-5">
                          {prod.location}
                        </p>
                        <div className="font-inter text-navy/80 text-sm md:text-base leading-relaxed mb-6 space-y-3">
                          {prod.description.split('\n\n').map((para, pi) => (
                            <p key={`${prod.id}-p-${pi}`}>{para}</p>
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
                            <ul className="space-y-1 mb-3">
                              {prod.specialEvents.map((ev) => (
                                <li key={ev} className="font-inter text-navy/65 text-xs leading-relaxed">
                                  {ev}
                                </li>
                              ))}
                            </ul>
                            <Link to="/events" className="link-gold">
                              View all special events
                            </Link>
                          </div>
                        )}
                        {prod.creativeTeam?.length > 0 && (
                          <p className="font-inter text-navy/50 text-[10px] leading-relaxed mb-6">
                            {prod.creativeTeam.join(' · ')}
                          </p>
                        )}
                        <div className="btn-stack-mobile mt-auto pt-2 border-t border-navy/8">
                          <CtaLink
                            href={prod.ticketUrl}
                            className={isExternalTicket ? 'btn-primary' : 'btn-outline'}
                          >
                            {prod.tag ||
                              (isExternalTicket ? 'Get Tickets' : 'Learn More')}
                          </CtaLink>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </TheatreBackdrop>
    </PageLayout>
  );
}
