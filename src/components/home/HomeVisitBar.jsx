import { Link } from 'react-router-dom';
import { site } from '@/content/site';

const links = [
  { label: 'Plan Your Visit', href: '/about#visit' },
  { label: 'Parking & Directions', href: '/about#visit' },
  { label: 'FAQ', href: '/about#faq' },
  { label: 'Box Office', href: `tel:${site.phone.replace(/\D/g, '')}`, external: true },
];

/** Orpheum 1:1 — four equal quick-link columns */
export default function HomeVisitBar() {
  return (
    <section className="home-visit-bar border-t-0" data-nav-zone="light" aria-label="Quick visit links">
      <div className="site-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-navy/10 border-y border-navy/10">
          {links.map((link) => {
            const className = 'home-visit-bar-link group';
            if (link.external) {
              return (
                <a key={link.label} href={link.href} className={className}>
                  <span className="home-visit-bar-label">{link.label}</span>
                </a>
              );
            }
            return (
              <Link key={link.label} to={link.href} className={className}>
                <span className="home-visit-bar-label">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
