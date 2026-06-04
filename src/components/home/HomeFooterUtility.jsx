import { Link } from 'react-router-dom';
import { site } from '@/content/site';
import { seasonVoice } from '@/content/voice';

const ticketOptions = [
  {
    label: 'Main Stage Tickets',
    description: 'Purchased via Eventbrite or at the park box office',
    href: site.ticketsUrl,
    external: true,
  },
  {
    label: 'Box Office by Phone',
    description: site.phoneNote,
    href: `tel:${site.phone.replace(/\D/g, '')}`,
    external: true,
  },
  {
    label: 'Group & Gala Tickets',
    description: 'Special events, sponsorship, and group sales',
    href: '/events',
    external: false,
  },
];

/** Orpheum 1:1 — box office + access tickets band above footer */
export default function HomeFooterUtility() {
  return (
    <section className="bg-[hsl(220_52%_10%)] border-t border-white/10" data-nav-zone="dark">
      <div className="site-container py-10 sm:py-12">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div>
            <h3 className="font-inter text-gold-light text-[10px] tracking-[0.25em] uppercase font-bold mb-3">
              Box Office Hours
            </h3>
            <p className="font-inter text-white/65 text-sm leading-relaxed">
              June {seasonVoice.runDates}, {seasonVoice.year}
              <br />
              Gates open {seasonVoice.parkOpens} · Box office {seasonVoice.boxOfficeOpens}
              <br />
              Showtime {seasonVoice.showTime}
            </p>
          </div>

          <div>
            <h3 className="font-inter text-gold-light text-[10px] tracking-[0.25em] uppercase font-bold mb-3">
              Box Office Phone
            </h3>
            <a
              href={`tel:${site.phone.replace(/\D/g, '')}`}
              className="font-display text-white text-2xl sm:text-3xl font-semibold hover:text-gold transition-colors"
            >
              {site.phone}
            </a>
            <p className="font-inter text-white/45 text-xs mt-2">{site.phoneNote}</p>
          </div>

          <div>
            <h3 className="font-inter text-gold-light text-[10px] tracking-[0.25em] uppercase font-bold mb-3">
              Access Your Tickets
            </h3>
            <p className="font-inter text-white/55 text-sm mb-4">
              Mobile tickets make entry to Pinkney Park quick and easy.
            </p>
            <ul className="space-y-2">
              {ticketOptions.map((opt) => (
                <li key={opt.label}>
                  {opt.external ? (
                    <a
                      href={opt.href}
                      target={opt.href.startsWith('http') ? '_blank' : undefined}
                      rel={opt.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="font-inter text-white/80 text-sm hover:text-gold transition-colors"
                    >
                      {opt.label}
                    </a>
                  ) : (
                    <Link to={opt.href} className="font-inter text-white/80 text-sm hover:text-gold transition-colors">
                      {opt.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
