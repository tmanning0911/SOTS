import { Link } from 'react-router-dom';
import { site } from '@/content/site';

const links = [
  { label: 'Plan your visit', href: '/about#visit' },
  { label: 'Season schedule', href: '/plays' },
  { label: 'FAQ', href: '/about#faq' },
  { label: 'Box office', href: `tel:${site.phone.replace(/\D/g, '')}`, external: true },
];

export default function HomeVisitBar() {
  return (
    <section className="bg-cream pt-2" data-nav-zone="light" aria-label="Visit information">
      <div className="site-container pb-2">
        <p className="visit-bar__heading">
          <span className="visit-bar__pin" aria-hidden />
          Pinkney Park · Rowayton, Connecticut
        </p>
        <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-navy/10 border-y border-navy/10 bg-white/70 backdrop-blur-sm rounded-lg overflow-hidden">
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
        </nav>
      </div>
    </section>
  );
}
