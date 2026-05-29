import { Link } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import { useFormModal } from '@/lib/FormModalContext';
import { site } from '@/content/site';
import { contactPaths } from '@/lib/contactPaths';

/**
 * Site-wide mailing list strip — opens subscribe form in a modal.
 */
export default function EmailSignupBar() {
  const { openForm } = useFormModal();

  return (
    <section
      id="email-signup"
      className="bg-navy border-t border-gold/25 relative overflow-hidden scroll-mt-24"
      data-nav-zone="dark"
      aria-labelledby="email-signup-heading"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5 pointer-events-none" aria-hidden />
      <div className="page-container py-10 sm:py-12 relative z-[1]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-10">
          <div className="max-w-xl">
            <SectionHeader
              eyebrow="Mailing List"
              title="Never Miss a Season"
              titleId="email-signup-heading"
              description="Announcements for tickets, education programs, and special events — we only email when there is news worth sharing."
              align="left"
              light
              className="!mb-0 !max-w-none"
            />
          </div>
          <div className="flex flex-col sm:items-end gap-3 shrink-0">
            <button type="button" className="btn-primary min-w-[200px]" onClick={() => openForm('newsletter')}>
              Subscribe
            </button>
            <p className="font-inter text-white/45 text-xs text-center sm:text-right">
              <Link to={contactPaths.general} className="text-gold hover:text-white transition-colors">
                Contact form
              </Link>
              {' · '}
              <a href={`tel:${site.phone.replace(/\D/g, '')}`} className="text-gold hover:text-white transition-colors">
                {site.phone}
              </a>
              <span className="text-white/35"> during the season</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
