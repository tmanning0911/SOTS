import NewsletterForm from './forms/NewsletterForm';
import { Link } from 'react-router-dom';
import { contactPaths } from '@/lib/contactPaths';

/**
 * Site-wide mailing list strip — shown above the footer on every page.
 */
export default function EmailSignupBar() {
  return (
    <section
      id="email-signup"
      className="bg-navy border-t border-gold/25 relative overflow-hidden scroll-mt-24"
      data-nav-zone="dark"
      aria-labelledby="email-signup-heading"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5 pointer-events-none" aria-hidden />
      <div className="max-w-6xl mx-auto page-gutter py-10 sm:py-12 relative z-[1]">
        <div className="grid lg:grid-cols-[1fr_minmax(280px,400px)] gap-8 lg:gap-12 items-center">
          <div>
            <p className="section-eyebrow text-gold-light mb-3">Mailing List</p>
            <h2
              id="email-signup-heading"
              className="font-display text-white text-2xl sm:text-3xl font-semibold uppercase mb-3 text-balance"
            >
              Never Miss a Season
            </h2>
            <p className="font-inter text-white/60 text-sm leading-relaxed max-w-md mb-4">
              Get announcements for tickets, education programs, and special events. We only email when
              there is news worth sharing.
            </p>
            <p className="font-inter text-white/45 text-xs">
              Prefer to write us?{' '}
              <Link to={contactPaths.general} className="text-gold hover:text-white transition-colors">
                Use our contact form
              </Link>
              {' · '}
              <a href="tel:2039571006" className="text-gold hover:text-white transition-colors">
                (203) 957-1006
              </a>
              <span className="text-white/35"> during the season</span>
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
