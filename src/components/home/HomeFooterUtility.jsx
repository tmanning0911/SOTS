import { Link } from 'react-router-dom';
import Reveal from '../Reveal';
import { site } from '@/content/site';
import { seasonVoice } from '@/content/voice';

const ticketOptions = [
  { label: 'Book on Eventbrite', href: site.ticketsUrl, external: true },
  { label: `Call ${site.phone}`, href: `tel:${site.phone.replace(/\D/g, '')}`, external: true },
  { label: 'Group & gala tickets', href: '/events', external: false },
];

export default function HomeFooterUtility() {
  return (
    <section className="bg-navy-deep text-white border-t border-white/10" data-nav-zone="dark">
      <div className="site-container py-14 md:py-16">
        <Reveal>
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            <div>
              <h3 className="label text-white/45 mb-3">Box office hours</h3>
              <p className="text-body text-white/70">
                {seasonVoice.runDates}, {seasonVoice.year}
                <br />
                Gates {seasonVoice.parkOpens} · Box office {seasonVoice.boxOfficeOpens}
                <br />
                Showtime {seasonVoice.showTime}
              </p>
            </div>

            <div>
              <h3 className="label text-white/45 mb-3">Phone</h3>
              <a
                href={`tel:${site.phone.replace(/\D/g, '')}`}
                className="font-display text-2xl md:text-3xl text-white hover:text-gold transition-colors"
              >
                {site.phone}
              </a>
              <p className="text-sm text-white/45 mt-2">{site.phoneNote}</p>
            </div>

            <div>
              <h3 className="label text-white/45 mb-3">Tickets</h3>
              <ul className="space-y-2">
                {ticketOptions.map((opt) => (
                  <li key={opt.label}>
                    {opt.external ? (
                      <a
                        href={opt.href}
                        target={opt.href.startsWith('http') ? '_blank' : undefined}
                        rel={opt.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-link-light text-sm"
                      >
                        {opt.label}
                      </a>
                    ) : (
                      <Link to={opt.href} className="text-link-light text-sm">
                        {opt.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
