import { Link } from 'react-router-dom';
import { site, socialLinks, sponsors } from '@/content/site';
import { seasonVoice } from '@/content/voice';
import { IconFacebook, IconInstagram, IconTwitter, IconYoutube } from '@/components/icons';
import LogoImage from './LogoImage';
import { useFormModal } from '@/lib/FormModalContext';

const iconMap = {
  Facebook: IconFacebook,
  Instagram: IconInstagram,
  Twitter: IconTwitter,
  YouTube: IconYoutube,
};

const footerLinks = [
  { label: 'Productions', to: '/plays' },
  { label: 'Special events', to: '/events' },
  { label: 'News', to: '/news' },
  { label: 'Education', to: '/learning' },
  { label: 'About', to: '/about' },
  { label: 'Plan a visit', to: '/about#visit' },
  { label: 'Support', to: '/support' },
  { label: 'Contact', to: '/contact' },
  { label: 'FAQ', to: '/about#faq' },
  { label: 'Watch', to: '/watch' },
  { label: 'Get tickets', href: site.ticketsUrl, external: true },
  { label: 'Donate', href: site.donateUrl, external: true },
];

function FooterLink({ item }) {
  const className =
    'text-sm text-white/65 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm';

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
        {item.label}
      </a>
    );
  }

  if (item.form) {
    return <FooterFormLink variant={item.form}>{item.label}</FooterFormLink>;
  }

  return (
    <Link to={item.to} className={className}>
      {item.label}
    </Link>
  );
}

function FooterFormLink({ variant, children }) {
  const { openForm } = useFormModal();
  return (
    <button
      type="button"
      onClick={() => openForm(variant)}
      className="text-sm text-white/65 hover:text-white transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
    >
      {children}
    </button>
  );
}

export default function Footer({ preFooter = false }) {
  const { openForm } = useFormModal();

  return (
    <footer className="bg-navy-deep text-white" data-nav-zone="dark">
      {preFooter && (
        <div className="border-b border-white/10">
          <div className="site-container py-6 md:py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm">
              <div>
                <span className="text-white/40 mr-2">Box office</span>
                <a
                  href={`tel:${site.phone.replace(/\D/g, '')}`}
                  className="font-display text-lg text-white hover:text-gold transition-colors"
                >
                  {site.phone}
                </a>
              </div>
              <p className="text-white/45 text-xs sm:text-sm">
                Gates {seasonVoice.parkOpens} · Show {seasonVoice.showTime}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 btn-stack-mobile">
              <a
                href={site.ticketsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary btn-sm"
              >
                Get tickets
              </a>
              <button
                type="button"
                onClick={() => openForm('newsletter')}
                className="btn-ghost-light btn-sm"
              >
                Join the list
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="site-container py-12 md:py-14">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-12 lg:gap-16">
          <div>
            <Link
              to="/"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
            >
              <LogoImage className="h-10 sm:h-11 w-auto object-contain" priority />
            </Link>

            <p className="font-display text-xl text-white/90 mt-6 mb-1">{seasonVoice.mainStage}</p>
            <p className="text-sm text-white/50">
              {seasonVoice.runDates}, {seasonVoice.year} · {site.location}
            </p>

            <address className="not-italic text-sm text-white/45 mt-5 leading-relaxed">
              {site.mailingAddress}
            </address>

            <p className="mt-4 text-sm">
              <a
                href={`tel:${site.phone.replace(/\D/g, '')}`}
                className="text-white/70 hover:text-white transition-colors"
              >
                {site.phone}
              </a>
              <span className="text-white/35"> · {site.phoneNote}</span>
            </p>

            <div className="flex gap-2 mt-6">
              {socialLinks.map(({ label, url }) => {
                const SocialIcon = iconMap[label] || IconYoutube;
                return (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in new tab)`}
                    className="w-10 h-10 border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
                  >
                    <SocialIcon size={14} />
                  </a>
                );
              })}
            </div>
          </div>

          <nav aria-label="Footer">
            <p className="label text-white/35 mb-4">Explore</p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2.5">
              {footerLinks.map((item) => (
                <li key={item.label}>
                  <FooterLink item={item} />
                </li>
              ))}
              <li>
                <FooterFormLink variant="education">Book a school program</FooterFormLink>
              </li>
              <li>
                <FooterFormLink variant="sponsorship">Gala & sponsorship</FooterFormLink>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="label text-white/35 mb-4">Supported by</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {sponsors.map((sponsor) => (
              <li key={sponsor.name}>
                <a
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/50 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
                >
                  {sponsor.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="site-container py-4">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} {site.name}. 501(c)(3) nonprofit.
          </p>
        </div>
      </div>
    </footer>
  );
}
