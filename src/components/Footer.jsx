import { Link } from 'react-router-dom';
import { site, socialLinks, sponsors } from '@/content/site';
import { IconFacebook, IconInstagram, IconTwitter, IconYoutube } from '@/components/icons';
import LogoImage from './LogoImage';
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
      { type: 'route', label: 'Special Events', to: '/events' },
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
  return (
    <footer className="bg-navy-deep border-t border-white/10" data-nav-zone="dark">
      <div className="max-w-6xl mx-auto page-gutter py-8 sm:py-9">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-5 flex flex-col">
            <Link
              to="/"
              className="inline-block w-fit mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
            >
              <LogoImage className="h-10 sm:h-11 w-auto object-contain" priority />
            </Link>
            <p className="font-inter text-white/55 text-xs leading-relaxed mb-4 max-w-xs">
              {site.location} · {site.mailingAddress}
            </p>
            <p className="font-inter text-xs text-white/65 mb-4">
              <a href={`tel:${site.phone.replace(/\D/g, '')}`} className="hover:text-white transition-colors">
                {site.phone}
              </a>
              <span className="text-white/55"> · {site.phoneNote}</span>
            </p>
            <div className="flex gap-2 mt-auto">
              {socialLinks.map(({ label, url }) => {
                const SocialIcon = iconMap[label] || IconYoutube;
                return (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in new tab)`}
                    className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/55 hover:text-gold hover:border-gold/40 transition-colors"
                  >
                    <SocialIcon size={14} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-5">
            {navGroups.map((group) => (
              <div key={group.heading}>
                <p className="font-inter text-gold-light/90 text-[10px] tracking-[0.25em] uppercase font-semibold mb-3">
                  {group.heading}
                </p>
                <ul className="space-y-2">
                  {group.links.map((item) => (
                    <li key={item.label}>
                      <FooterNavItem item={item} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-7 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <StaAffiliation theme="dark" align="left" compact />
          <p className="font-inter text-white/55 text-[10px] leading-relaxed sm:text-right sm:max-w-md">
            {sponsors.map((s) => s.name).join(' · ')}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[hsl(220_52%_8%)]">
        <div className="max-w-6xl mx-auto page-gutter py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="font-inter text-white/45 text-[10px]">
            © {new Date().getFullYear()} {site.name}. 501(c)(3) nonprofit.
          </p>
          <p className="font-inter text-white/45 text-[10px] flex flex-wrap items-center justify-center sm:justify-end gap-x-2 gap-y-1">
            <FooterFormLink variant="education">Education</FooterFormLink>
            <span className="text-white/25" aria-hidden>
              ·
            </span>
            <Link to={contactPaths.general} className={linkClass}>
              Contact
            </Link>
            <span className="text-white/25" aria-hidden>
              ·
            </span>
            <a
              href="https://thenounproject.com/search/icons/?q=THEATRE"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Icons by Noun Project
            </a>
          </p>
        </div>
        <FooterBoardEasterEgg />
      </div>
    </footer>
  );
}
