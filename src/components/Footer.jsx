import { Link } from 'react-router-dom';
import { site, socialLinks, sponsors } from '@/content/site';
import { IconFacebook, IconInstagram, IconTwitter, IconYoutube } from '@/components/icons';
import StaAffiliation from './StaAffiliation';
import ContactChannelLink from './ContactChannelLink';
import { contactPaths } from '@/lib/contactPaths';
import FooterBoardEasterEgg from './FooterBoardEasterEgg';

const iconMap = {
  Facebook: IconFacebook,
  Instagram: IconInstagram,
  Twitter: IconTwitter,
  YouTube: IconYoutube,
};

const navCols = [
  {
    heading: 'Explore',
    links: [
      { label: 'Productions', path: '/plays' },
      { label: 'News', path: '/news' },
      { label: 'Watch on YouTube', path: '/watch' },
      { label: 'Support Us', path: '/support' },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { label: 'In Schools', path: '/learning' },
      { label: 'Summer Camps', path: '/learning' },
      { label: 'Tours & Workshops', path: '/learning' },
      { label: 'In the Park', path: '/learning' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Donate', path: '/support' },
      { label: 'Individual Giving', path: '/support' },
      { label: 'Program Ads & Sponsorships', path: '/support' },
      { label: '2026 Gala', path: '/support' },
    ],
  },
  {
    heading: 'About',
    links: [
      { label: 'Mission & History', path: '/about' },
      { label: 'Visit Pinkney Park', path: '/about#visit' },
      { label: 'Contact', path: '/contact' },
      { label: 'Admin', path: '/admin/login' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-navy">
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto page-gutter py-8 sm:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="min-w-0">
            <p className="font-display text-white text-xl sm:text-2xl md:text-3xl font-semibold uppercase tracking-wide text-balance">
              {site.tagline}
            </p>
            <p className="font-inter text-white/60 text-xs mt-2 max-w-md">{site.educationBlurb}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <a href="#email-signup" className="btn-secondary w-full sm:w-auto justify-center">
              Join Mailing List
            </a>
            <a
              href={site.donateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full sm:w-auto justify-center"
            >
              Donate Today
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto page-gutter py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-10 mb-10 sm:mb-12">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/">
              <img src="/images/logo.png" alt={site.name} className="h-14 w-auto object-contain mb-5" />
            </Link>
            <div className="space-y-2.5 mb-6 font-inter text-xs text-white/70 leading-relaxed">
              <p>{site.mailingAddress}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(site.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition-colors"
              >
                {site.location}
              </a>
              <ContactChannelLink className="block hover:text-white transition-colors">
                Send us a message
              </ContactChannelLink>
              <a href={`tel:${site.phone.replace(/\D/g, '')}`} className="block hover:text-white transition-colors">
                {site.phone}
                <span className="text-white/40"> · {site.phoneNote}</span>
              </a>
            </div>
            <div className="flex gap-3">
              {socialLinks.map(({ label, url }) => {
                const SocialIcon = iconMap[label] || IconYoutube;
                return (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/50 transition-colors duration-300"
                  >
                    <SocialIcon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {navCols.map((col) => (
            <div key={col.heading}>
              <p className="font-inter text-white text-[10px] tracking-[0.25em] uppercase font-semibold mb-5">
                {col.heading}
              </p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.path}
                      className="font-inter text-white/70 text-xs hover:text-white transition-colors leading-relaxed"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="font-inter text-white/40 text-[11px] mb-10 leading-relaxed">
          <span className="hidden sm:inline">Sponsors: </span>
          <span className="sm:hidden">Sponsors — </span>
          {sponsors.map((s) => s.name).join(' · ')}
        </p>
        <StaAffiliation theme="dark" />
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto page-gutter py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-center md:text-left">
          <p className="font-inter text-white/50 text-[11px] w-full md:w-auto">
            © {new Date().getFullYear()} {site.name} · A 501(c)(3) nonprofit organization
          </p>
          <p className="font-inter text-white/50 text-[11px] w-full md:w-auto">
            <Link to={contactPaths.education} className="hover:text-white/80 transition-colors">
              Education inquiries
            </Link>
            <span className="text-white/35"> · </span>
            <Link to={contactPaths.general} className="hover:text-white/80 transition-colors">
              Contact form
            </Link>
          </p>
        </div>
      </div>

      <FooterBoardEasterEgg />
    </footer>
  );
}
