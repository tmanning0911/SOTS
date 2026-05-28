import { Link } from 'react-router-dom';
import { site, socialLinks, sponsors } from '@/content/site';
import { IconFacebook, IconInstagram, IconTwitter, IconYoutube } from '@/components/icons';
import StaAffiliation from './StaAffiliation';
import { contactPaths } from '@/lib/contactPaths';
import FooterBoardEasterEgg from './FooterBoardEasterEgg';
import { useFormModal } from '@/lib/FormModalContext';

const iconMap = {
  Facebook: IconFacebook,
  Instagram: IconInstagram,
  Twitter: IconTwitter,
  YouTube: IconYoutube,
};

const linkClass =
  'font-inter text-white/70 text-xs hover:text-white transition-colors text-left leading-relaxed';

const navGroups = [
  {
    heading: 'Season',
    links: [
      { type: 'route', label: 'Productions', to: '/plays' },
      { type: 'route', label: 'News', to: '/news' },
      { type: 'route', label: 'Watch on YouTube', to: '/watch' },
      { type: 'external', label: 'Get Tickets', href: site.ticketsUrl },
    ],
  },
  {
    heading: 'Education',
    links: [
      { type: 'route', label: 'All Programs', to: '/learning' },
      { type: 'form', label: 'Book a School Program', variant: 'education' },
      { type: 'route', label: 'Visit Pinkney Park', to: '/about#visit' },
    ],
  },
  {
    heading: 'Support & About',
    links: [
      { type: 'route', label: 'Ways to Give', to: '/support' },
      { type: 'external', label: 'Donate', href: site.donateUrl },
      { type: 'form', label: 'Gala & Sponsorship', variant: 'sponsorship' },
      { type: 'route', label: 'About Us', to: '/about' },
      { type: 'route', label: 'Contact', to: '/contact' },
    ],
  },
];

function FooterNavItem({ item }) {
  if (item.type === 'external') {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {item.label}
        <span className="text-white/35" aria-hidden>
          {' '}
          ↗
        </span>
      </a>
    );
  }
  if (item.type === 'form') {
    return <FooterFormLink variant={item.variant}>{item.label}</FooterFormLink>;
  }
  return (
    <Link to={item.to} className={linkClass}>
      {item.label}
    </Link>
  );
}

function FooterFormLink({ variant, children }) {
  const { openForm } = useFormModal();
  return (
    <button type="button" onClick={() => openForm(variant)} className={linkClass}>
      {children}
    </button>
  );
}

export default function Footer() {
  const { openForm } = useFormModal();

  return (
    <footer className="bg-navy-deep border-t border-white/10" data-nav-zone="dark">
      <div className="max-w-6xl mx-auto page-gutter py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-4 flex flex-col">
            <Link to="/" className="inline-block w-fit mb-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm">
              <img src="/images/logo.png" alt={site.name} className="h-12 sm:h-14 w-auto object-contain" />
            </Link>
            <p className="font-display text-white text-lg sm:text-xl font-semibold uppercase tracking-wide mb-2 text-balance">
              {site.tagline}
            </p>
            <p className="font-inter text-white/55 text-xs leading-relaxed mb-5 max-w-sm">
              Professional Shakespeare under the stars at Pinkney Park, Rowayton — plus year-round education
              across Fairfield County.
            </p>
            <address className="not-italic space-y-2 font-inter text-xs text-white/65 leading-relaxed mb-6">
              <p>{site.mailingAddress}</p>
              <p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(site.parkAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {site.parkAddress}
                </a>
              </p>
              <p>
                <a href={`tel:${site.phone.replace(/\D/g, '')}`} className="hover:text-white transition-colors">
                  {site.phone}
                </a>
                <span className="text-white/40"> · {site.phoneNote}</span>
              </p>
            </address>
            <div className="flex gap-2.5 mt-auto">
              {socialLinks.map(({ label, url }) => {
                const SocialIcon = iconMap[label] || IconYoutube;
                return (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in new tab)`}
                    className="w-9 h-9 border border-white/15 flex items-center justify-center text-white/55 hover:text-gold hover:border-gold/40 transition-colors"
                  >
                    <SocialIcon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
            {navGroups.map((group) => (
              <div key={group.heading}>
                <p className="font-inter text-gold-light/90 text-[10px] tracking-[0.28em] uppercase font-semibold mb-4">
                  {group.heading}
                </p>
                <ul className="space-y-2.5">
                  {group.links.map((item) => (
                    <li key={item.label}>
                      <FooterNavItem item={item} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Quick actions — forms open modals; no duplicate mailing-list essay */}
          <div className="lg:col-span-3">
            <p className="font-inter text-gold-light/90 text-[10px] tracking-[0.28em] uppercase font-semibold mb-4">
              Quick Actions
            </p>
            <div className="flex flex-col gap-2.5">
              <button type="button" onClick={() => openForm('newsletter')} className="btn-primary w-full justify-center">
                Subscribe
              </button>
              <button type="button" onClick={() => openForm('contact')} className="btn-secondary w-full justify-center">
                Contact Us
              </button>
              <a
                href={site.ticketsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full justify-center"
              >
                Get Tickets
              </a>
              <a
                href={site.donateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-navy w-full justify-center !border-gold/40 !text-gold hover:!bg-gold/10"
              >
                Donate
              </a>
            </div>
            <p className="font-inter text-white/40 text-[10px] leading-relaxed mt-4">
              Forms open in a window on this page. For all options, visit{' '}
              <Link to={contactPaths.general} className="text-gold/80 hover:text-gold">
                Contact
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 pt-8 border-t border-white/10">
          <p className="font-inter text-white/45 text-[11px] mb-8 leading-relaxed text-center sm:text-left">
            <span className="text-white/55 font-medium">Season sponsors · </span>
            {sponsors.map((s) => s.name).join(' · ')}
          </p>
          <StaAffiliation theme="dark" align="left" compact />
        </div>
      </div>

      <div className="border-t border-white/10 bg-[hsl(220_52%_8%)]">
        <div className="max-w-6xl mx-auto page-gutter py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="font-inter text-white/45 text-[11px]">
            © {new Date().getFullYear()} {site.name}. 501(c)(3) nonprofit.
          </p>
          <p className="font-inter text-white/45 text-[11px] flex flex-wrap items-center justify-center sm:justify-end gap-x-2 gap-y-1">
            <FooterFormLink variant="education">Education</FooterFormLink>
            <span className="text-white/25" aria-hidden>
              ·
            </span>
            <FooterFormLink variant="sponsorship">Sponsorship</FooterFormLink>
            <span className="text-white/25" aria-hidden>
              ·
            </span>
            <Link to="/contact" className={linkClass}>
              Contact page
            </Link>
          </p>
        </div>
        <FooterBoardEasterEgg />
      </div>
    </footer>
  );
}
